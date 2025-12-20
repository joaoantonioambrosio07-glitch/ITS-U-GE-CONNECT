
import React, { useState, useEffect } from 'react';
import { User, UserRole, Announcement, Grade } from './types';
import Auth from './components/Auth';
import Layout from './components/Layout';
import Dashboard from './components/Dashboard';
import Library from './components/Library';
import AISummarizer from './components/AISummarizer';
import Chat from './components/Chat';
import Announcements from './components/Announcements';
import Grades from './components/Grades';
import FounderProfile from './components/FounderProfile';
import AdminPanel from './components/AdminPanel';

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [grades, setGrades] = useState<Grade[]>([]);

  // Simulation of real-time notifications
  useEffect(() => {
    if (user) {
      const checkNotifications = () => {
        const unreadCount = announcements.filter(a => !a.readBy.includes(user.id)).length;
        if (unreadCount > 0) {
          console.log(`Você tem ${unreadCount} novos comunicados!`);
        }
      };
      checkNotifications();
    }
  }, [user, announcements]);

  if (!user) {
    return <Auth onLogin={setUser} />;
  }

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <Dashboard user={user} announcements={announcements} grades={grades} />;
      case 'library':
        return <Library user={user} />;
      case 'ai-summary':
        return <AISummarizer />;
      case 'chat':
        return <Chat user={user} />;
      case 'announcements':
        return (
          <Announcements 
            user={user} 
            announcements={announcements} 
            onUpdate={setAnnouncements} 
          />
        );
      case 'grades':
        return (
          <Grades 
            user={user} 
            grades={grades} 
            onUpdate={setGrades} 
          />
        );
      case 'admin':
        return <AdminPanel />;
      case 'founder':
        return <FounderProfile />;
      default:
        return <Dashboard user={user} announcements={announcements} grades={grades} />;
    }
  };

  return (
    <Layout 
      user={user} 
      activeTab={activeTab} 
      setActiveTab={setActiveTab}
      onLogout={() => {
        setUser(null);
        setActiveTab('dashboard');
      }}
    >
      {renderContent()}
    </Layout>
  );
};

export default App;
