import React, { useState } from 'react';
import { Ticket, User, Mail, Phone, Building, ArrowRight, Award, CreditCard, Loader2, QrCode, Copy, Check, ShieldCheck, Upload, AlertTriangle } from 'lucide-react';
import { submitForm, createRazorpayOrder, verifyRazorpayPayment, validateUpiUtr, uploadImage } from '../utils/api';
import { openRazorpayCheckout } from '../utils/razorpay';

export default function EventRegistration({ onSubmitSuccess, siteConfig }) {
  const [ticketType, setTicketType] = useState('premium');
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentProof, setPaymentProof] = useState('');
  const [proofPreview, setProofPreview] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    organization: '',
    interest: 'Temple administration',
    specialNotes: '',
    consentTerms: false
  });

  const eventYear = siteConfig?.eventYear || siteConfig?.eventRegConfig?.eventYear || '2026';
  const tickets = (siteConfig?.registrationTickets && siteConfig.registrationTickets.length > 0)
    ? siteConfig.registrationTickets
    : (siteConfig?.eventRegConfig?.tickets && siteConfig.eventRegConfig.tickets.length > 0)
    ? siteConfig.eventRegConfig.tickets
    : [
        {
          id: 'delegate',
          name: 'Delegate Pass',
          price: '₹1,500',
          description: 'Access to main awards ceremony and youth plenary sessions.',
          features: ['Seva Pass Entry', 'Satvik Dinner', 'Preferred Seating', 'Delegate Kit', 'Networking Access', 'Event Souvenir']
        },
        {
          id: 'premium',
          name: 'Premium Delegate',
          price: '₹3,000',
          description: 'Full delegate access to the awards, exhibitions, and networking lounge.',
          features: ['Premium Row Seating', 'Satvik Dinner', 'Souvenir Kit', 'Priority Registration', 'Recorded Sessions', 'Networking Access', 'Event Souvenir']
        },
        {
          id: 'patron',
          name: 'Patron Pass',
          price: '₹5,000',
          description: 'Exclusive access to VIP networking, front-row seating, and private dinner.',
          features: ['Reserved VIP Seating', 'Satvik Dinner', 'Meet & Greet with Dignitaries', 'Networking Access', 'Event Souvenir']
        }
      ];

  const selectedTicket = tickets.find(t => t.id === ticketType) || tickets[0];
  const ticketPriceNumeric = parseInt(selectedTicket.price.replace(/[^0-9]/g, '')) || 1500;

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  };

  const [paymentMethod, setPaymentMethod] = useState('razorpay');
  const [transactionId, setTransactionId] = useState('');
  const [copiedUpi, setCopiedUpi] = useState(false);

  const bankDetails = siteConfig?.donorConfig?.bankDetails || siteConfig?.bankDetails || {
    bankName: 'HDFC Bank',
    accountName: 'Dhara Foundations',
    accountNumber: '50200012345678',
    ifsc: 'HDFC0001234',
    branch: 'Chennai Main Branch',
    upiId: 'dharafoundations@hdfcbank',
    qrImage: '/images/upi_qr_code.svg'
  };

  const handleCopyUpi = () => {
    navigator.clipboard.writeText(bankDetails.upiId);
    setCopiedUpi(true);
    setTimeout(() => setCopiedUpi(false), 2000);
  };

  const handleProofChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        alert('File size must be under 5MB.');
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setProofPreview(reader.result);
        setPaymentProof(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.phone) {
      alert('Please fill in all required fields.');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email.trim())) {
      alert('Please enter a valid email address.');
      return;
    }

    const cleanedPhone = formData.phone.replace(/[\s-]/g, '');
    const phoneRegex = /^(\+?91)?[6-9]\d{9}$/;
    if (!phoneRegex.test(cleanedPhone)) {
      alert('Please enter a valid 10-digit mobile number.');
      return;
    }

    if (!formData.consentTerms) {
      alert('Please accept the Terms and Conditions to proceed.');
      return;
    }

    // Strict UPI UTR validation
    if (paymentMethod === 'qr') {
      const utrValidation = validateUpiUtr(transactionId);
      if (!utrValidation.valid) {
        alert(utrValidation.error);
        return;
      }
    }

    setIsProcessing(true);

    // Path 1: Direct UPI QR Code Payment
    if (paymentMethod === 'qr') {
      try {
        const utrValidation = validateUpiUtr(transactionId);
        const passCode = `DDA-2026-${Math.floor(1000 + Math.random() * 9000)}`;

        let uploadedProofUrl = '';
        if (paymentProof) {
          uploadedProofUrl = await uploadImage(paymentProof, `qr_proof_${Date.now()}.png`);
        }

        await submitForm('Event Registration', {
          ...formData,
          ticketType: selectedTicket.name,
          amount: ticketPriceNumeric,
          payment_method: 'UPI_QR',
          payment_id: utrValidation.cleaned,
          transaction_id: utrValidation.cleaned,
          proof_image: uploadedProofUrl || paymentProof,
          payment_status: 'Pending Admin Verification',
          verified: false,
          pass_code: passCode,
          timestamp: new Date().toISOString()
        });

        setIsProcessing(false);

        onSubmitSuccess({
          title: 'Registration Submitted (Pending UPI Verification)',
          message: `Namaste, ${formData.name}. Your registration for ${selectedTicket.name} with UPI Transaction ID (${utrValidation.cleaned}) has been received. Your Pass Code is ${passCode}. It will be activated upon verification of your transaction by our Seva finance desk.`,
          details: [
            { label: 'Attendee', value: formData.name },
            { label: 'Pass Type', value: selectedTicket.name },
            { label: 'Entry Pass Code', value: passCode },
            { label: 'Payment Method', value: 'UPI / QR Code Scan' },
            { label: 'UPI Transaction ID / UTR', value: utrValidation.cleaned },
            { label: 'Verification Status', value: 'Pending Admin Verification' },
            { label: 'Area of Interest', value: formData.interest }
          ]
        });
        return;
      } catch (err) {
        console.error('UPI submission error:', err);
        setIsProcessing(false);
        alert('Could not record UPI registration. Please try again.');
        return;
      }
    }

    // Path 2: Razorpay Gateway Payment
    try {
      // Step 1: Create Razorpay Order for Ticket Price
      const orderRes = await createRazorpayOrder({
        amount: ticketPriceNumeric,
        currency: 'INR',
        receipt: `rcpt_evt_${Date.now()}`,
        notes: {
          delegate_name: formData.name,
          email: formData.email,
          pass_type: selectedTicket.name
        }
      });

      if (!orderRes.success && !orderRes.order_id) {
        throw new Error(orderRes.error || 'Failed to initialize payment gateway order');
      }

      // Step 2: Open Razorpay Checkout Modal
      const envKey = import.meta.env.VITE_RAZORPAY_KEY_ID || import.meta.env.RAZORPAY_KEY_ID || import.meta.env.NEXT_PUBLIC_RAZORPAY_KEY_ID;
      const activeKey = (envKey && envKey.trim())
        ? envKey.trim()
        : (siteConfig?.razorpayConfig?.keyId || siteConfig?.donorConfig?.razorpayKeyId || orderRes.key_id);

      openRazorpayCheckout({
        key_id: activeKey,
        order_id: orderRes.order_id,
        amount: orderRes.amount,
        currency: orderRes.currency,
        name: 'Dhara Foundations',
        description: `Divine Awards ${eventYear} — ${selectedTicket.name}`,
        prefill: {
          name: formData.name,
          email: formData.email,
          phone: formData.phone
        },
        onSuccess: async (razorpayResponse) => {
          // Step 3: Verify Payment and Record Delegate Registration
          const verification = await verifyRazorpayPayment({
            razorpay_order_id: razorpayResponse.razorpay_order_id,
            razorpay_payment_id: razorpayResponse.razorpay_payment_id,
            razorpay_signature: razorpayResponse.razorpay_signature,
            module: 'Event Registration',
            name: formData.name,
            email: formData.email,
            phone: formData.phone,
            amount: ticketPriceNumeric,
            ticketType: selectedTicket.name,
            organization: formData.organization,
            interest: formData.interest,
            specialNotes: formData.specialNotes,
            payment_method: 'Razorpay'
          });

          // Backup submission
          submitForm('Event Registration', {
            ...formData,
            ticketType: selectedTicket.name,
            amount: ticketPriceNumeric,
            payment_method: 'Razorpay',
            payment_id: razorpayResponse.razorpay_payment_id,
            order_id: razorpayResponse.razorpay_order_id,
            timestamp: new Date().toISOString()
          });

          setIsProcessing(false);

          const passCode = verification?.details?.pass_code || `DDA-2026-${Math.floor(1000 + Math.random() * 9000)}`;

          onSubmitSuccess({
            title: 'Registration & Pass Confirmed',
            message: `Namaste, ${formData.name}. Your presence and ticket payment are gracefully confirmed for the Divine Awards ${eventYear} under the ${selectedTicket.name} tier. Your Pass Code is ${passCode}. We look forward to hosting you!`,
            details: [
              { label: 'Attendee', value: formData.name },
              { label: 'Pass Type', value: selectedTicket.name },
              { label: 'Entry Pass Code', value: passCode },
              { label: 'Payment Method', value: 'Razorpay Online' },
              { label: 'Payment ID', value: razorpayResponse.razorpay_payment_id || orderRes.order_id },
              { label: 'Area of Interest', value: formData.interest }
            ]
          });
        },
        onDismiss: () => {
          setIsProcessing(false);
        }
      });

    } catch (err) {
      console.error('Event payment error:', err);
      setIsProcessing(false);
      alert(`Payment Gateway Error: ${err.message || 'Could not launch payment gateway. Please try again.'}`);
    }
  };

  return (
    <div style={{ background: 'var(--color-warm-cream)', minHeight: '100vh', paddingBottom: '80px' }}>
      
      {/* 1. Hero Section */}
      <section style={{ 
        position: 'relative', 
        padding: '80px 20px 40px',
        textAlign: 'center',
        overflow: 'hidden',
        marginBottom: '24px'
      }}>
        <div className="wrap" style={{ position: 'relative', zIndex: 2 }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            background: 'var(--color-primary-accent-bg, rgba(217, 166, 70, 0.1))',
            border: '2px solid var(--color-saffron-glow)',
            borderRadius: '999px',
            padding: '8px 24px',
            marginBottom: '24px',
            boxShadow: '0 4px 12px rgba(217, 166, 70, 0.15)',
            transform: 'scale(1.05)'
          }}>
            <Ticket className="w-4 h-4 text-[var(--color-primary-accent)]" />
            <span style={{ 
              color: 'var(--color-deep-forest-dark)', 
              fontFamily: 'var(--font-mono)', 
              letterSpacing: '1.5px', 
              fontSize: '13px',
              textTransform: 'uppercase',
              fontWeight: '800'
            }}>
              Divine Awards {eventYear}
            </span>
          </div>

          <h1 style={{ 
            fontFamily: 'var(--font-serif)', 
            fontSize: 'clamp(36px, 5.5vw, 56px)', 
            lineHeight: '1.15', 
            maxWidth: '920px',
            margin: '0 auto 20px',
            fontWeight: 'bold',
            color: 'var(--color-deep-forest-dark)'
          }}>
            Secure Your Entry Pass
          </h1>

          <p style={{ 
            color: 'var(--ink-soft)', 
            fontSize: '18px', 
            maxWidth: '740px', 
            margin: '0 auto',
            lineHeight: '1.6'
          }}>
            Join us in honoring outstanding contributions to society and spiritual evolution. Select your attendance category below to secure your seat.
          </p>
        </div>
      </section>

      <div className="px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto">

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
        {tickets.map((t) => (
          <div
            key={t.id}
            onClick={() => setTicketType(t.id)}
            className={`cursor-pointer rounded-2xl p-6 transition-all duration-300 ease-in-out border flex flex-col justify-between ${
              ticketType === t.id
                ? 'bg-forest-teal text-white border-sun-gold shadow-premium-hover scale-102'
                : 'bg-white text-neutral-800 border-neutral-100 shadow-premium hover:border-forest-teal-light'
            }`}
          >
            <div>
              <div className="flex justify-between items-center mb-4">
                <span className={`px-3 py-1 rounded-full text-xs font-semibold uppercase ${
                  ticketType === t.id ? 'bg-sun-gold text-forest-teal-dark font-sans' : 'bg-soft-sage text-forest-teal font-sans'
                }`}>
                  {t.id === 'patron' ? 'Exclusive' : 'Access'}
                </span>
                <span className={`text-2xl font-serif font-bold ${ticketType === t.id ? 'text-sun-gold' : 'text-forest-teal'}`}>
                  {t.price}
                </span>
              </div>
              <h3 className={`text-xl font-serif font-bold mb-2 ${ticketType === t.id ? 'text-white' : 'text-forest-teal-dark'}`}>{t.name}</h3>
              <p className={`text-sm mb-6 ${ticketType === t.id ? 'text-neutral-100' : 'text-neutral-500'}`}>
                {t.description}
              </p>
              
              <ul className="space-y-3 mb-8">
                {t.features.map((f, index) => (
                  <li key={index} className="flex items-center text-sm">
                    <Award className={`w-4 h-4 mr-2 shrink-0 ${ticketType === t.id ? 'text-sun-gold' : 'text-forest-teal'}`} />
                    <span>{f}</span>
                  </li>
                ))}
              </ul>
            </div>
            
            <div className={`w-full py-2.5 rounded-xl font-sans text-center text-sm font-semibold transition-colors duration-300 ${
              ticketType === t.id 
                ? 'bg-sun-gold text-forest-teal-dark hover:bg-white hover:text-forest-teal-dark' 
                : 'bg-soft-sage text-forest-teal hover:bg-forest-teal hover:text-white'
            }`}>
              Select Pass
            </div>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-3xl border border-neutral-100 shadow-premium p-8 max-w-3xl mx-auto">
        <div className="flex items-center space-x-3 mb-6 border-b border-neutral-100 pb-4">
          <Ticket className="text-sun-gold w-6 h-6" />
          <h3 className="text-xl font-serif text-forest-teal-dark">Attendee Details</h3>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-forest-teal-dark mb-2">Full Name *</label>
              <div className="relative">
                <User className="absolute left-3 top-3.5 w-5 h-5 text-neutral-400" />
                <input
                  type="text"
                  name="name"
                  required
                  placeholder="Sri Anand Rao"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full pl-11 pr-4 py-3 rounded-xl border border-neutral-200 focus:outline-none focus:ring-2 focus:ring-forest-teal focus:border-transparent transition-all duration-300 text-sm font-sans"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-forest-teal-dark mb-2">Email Address *</label>
              <div className="relative">
                <Mail className="absolute left-3 top-3.5 w-5 h-5 text-neutral-400" />
                <input
                  type="email"
                  name="email"
                  required
                  placeholder="anand@example.com"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full pl-11 pr-4 py-3 rounded-xl border border-neutral-200 focus:outline-none focus:ring-2 focus:ring-forest-teal focus:border-transparent transition-all duration-300 text-sm font-sans"
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-forest-teal-dark mb-2">Phone Number *</label>
              <div className="relative">
                <Phone className="absolute left-3 top-3.5 w-5 h-5 text-neutral-400" />
                <input
                  type="tel"
                  name="phone"
                  required
                  placeholder="+91 98765 43210"
                  value={formData.phone}
                  onChange={handleChange}
                  className="w-full pl-11 pr-4 py-3 rounded-xl border border-neutral-200 focus:outline-none focus:ring-2 focus:ring-forest-teal focus:border-transparent transition-all duration-300 text-sm font-sans"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-forest-teal-dark mb-2">Organization / Affiliation and Address</label>
              <div className="relative">
                <Building className="absolute left-3 top-3.5 w-5 h-5 text-neutral-400" />
                <input
                  type="text"
                  name="organization"
                  placeholder="Dhara Seva Mandir"
                  value={formData.organization}
                  onChange={handleChange}
                  className="w-full pl-11 pr-4 py-3 rounded-xl border border-neutral-200 focus:outline-none focus:ring-2 focus:ring-forest-teal focus:border-transparent transition-all duration-300 text-sm font-sans"
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-forest-teal-dark mb-2">Areas of Interest</label>
              <select
                name="interest"
                value={formData.interest}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-xl border border-neutral-200 focus:outline-none focus:ring-2 focus:ring-forest-teal focus:border-transparent transition-all duration-300 text-sm font-sans bg-white"
              >
                <option value="Temple administration">Temple administration</option>
                <option value="Culture">Culture</option>
                <option value="Education">Education</option>
                <option value="Social Service">Social Service</option>
                <option value="Spirituality">Spirituality</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-forest-teal-dark mb-2">Special Requirements / Notes</label>
              <input
                type="text"
                name="specialNotes"
                placeholder="Wheelchair access, dietary allergy notes..."
                value={formData.specialNotes}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-xl border border-neutral-200 focus:outline-none focus:ring-2 focus:ring-forest-teal focus:border-transparent transition-all duration-300 text-sm font-sans"
              />
            </div>
          </div>

          <div className="space-y-3 pt-4">
            <h4 className="text-sm font-bold text-forest-teal-dark mb-2">Terms and Conditions</h4>
            <label className="flex items-start space-x-3 cursor-pointer">
              <input 
                type="checkbox" 
                name="consentTerms" 
                checked={formData.consentTerms} 
                onChange={handleChange} 
                className="mt-1 min-w-4 w-4 h-4 text-forest-teal rounded border-neutral-300 focus:ring-forest-teal cursor-pointer" 
              />
              <span className="text-sm text-neutral-600 font-sans leading-relaxed">
                I agree to the Terms and Conditions, provide consent for Photography and Videography, and consent to receive updates.
              </span>
            </label>
          </div>

          {/* Payment Method Selector */}
          <div className="pt-4 border-t border-neutral-100 space-y-4">
            <h4 className="text-sm font-bold text-forest-teal-dark font-sans flex items-center">
              <CreditCard className="w-4 h-4 text-sun-gold mr-2" />
              Select Payment Method
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setPaymentMethod('razorpay')}
                className={`p-4 rounded-xl border-2 transition-all text-left flex items-start space-x-3 cursor-pointer ${
                  paymentMethod === 'razorpay'
                    ? 'border-sun-gold bg-[#FDFBF7] shadow-sm'
                    : 'border-neutral-200 bg-white hover:border-neutral-300'
                }`}
              >
                <input
                  type="radio"
                  name="pmethod"
                  checked={paymentMethod === 'razorpay'}
                  onChange={() => setPaymentMethod('razorpay')}
                  className="mt-1 text-forest-teal focus:ring-forest-teal"
                />
                <div>
                  <div className="font-bold text-sm text-forest-teal-dark flex items-center">
                    <CreditCard className="w-4 h-4 mr-1.5 text-forest-teal" />
                    Razorpay Online Gateway
                  </div>
                  <p className="text-xs text-neutral-500 mt-1">Cards, Netbanking, UPI, Wallets</p>
                </div>
              </button>

              <button
                type="button"
                onClick={() => setPaymentMethod('qr')}
                className={`p-4 rounded-xl border-2 transition-all text-left flex items-start space-x-3 cursor-pointer ${
                  paymentMethod === 'qr'
                    ? 'border-sun-gold bg-[#FDFBF7] shadow-sm'
                    : 'border-neutral-200 bg-white hover:border-neutral-300'
                }`}
              >
                <input
                  type="radio"
                  name="pmethod"
                  checked={paymentMethod === 'qr'}
                  onChange={() => setPaymentMethod('qr')}
                  className="mt-1 text-forest-teal focus:ring-forest-teal"
                />
                <div>
                  <div className="font-bold text-sm text-forest-teal-dark flex items-center">
                    <QrCode className="w-4 h-4 mr-1.5 text-forest-teal" />
                    UPI / QR Code Scan & Pay
                  </div>
                  <p className="text-xs text-neutral-500 mt-1">GPay, PhonePe, Paytm, BHIM QR Scan</p>
                </div>
              </button>
            </div>

            {/* UPI QR Display Card when 'qr' is selected */}
            {paymentMethod === 'qr' && (
              <div className="bg-[#FFFDF9] border-2 border-sun-gold/50 rounded-2xl p-6 shadow-sm space-y-4">
                <div className="text-center space-y-2">
                  <span className="text-[11px] font-mono uppercase tracking-wider text-sun-gold font-bold bg-amber-50 px-3 py-1 rounded-full border border-amber-200">
                    Official Seva Payment QR
                  </span>
                  <h5 className="text-lg font-serif font-bold text-forest-teal-dark">Scan QR Code to Pay {selectedTicket.price}</h5>
                  <p className="text-xs text-neutral-600">Scan using any UPI App (Google Pay, PhonePe, Paytm, BHIM, CRED)</p>
                </div>

                <div className="flex flex-col sm:flex-row items-center justify-center gap-6 py-2">
                  <div className="bg-white p-3 rounded-2xl border-2 border-amber-200 shadow-md text-center">
                    <img 
                      src={bankDetails.qrImage || "/images/upi_qr_code.svg"} 
                      alt="UPI Payment QR Code" 
                      className="w-44 h-44 object-contain mx-auto rounded-lg"
                    />
                    <span className="text-[10px] text-neutral-500 font-mono block mt-1">Dhara Foundations Official QR</span>
                  </div>

                  <div className="space-y-3 text-xs text-neutral-700 w-full sm:w-auto">
                    <div className="bg-white p-3 rounded-xl border border-neutral-200 space-y-1">
                      <span className="text-[10px] text-neutral-400 uppercase font-mono block">UPI ID</span>
                      <div className="flex items-center justify-between gap-2 font-bold text-forest-teal-dark">
                        <span className="font-mono text-sm">{bankDetails.upiId}</span>
                        <button
                          type="button"
                          onClick={handleCopyUpi}
                          className="px-2 py-1 bg-soft-sage text-forest-teal rounded hover:bg-forest-teal hover:text-white transition-colors text-[11px] flex items-center gap-1 cursor-pointer"
                        >
                          {copiedUpi ? <Check className="w-3 h-3 text-green-600" /> : <Copy className="w-3 h-3" />}
                          <span>{copiedUpi ? 'Copied' : 'Copy'}</span>
                        </button>
                      </div>
                    </div>

                    <div className="bg-white p-3 rounded-xl border border-neutral-200 space-y-1">
                      <span className="text-[10px] text-neutral-400 uppercase font-mono block">Account Name</span>
                      <p className="font-bold text-forest-teal-dark">{bankDetails.accountName}</p>
                      <p className="text-[11px] text-neutral-500">{bankDetails.bankName} • {bankDetails.ifsc}</p>
                    </div>

                    <div className="flex items-center gap-2 text-forest-teal text-[11px]">
                      <ShieldCheck className="w-4 h-4 text-sun-gold shrink-0" />
                      <span>Direct trust account transfer for Divine Awards {eventYear}</span>
                    </div>
                  </div>
                </div>

                <div className="pt-2 border-t border-amber-200/50 space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-forest-teal-dark mb-1 font-sans">
                      Enter 12-Digit UPI UTR / Transaction Reference ID *
                    </label>
                    <input
                      type="text"
                      required={paymentMethod === 'qr'}
                      placeholder="e.g. 423987123456 (Found on GPay / PhonePe receipt)"
                      value={transactionId}
                      onChange={(e) => setTransactionId(e.target.value)}
                      maxLength={18}
                      className="w-full px-4 py-3 rounded-xl border border-neutral-300 focus:outline-none focus:ring-2 focus:ring-forest-teal text-sm font-sans font-mono"
                    />
                    <p className="text-[11px] text-neutral-500 mt-1 font-sans">
                      Paste the authentic 12-digit UTR/Ref number from your payment confirmation screen.
                    </p>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-forest-teal-dark mb-1 font-sans flex items-center justify-between">
                      <span>Upload Payment Screenshot (Optional for Instant Verification)</span>
                      <span className="text-[10px] text-neutral-400 font-normal">PNG, JPG, WEBP (Max 5MB)</span>
                    </label>
                    <div className="flex items-center gap-3">
                      <label className="px-4 py-2.5 bg-white border border-neutral-300 rounded-xl hover:bg-neutral-50 transition-colors text-xs font-semibold text-forest-teal flex items-center gap-2 cursor-pointer shadow-sm">
                        <Upload className="w-4 h-4 text-sun-gold" />
                        <span>{proofPreview ? 'Change Screenshot' : 'Choose Screenshot Image'}</span>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleProofChange}
                          className="hidden"
                        />
                      </label>
                      {proofPreview && (
                        <div className="flex items-center gap-2">
                          <img src={proofPreview} alt="Payment Proof" className="w-10 h-10 object-cover rounded-lg border border-amber-200" />
                          <span className="text-[11px] text-green-700 font-semibold flex items-center gap-1">
                            <Check className="w-3.5 h-3.5" /> Attached
                          </span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Anti-misuse Warning Banner */}
                  <div className="p-3 bg-amber-50 rounded-xl border border-amber-200/80 flex items-start space-x-2.5 text-[11px] text-amber-900 font-sans">
                    <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                    <div>
                      <span className="font-bold block">Manual Bank Statement Verification Notice</span>
                      <span>
                        All UPI QR payments are cross-verified by our finance desk against official bank statements. Submitting fake or invalid UTR numbers will result in rejection of the delegate pass.
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="pt-4">
            <button
              type="submit"
              disabled={!formData.consentTerms || isProcessing}
              className={`w-full py-4 rounded-xl font-sans font-bold text-base transition-all duration-300 ease-in-out flex items-center justify-center space-x-2 border-2 shadow-lg ${
                formData.consentTerms && !isProcessing
                  ? 'bg-gradient-to-r from-[var(--color-saffron-glow)] to-[var(--color-saffron-glow-dark)] text-[#281006] hover:brightness-105 border-transparent hover:border-[#281006] cursor-pointer group hover:shadow-xl hover:-translate-y-0.5'
                  : 'bg-neutral-200 text-neutral-400 border-transparent cursor-not-allowed opacity-75'
              }`}
            >
              {isProcessing ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin text-[#281006]" />
                  <span>{paymentMethod === 'qr' ? 'Submitting Registration...' : 'Processing Razorpay Checkout...'}</span>
                </>
              ) : paymentMethod === 'qr' ? (
                <>
                  <QrCode className="w-5 h-5 text-[#281006]" />
                  <span>Confirm UPI Payment & Submit ({selectedTicket.price})</span>
                </>
              ) : (
                <>
                  <CreditCard className="w-5 h-5 text-[#281006]" />
                  <span>Pay via Razorpay: {selectedTicket.price}</span>
                </>
              )}
            </button>
            <p className="text-center text-xs text-neutral-400 mt-3 font-sans">
              Instant entry pass code will be issued immediately upon payment submission.
            </p>
          </div>
        </form>
      </div>
    </div>
  </div>
  );
}
