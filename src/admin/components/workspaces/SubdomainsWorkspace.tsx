import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Save, ShieldCheck, Plus, Trash2, Calendar, Building2, Trophy, Briefcase, 
  HelpCircle, Users, ArrowUpDown, Newspaper, Star, Award, ShieldAlert, Heart
} from 'lucide-react';

export const SubdomainsWorkspace: React.FC = () => {
  const { siteConfig, updateSiteConfig } = useApp();

  const [saving, setSaving] = useState(false);
  const [activeSubTab, setActiveSubTab] = useState<'passes' | 'sponsors' | 'csr'>('passes');

  // 1. PASSES & GENERAL CONFIG STATES
  const [eventYear, setEventYear] = useState('2026');
  const [razorpayKeyId, setRazorpayKeyId] = useState('');
  const [donorPresets, setDonorPresets] = useState<{ amount: string; label: string; impact: string; desc: string }[]>([
    { amount: '510', label: '₹510', impact: 'Meal Seva', desc: 'Sponsor pure Sattvic meals and sacred prasad for a student delegate.' },
    { amount: '1008', label: '₹1,008', impact: 'Sevak Support', desc: 'Sponsor event souvenir kit, green handbook, and transport support.' },
    { amount: '5001', label: '₹5,001', impact: 'Kala Seva', desc: 'Sponsor travel and honorarium for traditional musician/folk artist.' },
    { amount: '10008', label: '₹10,008', impact: 'Nominee Seva', desc: 'Sponsor a grassroots social worker nominee round-trip travel.' }
  ]);

  const [bankDetails, setBankDetails] = useState({
    bankName: 'HDFC Bank',
    accountName: 'Dhara Foundations',
    accountNumber: '50200012345678',
    ifsc: 'HDFC0001234',
    branch: 'Chennai Main Branch',
    upiId: 'dharafoundations@hdfcbank'
  });

  const [taxExemptText, setTaxExemptText] = useState('All donations made to Dhara Foundations are eligible for 50% Tax Deduction under Section 80G of the Income Tax Act.');

  const [registrationTickets, setRegistrationTickets] = useState<{ id: string; name: string; price: string; description: string; features: string }[]>([
    {
      id: 'delegate',
      name: 'Delegate Pass',
      price: '₹1,500',
      description: 'Access to main awards ceremony and youth plenary sessions.',
      features: 'Seva Pass Entry, Satvik Dinner, Preferred Seating, Delegate Kit'
    },
    {
      id: 'premium',
      name: 'Premium Delegate',
      price: '₹3,000',
      description: 'Full delegate access to awards, exhibitions, and networking lounge.',
      features: 'Premium Row Seating, Satvik Dinner, Souvenir Kit, Priority Registration'
    },
    {
      id: 'patron',
      name: 'Patron Pass',
      price: '₹5,000',
      description: 'Exclusive access to VIP networking, front-row seating, and private dinner.',
      features: 'Reserved VIP Seating, Satvik Dinner, Meet & Greet with Dignitaries'
    }
  ]);

  const [contactInfo, setContactInfo] = useState({
    email: 'info@dharafoundations.in',
    phone: '+91 94440 12345',
    address: 'Dhara Foundations Trust Office, Chennai, Tamil Nadu',
    timings: 'Monday - Saturday: 9:00 AM - 6:00 PM IST'
  });

  // 2. SPONSORSHIP CONFIG STATES
  const [sponsorshipBenefits, setSponsorshipBenefits] = useState<any[]>([
    {
      title: "Brand Visibility",
      desc: "Gain widespread presence across standard, digital, and stage materials.",
      items: ["Logo on event banners & backdrops", "Website and social media promotions", "Recognition during the award ceremony", "Branding on event print materials"]
    },
    {
      title: "Networking Opportunities",
      desc: "Build strategic relations with social ecosystem leaders and delegates.",
      items: ["Meet industry & corporate leaders", "Connect with NGOs & social organizations", "Build long-term strategic partnerships", "Interact with government officials & influencers"]
    },
    {
      title: "Corporate Recognition",
      desc: "Cement corporate social responsibility prestige on a public platform.",
      items: ["Sponsor appreciation certificates", "Media and press coverage opportunities", "Stage recognition and vocal mentions", "Featured as a social impact partner"]
    }
  ]);

  const [sponsorshipOpportunities, setSponsorshipOpportunities] = useState<any[]>([
    { title: "Event Sponsorship", desc: "Support the Divine Awards event directly and gain extensive corporate brand exposure on stage and screens." },
    { title: "Program Sponsorship", desc: "Sponsor specific rural welfare and educational development projects that align with your organizational goals." },
    { title: "CSR Collaboration", desc: "Establish long-term structured MoUs for multi-year community upliftment initiatives." },
    { title: "In-Kind Sponsorship", desc: "Provide essential venue support, refreshments, technology aids, hospitality, printing materials, or gifts for honorees." }
  ]);

  const [previousSponsors, setPreviousSponsors] = useState<any[]>([
    { name: "ABC Corporation", role: "Title Sponsor 2025" },
    { name: "XYZ Foundations", role: "Platinum Sponsor 2025" },
    { name: "Zenith Tech", role: "Gold Partner 2024" },
    { name: "Indus Seva Co", role: "Silver Patron 2024" }
  ]);

  const [sponsorTestimonial, setSponsorTestimonial] = useState({
    quote: "Partnering with Dhara Foundations allowed us to route section 135 CSR funds into verified grassroots projects that delivered measurable impact. The accountability and transparency was exemplary.",
    author: "Shri. R. Ramanathan",
    designation: "VP Corporate Relations, ABC Corp"
  });

  const [sponsorshipFaqs, setSponsorshipFaqs] = useState<any[]>([
    {
      q: "Can sponsorship packages be customized?",
      a: "Yes. We can tailor sponsorship packages and benefits specifically according to your organization's business objectives, budget, and geographic preferences."
    },
    {
      q: "Will sponsors receive branding benefits?",
      a: "Yes. Every sponsor level receives corresponding visual and stage recognition, including logo placement, social media mentions, and souvenir advertisement pages."
    },
    {
      q: "Can we sponsor a specific award category?",
      a: "Absolutely. Category sponsorships (e.g. sponsoring the 'Women Leader' or 'Educator' award) are available. Please note your choice in the inquiry form."
    },
    {
      q: "Do you provide sponsorship agreements and invoices?",
      a: "Yes. All formal corporate relationships are documented with signed MoUs, legal sponsorship agreements, and standard GST invoices."
    }
  ]);

  const [sponsorshipPackages, setSponsorshipPackages] = useState<any[]>([
    {
      id: 'title',
      name: 'Title Sponsor',
      amount: '₹5,00,000+',
      description: 'Exclusive title branding, keynote speech recognition, and maximum media visibility.',
      benefits: ["Exclusive naming rights", "Main backdrop prominence", "Keynote address slot", "10 VIP Event passes"]
    },
    {
      id: 'platinum',
      name: 'Platinum Sponsor',
      amount: '₹2,50,000+',
      description: 'Main stage panel branding, extensive social promotions, and prominent logo spots.',
      benefits: ["Main stage branding", "AV profile clip slot", "5 VIP Event passes", "Souvenir full-page ad"]
    },
    {
      id: 'gold',
      name: 'Gold Sponsor',
      amount: '₹1,00,000+',
      description: 'Logo placement on branding collaterals, event recognition, and delegate passes.',
      benefits: ["Logo on standard flyers", "Reception standee slot", "3 VIP Event passes", "Social media mentions"]
    },
    {
      id: 'silver',
      name: 'Silver Sponsor',
      amount: '₹50,000+',
      description: 'Branding placement on previous sponsor walls, digital brochures, and websites.',
      benefits: ["Logo on website scroll", "Event souvenir mention", "2 Delegate passes", "Appreciation certificate"]
    },
    {
      id: 'community',
      name: 'Community Sponsor',
      amount: '₹25,000+',
      description: 'Showcase grassroots community support with appreciation certificate and mention.',
      benefits: ["Brochure listing logo", "Appreciation certificate", "1 Delegate pass", "Group mention on stage"]
    }
  ]);

  // 3. CSR CONFIG STATES
  const [csrWhyPartner, setCsrWhyPartner] = useState<any[]>([
    { title: "Trusted Implementation Partner", desc: "Proven track record of executing grassroot social welfare drives with end-to-end management." },
    { title: "Transparent Fund Utilization", desc: "Rigorous accounting audits, clear visual dashboards, and quarterly progress disclosures." },
    { title: "Compliance with CSR Regulations", desc: "100% compliant with Section 135 rules, holding CSR-1, 12A, and 80G registrations." },
    { title: "Experienced Project Management", desc: "Professional implementation team executing, monitoring, and scaling project milestones." },
    { title: "Measurable Social Impact", desc: "Data-driven results and impact certificates showing clear improvement in community welfare." },
    { title: "Regular Progress Reports", desc: "Timely delivery of compliance utilization certificates, field audit sheets, and media packages." }
  ]);

  const [csrProcess, setCsrProcess] = useState<string[]>([
    "Consultation",
    "Requirement Analysis",
    "Project Planning",
    "Implementation",
    "Monitoring & Evaluation",
    "Impact Reporting"
  ]);

  const [csrPartnershipModels, setCsrPartnershipModels] = useState<any[]>([
    { title: "Project-Based Partnership", desc: "Fund a specific social initiative or infrastructure development project matching your geographical goals." },
    { title: "Long-Term Strategic Partnership", desc: "Form multi-year CSR collaborations to adopt schools, care facilities, or villages for continuous upliftment." },
    { title: "Employee Engagement Programs", desc: "Coordinate hands-on volunteer activities, tree plantation campaigns, and community service days for staff." },
    { title: "Sponsorship Partnership", desc: "Directly sponsor existing educational kits, clean energy packs, and emergency healthcare drives." }
  ]);

  const [csrComplianceDocs, setCsrComplianceDocs] = useState<string[]>([
    "CSR-1 Registration Number",
    "12A Certificate",
    "80G Certificate",
    "PAN Card",
    "Annual Reports",
    "Audited Financial Statements"
  ]);

  const [csrComplianceDownloads, setCsrComplianceDownloads] = useState<any[]>([
    { name: "CSR Brochure (PDF)", size: "4.2 MB" },
    { name: "Annual Report 2024-25", size: "6.8 MB" },
    { name: "Financial Audit Statements", size: "3.1 MB" },
    { name: "Impact Statistics summary", size: "1.9 MB" }
  ]);

  const [csrCaseStudies, setCsrCaseStudies] = useState<any[]>([
    {
      title: "Vidya: Digital Classrooms in Javadhu Hills",
      problem: "Over 85% of tribal students in Javadhu hills lacked access to basic computer literacy and internet connectivity, leading to high school dropout rates.",
      solution: "Established 5 fully-equipped digital learning centers with solar power backups, hardware systems, and local coordinators.",
      results: "94% drop in school dropouts, and over 1,200 tribal children trained in basic computer skills.",
      beneficiaries: "1,200+ Students",
      quote: "This center has opened a new world for our children. They now look forward to school every single day.",
      author: "M. Raman, Village Head"
    },
    {
      title: "Prakriti: Water Conservation in Salem District",
      problem: "Severe seasonal water scarcity in agricultural villages caused crop failures and community migration during dry summer months.",
      solution: "Constructed 3 check dams and desilted 5 community temple tanks to recharge the local groundwater table.",
      results: "40% increase in seasonal crop yield and reliable groundwater access for 4 adjacent villages.",
      beneficiaries: "3,500+ Villagers",
      quote: "We did not have water to drink in May. Now our wells are full, and we are harvesting double crops.",
      author: "K. Sidhan, Farmer Union Lead"
    }
  ]);

  const [csrCorporatePartners, setCsrCorporatePartners] = useState<any[]>([
    { name: "ABC Company", duration: "Partner since 2024", collab: "Vidya School digitisation" },
    { name: "XYZ Corporation", duration: "Partner since 2025", collab: "Prakriti Tree Planting" },
    { name: "Dhara Tech Solutions", duration: "Partner since 2023", collab: "Rural Healthcare Drives" },
    { name: "Southern Enterprises", duration: "Partner since 2025", collab: "Community Water Desilting" }
  ]);

  const [csrTestimonial, setCsrTestimonial] = useState({
    quote: "Dhara Foundations has been an excellent CSR implementation partner, delivering measurable impact and maintaining complete transparency.",
    author: "CSR Head, ABC Company"
  });

  // Load config on mount or config change
  useEffect(() => {
    if (siteConfig) {
      if (siteConfig.razorpayConfig && siteConfig.razorpayConfig.keyId) {
        setRazorpayKeyId(siteConfig.razorpayConfig.keyId);
      } else if (siteConfig.donorConfig && siteConfig.donorConfig.razorpayKeyId) {
        setRazorpayKeyId(siteConfig.donorConfig.razorpayKeyId);
      }

      if (siteConfig.donorConfig) {
        if (siteConfig.donorConfig.presets) setDonorPresets(siteConfig.donorConfig.presets);
        if (siteConfig.donorConfig.bankDetails) setBankDetails(siteConfig.donorConfig.bankDetails);
        if (siteConfig.donorConfig.taxExemptText) setTaxExemptText(siteConfig.donorConfig.taxExemptText);
      }

      if (siteConfig.eventRegConfig && siteConfig.eventRegConfig.tickets) {
        setRegistrationTickets(siteConfig.eventRegConfig.tickets.map((t: any) => ({
          ...t,
          features: Array.isArray(t.features) ? t.features.join(', ') : t.features || ''
        })));
      } else if (siteConfig.registrationTickets && siteConfig.registrationTickets.length > 0) {
        setRegistrationTickets(siteConfig.registrationTickets.map((t: any) => ({
          ...t,
          features: Array.isArray(t.features) ? t.features.join(', ') : t.features || ''
        })));
      }

      if (siteConfig.eventYear) {
        setEventYear(siteConfig.eventYear);
      } else if (siteConfig.eventRegConfig && siteConfig.eventRegConfig.eventYear) {
        setEventYear(siteConfig.eventRegConfig.eventYear);
      }

      if (siteConfig.generalEnquiriesConfig) {
        setContactInfo(prev => ({ ...prev, ...siteConfig.generalEnquiriesConfig }));
      }

      if (siteConfig.sponsorshipConfig) {
        const sc = siteConfig.sponsorshipConfig;
        if (sc.benefits && sc.benefits.length > 0) setSponsorshipBenefits(sc.benefits);
        if (sc.opportunities && sc.opportunities.length > 0) setSponsorshipOpportunities(sc.opportunities);
        if (sc.previousSponsors && sc.previousSponsors.length > 0) setPreviousSponsors(sc.previousSponsors);
        if (sc.testimonial) setSponsorTestimonial(sc.testimonial);
        if (sc.faqs && sc.faqs.length > 0) setSponsorshipFaqs(sc.faqs);
        if (sc.packages && sc.packages.length > 0) setSponsorshipPackages(sc.packages);
      }

      if (siteConfig.csrConfig) {
        const cc = siteConfig.csrConfig;
        if (cc.whyPartner && cc.whyPartner.length > 0) setCsrWhyPartner(cc.whyPartner);
        if (cc.csrProcess && cc.csrProcess.length > 0) setCsrProcess(cc.csrProcess);
        if (cc.partnershipModels && cc.partnershipModels.length > 0) setCsrPartnershipModels(cc.partnershipModels);
        if (cc.complianceHub) {
          if (cc.complianceHub.docs) setCsrComplianceDocs(cc.complianceHub.docs);
          if (cc.complianceHub.downloads) setCsrComplianceDownloads(cc.complianceHub.downloads);
        }
        if (cc.caseStudies && cc.caseStudies.length > 0) setCsrCaseStudies(cc.caseStudies);
        if (cc.corporatePartners && cc.corporatePartners.length > 0) setCsrCorporatePartners(cc.corporatePartners);
        if (cc.testimonial) setCsrTestimonial(cc.testimonial);
      }
    }
  }, [siteConfig]);

  // Handlers for Passes/General
  const handleDonorPresetChange = (index: number, field: string, value: string) => {
    const updated = [...donorPresets];
    updated[index] = { ...updated[index], [field]: value };
    setDonorPresets(updated);
  };
  const addDonorPreset = () => setDonorPresets([...donorPresets, { amount: '2001', label: '₹2,001', impact: 'General Seva', desc: 'Sponsor essential event logistics.' }]);
  const removeDonorPreset = (index: number) => setDonorPresets(donorPresets.filter((_, i) => i !== index));

  const handleTicketChange = (index: number, field: string, value: string) => {
    const updated = [...registrationTickets];
    updated[index] = { ...updated[index], [field]: value };
    setRegistrationTickets(updated);
  };

  // Handlers for Sponsors
  const addPartner = () => {
    setPreviousSponsors(prev => [...prev, { name: '', role: '' }]);
  };
  const removePartner = (index: number) => {
    setPreviousSponsors(prev => prev.filter((_, i) => i !== index));
  };
  const handlePartnerChange = (index: number, field: string, value: string) => {
    setPreviousSponsors(prev => prev.map((item, i) => i === index ? { ...item, [field]: value } : item));
  };

  const addSponsorFaq = () => {
    setSponsorshipFaqs(prev => [...prev, { q: '', a: '' }]);
  };
  const removeSponsorFaq = (index: number) => {
    setSponsorshipFaqs(prev => prev.filter((_, i) => i !== index));
  };
  const handleSponsorFaqChange = (index: number, field: string, value: string) => {
    setSponsorshipFaqs(prev => prev.map((item, i) => i === index ? { ...item, [field]: value } : item));
  };

  const handleOpportunityChange = (index: number, field: string, value: string) => {
    setSponsorshipOpportunities(prev => prev.map((item, i) => i === index ? { ...item, [field]: value } : item));
  };

  const handleBenefitChange = (index: number, field: string, value: any) => {
    setSponsorshipBenefits(prev => prev.map((item, i) => i === index ? { ...item, [field]: value } : item));
  };

  const handlePackageChange = (index: number, field: string, value: any) => {
    setSponsorshipPackages(prev => prev.map((item, i) => i === index ? { ...item, [field]: value } : item));
  };

  // Handlers for CSR
  const handleCsrWhyPartnerChange = (index: number, field: string, value: string) => {
    setCsrWhyPartner(prev => prev.map((item, i) => i === index ? { ...item, [field]: value } : item));
  };

  const handleCsrProcessChange = (index: number, value: string) => {
    setCsrProcess(prev => prev.map((step, i) => i === index ? value : step));
  };
  const addCsrProcessStep = () => {
    setCsrProcess(prev => [...prev, '']);
  };
  const removeCsrProcessStep = (index: number) => {
    setCsrProcess(prev => prev.filter((_, i) => i !== index));
  };

  const handleCsrPartnershipModelChange = (index: number, field: string, value: string) => {
    setCsrPartnershipModels(prev => prev.map((item, i) => i === index ? { ...item, [field]: value } : item));
  };

  const handleCsrComplianceDocChange = (index: number, value: string) => {
    setCsrComplianceDocs(prev => prev.map((doc, i) => i === index ? value : doc));
  };
  const addCsrComplianceDoc = () => {
    setCsrComplianceDocs(prev => [...prev, '']);
  };
  const removeCsrComplianceDoc = (index: number) => {
    setCsrComplianceDocs(prev => prev.filter((_, i) => i !== index));
  };

  const handleCsrComplianceDownloadChange = (index: number, field: string, value: string) => {
    setCsrComplianceDownloads(prev => prev.map((item, i) => i === index ? { ...item, [field]: value } : item));
  };
  const addCsrComplianceDownload = () => {
    setCsrComplianceDownloads(prev => [...prev, { name: '', size: '' }]);
  };
  const removeCsrComplianceDownload = (index: number) => {
    setCsrComplianceDownloads(prev => prev.filter((_, i) => i !== index));
  };

  const handleCsrCaseStudyChange = (index: number, field: string, value: string) => {
    setCsrCaseStudies(prev => prev.map((item, i) => i === index ? { ...item, [field]: value } : item));
  };

  const handleCsrCorporatePartnerChange = (index: number, field: string, value: string) => {
    setCsrCorporatePartners(prev => prev.map((item, i) => i === index ? { ...item, [field]: value } : item));
  };
  const addCsrCorporatePartner = () => {
    setCsrCorporatePartners(prev => [...prev, { name: '', duration: '', collab: '' }]);
  };
  const removeCsrCorporatePartner = (index: number) => {
    setCsrCorporatePartners(prev => prev.filter((_, i) => i !== index));
  };

  const handleSave = async () => {
    setSaving(true);
    const parsedTickets = registrationTickets.map(t => ({
      ...t,
      features: typeof t.features === 'string' ? t.features.split(',').map(f => f.trim()).filter(Boolean) : t.features
    }));

    await updateSiteConfig({
      ...siteConfig,
      eventYear,
      registrationTickets: parsedTickets,
      razorpayConfig: {
        keyId: razorpayKeyId
      },
      donorConfig: {
        presets: donorPresets,
        bankDetails,
        taxExemptText,
        razorpayKeyId
      },
      eventRegConfig: {
        eventYear,
        tickets: parsedTickets
      },
      generalEnquiriesConfig: contactInfo,
      sponsorshipConfig: {
        benefits: sponsorshipBenefits,
        opportunities: sponsorshipOpportunities,
        previousSponsors,
        testimonial: sponsorTestimonial,
        faqs: sponsorshipFaqs,
        packages: sponsorshipPackages
      },
      csrConfig: {
        whyPartner: csrWhyPartner,
        csrProcess: csrProcess,
        partnershipModels: csrPartnershipModels,
        complianceHub: {
          docs: csrComplianceDocs,
          downloads: csrComplianceDownloads
        },
        caseStudies: csrCaseStudies,
        corporatePartners: csrCorporatePartners,
        testimonial: csrTestimonial
      }
    });
    setSaving(false);
    alert('Subdomain configurations updated successfully!');
  };

  return (
    <div className="space-y-6 pb-12 animate-fade-in text-[#1B1C19] dark:text-[#F3F4F6]">
      {/* Header Panel */}
      <div className="p-6 rounded-3xl bg-white dark:bg-[#1B1C19] border border-[#EAE8E3] dark:border-[#30312E] shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-serif text-2xl font-bold text-[#1B1C19] dark:text-[#F3F4F6] flex items-center gap-2">
            <Building2 className="text-[#D9762E]" /> Subdomains & Payment Gateway Control
          </h2>
          <p className="text-xs text-[#867463] dark:text-[#9CA3AF] mt-1">
            Configure payment gateways, donate micro-presets, pricing ticket tiers, sponsorships, and CSR credentials.
          </p>
        </div>
        <button
          onClick={handleSave}
          disabled={saving}
          className="bg-[#401C0C] hover:bg-[#5C2913] text-white rounded-xl text-xs font-semibold px-6 py-2.5 flex items-center gap-1.5 cursor-pointer shadow-sm transition-all self-start sm:self-center"
        >
          <Save size={16} /> {saving ? 'Saving...' : 'Save Configuration'}
        </button>
      </div>

      {/* Navigation Tabs */}
      <div className="flex gap-2 border-b border-[#F5F3EE] dark:border-[#2E302A] pb-3 flex-wrap">
        <button
          onClick={() => setActiveSubTab('passes')}
          className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
            activeSubTab === 'passes'
              ? 'bg-[#401C0C] text-white shadow-sm'
              : 'bg-[#F5F3EE] dark:bg-[#242622] text-[#534436] dark:text-[#D1D5DB] hover:bg-[#EAE8E3]'
          }`}
        >
          <Calendar size={14} /> Passes & Payment Control
        </button>
        <button
          onClick={() => setActiveSubTab('sponsors')}
          className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
            activeSubTab === 'sponsors'
              ? 'bg-[#401C0C] text-white shadow-sm'
              : 'bg-[#F5F3EE] dark:bg-[#242622] text-[#534436] dark:text-[#D1D5DB] hover:bg-[#EAE8E3]'
          }`}
        >
          <Trophy size={14} /> Sponsors Control
        </button>
        <button
          onClick={() => setActiveSubTab('csr')}
          className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
            activeSubTab === 'csr'
              ? 'bg-[#401C0C] text-white shadow-sm'
              : 'bg-[#F5F3EE] dark:bg-[#242622] text-[#534436] dark:text-[#D1D5DB] hover:bg-[#EAE8E3]'
          }`}
        >
          <Briefcase size={14} /> CSR Partnerships
        </button>
      </div>

      <div className="space-y-6">
        {/* SUBTAB 1: PASSES & PAYMENT CONTROL */}
        {activeSubTab === 'passes' && (
          <>
            {/* Razorpay Gateway Settings */}
            <div className="p-6 rounded-3xl bg-white dark:bg-[#1B1C19] border border-[#EAE8E3] dark:border-[#30312E] shadow-sm space-y-4">
              <div className="flex items-center justify-between flex-wrap gap-2">
                <h3 className="font-serif text-lg font-bold flex items-center gap-2 text-[#401C0C] dark:text-[#F3F4F6]">
                  <ShieldCheck className="text-[#D9762E]" size={20} /> Razorpay Payment Gateway Configuration
                </h3>
                <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                  razorpayKeyId.startsWith('rzp_')
                    ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300'
                    : 'bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300'
                }`}>
                  {razorpayKeyId.startsWith('rzp_') ? 'Active Key Loaded' : 'Key Unconfigured'}
                </span>
              </div>
              <div className="p-4 bg-[#FAF8F5] dark:bg-[#242622] border border-[#EAE8E3] dark:border-[#30312E] rounded-2xl">
                <label className="block text-xs font-bold text-[#401C0C] dark:text-[#F3F4F6] mb-1.5">
                  Razorpay Key ID (Live / Test Key)
                </label>
                <input
                  type="text"
                  value={razorpayKeyId}
                  onChange={(e) => setRazorpayKeyId(e.target.value)}
                  placeholder="e.g. rzp_live_aBcDeFgHiJkLmNoP"
                  className="w-full bg-white dark:bg-[#1B1C19] text-[#1B1C19] dark:text-[#F3F4F6] border border-[#E4E2DD] dark:border-[#30312E] rounded-xl p-3 text-sm focus:outline-none focus:border-[#401C0C] font-mono"
                />
                <p className="text-[10px] text-[#867463] dark:text-[#9CA3AF] mt-1.5 flex items-center gap-1">
                  <ShieldAlert size={12} className="text-amber-500" /> Keys are encrypted and processed securely during checkouts.
                </p>
              </div>
            </div>

            {/* Offline Bank Details Settings */}
            <div className="p-6 rounded-3xl bg-white dark:bg-[#1B1C19] border border-[#EAE8E3] dark:border-[#30312E] shadow-sm space-y-5">
              <h3 className="font-serif text-lg font-bold flex items-center gap-2 text-[#401C0C] dark:text-[#F3F4F6]">
                <Heart className="text-[#D9762E]" size={20} /> Bank Transfer / Offline Manual Seva Details
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <label className="block text-[10px] uppercase font-bold text-[#867463] mb-1">Account Holder Name</label>
                    <input
                      type="text"
                      value={bankDetails.accountName}
                      onChange={(e) => setBankDetails(prev => ({ ...prev, accountName: e.target.value }))}
                      className="w-full bg-[#F5F3EE] dark:bg-[#242622] border border-[#E4E2DD] dark:border-[#30312E] rounded-xl p-2.5 text-xs font-semibold"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[10px] uppercase font-bold text-[#867463] mb-1">Bank Name</label>
                      <input
                        type="text"
                        value={bankDetails.bankName}
                        onChange={(e) => setBankDetails(prev => ({ ...prev, bankName: e.target.value }))}
                        className="w-full bg-[#F5F3EE] dark:bg-[#242622] border border-[#E4E2DD] dark:border-[#30312E] rounded-xl p-2.5 text-xs font-medium"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] uppercase font-bold text-[#867463] mb-1">IFSC Code</label>
                      <input
                        type="text"
                        value={bankDetails.ifsc}
                        onChange={(e) => setBankDetails(prev => ({ ...prev, ifsc: e.target.value }))}
                        className="w-full bg-[#F5F3EE] dark:bg-[#242622] border border-[#E4E2DD] dark:border-[#30312E] rounded-xl p-2.5 text-xs font-mono font-bold"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-[10px] uppercase font-bold text-[#867463] mb-1">Account Number</label>
                    <input
                      type="text"
                      value={bankDetails.accountNumber}
                      onChange={(e) => setBankDetails(prev => ({ ...prev, accountNumber: e.target.value }))}
                      className="w-full bg-[#F5F3EE] dark:bg-[#242622] border border-[#E4E2DD] dark:border-[#30312E] rounded-xl p-2.5 text-xs font-mono font-bold"
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-[10px] uppercase font-bold text-[#867463] mb-1">80G tax exemption alert text</label>
                    <textarea
                      value={taxExemptText}
                      onChange={(e) => setTaxExemptText(e.target.value)}
                      rows={3}
                      className="w-full bg-[#F5F3EE] dark:bg-[#242622] border border-[#E4E2DD] dark:border-[#30312E] rounded-xl p-2.5 text-xs focus:outline-none"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[10px] uppercase font-bold text-[#867463] mb-1">Branch</label>
                      <input
                        type="text"
                        value={bankDetails.branch}
                        onChange={(e) => setBankDetails(prev => ({ ...prev, branch: e.target.value }))}
                        className="w-full bg-[#F5F3EE] dark:bg-[#242622] border border-[#E4E2DD] dark:border-[#30312E] rounded-xl p-2.5 text-xs font-medium"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] uppercase font-bold text-[#867463] mb-1">UPI ID</label>
                      <input
                        type="text"
                        value={bankDetails.upiId}
                        onChange={(e) => setBankDetails(prev => ({ ...prev, upiId: e.target.value }))}
                        className="w-full bg-[#F5F3EE] dark:bg-[#242622] border border-[#E4E2DD] dark:border-[#30312E] rounded-xl p-2.5 text-xs font-medium"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Event Registration Ticket Passes Settings */}
            <div className="p-6 rounded-3xl bg-white dark:bg-[#1B1C19] border border-[#EAE8E3] dark:border-[#30312E] shadow-sm space-y-5">
              <h3 className="font-serif text-lg font-bold flex items-center gap-2 text-[#401C0C] dark:text-[#F3F4F6]">
                <Calendar className="text-[#C9A646]" size={20} /> Event Registration — Ticket Tiers & Pricing Pass Config
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pb-4 border-b border-[#F5F3EE] dark:border-[#2E302A]">
                <div>
                  <label className="block text-xs font-bold text-[#401C0C] dark:text-[#F3F4F6] mb-1">
                    Event Celebration Year (e.g. 2026)
                  </label>
                  <input
                    type="text"
                    value={eventYear}
                    onChange={(e) => setEventYear(e.target.value)}
                    placeholder="2026"
                    className="w-full bg-[#F5F3EE] dark:bg-[#242622] text-[#1B1C19] dark:text-[#F3F4F6] border border-[#E4E2DD] dark:border-[#30312E] rounded-xl p-2.5 text-xs font-semibold"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {registrationTickets.map((ticket, index) => (
                  <div key={ticket.id || index} className="p-4 bg-[#F9F8F6] dark:bg-[#242622] border border-[#EAE8E3] dark:border-[#30312E] rounded-2xl space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-xs font-bold uppercase tracking-wider text-[#D9762E]">{ticket.id}</span>
                      <input
                        type="text"
                        value={ticket.price}
                        onChange={(e) => handleTicketChange(index, 'price', e.target.value)}
                        placeholder="₹1,500"
                        className="w-24 bg-white dark:bg-[#1B1C19] border border-[#E4E2DD] dark:border-[#404040] rounded-lg p-1.5 text-xs font-bold text-center"
                      />
                    </div>
                    <input
                      type="text"
                      value={ticket.name}
                      onChange={(e) => handleTicketChange(index, 'name', e.target.value)}
                      placeholder="Ticket Name"
                      className="w-full bg-white dark:bg-[#1B1C19] text-[#1B1C19] dark:text-[#F3F4F6] border border-[#E4E2DD] dark:border-[#404040] rounded p-1.5 text-xs font-bold"
                    />
                    <textarea
                      value={ticket.description}
                      onChange={(e) => handleTicketChange(index, 'description', e.target.value)}
                      rows={2}
                      placeholder="Short description..."
                      className="w-full bg-white dark:bg-[#1B1C19] text-[#1B1C19] dark:text-[#F3F4F6] border border-[#E4E2DD] dark:border-[#404040] rounded p-1.5 text-xs resize-none"
                    />
                    <div>
                      <label className="block text-[8px] uppercase text-[#867463] mb-0.5">Features List (Comma Separated)</label>
                      <input
                        type="text"
                        value={ticket.features}
                        onChange={(e) => handleTicketChange(index, 'features', e.target.value)}
                        placeholder="Feature A, Feature B..."
                        className="w-full bg-white dark:bg-[#1B1C19] text-[#1B1C19] dark:text-[#F3F4F6] border border-[#E4E2DD] dark:border-[#404040] rounded p-1.5 text-xs"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* General Enquiries Form Contact Info */}
            <div className="p-6 rounded-3xl bg-white dark:bg-[#1B1C19] border border-[#EAE8E3] dark:border-[#30312E] shadow-sm space-y-4">
              <h3 className="font-serif text-lg font-bold flex items-center gap-2 text-[#401C0C] dark:text-[#F3F4F6]">
                <ShieldCheck className="text-[#C9A646]" size={20} /> General Enquiries Form Contact Info
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-[#867463] dark:text-[#9CA3AF] mb-1">Enquiries Email Address</label>
                  <input
                    type="email"
                    value={contactInfo.email}
                    onChange={(e) => setContactInfo(prev => ({ ...prev, email: e.target.value }))}
                    className="w-full bg-[#F5F3EE] dark:bg-[#242622] text-[#1B1C19] dark:text-[#F3F4F6] border border-[#E4E2DD] dark:border-[#30312E] rounded-xl p-3 text-sm focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#867463] dark:text-[#9CA3AF] mb-1">Enquiries Contact Phone</label>
                  <input
                    type="text"
                    value={contactInfo.phone}
                    onChange={(e) => setContactInfo(prev => ({ ...prev, phone: e.target.value }))}
                    className="w-full bg-[#F5F3EE] dark:bg-[#242622] text-[#1B1C19] dark:text-[#F3F4F6] border border-[#E4E2DD] dark:border-[#30312E] rounded-xl p-3 text-sm focus:outline-none"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-xs font-bold text-[#867463] dark:text-[#9CA3AF] mb-1">Trustees Office Address</label>
                  <input
                    type="text"
                    value={contactInfo.address}
                    onChange={(e) => setContactInfo(prev => ({ ...prev, address: e.target.value }))}
                    className="w-full bg-[#F5F3EE] dark:bg-[#242622] text-[#1B1C19] dark:text-[#F3F4F6] border border-[#E4E2DD] dark:border-[#30312E] rounded-xl p-3 text-sm focus:outline-none"
                  />
                </div>
              </div>
            </div>
          </>
        )}

        {/* SUBTAB 2: SPONSORSHIP CONFIGURATION */}
        {activeSubTab === 'sponsors' && (
          <>
            {/* Testimonial Quote */}
            <div className="p-6 rounded-3xl bg-white dark:bg-[#1B1C19] border border-[#EAE8E3] dark:border-[#30312E] shadow-sm space-y-4">
              <h3 className="font-serif text-lg font-bold text-[#401C0C] dark:text-[#F3F4F6] flex items-center gap-2">
                <Trophy size={18} className="text-[#D9762E]" /> Sponsor Testimonial Quote
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="md:col-span-3">
                  <label className="block text-[10px] uppercase font-semibold text-[#867463] mb-1">Quote Text</label>
                  <textarea
                    value={sponsorTestimonial.quote}
                    onChange={(e) => setSponsorTestimonial(prev => ({ ...prev, quote: e.target.value }))}
                    rows={3}
                    className="w-full bg-white dark:bg-[#1B1C19] text-[#1B1C19] dark:text-[#F3F4F6] border border-[#E4E2DD] dark:border-[#30312E] rounded-xl p-3 text-xs resize-none focus:outline-none focus:border-[#D9762E]"
                  />
                </div>
                <div>
                  <label className="block text-[10px] uppercase font-semibold text-[#867463] mb-1">Author Name</label>
                  <input
                    type="text"
                    value={sponsorTestimonial.author}
                    onChange={(e) => setSponsorTestimonial(prev => ({ ...prev, author: e.target.value }))}
                    className="w-full bg-white dark:bg-[#1B1C19] text-[#1B1C19] dark:text-[#F3F4F6] border border-[#E4E2DD] dark:border-[#30312E] rounded-xl p-2.5 text-xs font-bold focus:outline-none focus:border-[#D9762E]"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-[10px] uppercase font-semibold text-[#867463] mb-1">Author Designation & Company</label>
                  <input
                    type="text"
                    value={sponsorTestimonial.designation}
                    onChange={(e) => setSponsorTestimonial(prev => ({ ...prev, designation: e.target.value }))}
                    className="w-full bg-white dark:bg-[#1B1C19] text-[#1B1C19] dark:text-[#F3F4F6] border border-[#E4E2DD] dark:border-[#30312E] rounded-xl p-2.5 text-xs focus:outline-none focus:border-[#D9762E]"
                  />
                </div>
              </div>
            </div>

            {/* Previous Partners & Sponsors */}
            <div className="p-6 rounded-3xl bg-white dark:bg-[#1B1C19] border border-[#EAE8E3] dark:border-[#30312E] shadow-sm space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="font-serif text-lg font-bold text-[#401C0C] dark:text-[#F3F4F6] flex items-center gap-2">
                  <Users size={18} className="text-[#D9762E]" /> Previous Partners & Sponsors
                </h3>
                <button
                  type="button"
                  onClick={addPartner}
                  className="text-[#D9762E] hover:text-[#C9A646] p-1.5 bg-[#F5F3EE] dark:bg-[#242622] rounded-lg border border-[#EAE8E3] dark:border-[#30312E] flex items-center gap-1 text-xs font-semibold"
                >
                  <Plus size={14} /> Add Partner
                </button>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {previousSponsors.map((partner, index) => (
                  <div key={index} className="p-4 bg-[#F9F8F6] dark:bg-[#242622] border border-[#EAE8E3] dark:border-[#30312E] rounded-2xl space-y-3 relative">
                    <button
                      type="button"
                      onClick={() => removePartner(index)}
                      className="absolute top-3 right-3 p-1 text-red-400 hover:text-red-500 rounded"
                      title="Remove Partner"
                    >
                      <Trash2 size={14} />
                    </button>
                    <span className="text-[10px] font-bold font-mono text-[#D9762E]">Sponsor #{index + 1}</span>
                    <div className="grid grid-cols-1 gap-2">
                      <div>
                        <label className="block text-[9px] uppercase font-semibold text-[#867463] mb-1">Company / Brand Name</label>
                        <input
                          type="text"
                          value={partner.name}
                          onChange={(e) => handlePartnerChange(index, 'name', e.target.value)}
                          placeholder="e.g. ABC Corporation"
                          className="w-full bg-white dark:bg-[#1B1C19] text-[#1B1C19] dark:text-[#F3F4F6] border border-[#E4E2DD] dark:border-[#404040] rounded px-2.5 py-1.5 text-xs font-bold focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-[9px] uppercase font-semibold text-[#867463] mb-1">Sponsorship Role / Tag</label>
                        <input
                          type="text"
                          value={partner.role}
                          onChange={(e) => handlePartnerChange(index, 'role', e.target.value)}
                          placeholder="e.g. Title Sponsor 2025"
                          className="w-full bg-white dark:bg-[#1B1C19] text-[#1B1C19] dark:text-[#F3F4F6] border border-[#E4E2DD] dark:border-[#404040] rounded px-2.5 py-1.5 text-xs focus:outline-none"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Frequently Asked Questions */}
            <div className="p-6 rounded-3xl bg-white dark:bg-[#1B1C19] border border-[#EAE8E3] dark:border-[#30312E] shadow-sm space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="font-serif text-lg font-bold text-[#401C0C] dark:text-[#F3F4F6] flex items-center gap-2">
                  <HelpCircle className="text-[#D9762E]" size={18} /> Frequently Asked Questions
                </h3>
                <button
                  type="button"
                  onClick={addSponsorFaq}
                  className="text-[#D9762E] hover:text-[#C9A646] p-1.5 bg-[#F5F3EE] dark:bg-[#242622] rounded-lg border border-[#EAE8E3] dark:border-[#30312E] flex items-center gap-1 text-xs font-semibold"
                >
                  <Plus size={14} /> Add Question
                </button>
              </div>
              
              <div className="space-y-4">
                {sponsorshipFaqs.map((faq, index) => (
                  <div key={index} className="p-4 bg-[#F9F8F6] dark:bg-[#242622] border border-[#EAE8E3] dark:border-[#30312E] rounded-2xl space-y-3 relative">
                    <button
                      type="button"
                      onClick={() => removeSponsorFaq(index)}
                      className="absolute top-3 right-3 p-1 text-red-400 hover:text-red-500 rounded"
                      title="Remove FAQ"
                    >
                      <Trash2 size={14} />
                    </button>
                    <span className="text-[10px] font-bold font-mono text-[#D9762E]">FAQ #{index + 1}</span>
                    <div className="space-y-2">
                      <div>
                        <label className="block text-[9px] uppercase font-semibold text-[#867463] mb-1">Question</label>
                        <input
                          type="text"
                          value={faq.q}
                          onChange={(e) => handleSponsorFaqChange(index, 'q', e.target.value)}
                          placeholder="e.g. Can sponsorship packages be customized?"
                          className="w-full bg-white dark:bg-[#1B1C19] text-[#1B1C19] dark:text-[#F3F4F6] border border-[#E4E2DD] dark:border-[#404040] rounded px-2.5 py-1.5 text-xs font-bold focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-[9px] uppercase font-semibold text-[#867463] mb-1">Answer</label>
                        <textarea
                          value={faq.a}
                          onChange={(e) => handleSponsorFaqChange(index, 'a', e.target.value)}
                          rows={2}
                          className="w-full bg-white dark:bg-[#1B1C19] text-[#1B1C19] dark:text-[#F3F4F6] border border-[#E4E2DD] dark:border-[#404040] rounded px-2.5 py-1.5 text-xs resize-none focus:outline-none"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Sponsorship Packages */}
            <div className="p-6 rounded-3xl bg-white dark:bg-[#1B1C19] border border-[#EAE8E3] dark:border-[#30312E] shadow-sm space-y-4">
              <h3 className="font-serif text-lg font-bold text-[#401C0C] dark:text-[#F3F4F6] flex items-center gap-2">
                <Award size={18} className="text-[#D9762E]" /> Sponsorship Tiers & Packages (5 Tiers)
              </h3>
              <div className="grid grid-cols-1 gap-6">
                {sponsorshipPackages.map((pkg, index) => (
                  <div key={index} className="p-5 border border-[#EAE8E3] dark:border-[#30312E] rounded-2xl space-y-3 bg-[#FDFDFD] dark:bg-[#1D1E1B]">
                    <span className="text-[10px] font-bold font-mono text-[#D9762E] uppercase tracking-wider">{pkg.id} tier</span>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-[9px] uppercase font-semibold text-[#867463] mb-1">Package Name</label>
                        <input
                          type="text"
                          value={pkg.name}
                          onChange={(e) => handlePackageChange(index, 'name', e.target.value)}
                          className="w-full bg-white dark:bg-[#1B1C19] text-[#1B1C19] dark:text-[#F3F4F6] border border-[#30312E] rounded-xl p-2.5 text-xs font-bold focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-[9px] uppercase font-semibold text-[#867463] mb-1">Sponsorship Amount Label</label>
                        <input
                          type="text"
                          value={pkg.amount}
                          onChange={(e) => handlePackageChange(index, 'amount', e.target.value)}
                          className="w-full bg-white dark:bg-[#1B1C19] text-[#1B1C19] dark:text-[#F3F4F6] border border-[#30312E] rounded-xl p-2.5 text-xs font-bold focus:outline-none text-[#D9762E]"
                        />
                      </div>
                      <div>
                        <label className="block text-[9px] uppercase font-semibold text-[#867463] mb-1">Short Description</label>
                        <input
                          type="text"
                          value={pkg.description}
                          onChange={(e) => handlePackageChange(index, 'description', e.target.value)}
                          className="w-full bg-white dark:bg-[#1B1C19] text-[#1B1C19] dark:text-[#F3F4F6] border border-[#30312E] rounded-xl p-2.5 text-xs focus:outline-none"
                        />
                      </div>
                      <div className="md:col-span-3">
                        <label className="block text-[9px] uppercase font-semibold text-[#867463] mb-1">Tier Benefits Bullet List (One per line)</label>
                        <textarea
                          value={Array.isArray(pkg.benefits) ? pkg.benefits.join('\n') : pkg.benefits || ''}
                          onChange={(e) => handlePackageChange(index, 'benefits', e.target.value.split('\n'))}
                          rows={4}
                          className="w-full bg-white dark:bg-[#1B1C19] text-[#1B1C19] dark:text-[#F3F4F6] border border-[#E4E2DD] dark:border-[#30312E] rounded-xl p-3 text-xs resize-none focus:outline-none font-mono"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}

        {/* SUBTAB 3: CSR PARTNERSHIPS */}
        {activeSubTab === 'csr' && (
          <>
            {/* Why Partner With Us */}
            <div className="p-6 rounded-3xl bg-white dark:bg-[#1B1C19] border border-[#EAE8E3] dark:border-[#30312E] shadow-sm space-y-4">
              <h3 className="font-serif text-lg font-bold text-[#401C0C] dark:text-[#F3F4F6] flex items-center gap-2">
                <Briefcase size={18} className="text-[#D9762E]" /> Why Partner With Us (6 Cards)
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {csrWhyPartner.map((card, index) => (
                  <div key={index} className="p-4 bg-[#F9F8F6] dark:bg-[#242622] border border-[#EAE8E3] dark:border-[#30312E] rounded-2xl space-y-3">
                    <span className="text-[10px] font-bold font-mono text-[#D9762E]">Card #{index + 1}</span>
                    <div>
                      <label className="block text-[9px] uppercase font-semibold text-[#867463] mb-1">Title</label>
                      <input
                        type="text"
                        value={card.title}
                        onChange={(e) => handleCsrWhyPartnerChange(index, 'title', e.target.value)}
                        className="w-full bg-white dark:bg-[#1B1C19] text-[#1B1C19] dark:text-[#F3F4F6] border border-[#E4E2DD] dark:border-[#30312E] rounded-xl p-2 text-xs font-bold focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-[9px] uppercase font-semibold text-[#867463] mb-1">Description</label>
                      <textarea
                        value={card.desc}
                        onChange={(e) => handleCsrWhyPartnerChange(index, 'desc', e.target.value)}
                        rows={2}
                        className="w-full bg-white dark:bg-[#1B1C19] text-[#1B1C19] dark:text-[#F3F4F6] border border-[#E4E2DD] dark:border-[#30312E] rounded-xl p-2 text-xs resize-none focus:outline-none"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Our CSR Process Timeline */}
            <div className="p-6 rounded-3xl bg-white dark:bg-[#1B1C19] border border-[#EAE8E3] dark:border-[#30312E] shadow-sm space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="font-serif text-lg font-bold text-[#401C0C] dark:text-[#F3F4F6] flex items-center gap-2">
                  <ArrowUpDown size={18} className="text-[#D9762E]" /> Our CSR Process Steps
                </h3>
                <button
                  type="button"
                  onClick={addCsrProcessStep}
                  className="text-[#D9762E] hover:text-[#C9A646] p-1.5 bg-[#F5F3EE] dark:bg-[#242622] rounded-lg border border-[#EAE8E3] dark:border-[#30312E] flex items-center gap-1 text-xs font-semibold"
                >
                  <Plus size={14} /> Add Step
                </button>
              </div>
              <div className="space-y-3">
                {csrProcess.map((step, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <span className="text-xs font-mono font-bold text-[#D9762E] w-12">Step 0{index + 1}</span>
                    <input
                      type="text"
                      value={step}
                      onChange={(e) => handleCsrProcessChange(index, e.target.value)}
                      className="flex-1 bg-white dark:bg-[#1B1C19] text-[#1B1C19] dark:text-[#F3F4F6] border border-[#E4E2DD] dark:border-[#30312E] rounded-xl p-2.5 text-xs focus:outline-none focus:border-[#D9762E]"
                    />
                    <button
                      type="button"
                      onClick={() => removeCsrProcessStep(index)}
                      className="p-2 text-red-400 hover:text-red-500 rounded-lg hover:bg-red-50"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* CSR Partnership Models */}
            <div className="p-6 rounded-3xl bg-white dark:bg-[#1B1C19] border border-[#EAE8E3] dark:border-[#30312E] shadow-sm space-y-4">
              <h3 className="font-serif text-lg font-bold text-[#401C0C] dark:text-[#F3F4F6] flex items-center gap-2">
                <Building2 size={18} className="text-[#D9762E]" /> CSR Partnership Collaboration Models (4 Models)
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {csrPartnershipModels.map((model, index) => (
                  <div key={index} className="p-4 bg-[#F9F8F6] dark:bg-[#242622] border border-[#EAE8E3] dark:border-[#30312E] rounded-2xl space-y-3">
                    <span className="text-[10px] font-bold font-mono text-[#D9762E]">Model #{index + 1}</span>
                    <div>
                      <label className="block text-[9px] uppercase font-semibold text-[#867463] mb-1">Collaboration Model Title</label>
                      <input
                        type="text"
                        value={model.title}
                        onChange={(e) => handleCsrPartnershipModelChange(index, 'title', e.target.value)}
                        className="w-full bg-white dark:bg-[#1B1C19] text-[#1B1C19] dark:text-[#F3F4F6] border border-[#E4E2DD] dark:border-[#30312E] rounded-xl p-2 text-xs font-bold focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-[9px] uppercase font-semibold text-[#867463] mb-1">Description / Focus Areas</label>
                      <textarea
                        value={model.desc}
                        onChange={(e) => handleCsrPartnershipModelChange(index, 'desc', e.target.value)}
                        rows={2}
                        className="w-full bg-white dark:bg-[#1B1C19] text-[#1B1C19] dark:text-[#F3F4F6] border border-[#E4E2DD] dark:border-[#30312E] rounded-xl p-2 text-xs resize-none focus:outline-none"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* CSR Compliance Hub */}
            <div className="p-6 rounded-3xl bg-white dark:bg-[#1B1C19] border border-[#EAE8E3] dark:border-[#30312E] shadow-sm space-y-4">
              <h3 className="font-serif text-lg font-bold text-[#401C0C] dark:text-[#F3F4F6] flex items-center gap-2">
                <ShieldCheck size={18} className="text-[#D9762E]" /> CSR Compliance & Legal Disclosures
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Checklist list */}
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <label className="block text-[10px] uppercase font-bold text-[#867463]">Compliance Checklist</label>
                    <button
                      type="button"
                      onClick={addCsrComplianceDoc}
                      className="text-[#D9762E] hover:text-[#C9A646] p-1.5 bg-[#F5F3EE] dark:bg-[#242622] rounded-lg border border-[#EAE8E3] dark:border-[#30312E] flex items-center gap-1 text-[10px] font-semibold"
                    >
                      <Plus size={12} /> Add Item
                    </button>
                  </div>
                  <div className="space-y-2">
                    {csrComplianceDocs.map((doc, index) => (
                      <div key={index} className="flex items-center gap-2">
                        <input
                          type="text"
                          value={doc}
                          onChange={(e) => handleCsrComplianceDocChange(index, e.target.value)}
                          className="flex-1 bg-white dark:bg-[#1B1C19] text-[#1B1C19] dark:text-[#F3F4F6] border border-[#E4E2DD] dark:border-[#30312E] rounded-xl p-2 text-xs focus:outline-none"
                        />
                        <button
                          type="button"
                          onClick={() => removeCsrComplianceDoc(index)}
                          className="p-1 text-red-400 hover:text-red-500"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Downloads list */}
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <label className="block text-[10px] uppercase font-bold text-[#867463]">Download Files Section</label>
                    <button
                      type="button"
                      onClick={addCsrComplianceDownload}
                      className="text-[#D9762E] hover:text-[#C9A646] p-1.5 bg-[#F5F3EE] dark:bg-[#242622] rounded-lg border border-[#EAE8E3] dark:border-[#30312E] flex items-center gap-1 text-[10px] font-semibold"
                    >
                      <Plus size={12} /> Add File
                    </button>
                  </div>
                  <div className="space-y-2">
                    {csrComplianceDownloads.map((file, index) => (
                      <div key={index} className="flex items-center gap-2 bg-[#F9F8F6] dark:bg-[#242622] p-2 border border-[#EAE8E3] dark:border-[#30312E] rounded-2xl">
                        <div className="flex-1 grid grid-cols-2 gap-2">
                          <input
                            type="text"
                            value={file.name}
                            onChange={(e) => handleCsrComplianceDownloadChange(index, 'name', e.target.value)}
                            placeholder="File Name"
                            className="bg-white dark:bg-[#1B1C19] text-[#1B1C19] dark:text-[#F3F4F6] border border-[#E4E2DD] dark:border-[#30312E] rounded-xl p-2 text-[11px] focus:outline-none"
                          />
                          <input
                            type="text"
                            value={file.size}
                            onChange={(e) => handleCsrComplianceDownloadChange(index, 'size', e.target.value)}
                            placeholder="e.g. 4.2 MB"
                            className="bg-white dark:bg-[#1B1C19] text-[#1B1C19] dark:text-[#F3F4F6] border border-[#E4E2DD] dark:border-[#30312E] rounded-xl p-2 text-[11px] focus:outline-none"
                          />
                        </div>
                        <button
                          type="button"
                          onClick={() => removeCsrComplianceDownload(index)}
                          className="p-1 text-red-400 hover:text-red-500"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Success Stories & Case Studies */}
            <div className="p-6 rounded-3xl bg-white dark:bg-[#1B1C19] border border-[#EAE8E3] dark:border-[#30312E] shadow-sm space-y-4">
              <h3 className="font-serif text-lg font-bold text-[#401C0C] dark:text-[#F3F4F6] flex items-center gap-2">
                <Newspaper size={18} className="text-[#D9762E]" /> Success Stories & Case Studies (2 Cases)
              </h3>
              <div className="grid grid-cols-1 gap-6">
                {csrCaseStudies.map((study, index) => (
                  <div key={index} className="p-5 border border-[#EAE8E3] dark:border-[#30312E] rounded-2xl bg-[#FDFDFD] dark:bg-[#1D1E1B] space-y-3">
                    <span className="text-[10px] font-bold font-mono text-[#D9762E] uppercase tracking-wider">Case Study #{index + 1}</span>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-[9px] uppercase font-semibold text-[#867463] mb-1">Case Study Title</label>
                        <input
                          type="text"
                          value={study.title}
                          onChange={(e) => handleCsrCaseStudyChange(index, 'title', e.target.value)}
                          className="w-full bg-white dark:bg-[#1B1C19] text-[#1B1C19] dark:text-[#F3F4F6] border border-[#E4E2DD] dark:border-[#30312E] rounded-xl p-2.5 text-xs font-bold focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-[9px] uppercase font-semibold text-[#867463] mb-1">Key Metrics / Impact Label</label>
                        <input
                          type="text"
                          value={study.beneficiaries}
                          onChange={(e) => handleCsrCaseStudyChange(index, 'beneficiaries', e.target.value)}
                          placeholder="e.g. 1,200+ Students"
                          className="w-full bg-white dark:bg-[#1B1C19] text-[#1B1C19] dark:text-[#F3F4F6] border border-[#E4E2DD] dark:border-[#30312E] rounded-xl p-2.5 text-xs font-bold focus:outline-none text-[#D9762E]"
                        />
                      </div>
                      <div>
                        <label className="block text-[9px] uppercase font-semibold text-[#867463] mb-1">Problem Statement</label>
                        <textarea
                          value={study.problem}
                          onChange={(e) => handleCsrCaseStudyChange(index, 'problem', e.target.value)}
                          rows={2}
                          className="w-full bg-white dark:bg-[#1B1C19] text-[#1B1C19] dark:text-[#F3F4F6] border border-[#E4E2DD] dark:border-[#30312E] rounded-xl p-2 text-xs resize-none focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-[9px] uppercase font-semibold text-[#867463] mb-1">Solution Implemented</label>
                        <textarea
                          value={study.solution}
                          onChange={(e) => handleCsrCaseStudyChange(index, 'solution', e.target.value)}
                          rows={2}
                          className="w-full bg-white dark:bg-[#1B1C19] text-[#1B1C19] dark:text-[#F3F4F6] border border-[#E4E2DD] dark:border-[#30312E] rounded-xl p-2 text-xs resize-none focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-[9px] uppercase font-semibold text-[#867463] mb-1">Results Delivered</label>
                        <textarea
                          value={study.results}
                          onChange={(e) => handleCsrCaseStudyChange(index, 'results', e.target.value)}
                          rows={2}
                          className="w-full bg-white dark:bg-[#1B1C19] text-[#1B1C19] dark:text-[#F3F4F6] border border-[#E4E2DD] dark:border-[#30312E] rounded-xl p-2 text-xs resize-none focus:outline-none"
                        />
                      </div>
                      
                      <div className="p-4 border border-[#EAE8E3] dark:border-[#30312E] rounded-2xl bg-white dark:bg-[#1B1C19] space-y-2">
                        <span className="text-[9px] font-bold font-mono text-[#867463] uppercase">Beneficiary Testimonial Quote</span>
                        <div>
                          <label className="block text-[8px] uppercase text-[#867463] mb-0.5">Quote Text</label>
                          <input
                            type="text"
                            value={study.quote}
                            onChange={(e) => handleCsrCaseStudyChange(index, 'quote', e.target.value)}
                            className="w-full bg-white dark:bg-[#1B1C19] text-[#1B1C19] dark:text-[#F3F4F6] border border-transparent border-b-[#E4E2DD] dark:border-b-[#30312E] p-1 text-[11px] focus:outline-none"
                          />
                        </div>
                        <div>
                          <label className="block text-[8px] uppercase text-[#867463] mb-0.5">Author</label>
                          <input
                            type="text"
                            value={study.author}
                            onChange={(e) => handleCsrCaseStudyChange(index, 'author', e.target.value)}
                            className="w-full bg-white dark:bg-[#1B1C19] text-[#1B1C19] dark:text-[#F3F4F6] border-transparent p-1 text-[11px] focus:outline-none"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* CSR Corporate Partners list */}
            <div className="p-6 rounded-3xl bg-white dark:bg-[#1B1C19] border border-[#EAE8E3] dark:border-[#30312E] shadow-sm space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="font-serif text-lg font-bold text-[#401C0C] dark:text-[#F3F4F6] flex items-center gap-2">
                  <Users size={18} className="text-[#D9762E]" /> CSR Corporate Impact Partners
                </h3>
                <button
                  type="button"
                  onClick={addCsrCorporatePartner}
                  className="text-[#D9762E] hover:text-[#C9A646] p-1.5 bg-[#F5F3EE] dark:bg-[#242622] rounded-lg border border-[#EAE8E3] dark:border-[#30312E] flex items-center gap-1 text-xs font-semibold"
                >
                  <Plus size={14} /> Add Partner
                </button>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {csrCorporatePartners.map((partner, index) => (
                  <div key={index} className="p-4 bg-[#F9F8F6] dark:bg-[#242622] border border-[#EAE8E3] dark:border-[#30312E] rounded-2xl space-y-3 relative">
                    <button
                      type="button"
                      onClick={() => removeCsrCorporatePartner(index)}
                      className="absolute top-3 right-3 p-1 text-red-400 hover:text-red-500"
                    >
                      <Trash2 size={14} />
                    </button>
                    <span className="text-[10px] font-bold font-mono text-[#D9762E]">Partner #{index + 1}</span>
                    <div className="space-y-2">
                      <div>
                        <label className="block text-[8px] uppercase text-[#867463] mb-0.5">Partner Corporate Name</label>
                        <input
                          type="text"
                          value={partner.name}
                          onChange={(e) => handleCsrCorporatePartnerChange(index, 'name', e.target.value)}
                          className="w-full bg-white dark:bg-[#1B1C19] text-[#1B1C19] dark:text-[#F3F4F6] border border-[#E4E2DD] dark:border-[#30312E] rounded p-1.5 text-xs font-bold focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-[8px] uppercase text-[#867463] mb-0.5">Partnership Timeline</label>
                        <input
                          type="text"
                          value={partner.duration}
                          onChange={(e) => handleCsrCorporatePartnerChange(index, 'duration', e.target.value)}
                          className="w-full bg-white dark:bg-[#1B1C19] text-[#1B1C19] dark:text-[#F3F4F6] border border-[#E4E2DD] dark:border-[#30312E] rounded p-1.5 text-xs focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-[8px] uppercase text-[#867463] mb-0.5">Collaboration Project Scope</label>
                        <input
                          type="text"
                          value={partner.collab}
                          onChange={(e) => handleCsrCorporatePartnerChange(index, 'collab', e.target.value)}
                          className="w-full bg-white dark:bg-[#1B1C19] text-[#1B1C19] dark:text-[#F3F4F6] border border-[#E4E2DD] dark:border-[#30312E] rounded p-1.5 text-xs focus:outline-none"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* CSR Global Testimonial Quote */}
            <div className="p-6 rounded-3xl bg-white dark:bg-[#1B1C19] border border-[#EAE8E3] dark:border-[#30312E] shadow-sm space-y-4">
              <h3 className="font-serif text-lg font-bold text-[#401C0C] dark:text-[#F3F4F6] flex items-center gap-2">
                <Star size={18} className="text-[#D9762E]" /> CSR Partnership Global Testimonial Quote
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="md:col-span-2">
                  <label className="block text-[10px] uppercase font-semibold text-[#867463] mb-1">Quote Text</label>
                  <textarea
                    value={csrTestimonial.quote}
                    onChange={(e) => setCsrTestimonial(prev => ({ ...prev, quote: e.target.value }))}
                    rows={2}
                    className="w-full bg-white dark:bg-[#1B1C19] text-[#1B1C19] dark:text-[#F3F4F6] border border-[#E4E2DD] dark:border-[#30312E] rounded-xl p-3 text-xs resize-none focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[10px] uppercase font-semibold text-[#867463] mb-1">Author Name / Entity</label>
                  <input
                    type="text"
                    value={csrTestimonial.author}
                    onChange={(e) => setCsrTestimonial(prev => ({ ...prev, author: e.target.value }))}
                    className="w-full bg-white dark:bg-[#1B1C19] text-[#1B1C19] dark:text-[#F3F4F6] border border-[#E4E2DD] dark:border-[#30312E] rounded-xl p-2.5 text-xs font-bold focus:outline-none"
                  />
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};
