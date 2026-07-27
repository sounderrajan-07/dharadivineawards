import React from 'react';
import { useApp, TabType } from '../../context/AppContext';
import { 
  LayoutDashboard, 
  Award, 
  IndianRupee, 
  QrCode, 
  Users, 
  ChevronRight,
  Image as ImageIcon,
  Calendar,
  X,
  Settings,
  Ticket,
  Building2
} from 'lucide-react';

interface NavItem {
  id: TabType;
  label: string;
  icon: React.ReactNode;
  badge?: number | string;
}

export const Sidebar: React.FC = () => {
  const { currentTab, setCurrentTab, nominations, sidebarOpen, setSidebarOpen } = useApp();

  const pendingNominations = nominations.filter(n => n.vetting_status === 'pending').length;

  const navItems: NavItem[] = [
    { id: 'overview', label: 'Overview', icon: <LayoutDashboard size={20} /> },
    { 
      id: 'nominations', 
      label: 'Award Nominations', 
      icon: <Award size={20} />,
      badge: pendingNominations > 0 ? pendingNominations : undefined 
    },
    { id: 'donations', label: 'Donations & Sponsors', icon: <IndianRupee size={20} /> },
    { id: 'delegates', label: 'Event Registration', icon: <QrCode size={20} /> },
    { id: 'volunteers', label: 'Volunteer Seva', icon: <Users size={20} /> },
    { 
      id: 'youtube-highlights', 
      label: 'YouTube Video', 
      icon: (
        <svg viewBox="0 0 24 24" fill="currentColor" style={{ width: '20px', height: '20px' }}>
          <path d="M23.498 6.163a3.003 3.003 0 0 0-2.11-2.108C19.518 3.5 12 3.5 12 3.5s-7.518 0-9.388.555A3.003 3.003 0 0 0 .502 6.163C0 8.07 0 12 0 12s0 3.93.502 5.837a3.003 3.003 0 0 0 2.11 2.108C4.482 20.5 12 20.5 12 20.5s7.518 0 9.388-.555a3.003 3.003 0 0 0 2.11-2.108C24 15.93 24 12 24 12s0-3.93-.502-5.837zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
        </svg>
      )
    },
    { id: 'gallery', label: 'Gallery', icon: <ImageIcon size={20} /> },
    { id: 'subdomains', label: 'Subdomains Control', icon: <Building2 size={20} /> },
    { id: 'settings', label: 'Site Settings', icon: <Settings size={20} /> },
  ];

  return (
    <>
      {/* Mobile Sidebar Backdrop Overlay */}
      {sidebarOpen && (
        <div 
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 bg-[#281006]/60 backdrop-blur-md z-40 lg:hidden transition-opacity duration-300"
        />
      )}

      <aside 
        className={`bg-gradient-to-b from-[#2E1205] via-[#401C0C] to-[#200B02] text-white flex flex-col transition-all duration-300 shadow-[0_8px_32px_0_rgba(64,28,12,0.2)] border border-white/10 fixed lg:sticky z-50 lg:z-30 w-72 h-[calc(100vh-2rem)] my-4 ml-4 rounded-[2rem] overflow-hidden ${
          sidebarOpen 
            ? 'translate-x-0 left-0 top-0' 
            : '-translate-x-full lg:translate-x-0 lg:left-0 lg:top-0'
        }`}
      >
        {/* Brand Header */}
        <div className="p-6 border-b border-white/10 bg-black/25 relative">
          <div className="flex flex-col gap-3 items-center text-center">
            {/* Logo Container with Golden Glow */}
            <div className="relative group p-2 rounded-2xl bg-white/5 border border-white/10 shadow-inner transition-transform duration-300 hover:scale-105">
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-tr from-[#FFD27F]/20 to-[#C9A646]/20 blur-md opacity-75 group-hover:opacity-100 transition-opacity"></div>
              <img 
                src="/logo.png" 
                alt="Dhara Foundations" 
                width={150}
                height={75}
                className="h-16 w-auto object-contain relative z-10 filter drop-shadow-[0_2px_8px_rgba(201,166,70,0.4)]"
              />
            </div>
            
            <div className="space-y-1">
              <p className="text-[10px] font-bold tracking-[0.2em] uppercase text-[#FFD27F] font-mono">
                Divine Awards 2026
              </p>
              <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-white/10 border border-white/15 text-[8px] font-mono tracking-widest text-[#FFD27F] uppercase">
                <span className="w-1 h-1 rounded-full bg-emerald-400 animate-pulse"></span>
                Admin Panel
              </div>
            </div>
          </div>
          
          {/* Close button for mobile menu */}
          {sidebarOpen && (
            <button 
              onClick={() => setSidebarOpen(false)}
              className="absolute top-4 right-4 p-1.5 rounded-xl text-white/50 hover:text-white hover:bg-white/10 lg:hidden cursor-pointer transition-colors"
              aria-label="Close menu"
            >
              <X size={18} />
            </button>
          )}
        </div>

        {/* Navigation List */}
        <div className="p-4 pb-10 space-y-3 overflow-y-auto flex-1 custom-scrollbar">
          <div className="px-3 text-[10px] font-bold tracking-[0.15em] text-[#FFD27F]/50 uppercase font-mono">
            Workspaces
          </div>
          <nav className="space-y-1">
            {navItems.map((item) => {
              const isActive = currentTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setCurrentTab(item.id);
                    setSidebarOpen(false); // Collapse sidebar drawer on selection
                  }}
                  className={`w-full flex items-center px-3.5 py-3 rounded-xl text-xs font-semibold tracking-wide transition-all duration-300 cursor-pointer group ${
                    isActive
                      ? 'bg-gradient-to-r from-[#FFD27F]/15 via-[#C9A646]/5 to-transparent text-[#FFD27F] border-r-4 border-[#FFD27F] shadow-sm shadow-[#FFD27F]/5'
                      : 'text-neutral-300 hover:text-white hover:bg-white/5 hover:translate-x-1'
                  }`}
                >
                  <div className="flex items-center gap-3.5 relative">
                    <span className={`transition-colors duration-300 ${
                      isActive ? 'text-[#FFD27F]' : 'text-neutral-400 group-hover:text-[#FFD27F]'
                    }`}>
                      {item.icon}
                    </span>
                    <span>{item.label}</span>
                  </div>
                  
                  <div className="ml-auto flex items-center gap-2">
                    {item.badge && (
                      <span className={`px-2 py-0.5 text-[10px] font-bold rounded-full font-mono transition-colors duration-300 ${
                        isActive 
                          ? 'bg-[#D9762E] text-white' 
                          : 'bg-[#D9762E]/20 text-[#FFD27F] group-hover:bg-[#D9762E]/30'
                      }`}>
                        {item.badge}
                      </span>
                    )}
                    {isActive && <ChevronRight size={14} className="text-[#FFD27F] animate-pulse" />}
                  </div>
                </button>
              );
            })}
          </nav>
        </div>
      </aside>
    </>
  );
};
