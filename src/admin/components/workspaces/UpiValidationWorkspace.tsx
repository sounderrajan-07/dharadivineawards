import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  ShieldCheck, 
  Search, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  Copy, 
  Check, 
  Eye, 
  Filter, 
  QrCode, 
  IndianRupee, 
  ExternalLink,
  AlertTriangle,
  Download,
  X
} from 'lucide-react';

export const UpiValidationWorkspace: React.FC = () => {
  const { delegates, donations, updateUpiVerificationStatus, globalSearchQuery, setGlobalSearchQuery } = useApp();
  const [statusFilter, setStatusFilter] = useState<'pending' | 'all' | 'approved' | 'rejected'>('pending');
  const [moduleFilter, setModuleFilter] = useState<'all' | 'delegates' | 'donations'>('all');
  const [copiedUtr, setCopiedUtr] = useState<string | null>(null);
  const [previewImage, setPreviewImage] = useState<{ src: string; title: string } | null>(null);

  // Normalize delegate and donation entries into unified list
  const delegateUpiItems = delegates
    .filter(d => (d.payment_method === 'UPI_QR' || (d as any).transaction_id || (d as any).payment_id))
    .map(d => ({
      id: d.id,
      moduleType: 'delegates' as const,
      moduleLabel: 'Event Registration',
      name: d.delegate_name,
      email: d.email,
      phone: d.phone,
      tierOrDomain: `${(d.pass_tier || 'delegate').toUpperCase()} Pass (${d.pass_code || ''})`,
      amount: (d as any).amount || (d.pass_tier === 'patron' ? 5000 : d.pass_tier === 'premium delegate' ? 3000 : 1500),
      utr: d.transaction_id || d.payment_id || 'N/A',
      proofImage: d.proof_image || (d as any).proofImage || (d as any).paymentProof || (d as any).proofPreview || '',
      status: d.verified ? 'Approved' : (d.payment_status?.toLowerCase().includes('reject') || d.payment_status?.toLowerCase().includes('void')) ? 'Rejected' : 'Pending',
      rawStatus: d.payment_status || 'Pending Verification',
      date: d.timestamp || d.created_at || 'Recent'
    }));

  const donationUpiItems = donations
    .filter(d => (d.payment_method === 'UPI_QR' || (d as any).transaction_id || (d as any).payment_id))
    .map(d => ({
      id: d.id,
      moduleType: 'donations' as const,
      moduleLabel: 'Donor Support',
      name: d.name,
      email: d.email,
      phone: d.phone,
      tierOrDomain: d.seva_domain || 'General Fund',
      amount: d.amount,
      utr: d.transaction_id || d.payment_id || 'N/A',
      proofImage: d.proof_image || (d as any).proofImage || (d as any).paymentProof || (d as any).proofPreview || '',
      status: d.verified ? 'Approved' : (d.payment_status?.toLowerCase().includes('reject') || d.payment_status?.toLowerCase().includes('void')) ? 'Rejected' : 'Pending',
      rawStatus: d.payment_status || 'Pending Verification',
      date: d.created_at || 'Recent'
    }));

  const allUpiItems = [...delegateUpiItems, ...donationUpiItems].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  const filteredItems = allUpiItems.filter(item => {
    const matchesModule = moduleFilter === 'all' || item.moduleType === moduleFilter;
    const matchesStatus = 
      statusFilter === 'all' ||
      (statusFilter === 'pending' && item.status === 'Pending') ||
      (statusFilter === 'approved' && item.status === 'Approved') ||
      (statusFilter === 'rejected' && item.status === 'Rejected');

    const matchesSearch = !globalSearchQuery || 
      item.name.toLowerCase().includes(globalSearchQuery.toLowerCase()) ||
      item.phone.includes(globalSearchQuery) ||
      item.email.toLowerCase().includes(globalSearchQuery.toLowerCase()) ||
      item.utr.toLowerCase().includes(globalSearchQuery.toLowerCase());

    return matchesModule && matchesStatus && matchesSearch;
  });

  const pendingCount = allUpiItems.filter(i => i.status === 'Pending').length;
  const pendingAmount = allUpiItems.filter(i => i.status === 'Pending').reduce((acc, curr) => acc + curr.amount, 0);
  const approvedCount = allUpiItems.filter(i => i.status === 'Approved').length;
  const approvedAmount = allUpiItems.filter(i => i.status === 'Approved').reduce((acc, curr) => acc + curr.amount, 0);
  const rejectedCount = allUpiItems.filter(i => i.status === 'Rejected').length;

  const handleCopyUtr = (utr: string) => {
    navigator.clipboard.writeText(utr);
    setCopiedUtr(utr);
    setTimeout(() => setCopiedUtr(null), 2000);
  };

  const handleAction = async (id: string, moduleType: 'delegates' | 'donations', status: 'Approved' | 'Rejected') => {
    await updateUpiVerificationStatus(id, moduleType, status);
  };

  return (
    <div className="space-y-6">
      {/* Workspace Title Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-gradient-to-r from-[#401C0C] via-[#2E1205] to-[#1F0A02] p-6 rounded-3xl text-white shadow-xl border border-white/10">
        <div>
          <div className="flex items-center gap-2 text-sun-gold text-xs font-mono font-bold uppercase tracking-wider mb-1">
            <ShieldCheck className="w-4 h-4 text-[#FFD27F]" />
            <span>Finance Desk Control</span>
          </div>
          <h2 className="text-2xl font-serif font-bold text-white">UPI Payment Verification Workspace</h2>
          <p className="text-xs text-neutral-300 font-sans mt-1 max-w-2xl leading-relaxed">
            Verify 12-digit UTR transaction reference IDs and uploaded payment screenshots against official bank statements to approve or void event passes and donor receipts.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="bg-white/10 backdrop-blur-md px-4 py-2.5 rounded-2xl border border-white/15 text-center">
            <span className="text-[10px] text-amber-200 font-mono block uppercase">Action Required</span>
            <span className="text-lg font-bold text-amber-300 font-serif">{pendingCount} Pending</span>
          </div>
        </div>
      </div>

      {/* Summary Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-[#1C1D18] p-5 rounded-2xl border border-neutral-200 dark:border-neutral-800 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs text-neutral-500 font-sans font-medium block">Total UPI Payments</span>
            <span className="text-xl font-bold font-serif text-neutral-800 dark:text-neutral-100">{allUpiItems.length} Submissions</span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-amber-50 dark:bg-amber-900/30 border border-amber-200 dark:border-amber-700/50 flex items-center justify-center text-amber-600">
            <QrCode className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-amber-50/70 dark:bg-amber-950/20 p-5 rounded-2xl border-2 border-amber-300 dark:border-amber-700/60 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs text-amber-800 dark:text-amber-300 font-sans font-bold block uppercase">Pending Verification</span>
            <span className="text-xl font-bold font-serif text-amber-900 dark:text-amber-200">{pendingCount} ({`₹${pendingAmount.toLocaleString('en-IN')}`})</span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-amber-200 dark:bg-amber-800 flex items-center justify-center text-amber-900 dark:text-amber-100">
            <Clock className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-emerald-50/70 dark:bg-emerald-950/20 p-5 rounded-2xl border border-emerald-200 dark:border-emerald-800/60 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs text-emerald-800 dark:text-emerald-300 font-sans font-medium block">Verified & Approved</span>
            <span className="text-xl font-bold font-serif text-emerald-900 dark:text-emerald-200">{approvedCount} ({`₹${approvedAmount.toLocaleString('en-IN')}`})</span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-emerald-100 dark:bg-emerald-800/50 flex items-center justify-center text-emerald-700 dark:text-emerald-300">
            <CheckCircle2 className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-rose-50/70 dark:bg-rose-950/20 p-5 rounded-2xl border border-rose-200 dark:border-rose-800/60 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs text-rose-800 dark:text-rose-300 font-sans font-medium block">Rejected / Voided</span>
            <span className="text-xl font-bold font-serif text-rose-900 dark:text-rose-200">{rejectedCount} Requests</span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-rose-100 dark:bg-rose-800/50 flex items-center justify-center text-rose-700 dark:text-rose-300">
            <XCircle className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white dark:bg-[#1C1D18] p-4 rounded-2xl border border-neutral-200 dark:border-neutral-800 shadow-sm flex flex-col md:flex-row gap-4 items-center justify-between">
        {/* Search */}
        <div className="relative w-full md:w-80">
          <Search className="absolute left-3 top-3 w-4 h-4 text-neutral-400" />
          <input
            type="text"
            placeholder="Search Name, Phone, UTR ID..."
            value={globalSearchQuery}
            onChange={(e) => setGlobalSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 rounded-xl border border-neutral-200 dark:border-neutral-700 text-xs font-sans focus:outline-none focus:ring-2 focus:ring-[#401C0C]"
          />
        </div>

        {/* Status Filter Buttons */}
        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
          <button
            onClick={() => setStatusFilter('pending')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold font-sans transition-all flex items-center gap-1.5 cursor-pointer ${
              statusFilter === 'pending'
                ? 'bg-amber-500 text-white shadow-md'
                : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-300 hover:bg-neutral-200'
            }`}
          >
            <Clock className="w-3.5 h-3.5" />
            <span>Pending ({pendingCount})</span>
          </button>

          <button
            onClick={() => setStatusFilter('all')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold font-sans transition-all cursor-pointer ${
              statusFilter === 'all'
                ? 'bg-[#401C0C] text-white shadow-md'
                : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-300 hover:bg-neutral-200'
            }`}
          >
            <span>All Payments ({allUpiItems.length})</span>
          </button>

          <button
            onClick={() => setStatusFilter('approved')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold font-sans transition-all flex items-center gap-1.5 cursor-pointer ${
              statusFilter === 'approved'
                ? 'bg-emerald-600 text-white shadow-md'
                : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-300 hover:bg-neutral-200'
            }`}
          >
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Approved ({approvedCount})</span>
          </button>

          <button
            onClick={() => setStatusFilter('rejected')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold font-sans transition-all flex items-center gap-1.5 cursor-pointer ${
              statusFilter === 'rejected'
                ? 'bg-rose-600 text-white shadow-md'
                : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-300 hover:bg-neutral-200'
            }`}
          >
            <XCircle className="w-3.5 h-3.5" />
            <span>Rejected ({rejectedCount})</span>
          </button>

          {/* Module Filter dropdown */}
          <select
            value={moduleFilter}
            onChange={(e) => setModuleFilter(e.target.value as any)}
            className="px-3 py-1.5 rounded-xl border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-xs font-sans font-semibold text-neutral-700 dark:text-neutral-200 focus:outline-none"
          >
            <option value="all">All Modules</option>
            <option value="delegates">Event Passes</option>
            <option value="donations">Donor Support</option>
          </select>
        </div>
      </div>

      {/* Main Payment Submissions Table */}
      <div className="bg-white dark:bg-[#1C1D18] rounded-3xl border border-neutral-200 dark:border-neutral-800 shadow-sm overflow-hidden">
        {filteredItems.length === 0 ? (
          <div className="p-12 text-center space-y-3">
            <ShieldCheck className="w-12 h-12 text-neutral-300 mx-auto" />
            <h3 className="text-base font-serif font-bold text-neutral-700 dark:text-neutral-200">No UPI Payments Found</h3>
            <p className="text-xs text-neutral-500 font-sans max-w-sm mx-auto">
              There are no UPI payment submissions matching the selected filters.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-neutral-200 dark:border-neutral-800 bg-neutral-50/50 dark:bg-neutral-900/50 text-[11px] font-mono uppercase tracking-wider text-neutral-500">
                  <th className="p-4 pl-6">Module &amp; Date</th>
                  <th className="p-4">Customer / Donor</th>
                  <th className="p-4">Amount</th>
                  <th className="p-4">12-Digit UTR ID</th>
                  <th className="p-4">Screenshot Proof</th>
                  <th className="p-4">Status</th>
                  <th className="p-4 pr-6 text-right">Verification Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100 dark:divide-neutral-800 text-xs font-sans">
                {filteredItems.map((item) => (
                  <tr key={`${item.moduleType}-${item.id}`} className="hover:bg-neutral-50/80 dark:hover:bg-neutral-800/40 transition-colors">
                    {/* Module & Date */}
                    <td className="p-4 pl-6 space-y-1">
                      <span className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold font-mono uppercase ${
                        item.moduleType === 'delegates' 
                          ? 'bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-200' 
                          : 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-200'
                      }`}>
                        {item.moduleLabel}
                      </span>
                      <span className="block text-[10px] text-neutral-400 font-mono">
                        {item.date ? new Date(item.date).toLocaleString('en-IN', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' }) : 'Recent'}
                      </span>
                    </td>

                    {/* Customer details */}
                    <td className="p-4">
                      <div className="font-bold text-neutral-800 dark:text-neutral-100 text-sm">{item.name}</div>
                      <div className="text-[11px] text-neutral-500 font-mono">{item.phone} • {item.email}</div>
                      <div className="text-[10px] text-amber-700 font-semibold mt-0.5">{item.tierOrDomain}</div>
                    </td>

                    {/* Amount */}
                    <td className="p-4 font-bold text-sm font-serif text-[#401C0C] dark:text-amber-300">
                      ₹{item.amount.toLocaleString('en-IN')}
                    </td>

                    {/* UTR ID */}
                    <td className="p-4">
                      <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-neutral-100 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 font-mono font-bold text-xs text-neutral-800 dark:text-neutral-200">
                        <span>{item.utr}</span>
                        <button
                          type="button"
                          onClick={() => handleCopyUtr(item.utr)}
                          className="text-neutral-400 hover:text-forest-teal transition-colors cursor-pointer p-0.5"
                          title="Copy UTR ID"
                        >
                          {copiedUtr === item.utr ? <Check className="w-3.5 h-3.5 text-green-600" /> : <Copy className="w-3.5 h-3.5" />}
                        </button>
                      </div>
                    </td>

                    {/* Screenshot Proof */}
                    <td className="p-4">
                      {item.proofImage ? (
                        <button
                          type="button"
                          onClick={() => setPreviewImage({ src: item.proofImage, title: `${item.name} - UPI Proof` })}
                          className="flex items-center gap-2 px-2.5 py-1.5 rounded-xl border border-amber-200 bg-amber-50/60 hover:bg-amber-100/80 transition-colors text-[11px] font-semibold text-amber-900 cursor-pointer shadow-sm"
                        >
                          <img src={item.proofImage} alt="Proof" className="w-6 h-6 object-cover rounded" />
                          <span>View Proof</span>
                          <Eye className="w-3.5 h-3.5 text-amber-700" />
                        </button>
                      ) : (
                        <span className="text-[11px] text-neutral-400 italic">No Image Attached</span>
                      )}
                    </td>

                    {/* Status */}
                    <td className="p-4">
                      <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold font-sans ${
                        item.status === 'Approved'
                          ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300 border border-emerald-200'
                          : item.status === 'Rejected'
                          ? 'bg-rose-100 text-rose-800 dark:bg-rose-900/40 dark:text-rose-300 border border-rose-200'
                          : 'bg-amber-100 text-amber-900 dark:bg-amber-900/40 dark:text-amber-200 border border-amber-300 animate-pulse'
                      }`}>
                        {item.status === 'Approved' && <CheckCircle2 className="w-3.5 h-3.5" />}
                        {item.status === 'Rejected' && <XCircle className="w-3.5 h-3.5" />}
                        {item.status === 'Pending' && <Clock className="w-3.5 h-3.5" />}
                        <span>{item.status === 'Pending' ? 'Pending Manual Verification' : item.status}</span>
                      </span>
                    </td>

                    {/* Actions */}
                    <td className="p-4 pr-6 text-right">
                      <div className="flex items-center justify-end gap-2">
                        {item.status !== 'Approved' && (
                          <button
                            type="button"
                            onClick={() => handleAction(item.id, item.moduleType, 'Approved')}
                            className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs flex items-center gap-1 shadow-sm transition-all cursor-pointer"
                          >
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            <span>Approve</span>
                          </button>
                        )}

                        {item.status !== 'Rejected' && (
                          <button
                            type="button"
                            onClick={() => handleAction(item.id, item.moduleType, 'Rejected')}
                            className="px-3 py-1.5 rounded-xl bg-rose-500 hover:bg-rose-600 text-white font-semibold text-xs flex items-center gap-1 shadow-sm transition-all cursor-pointer"
                          >
                            <XCircle className="w-3.5 h-3.5" />
                            <span>Reject / Void</span>
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Fullscreen Screenshot Modal */}
      {previewImage && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-white dark:bg-[#1C1D18] rounded-3xl max-w-xl w-full p-6 space-y-4 shadow-2xl relative">
            <div className="flex items-center justify-between border-b border-neutral-200 dark:border-neutral-800 pb-3">
              <h3 className="text-base font-serif font-bold text-neutral-800 dark:text-neutral-100">{previewImage.title}</h3>
              <button
                type="button"
                onClick={() => setPreviewImage(null)}
                className="p-1 rounded-full bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 text-neutral-600 dark:text-neutral-300 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="max-h-[70vh] overflow-auto flex items-center justify-center bg-neutral-900 rounded-2xl p-2">
              <img src={previewImage.src} alt="UPI Payment Proof Screenshot" className="max-w-full max-h-[60vh] object-contain rounded-xl" />
            </div>

            <div className="flex items-center justify-between pt-2 text-xs">
              <span className="text-neutral-500 font-mono">Dhara Foundations Seva Verification</span>
              <a
                href={previewImage.src}
                target="_blank"
                rel="noreferrer"
                className="px-4 py-2 bg-[#401C0C] text-white font-semibold rounded-xl flex items-center gap-1.5 hover:bg-[#2E1205] transition-colors"
              >
                <Download className="w-4 h-4" />
                <span>Open Full Size</span>
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
