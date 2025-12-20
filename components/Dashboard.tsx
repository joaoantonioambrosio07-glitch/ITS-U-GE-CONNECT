
import React from 'react';
import { User, UserRole, Announcement, Grade } from '../types';
import { SUBJECTS } from '../constants';

interface DashboardProps {
  user: User;
  announcements: Announcement[];
  grades: Grade[];
}

const Dashboard: React.FC<DashboardProps> = ({ user, announcements, grades }) => {
  const latestAnnouncements = announcements.slice(0, 3);
  const userGrades = user.role === UserRole.ALUNO ? grades.filter(g => g.studentId === user.id) : [];

  return (
    <div className="space-y-6 animate-fadeIn">
      <header>
        <h2 className="text-2xl font-bold text-slate-800">Olá, {user.name}! 👋</h2>
        <p className="text-slate-500">Bem-vindo ao painel do {user.role.toLowerCase()}.</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex flex-col justify-between">
          <div>
            <span className="text-3xl mb-2 block">📢</span>
            <h3 className="font-semibold text-slate-700">Comunicados</h3>
            <p className="text-sm text-slate-500">{announcements.length} avisos recentes.</p>
          </div>
          <div className="mt-4 flex -space-x-2">
            {[1, 2, 3].map(i => (
              <div key={i} className={`w-8 h-8 rounded-full border-2 border-white bg-blue-${i * 100} flex items-center justify-center text-[10px] text-white font-bold`}>
                U{i}
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex flex-col justify-between">
          <div>
            <span className="text-3xl mb-2 block">📚</span>
            <h3 className="font-semibold text-slate-700">Biblioteca</h3>
            <p className="text-sm text-slate-500">{SUBJECTS.length} disciplinas ativas.</p>
          </div>
          <div className="mt-4 text-xs font-medium text-blue-600">Ver conteúdos →</div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex flex-col justify-between">
          <div>
            <span className="text-3xl mb-2 block">🎓</span>
            <h3 className="font-semibold text-slate-700">Desempenho</h3>
            <p className="text-sm text-slate-500">Média geral: 14.5 val.</p>
          </div>
          <div className="mt-4 w-full bg-slate-100 h-2 rounded-full overflow-hidden">
            <div className="bg-green-500 h-full w-[72%] transition-all"></div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Latest Announcements */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-bold text-slate-800">Últimos Comunicados</h3>
            <button className="text-xs text-blue-600 hover:underline">Ver todos</button>
          </div>
          <div className="space-y-4">
            {latestAnnouncements.length === 0 ? (
              <p className="text-sm text-slate-400 italic">Nenhum comunicado recente.</p>
            ) : (
              latestAnnouncements.map(ann => (
                <div key={ann.id} className="p-3 bg-slate-50 rounded-lg border-l-4 border-blue-500">
                  <p className="text-xs font-semibold text-blue-600 uppercase mb-1">{ann.priority}</p>
                  <p className="text-sm font-medium text-slate-800">{ann.title}</p>
                  <p className="text-xs text-slate-500 mt-1 line-clamp-1">{ann.message}</p>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Quick Access Grid */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
          <h3 className="font-bold text-slate-800 mb-4">Acesso Rápido</h3>
          <div className="grid grid-cols-2 gap-3">
            {SUBJECTS.slice(0, 4).map(sub => (
              <button key={sub.id} className="p-4 bg-slate-50 hover:bg-blue-50 hover:text-blue-600 rounded-xl transition-all text-left flex items-center space-x-3 group">
                <span className="text-xl group-hover:scale-110 transition-transform">{sub.icon}</span>
                <span className="text-sm font-medium">{sub.name}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
