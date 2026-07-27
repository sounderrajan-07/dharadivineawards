import React from 'react';
import { Quote, Sparkles, User } from 'lucide-react';

export default function FounderMessage({ siteConfig }) {
  const defaultFounders = [
    {
      name: "S. Vinoth Ragavendran",
      role: "Founder President & Trustee",
      bio: "With over two decades of leadership in engineering and construction, Vinoth is actively involved in temple heritage protection, traditional restoration, and legal advocacy for public heritage rights across Tamil Nadu.",
      image: "",
      order: 1
    },
    {
      name: "P. Ezhumalai",
      role: "Agriculturist, Social Worker & Trustee",
      bio: "A dedicated agriculturist and progressive dairy farmer, Ezhumalai has spent his life working in public welfare, guiding local community initiatives, and fostering traditional moral values at the grassroot levels.",
      image: "",
      order: 2
    },
    {
      name: "S. Srividhya",
      role: "Chartered Accountant, CS & Trustee",
      bio: "A dual-qualified professional (CA and CS) with extensive experience in corporate governance, Srividhya oversees the administrative precision, compliance, and strict financial transparency of the non-profit organization's initiatives.",
      image: "",
      order: 3
    }
  ];

  const getImageUrl = (imagePath) => {
    if (!imagePath) return 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=400&h=400&q=80';
    if (imagePath.startsWith('data:')) return imagePath;
    if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) return imagePath;
    
    const base = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
      ? 'http://localhost:3000'
      : '';
    
    if (imagePath.startsWith('/uploads')) {
      return `${base}${imagePath}`;
    }
    return imagePath;
  };

  const founders = (siteConfig?.founders && siteConfig.founders.length > 0)
    ? [...siteConfig.founders].sort((a, b) => (a.order || 0) - (b.order || 0))
    : defaultFounders;

  return (
    <div className="py-16 px-6 md:px-12 max-w-7xl mx-auto w-full space-y-16">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <span className="text-xs font-mono font-bold text-[var(--color-primary-accent)] uppercase tracking-[3px]">
          Leadership Voice
        </span>
        <h2 className="text-4xl sm:text-5xl font-bold text-[var(--color-deep-forest-dark)] font-serif leading-tight">
          A Message from Our Founders
        </h2>
        <div className="w-24 h-1 bg-[var(--color-saffron-glow)] mx-auto rounded-full"></div>
      </div>

      {/* Main Quote Block */}
      <div className="max-w-4xl mx-auto bg-white rounded-3xl border border-[#D9CBB0]/60 p-8 md:p-12 shadow-md relative overflow-hidden text-center space-y-6">
        <div className="absolute top-4 left-4 text-[#D9CBB0]/20">
          <Quote className="w-24 h-24 rotate-180" />
        </div>
        
        <p className="text-xl sm:text-2xl font-serif italic text-[var(--color-deep-forest-dark)] leading-relaxed relative z-10 max-w-2xl mx-auto">
          "Service to humanity is service to the divine. True preservation of culture does not lie in museums, but in the active practice of compassion and duty (dharma) in daily life."
        </p>
        
        <div className="relative z-10 flex justify-center items-center gap-2 text-xs font-mono font-bold text-[var(--color-primary-accent)] uppercase tracking-wider">
          <Sparkles className="w-4 h-4 text-[var(--color-saffron-glow)]" />
          <span>The Board of Trustees, Dhara Foundations</span>
        </div>
      </div>

      {/* Founders Profiles */}
      <div className="space-y-10 pt-8">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <h3 className="text-3xl font-bold text-[var(--color-deep-forest-dark)] font-serif">Meet the Trustees</h3>
          <p className="text-xs text-[var(--ink-soft)] font-sans">
            Bringing diverse backgrounds in business, agriculture, and finance to guide the non-profit organization with integrity.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {founders.map((founder, idx) => (
            <div
              key={idx}
              className="bg-white rounded-3xl border border-[#D9CBB0]/60 overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col group"
            >
              {/* Photo or Default Avatar */}
              <div className="h-72 bg-gradient-to-b from-[#F9F6F0] to-[#EAE2D2] overflow-hidden relative border-b border-[#D9CBB0]/40 flex items-center justify-center group-hover:bg-[#E8DFC8] transition-colors">
                {founder.image ? (
                  <img
                    src={getImageUrl(founder.image)}
                    alt={founder.name}
                    className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-500"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=400&h=400&q=80";
                    }}
                  />
                ) : (
                  <div className="w-32 h-32 rounded-full bg-[var(--color-deep-forest)]/10 border-2 border-[var(--color-primary-accent)]/30 flex items-center justify-center shadow-inner group-hover:scale-105 transition-transform duration-300">
                    <User className="w-16 h-16 text-[var(--color-deep-forest-dark)]/70 group-hover:text-[var(--color-primary-accent)] transition-colors" />
                  </div>
                )}
              </div>

              {/* Bio Details */}
              <div className="p-6 flex flex-col flex-1 justify-between space-y-4">
                <div className="space-y-2">
                  <h4 className="text-xl font-bold text-[var(--color-deep-forest-dark)] font-serif group-hover:text-[var(--color-primary-accent)] transition-colors">
                    {founder.name}
                  </h4>
                  <span className="text-[10px] font-mono text-[var(--color-primary-accent)] uppercase tracking-wider font-bold block">
                    {founder.role}
                  </span>
                  <p className="text-xs text-[var(--ink-soft)] leading-relaxed">
                    {founder.bio}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
