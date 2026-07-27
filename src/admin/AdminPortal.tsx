import React from 'react';
import { useAuth, AuthProvider } from './context/AuthContext';
import { AppProvider, useApp } from './context/AppContext';
import { Sidebar } from './components/layout/Sidebar';
import { Header } from './components/layout/Header';
import { OverviewWorkspace } from './components/workspaces/OverviewWorkspace';
import { NominationsWorkspace } from './components/workspaces/NominationsWorkspace';
import { DonationsWorkspace } from './components/workspaces/DonationsWorkspace';
import { DelegatesWorkspace } from './components/workspaces/DelegatesWorkspace';
import { VolunteersWorkspace } from './components/workspaces/VolunteersWorkspace';
import { YoutubeWorkspace } from './components/workspaces/YoutubeWorkspace';
import { GalleryWorkspace } from './components/workspaces/GalleryWorkspace';
import { SubdomainsWorkspace } from './components/workspaces/SubdomainsWorkspace';
import { SettingsWorkspace } from './components/workspaces/SettingsWorkspace';
import LoginView from './components/auth/LoginView';

const DashboardContent: React.FC = () => {
  const { currentTab } = useApp();

  return (
    <main className="flex-1 min-w-0 w-full flex flex-col h-[calc(100vh-2rem)] m-4 lg:my-4 lg:mr-4 lg:ml-0 bg-white/70 dark:bg-[#151613]/70 backdrop-blur-xl rounded-[2rem] border border-[#EAE8E3]/60 dark:border-[#2E302A]/60 shadow-[0_8px_32px_0_rgba(0,0,0,0.02)] overflow-hidden transition-all duration-300">
      <Header />
      <div className="flex-1 p-4 sm:p-8 overflow-y-auto custom-scrollbar">
        {currentTab === 'overview' && <OverviewWorkspace />}
        {currentTab === 'nominations' && <NominationsWorkspace />}
        {currentTab === 'donations' && <DonationsWorkspace />}
        {currentTab === 'delegates' && <DelegatesWorkspace />}
        {currentTab === 'volunteers' && <VolunteersWorkspace />}
        {currentTab === 'youtube-highlights' && <YoutubeWorkspace />}
        {currentTab === 'gallery' && <GalleryWorkspace />}
        {currentTab === 'subdomains' && <SubdomainsWorkspace />}
        {currentTab === 'settings' && <SettingsWorkspace />}
      </div>
    </main>
  );
};

const AdminPortalInner: React.FC = () => {
  const { isAuthenticated } = useAuth();

  React.useEffect(() => {
    // Save original body styles
    const originalZoom = document.body.style.zoom;
    const originalOverflow = document.body.style.overflow;

    // Reset zoom and hide body scrollbar for the admin section
    document.body.style.zoom = '1';
    document.body.style.overflow = 'hidden';

    // Restore when unmounting
    return () => {
      document.body.style.zoom = originalZoom;
      document.body.style.overflow = originalOverflow;
    };
  }, []);

  if (!isAuthenticated) {
    return <LoginView />;
  }

  return (
    <AppProvider>
      <div className="flex items-start h-screen w-screen overflow-hidden bg-gradient-to-br from-[#FAF6EE] via-[#FDFBF8] to-[#F3EEE3] dark:from-[#121310] dark:via-[#161713] dark:to-[#0F100D] text-[#1B1C19] dark:text-[#E5E7EB] selection:bg-[#401C0C] selection:text-[#FFD27F] gap-4">
        <Sidebar />
        <DashboardContent />
      </div>
    </AppProvider>
  );
};

export default function AdminPortal() {
  return (
    <AuthProvider>
      <AdminPortalInner />
    </AuthProvider>
  );
}
