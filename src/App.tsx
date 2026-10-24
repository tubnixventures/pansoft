/**
 * Pansoft Technologies – Enterprise Corporate Platform & Cloudflare Edge Suite
 * Registration: BN-36S5WLAP · Public Contact: 0141380666 (+254 141 380 666)
 * Founder & CEO: Movin Juma
 */
import React, { useState } from 'react';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { AuthModal } from './components/AuthModal';
import { StaffAccessModal } from './components/StaffAccessModal';

import { HomeView } from './views/HomeView';
import { ServicesView } from './views/ServicesView';
import { ProductsView } from './views/ProductsView';
import { FreelanceHubView } from './views/FreelanceHubView';
import { ReferralProgramView } from './views/ReferralProgramView';
import { InquireView } from './views/InquireView';
import { PartnershipView } from './views/PartnershipView';
import { ContactView } from './views/ContactView';
import { AdminDashboardView } from './views/AdminDashboardView';
import { CloudflareLabView } from './views/CloudflareLabView';
import { ProfileView } from './views/ProfileView';

import { HonoJwtAuthService } from './lib/auth-jwt';
import { User } from './types';

export default function App() {
  const [activeTab, setActiveTab] = useState<string>('home');
  const [currentUser, setCurrentUser] = useState<User | null>(HonoJwtAuthService.getCurrentUser());
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [isStaffModalOpen, setIsStaffModalOpen] = useState(false);

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleLogout = () => {
    HonoJwtAuthService.logout();
    setCurrentUser(null);
    setActiveTab('home');
  };

  const handleAuthSuccess = (user: User) => {
    setCurrentUser(user);
  };

  const handleStaffAccessGranted = (user: User) => {
    setCurrentUser(user);
    setActiveTab('admin');
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-blue-600 selection:text-white">
      
      {/* Top Navigation conforming to Top Bar Contract + Mobile Drawer */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={handleTabChange}
        currentUser={currentUser}
        onOpenStaffModal={() => setIsStaffModalOpen(true)}
        onOpenAuth={() => setIsAuthOpen(true)}
        onLogout={handleLogout}
      />

      {/* Main Viewport Container */}
      <main className="flex-1 w-full overflow-x-hidden">
        {activeTab === 'home' && <HomeView setActiveTab={handleTabChange} />}
        {activeTab === 'services' && <ServicesView setActiveTab={handleTabChange} />}
        {activeTab === 'products' && <ProductsView setActiveTab={handleTabChange} />}
        {activeTab === 'freelance' && <FreelanceHubView />}
        {activeTab === 'referrals' && <ReferralProgramView />}
        {activeTab === 'partnerships' && <PartnershipView currentUser={currentUser} onOpenAuth={() => setIsAuthOpen(true)} />}
        {activeTab === 'inquire' && <InquireView onInquirySuccess={() => handleTabChange('admin')} />}
        {activeTab === 'contact' && <ContactView />}
        {activeTab === 'admin' && (
          <AdminDashboardView
            currentUser={currentUser}
            onExitAdmin={() => handleTabChange('home')}
          />
        )}
        {activeTab === 'cloudflare-lab' && <CloudflareLabView />}
        {activeTab === 'profile' && (
          <ProfileView
            currentUser={currentUser}
            onUserUpdated={(u) => setCurrentUser(u)}
            onLogout={handleLogout}
            setActiveTab={handleTabChange}
          />
        )}
      </main>

      {/* Corporate Footer with statutory notices and direct channels */}
      <Footer setActiveTab={handleTabChange} />

      {/* Staff Access Modal for Pansoft Staff Portal */}
      <StaffAccessModal
        isOpen={isStaffModalOpen}
        onClose={() => setIsStaffModalOpen(false)}
        onAccessGranted={handleStaffAccessGranted}
      />

      {/* Client / Freelancer Auth Modal */}
      <AuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
        onAuthSuccess={handleAuthSuccess}
      />

    </div>
  );
}
