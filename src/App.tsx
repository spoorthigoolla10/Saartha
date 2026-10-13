/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { User, Application, ApplicationDocument, NotificationItem } from './types';
import { api } from './services/api';
import { Header } from './components/Header';
import { Sidebar } from './components/Sidebar';
import { AuthModal } from './components/AuthModal';
import { NotificationModal } from './components/NotificationModal';
import { SimulatedPaymentModal } from './components/SimulatedPaymentModal';
import { AppointmentBookingModal } from './components/AppointmentBookingModal';
import { DocumentPreviewModal } from './components/DocumentPreviewModal';

// Pages
import { LandingPage } from './pages/LandingPage';
import { ApplicantDashboard } from './pages/ApplicantDashboard';
import { NewApplicationPage } from './pages/NewApplicationPage';
import { OfficerConsole } from './pages/OfficerConsole';
import { MyApplicationsPage } from './pages/MyApplicationsPage';
import { DocumentVaultPage } from './pages/DocumentVaultPage';
import { AppointmentBookingPage } from './pages/AppointmentBookingPage';
import { ApplicationTrackingPage } from './pages/ApplicationTrackingPage';
import { NotificationsSettingsPage } from './pages/NotificationsSettingsPage';

import { db } from './data/mockDatabase';

export default function App() {
  const [currentUser, setCurrentUser] = useState<User>(() => db.getCurrentUser());
  const [activePath, setActivePath] = useState<string>('home');
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);

  // Modals
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [notifModalOpen, setNotifModalOpen] = useState(false);
  const [paymentModalApp, setPaymentModalApp] = useState<Application | null>(null);
  const [bookingModalApp, setBookingModalApp] = useState<Application | null>(null);
  const [previewModalDoc, setPreviewModalDoc] = useState<ApplicationDocument | null>(null);
  const [trackingSelectedApp, setTrackingSelectedApp] = useState<Application | null>(null);

  // Load User & Notifications
  const refreshUserAndData = async () => {
    try {
      const u = await api.getCurrentUser();
      setCurrentUser(u);
      const notifs = await api.getNotifications(u.id);
      setNotifications(notifs);
    } catch {
      // fallback
    }
  };

  useEffect(() => {
    refreshUserAndData();
    const unsub = api.onDataChange(() => {
      refreshUserAndData();
    });
    return unsub;
  }, []);

  const handleRoleSwitch = (role: 'applicant' | 'officer') => {
    if (role === 'applicant') {
      const u = api.login('eleanor.vance@example.com');
      u.then(usr => {
        setCurrentUser(usr);
        api.getNotifications(usr.id).then(setNotifications);
      });
    } else {
      const u = api.login('officer.rpo@passport.gov.in');
      u.then(usr => {
        setCurrentUser(usr);
        api.getNotifications(usr.id).then(setNotifications);
      });
    }
  };

  const handleNavigation = (path: string) => {
    setActivePath(path);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSelectAppForTracking = (app: Application) => {
    setTrackingSelectedApp(app);
    setActivePath('application-tracking');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const unreadCount = notifications.filter(n => !n.is_read).length;
  const isLanding = activePath === 'home';
  const isPublicLayout = activePath === 'home' || activePath === 'application-tracking';

  return (
    <div className="min-h-screen bg-[#F8F5F2] text-[#201A17] font-sans">
      {/* Top Header */}
      <Header
        currentUser={currentUser}
        activePath={activePath}
        onNavigate={handleNavigation}
        onOpenAuth={() => setAuthModalOpen(true)}
        onOpenNotifications={() => setNotifModalOpen(true)}
        unreadCount={unreadCount}
        onSwitchUser={handleRoleSwitch}
        isLanding={isPublicLayout}
      />

      {/* Landing Page (No Sidebar Layout) */}
      {isLanding ? (
        <main className="w-full pt-16">
          <LandingPage
            onNavigate={handleNavigation}
            onOpenAuth={() => setAuthModalOpen(true)}
          />
        </main>
      ) : activePath === 'application-tracking' ? (
        <main className="w-full pt-20 px-8 max-w-[1440px] mx-auto">
          <ApplicationTrackingPage
            currentUser={currentUser}
            initialApplication={trackingSelectedApp}
          />
        </main>
      ) : (
        /* Authenticated Workspace (Desktop Sidebar + Main Content Layout) */
        <div className="flex">
          {/* Persistent Left Sidebar (256px) */}
          <Sidebar
            activePath={activePath}
            onNavigate={handleNavigation}
            currentUser={currentUser}
          />

          {/* Main Workspace Frame */}
          <div className="pl-64 w-full min-h-screen">
            <main className="pt-20 px-8 max-w-[1440px] mx-auto w-full">
              {activePath === 'dashboard' && (
                <ApplicantDashboard
                  currentUser={currentUser}
                  onNavigate={handleNavigation}
                  onSelectApplication={handleSelectAppForTracking}
                  onOpenBooking={(app) => setBookingModalApp(app)}
                  onOpenPayment={(app) => setPaymentModalApp(app)}
                />
              )}

              {activePath === 'new-application' && (
                <NewApplicationPage
                  currentUser={currentUser}
                  onNavigate={handleNavigation}
                  onApplicationCreated={(app) => {
                    setPaymentModalApp(app);
                    setActivePath('dashboard');
                  }}
                />
              )}

              {activePath === 'officer-console' && (
                <OfficerConsole
                  currentUser={currentUser}
                  onSelectApplication={handleSelectAppForTracking}
                  onPreviewDocument={(doc) => setPreviewModalDoc(doc)}
                />
              )}

              {activePath === 'my-applications' && (
                <MyApplicationsPage
                  currentUser={currentUser}
                  onNavigate={handleNavigation}
                  onSelectApplication={handleSelectAppForTracking}
                  onOpenBooking={(app) => setBookingModalApp(app)}
                  onOpenPayment={(app) => setPaymentModalApp(app)}
                />
              )}

              {activePath === 'document-vault' && (
                <DocumentVaultPage
                  currentUser={currentUser}
                  onPreviewDocument={(doc) => setPreviewModalDoc(doc)}
                />
              )}

              {activePath === 'appointment-booking' && (
                <AppointmentBookingPage
                  currentUser={currentUser}
                  onOpenBookingModal={(app) => setBookingModalApp(app)}
                />
              )}

              {activePath === 'application-tracking' && (
                <ApplicationTrackingPage
                  currentUser={currentUser}
                  initialApplication={trackingSelectedApp}
                />
              )}

              {activePath === 'notifications-settings' && (
                <NotificationsSettingsPage
                  currentUser={currentUser}
                  notifications={notifications}
                  onUpdateUser={(u) => setCurrentUser(u)}
                  onRefreshNotifications={refreshUserAndData}
                />
              )}
            </main>
          </div>
        </div>
      )}

      {/* Modals & Dialogs */}
      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        onSuccess={(user) => {
          setCurrentUser(user);
          refreshUserAndData();
          setActivePath(user.role === 'officer' ? 'officer-console' : 'dashboard');
        }}
      />

      <NotificationModal
        isOpen={notifModalOpen}
        onClose={() => setNotifModalOpen(false)}
        notifications={notifications}
        onMarkRead={async (id) => {
          await api.markNotificationRead(id);
          refreshUserAndData();
        }}
      />

      {paymentModalApp && (
        <SimulatedPaymentModal
          isOpen={true}
          application={paymentModalApp}
          onClose={() => setPaymentModalApp(null)}
          onPaymentSuccess={() => {
            const app = paymentModalApp;
            setPaymentModalApp(null);
            setBookingModalApp(app);
          }}
        />
      )}

      {bookingModalApp && (
        <AppointmentBookingModal
          isOpen={true}
          application={bookingModalApp}
          onClose={() => setBookingModalApp(null)}
          onBookingSuccess={() => {
            setBookingModalApp(null);
            refreshUserAndData();
          }}
        />
      )}

      {previewModalDoc && (
        <DocumentPreviewModal
          isOpen={true}
          document={previewModalDoc}
          currentUser={currentUser}
          onClose={() => setPreviewModalDoc(null)}
          onUpdate={() => {
            refreshUserAndData();
          }}
        />
      )}
    </div>
  );
}
