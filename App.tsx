
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
import { supabase, db } from './services/supabase';

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [grades, setGrades] = useState<Grade[]>([]);
  const [allProfiles, setAllProfiles] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchGlobalData = async () => {
    try {
      const { data: gData } = await db.grades.list();
      if (gData) setGrades(gData);

      const { data: aData } = await db.announcements.list();
      if (aData) setAnnouncements(aData);

      if (user?.role === UserRole.ADMIN) {
        const { data: pData } = await db.profiles.listAll();
        if (pData) setAllProfiles(pData.map((p: any) => ({
          id: p.id,
          name: p.full_name,
          role: p.role as UserRole,
          turma: p.turma,
          status: p.status
        })));
      }
    } catch (err) {
      console.error("Erro ao carregar dados:", err);
    }
  };

  useEffect(() => {
    const initApp = async () => {
      try {
        // 1. Tenta Sessão Supabase
        if (supabase) {
          const { data: { session } } = await supabase.auth.getSession();
          if (session?.user) {
            const { data: profile } = await db.profiles.get(session.user.id);
            const meta = session.user.user_metadata;
            setUser({
              id: session.user.id,
              name: profile?.full_name || meta?.full_name || 'Utilizador',
              role: (profile?.role || meta?.role) as UserRole || UserRole.ALUNO,
              turma: profile?.turma || meta?.turma,
              status: profile?.status || meta?.status || 'APPROVED'
            });
            setIsLoading(false);
            return;
          }
        }

        // 2. Tenta Sessão Local (Failsafe)
        const localSession = localStorage.getItem('its_uige_session');
        if (localSession) {
          setUser(JSON.parse(localSession));
        }
      } catch (err) {
        console.error("Erro na inicialização:", err);
      } finally {
        setIsLoading(false);
      }
    };
    initApp();

    if (supabase) {
      const { data: authListener } = supabase.auth.onAuthStateChange(async (event, session) => {
        if (event === 'SIGNED_OUT') {
          setUser(null);
          localStorage.removeItem('its_uige_session');
        }
      });
      return () => authListener.subscription.unsubscribe();
    }
  }, []);

  useEffect(() => {
    if (user) fetchGlobalData();
  }, [user]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!user) return <Auth onLogin={setUser} />;

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard': return <Dashboard user={user} announcements={announcements} grades={grades} />;
      case 'library': return <Library user={user} />;
      case 'ai-summary': return <AISummarizer />;
      case 'chat': return <Chat user={user} />;
      case 'announcements': return <Announcements user={user} announcements={announcements} onUpdate={fetchGlobalData} />;
      case 'grades': return <Grades user={user} grades={grades} onUpdate={fetchGlobalData} />;
      case 'admin': return <AdminPanel allUsers={allProfiles} onUpdate={fetchGlobalData} />;
      case 'founder': return <FounderProfile />;
      default: return <Dashboard user={user} announcements={announcements} grades={grades} />;
    }
  };

  return (
    <Layout 
      user={user} 
      activeTab={activeTab} 
      setActiveTab={setActiveTab}
      onLogout={async () => {
        if (supabase) await supabase.auth.signOut();
        localStorage.removeItem('its_uige_session');
        setUser(null);
      }}
    >
      {renderContent()}
    </Layout>
  );
};

export default App;
