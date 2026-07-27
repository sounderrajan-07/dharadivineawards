import React from 'react';
import { Leaf, Flame, Compass, Goal, CheckCircle } from 'lucide-react';

export default function VisionMission() {
  const pillars = [
    {
      title: "Desiyam",
      subtitle: "National Culture & Civic Unity",
      description: "We work to rekindle national pride, unity, and a deep appreciation for India's rich cultural heritage, sacred arts, and traditional lifestyles.",
      details: ["Support traditional artisans and craftsmen", "Organize cultural events and seminars", "Promote civic responsibility and communal harmony"],
      icon: Compass,
      color: "var(--color-primary-accent)"
    },
    {
      title: "Spiritualism",
      subtitle: "Temple Consecration & Traditional Wisdom",
      description: "We physically restore neglected local temples and support traditional gurukulas to protect the spiritual continuity of our society.",
      details: ["Renovate ancient temple structures", "Support spiritual education & Vedic learning", "Facilitate traditional festivals and rituals"],
      icon: Flame,
      color: "var(--color-saffron-glow)"
    },
    {
      title: "Welfare",
      subtitle: "Grassroots Care & Empowerment",
      description: "We provide direct aid to the underprivileged, children in care homes, rural women self-help groups, and remote tribal communities.",
      details: ["Provide essentials to government welfare homes", "Empower women via digital & financial literacy", "Deploy medical and educational grants in tribal areas"],
      icon: Leaf,
      color: "var(--color-saffron-glow-dark)"
    }
  ];

  return (
    <div className="py-16 px-6 md:px-12 max-w-7xl mx-auto w-full space-y-16">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <span className="text-xs font-mono font-bold text-[var(--color-primary-accent)] uppercase tracking-[3px]">
          Our Purpose
        </span>
        <h2 className="text-4xl sm:text-5xl font-bold text-[var(--color-deep-forest-dark)] font-serif leading-tight">
          Guided by Dharma, Driven by Service
        </h2>
        <div className="w-24 h-1 bg-[var(--color-saffron-glow)] mx-auto rounded-full"></div>
      </div>

      {/* Vision & Mission Statements */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-4">
        <div className="bg-white rounded-3xl border border-[#D9CBB0]/60 p-8 space-y-4 shadow-sm relative overflow-hidden group hover:shadow-md transition-shadow">
          <div className="absolute right-0 top-0 w-32 h-32 bg-[var(--color-saffron-glow)]/5 rounded-full filter blur-2xl"></div>
          <div className="w-12 h-12 rounded-full bg-[var(--color-saffron-glow)]/10 text-[var(--color-saffron-glow-dark)] flex items-center justify-center">
            <Goal className="w-6 h-6" />
          </div>
          <h3 className="text-2xl font-bold text-[var(--color-deep-forest-dark)] font-serif">Our Vision</h3>
          <p className="text-sm text-[var(--ink-soft)] leading-relaxed">
            To build a vibrant, harmonious society where ancient spiritual traditions are preserved, cultural heritage is celebrated with pride, and every individual, regardless of their background, has the opportunity to live with dignity, security, and purpose.
          </p>
        </div>

        <div className="bg-white rounded-3xl border border-[#D9CBB0]/60 p-8 space-y-4 shadow-sm relative overflow-hidden group hover:shadow-md transition-shadow">
          <div className="absolute right-0 top-0 w-32 h-32 bg-[var(--color-primary-accent)]/5 rounded-full filter blur-2xl"></div>
          <div className="w-12 h-12 rounded-full bg-[var(--color-primary-accent)]/10 text-[var(--color-primary-accent)] flex items-center justify-center">
            <Leaf className="w-6 h-6" />
          </div>
          <h3 className="text-2xl font-bold text-[var(--color-deep-forest-dark)] font-serif">Our Mission</h3>
          <p className="text-sm text-[var(--ink-soft)] leading-relaxed">
            To execute direct, transparent community programs in Tamil Nadu that revive ancient temples, support Vedic education, provide nutritional and material support to government care homes, and empower tribal and rural communities through educational and economic grants.
          </p>
        </div>
      </div>

      {/* Three Pillars Section */}
      <div className="space-y-10 pt-8">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <h3 className="text-3xl font-bold text-[var(--color-deep-forest-dark)] font-serif">Our Three Core Pillars</h3>
          <p className="text-xs text-[var(--ink-soft)] font-sans">
            Every program we establish stems from these three focal areas of our dharmic non-profit organization.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {pillars.map((pillar, idx) => {
            const Icon = pillar.icon;
            return (
              <div
                key={idx}
                className="bg-white rounded-3xl border border-[#D9CBB0]/60 p-8 flex flex-col justify-between hover:shadow-2xl transition-all duration-300 group hover:-translate-y-2"
              >
                <div className="space-y-5">
                  <div
                    className="w-14 h-14 rounded-2xl flex items-center justify-center text-white shadow-md group-hover:scale-110 transition-transform"
                    style={{ backgroundColor: pillar.color }}
                  >
                    <Icon className="w-6 h-6" />
                  </div>
                  <div className="space-y-1">
                    <span className="text-xs font-mono font-bold tracking-widest uppercase" style={{ color: pillar.color }}>
                      Pillar 0{idx + 1}
                    </span>
                    <h4 className="text-2xl font-bold text-[var(--color-deep-forest-dark)] font-serif">
                      {pillar.title}
                    </h4>
                    <p className="text-xs text-neutral-400 font-bold uppercase tracking-wider">{pillar.subtitle}</p>
                  </div>
                  <p className="text-xs text-[var(--ink-soft)] leading-relaxed">
                    {pillar.description}
                  </p>
                </div>

                <div className="pt-6 border-t border-neutral-100 mt-6 space-y-2">
                  {pillar.details.map((detail, dIdx) => (
                    <div key={dIdx} className="flex items-start gap-2 text-xs text-[var(--ink-soft)] font-sans">
                      <CheckCircle className="w-3.5 h-3.5 mt-0.5 text-[#401C0C] shrink-0" />
                      <span>{detail}</span>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
