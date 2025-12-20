
import React, { useState } from 'react';
import { User, UserRole } from '../types';

interface LayoutProps {
  user: User;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  children: React.ReactNode;
  onLogout: () => void;
}

const Layout: React.FC<LayoutProps> = ({ user, activeTab, setActiveTab, children, onLogout }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const allNavItems = [
    { id: 'dashboard', label: 'Início', icon: '🏠', roles: [UserRole.ALUNO, UserRole.PROFESSOR, UserRole.ADMIN] },
    { id: 'library', label: 'Biblioteca', icon: '📚', roles: [UserRole.ALUNO, UserRole.ADMIN] },
    { id: 'ai-summary', label: 'Resumo IA', icon: '✨', roles: [UserRole.ALUNO] },
    { id: 'chat', label: 'Bate-papo', icon: '💬', roles: [UserRole.ALUNO, UserRole.ADMIN] },
    { id: 'announcements', label: 'Comunicados & Temas', icon: '📢', roles: [UserRole.ALUNO, UserRole.PROFESSOR, UserRole.ADMIN] },
    { id: 'grades', label: 'Notas', icon: '📊', roles: [UserRole.ALUNO, UserRole.PROFESSOR] },
    { id: 'admin', label: 'Painel Admin', icon: '🛠️', roles: [UserRole.ADMIN] },
    { id: 'founder', label: 'Sobre o Fundador', icon: '👨‍💻', roles: [UserRole.ALUNO, UserRole.PROFESSOR, UserRole.ADMIN] },
  ];

  const navItems = allNavItems.filter(item => item.roles.includes(user.role));

  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      {/* Mobile Top Nav */}
      <div className="md:hidden bg-slate-900 text-white p-4 flex justify-between items-center sticky top-0 z-50 shadow-md">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center font-bold text-xs">U</div>
          <h1 className="font-black text-sm tracking-tight">ITS Uíge Connect</h1>
        </div>
        <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="p-2 text-xl">
          {isSidebarOpen ? '✕' : '☰'}
        </button>
      </div>

      {/* Sidebar */}
      <aside className={`
        fixed inset-y-0 left-0 z-40 w-72 bg-slate-950 text-slate-100 transition-transform duration-300 md:relative md:translate-x-0
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        border-r border-white/5
      `}>
        <div className="p-8">
          <div className="flex items-center space-x-3 mb-2">
            <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center font-black text-xl shadow-lg shadow-blue-500/20">U</div>
            <h1 className="text-lg font-black tracking-tighter">ITS Uíge Connect</h1>
          </div>
          <p className="text-[10px] text-slate-500 font-black uppercase tracking-[0.2em] ml-1">Portal {user.role.toLowerCase()}</p>
        </div>

        <nav className="mt-4 px-4 space-y-1.5">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => {
                setActiveTab(item.id);
                setIsSidebarOpen(false);
              }}
              className={`
                w-full flex items-center space-x-3 px-4 py-3.5 rounded-2xl text-sm font-bold transition-all
                ${activeTab === item.id 
                  ? 'bg-blue-600 text-white shadow-xl shadow-blue-500/20' 
                  : 'text-slate-500 hover:bg-white/5 hover:text-white'}
              `}
            >
              <span className="text-lg">{item.icon}</span>
              <span>{item.label}</span>
            </button>
          ))}
        </nav>

        <div className="absolute bottom-0 w-full p-6 border-t border-white/5 bg-slate-950/50 backdrop-blur-xl">
          <div className="flex items-center space-x-4 mb-6 px-2">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-sm font-black shadow-lg">
              {user.name.charAt(0)}
            </div>
            <div className="overflow-hidden">
              <p className="text-sm font-black truncate">{user.name}</p>
              <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">{user.turma || 'Docente'}</p>
            </div>
          </div>
          <button 
            onClick={onLogout}
            className="w-full flex items-center justify-center space-x-3 px-4 py-4 rounded-2xl text-xs font-black uppercase tracking-widest text-red-400 bg-red-500/5 hover:bg-red-500/10 transition-all border border-red-500/10"
          >
            <span>Sair do Sistema</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 bg-slate-50 overflow-y-auto h-screen relative">
        <div className="max-w-6xl mx-auto p-4 md:p-10 pb-24 md:pb-10">
          {children}
        </div>
      </main>

      {/* Mobile Overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-30 md:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}
    </div>
  );
};

export default Layout;
