import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Enquiry, EnquiryStatus } from '../../types';
import { 
  MessageSquare, 
  Search, 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  Filter, 
  Mail, 
  Phone, 
  Eye, 
  Trash2, 
  X,
  Send,
  Building2,
  Calendar
} from 'lucide-react';

export const EnquiriesWorkspace: React.FC = () => {
  const { enquiries, updateEnquiryStatus, deleteEnquiry, globalSearchQuery, setGlobalSearchQuery } = useApp();
  const [statusFilter, setStatusFilter] = useState<'all' | 'new' | 'in_progress' | 'resolved'>('all');
  const [typeFilter, setTypeFilter] = useState<'all' | 'general' | 'media' | 'sponsorship_enquiry'>('all');
  const [selectedEnquiry, setSelectedEnquiry] = useState<Enquiry | null>(null);

  const filteredEnquiries = enquiries.filter(enq => {
    const statusNorm = (enq.status || 'new').toLowerCase();
    const matchesStatus = 
      statusFilter === 'all' || 
      (statusFilter === 'new' && (statusNorm === 'new' || statusNorm === 'unread')) ||
      (statusFilter === 'in_progress' && (statusNorm === 'in_progress' || statusNorm === 'read' || statusNorm === 'replied')) ||
      (statusFilter === 'resolved' && (statusNorm === 'resolved' || statusNorm === 'archived'));

    const typeNorm = (enq.type || 'general').toLowerCase();
    const matchesType = typeFilter === 'all' || typeNorm.includes(typeFilter);

    const q = (globalSearchQuery || '').toLowerCase();
    const matchesSearch = !q || 
      (enq.sender_name || '').toLowerCase().includes(q) ||
      (enq.email || '').toLowerCase().includes(q) ||
      (enq.subject || '').toLowerCase().includes(q) ||
      (enq.message || '').toLowerCase().includes(q) ||
      (enq.phone || '').includes(q);

    return matchesStatus && matchesType && matchesSearch;
  });

  const countNew = enquiries.filter(e => (e.status || 'new').toLowerCase() === 'new' || (e.status || '').toLowerCase() === 'unread').length;
  const countInProgress = enquiries.filter(e => (e.status || '').toLowerCase() === 'in_progress' || (e.status || '').toLowerCase() === 'read' || (e.status || '').toLowerCase() === 'replied').length;
  const countResolved = enquiries.filter(e => (e.status || '').toLowerCase() === 'resolved' || (e.status || '').toLowerCase() === 'archived').length;

  const handleDelete = async (id: string, name: string) => {
    if (window.confirm(`Are you sure you want to delete enquiry log from "${name}"?`)) {
      await deleteEnquiry(id);
    }
  };

  const getStatusBadge = (status: string) => {
    const s = (status || 'new').toLowerCase();
    if (s === 'new' || s === 'unread') {
      return (
        <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-1 rounded-full bg-amber-100 text-amber-900 dark:bg-amber-950/60 dark:text-amber-300 border border-amber-300/40">
          <Clock size={12} /> New Query
        </span>
      );
    }
    if (s === 'in_progress' || s === 'read' || s === 'replied') {
      return (
        <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-1 rounded-full bg-blue-100 text-blue-900 dark:bg-blue-950/60 dark:text-blue-300 border border-blue-300/40">
          <Clock size={12} /> In Progress
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-900 dark:bg-emerald-950/60 dark:text-emerald-300 border border-emerald-300/40">
        <CheckCircle2 size={12} /> Resolved
      </span>
    );
  };

  const getCategoryBadge = (subject: string, type: string) => {
    const sub = (subject || '').toLowerCase();
    if (sub.includes('media') || type === 'media') {
      return <span className="px-2 py-0.5 rounded bg-purple-100 text-purple-900 dark:bg-purple-950/60 dark:text-purple-300 font-semibold text-[10px]">Media Pass</span>;
    }
    if (sub.includes('csr') || sub.includes('sponsor') || type === 'sponsorship_enquiry') {
      return <span className="px-2 py-0.5 rounded bg-amber-100 text-amber-900 dark:bg-amber-950/60 dark:text-amber-300 font-semibold text-[10px]">CSR / Sponsor</span>;
    }
    return <span className="px-2 py-0.5 rounded bg-stone-200 text-stone-800 dark:bg-stone-800 dark:text-stone-300 font-semibold text-[10px]">General Query</span>;
  };

  return (
    <div className="space-y-6 pb-12 animate-fade-in">
      {/* Header & Filter Bar */}
      <div className="p-6 rounded-3xl bg-white dark:bg-[#1B1C19] border border-[#EAE8E3] dark:border-[#30312E] shadow-sm space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="font-serif text-2xl font-bold text-[#401C0C] dark:text-[#FFD27F] flex items-center gap-2">
              <MessageSquare className="text-[#C9A646]" size={26} />
              Contact Form Submissions & Enquiries
            </h2>
            <p className="text-xs text-[#867463] dark:text-[#9CA3AF] mt-1">
              Review public messages, event inquiries, accommodation requests, and media press clearance forms
            </p>
          </div>

          {/* Search Input */}
          <div className="relative w-full md:w-72">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400" size={16} />
            <input
              type="text"
              placeholder="Search sender, email, subject..."
              value={globalSearchQuery}
              onChange={(e) => setGlobalSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-2xl bg-[#F5F3EE] dark:bg-[#242622] text-[#1B1C19] dark:text-[#F3F4F6] text-xs border border-[#E4E2DD] dark:border-[#30312E] focus:outline-none focus:border-[#401C0C] dark:focus:border-[#FFD27F] transition-all"
            />
          </div>
        </div>

        {/* Filter Pills */}
        <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-[#F5F3EE] dark:border-[#2E302A]">
          {/* Status Filter */}
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-[#867463] dark:text-[#9CA3AF] flex items-center gap-1">
              <Filter size={13} /> Status:
            </span>
            <div className="flex items-center gap-1.5 flex-wrap">
              {[
                { id: 'all', label: `All (${enquiries.length})` },
                { id: 'new', label: `New (${countNew})` },
                { id: 'in_progress', label: `In Progress (${countInProgress})` },
                { id: 'resolved', label: `Resolved (${countResolved})` }
              ].map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setStatusFilter(tab.id as any)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    statusFilter === tab.id
                      ? 'bg-[#401C0C] text-white dark:bg-[#FFD27F] dark:text-[#401C0C] shadow-sm'
                      : 'bg-[#F5F3EE] dark:bg-[#242622] text-[#534436] dark:text-[#D1D5DB] hover:bg-[#EAE8E3]'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* Type Filter */}
          <div className="flex items-center gap-1.5 flex-wrap">
            {[
              { id: 'all', label: 'All Types' },
              { id: 'general', label: 'General Query' },
              { id: 'media', label: 'Media' },
              { id: 'sponsorship_enquiry', label: 'CSR / Sponsorship' }
            ].map(type => (
              <button
                key={type.id}
                onClick={() => setTypeFilter(type.id as any)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  typeFilter === type.id
                    ? 'bg-[#D9762E] text-white shadow-sm'
                    : 'bg-[#F5F3EE] dark:bg-[#242622] text-[#534436] dark:text-[#D1D5DB] hover:bg-[#EAE8E3]'
                }`}
              >
                {type.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Enquiries Table */}
      <div className="rounded-3xl bg-white dark:bg-[#1B1C19] border border-[#EAE8E3] dark:border-[#30312E] shadow-sm overflow-hidden">
        {filteredEnquiries.length === 0 ? (
          <div className="p-12 text-center text-[#867463] dark:text-[#9CA3AF] space-y-3">
            <MessageSquare className="w-12 h-12 mx-auto text-neutral-300 dark:text-neutral-700" />
            <p className="font-semibold text-sm">No contact form submissions found matching filter.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[#F5F3EE] dark:bg-[#242622] border-b border-[#E4E2DD] dark:border-[#30312E] text-[11px] font-bold text-[#867463] dark:text-[#9CA3AF] uppercase tracking-wider">
                  <th className="py-4 px-6">Sender & Contact</th>
                  <th className="py-4 px-4">Subject & Message Preview</th>
                  <th className="py-4 px-4">Category</th>
                  <th className="py-4 px-4">Submission Date</th>
                  <th className="py-4 px-4">Status</th>
                  <th className="py-4 px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#F5F3EE] dark:divide-[#2E302A] text-xs">
                {filteredEnquiries.map(enq => (
                  <tr key={enq.id} className="hover:bg-[#FDFBF8] dark:hover:bg-[#242622]/50 transition-colors">
                    <td className="py-4 px-6">
                      <div className="font-bold text-sm text-[#1B1C19] dark:text-[#F3F4F6]">{enq.sender_name}</div>
                      <div className="flex items-center gap-1.5 text-[11px] text-[#867463] dark:text-[#9CA3AF] font-mono mt-0.5">
                        <Mail size={11} /> {enq.email}
                      </div>
                      {enq.phone && (
                        <div className="flex items-center gap-1.5 text-[11px] text-[#867463] font-mono">
                          <Phone size={11} /> {enq.phone}
                        </div>
                      )}
                    </td>
                    <td className="py-4 px-4 max-w-xs">
                      <div className="font-bold text-sm text-[#401C0C] dark:text-[#FFD27F] truncate">{enq.subject}</div>
                      <div className="text-[11px] text-[#867463] dark:text-[#9CA3AF] truncate mt-0.5">
                        {enq.message}
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      {getCategoryBadge(enq.subject, enq.type)}
                    </td>
                    <td className="py-4 px-4 font-mono text-[#867463] dark:text-[#9CA3AF]">
                      {enq.created_at ? new Date(enq.created_at).toLocaleString('en-IN', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }) : 'Recent'}
                    </td>
                    <td className="py-4 px-4">
                      <div className="space-y-1">
                        {getStatusBadge(enq.status)}
                        <div>
                          <select
                            value={(enq.status || 'new').toLowerCase()}
                            onChange={(e) => updateEnquiryStatus(enq.id, e.target.value as EnquiryStatus)}
                            className="mt-1 text-[10px] font-semibold bg-[#F5F3EE] dark:bg-[#242622] text-[#1B1C19] dark:text-[#F3F4F6] px-2 py-0.5 rounded-lg border border-[#E4E2DD] dark:border-[#30312E] focus:outline-none cursor-pointer"
                          >
                            <option value="new">Mark New</option>
                            <option value="in_progress">Mark In Progress</option>
                            <option value="resolved">Mark Resolved</option>
                          </select>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-6 text-right space-x-2">
                      <button
                        onClick={() => setSelectedEnquiry(enq)}
                        title="View Full Message"
                        className="p-2 rounded-xl bg-[#F5F3EE] dark:bg-[#242622] text-[#534436] dark:text-[#D1D5DB] hover:bg-[#401C0C] hover:text-white transition-all cursor-pointer inline-flex items-center"
                      >
                        <Eye size={14} />
                      </button>
                      <button
                        onClick={() => handleDelete(enq.id, enq.sender_name)}
                        title="Delete Enquiry"
                        className="p-2 rounded-xl bg-rose-50 dark:bg-rose-950/40 text-rose-600 hover:bg-rose-600 hover:text-white transition-all cursor-pointer inline-flex items-center"
                      >
                        <Trash2 size={14} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Full Message Preview Modal */}
      {selectedEnquiry && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-white dark:bg-[#1C1D18] rounded-3xl max-w-xl w-full p-8 space-y-6 shadow-2xl relative border border-[#EAE8E3] dark:border-[#30312E]">
            <button 
              onClick={() => setSelectedEnquiry(null)}
              className="absolute top-6 right-6 p-2 rounded-full bg-[#F5F3EE] dark:bg-[#2E302A] text-[#867463] hover:text-[#1B1C19] transition-colors cursor-pointer"
            >
              <X size={20} />
            </button>

            <div className="space-y-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#D9762E]">
                Contact Submission Detail
              </span>
              <h3 className="font-serif text-xl font-bold text-[#401C0C] dark:text-[#FFD27F]">
                {selectedEnquiry.subject}
              </h3>
            </div>

            <div className="grid grid-cols-2 gap-4 p-4 rounded-2xl bg-[#F5F3EE] dark:bg-[#242622] text-xs">
              <div>
                <span className="text-[#867463] dark:text-[#9CA3AF] block font-semibold text-[10px]">Sender Name</span>
                <span className="font-bold text-[#1B1C19] dark:text-[#F3F4F6] text-sm">{selectedEnquiry.sender_name}</span>
              </div>
              <div>
                <span className="text-[#867463] dark:text-[#9CA3AF] block font-semibold text-[10px]">Date Submitted</span>
                <span className="font-mono text-[#1B1C19] dark:text-[#F3F4F6]">
                  {selectedEnquiry.created_at ? new Date(selectedEnquiry.created_at).toLocaleString() : 'Recent'}
                </span>
              </div>
              <div>
                <span className="text-[#867463] dark:text-[#9CA3AF] block font-semibold text-[10px]">Email Address</span>
                <a href={`mailto:${selectedEnquiry.email}`} className="font-mono text-blue-600 hover:underline flex items-center gap-1">
                  <Mail size={12} /> {selectedEnquiry.email}
                </a>
              </div>
              <div>
                <span className="text-[#867463] dark:text-[#9CA3AF] block font-semibold text-[10px]">Phone Number</span>
                <span className="font-mono text-[#1B1C19] dark:text-[#F3F4F6]">
                  {selectedEnquiry.phone || 'N/A'}
                </span>
              </div>
            </div>

            <div>
              <span className="text-xs font-bold text-[#867463] dark:text-[#9CA3AF] block mb-2">Full Message</span>
              <div className="p-4 rounded-2xl bg-[#FDFBF8] dark:bg-[#151613] border border-[#EAE8E3] dark:border-[#30312E] text-xs text-[#1B1C19] dark:text-[#E5E7EB] whitespace-pre-wrap leading-relaxed max-h-60 overflow-y-auto">
                {selectedEnquiry.message}
              </div>
            </div>

            <div className="flex items-center justify-between pt-2">
              <a
                href={`mailto:${selectedEnquiry.email}?subject=Re: ${encodeURIComponent(selectedEnquiry.subject)}`}
                className="px-5 py-2.5 rounded-xl bg-[#401C0C] text-white font-semibold text-xs flex items-center gap-2 hover:bg-[#5C2913] transition-all cursor-pointer shadow-sm"
              >
                <Send size={14} /> Reply via Email
              </a>

              <button
                onClick={() => {
                  handleDelete(selectedEnquiry.id, selectedEnquiry.sender_name);
                  setSelectedEnquiry(null);
                }}
                className="px-4 py-2.5 rounded-xl bg-rose-50 text-rose-600 hover:bg-rose-600 hover:text-white font-semibold text-xs transition-all cursor-pointer flex items-center gap-1.5"
              >
                <Trash2 size={14} /> Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
