
import React, { useState } from 'react';
import { User, UserRole } from '../types';
import { MOCK_TURMAS } from '../constants';

interface AuthProps {
  onLogin: (user: User) => void;
}

const Auth: React.FC<AuthProps> = ({ onLogin }) => {
  const [view, setView] = useState<'landing' | 'login'>('landing');
  const [role, setRole] = useState<UserRole>(UserRole.ALUNO);
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [selectedTurma, setSelectedTurma] = useState(MOCK_TURMAS[0]);

  const handlePortalSelect = (selectedRole: UserRole) => {
    setRole(selectedRole);
    setView('login');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    
    const lowerName = name.toLowerCase().trim();
    
    // Admin override (Jorge Anselmo)
    if (lowerName === 'jorge anselmo') {
      onLogin({
        id: 'jorge_anselmo',
        name: 'Jorge Anselmo',
        role: UserRole.ADMIN,
        status: 'APPROVED'
      });
      return;
    }

    onLogin({
      id: lowerName.replace(/\s+/g, '_'),
      name: name,
      role: role,
      status: 'APPROVED', // As requested: Professors no longer need authorization to publish
      turma: role === UserRole.ALUNO ? selectedTurma : undefined,
      assignedTurmas: role === UserRole.PROFESSOR ? MOCK_TURMAS : undefined
    });
  };

  if (view === 'landing') {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-6 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-blue-900/20 via-slate-950 to-slate-950">
        <div className="text-center mb-12 animate-fadeIn">
          <div className="w-20 h-20 bg-blue-600 rounded-3xl mx-auto flex items-center justify-center text-white text-4xl font-black mb-6 shadow-2xl shadow-blue-500/20 ring-4 ring-blue-500/10">
            U
          </div>
          <h1 className="text-4xl font-black text-white tracking-tight mb-2">ITS Uíge Connect</h1>
          <p className="text-slate-400 font-medium">Selecione o seu portal de acesso</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-4xl animate-slideUp">
          {/* Student Link/Portal */}
          <button 
            onClick={() => handlePortalSelect(UserRole.ALUNO)}
            className="group relative bg-slate-900 border border-slate-800 p-8 rounded-[2.5rem] text-left hover:border-blue-500/50 transition-all hover:shadow-2xl hover:shadow-blue-500/10 overflow-hidden"
          >
            <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 transition-opacity">
              <span className="text-8xl">🎓</span>
            </div>
            <div className="relative z-10">
              <div className="w-12 h-12 bg-blue-600/10 rounded-2xl flex items-center justify-center text-blue-500 mb-6 group-hover:bg-blue-600 group-hover:text-white transition-all">
                <span className="text-2xl">👨‍🎓</span>
              </div>
              <h3 className="text-2xl font-bold text-white mb-2">Portal do Aluno</h3>
              <p className="text-slate-400 text-sm leading-relaxed mb-6">
                Aceda às suas notas, resumos com IA, biblioteca digital e comunicados da sua turma.
              </p>
              <div className="inline-flex items-center text-blue-500 font-bold text-sm uppercase tracking-widest">
                Entrar como Aluno <span className="ml-2 group-hover:translate-x-2 transition-transform">→</span>
              </div>
            </div>
          </button>

          {/* Professor Link/Portal */}
          <button 
            onClick={() => handlePortalSelect(UserRole.PROFESSOR)}
            className="group relative bg-slate-900 border border-slate-800 p-8 rounded-[2.5rem] text-left hover:border-emerald-500/50 transition-all hover:shadow-2xl hover:shadow-emerald-500/10 overflow-hidden"
          >
            <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 transition-opacity">
              <span className="text-8xl">📋</span>
            </div>
            <div className="relative z-10">
              <div className="w-12 h-12 bg-emerald-600/10 rounded-2xl flex items-center justify-center text-emerald-500 mb-6 group-hover:bg-emerald-600 group-hover:text-white transition-all">
                <span className="text-2xl">👨‍🏫</span>
              </div>
              <h3 className="text-2xl font-bold text-white mb-2">Portal do Professor</h3>
              <p className="text-slate-400 text-sm leading-relaxed mb-6">
                Lance notas, publique temas de aula e envie comunicados oficiais para as suas turmas.
              </p>
              <div className="inline-flex items-center text-emerald-500 font-bold text-sm uppercase tracking-widest">
                Entrar como Docente <span className="ml-2 group-hover:translate-x-2 transition-transform">→</span>
              </div>
            </div>
          </button>
        </div>

        <div className="mt-12 text-slate-500 text-xs font-medium flex flex-col items-center gap-2">
          <p>© 2024 Instituto Técnico de Saúde do Uíge</p>
          <div className="h-1 w-12 bg-slate-800 rounded-full"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-md rounded-[2.5rem] shadow-2xl overflow-hidden p-10 space-y-8 animate-fadeIn">
        <div className="flex justify-between items-start">
          <button 
            onClick={() => setView('landing')}
            className="text-slate-400 hover:text-slate-600 transition-colors"
          >
            ← Voltar
          </button>
          <div className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest ${role === UserRole.ALUNO ? 'bg-blue-100 text-blue-600' : 'bg-emerald-100 text-emerald-600'}`}>
            Portal {role === UserRole.ALUNO ? 'Aluno' : 'Professor'}
          </div>
        </div>

        <div className="text-center">
          <h1 className="text-2xl font-black text-slate-800 mb-2">Bem-vindo de volta!</h1>
          <p className="text-slate-400 text-sm">Introduza os seus dados para aceder ao portal.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">Nome Completo</label>
            <input 
              required
              type="text" 
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Ex: João Manuel"
              className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all text-slate-700 font-medium"
            />
          </div>

          {role === UserRole.ALUNO && (
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">Sua Turma (10ª Classe)</label>
              <select 
                value={selectedTurma}
                onChange={(e) => setSelectedTurma(e.target.value)}
                className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all text-slate-700 font-bold appearance-none cursor-pointer"
              >
                {MOCK_TURMAS.map(t => (
                  <option key={t} value={t}>Turma {t}</option>
                ))}
              </select>
            </div>
          )}

          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">Palavra-passe</label>
            <input 
              required
              type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all text-slate-700"
            />
          </div>

          <button 
            type="submit" 
            className={`w-full py-5 rounded-2xl font-black text-white text-lg transition-all shadow-xl transform active:scale-[0.98] mt-4 uppercase tracking-widest
              ${role === UserRole.ALUNO ? 'bg-blue-600 hover:bg-blue-700 shadow-blue-500/20' : 'bg-emerald-600 hover:bg-emerald-700 shadow-emerald-500/20'}`}
          >
            Aceder ao Portal
          </button>
        </form>

        <div className="text-center pt-4 border-t border-slate-50">
          <p className="text-[10px] text-slate-300 font-bold uppercase tracking-widest">
            ITS Uíge Connect v1.0 • Desenvolvido por Jorge Anselmo
          </p>
        </div>
      </div>
    </div>
  );
};

export default Auth;
