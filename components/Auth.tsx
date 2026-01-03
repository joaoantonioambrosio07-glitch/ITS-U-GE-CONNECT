
import React, { useState } from 'react';
import { User, UserRole } from '../types';
import { MOCK_TURMAS } from '../constants';
import { supabase, db } from '../services/supabase';

interface AuthProps {
  onLogin: (user: User) => void;
}

const Auth: React.FC<AuthProps> = ({ onLogin }) => {
  const [view, setView] = useState<'landing' | 'login' | 'register' | 'check-email'>('landing');
  const [role, setRole] = useState<UserRole>(UserRole.ALUNO);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [selectedTurma, setSelectedTurma] = useState(MOCK_TURMAS[0]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handlePortalSelect = (selectedRole: UserRole, targetView: 'login' | 'register') => {
    setRole(selectedRole);
    setView(targetView);
    setError('');
  };

  const handleAuthSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      if (view === 'register') {
        const isFounder = name.toLowerCase().includes('jorge anselmo');
        const finalRole = isFounder ? UserRole.ADMIN : role;
        const initialStatus = (finalRole === UserRole.ALUNO || isFounder) ? 'APPROVED' : 'PENDING';

        let userId = Math.random().toString(36).substr(2, 9);
        
        // Tenta Supabase primeiro
        if (supabase) {
          const { data: authData, error: authError } = await supabase.auth.signUp({
            email,
            password,
            options: { data: { full_name: name, role: finalRole, turma: selectedTurma, status: initialStatus } }
          });
          if (!authError && authData.user) {
            userId = authData.user.id;
            setView('check-email');
          } else if (authError && authError.message.includes('Service not allowed')) {
             // Fallback Silencioso para Local
          } else if (authError) {
             throw authError;
          }
        }

        // Se falhou ou não há supabase, cria perfil local
        const userProfile = {
          id: userId,
          full_name: name,
          email,
          role: finalRole,
          turma: finalRole === UserRole.ALUNO ? selectedTurma : null,
          status: initialStatus,
          password // Apenas para simulação local
        };

        await db.profiles.upsert(userProfile);
        
        if (!supabase || view !== 'check-email') {
          alert("Conta criada em Modo Local (Failsafe). Podes fazer login agora!");
          setView('login');
        }
      } else {
        // LOGIN
        let userData: User | null = null;

        // 1. Tenta Supabase
        if (supabase) {
          const { data: authData, error: authError } = await supabase.auth.signInWithPassword({ email, password });
          if (!authError && authData.user) {
            const { data: profile } = await db.profiles.get(authData.user.id);
            const meta = authData.user.user_metadata;
            userData = {
              id: authData.user.id,
              name: profile?.full_name || meta?.full_name || 'Utilizador',
              role: (profile?.role || meta?.role) as UserRole,
              turma: profile?.turma || meta?.turma,
              status: profile?.status || meta?.status || 'APPROVED'
            };
          }
        }

        // 2. Fallback Local se Supabase falhar ou não existir
        if (!userData) {
          const profiles = JSON.parse(localStorage.getItem('its_uige_profiles') || '[]');
          const localUser = profiles.find((p: any) => p.email === email && p.password === password);
          
          if (localUser) {
            userData = {
              id: localUser.id,
              name: localUser.full_name,
              role: localUser.role,
              turma: localUser.turma,
              status: localUser.status
            };
          }
        }

        if (userData) {
          if (userData.status === 'BANNED') throw new Error("A tua conta está banida.");
          if (userData.role === UserRole.PROFESSOR && userData.status === 'PENDING') 
            throw new Error("Aguardando aprovação da administração.");
          
          localStorage.setItem('its_uige_session', JSON.stringify(userData));
          onLogin(userData);
        } else {
          throw new Error("Email ou palavra-passe incorretos.");
        }
      }
    } catch (err: any) {
      setError(err.message || 'Erro ao processar pedido');
    } finally {
      setLoading(false);
    }
  };

  if (view === 'check-email') {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4">
        <div className="bg-white w-full max-w-md rounded-[3rem] shadow-2xl p-10 text-center space-y-6">
          <div className="text-5xl">📧</div>
          <h2 className="text-3xl font-black text-slate-800">Verifica o E-mail</h2>
          <p className="text-slate-500">Enviámos um link para {email}. Confirma e volta aqui.</p>
          <button onClick={() => setView('login')} className="w-full py-5 bg-blue-600 text-white rounded-[2rem] font-black uppercase text-xs">Ir para o Login</button>
        </div>
      </div>
    );
  }

  if (view === 'landing') {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-6">
        <div className="text-center mb-12">
          <div className="w-20 h-20 bg-blue-600 rounded-[2rem] mx-auto flex items-center justify-center text-white text-4xl font-black mb-6">U</div>
          <h1 className="text-4xl font-black text-white tracking-tight">ITS Uíge Connect</h1>
          <p className="text-slate-500 text-xs font-bold uppercase tracking-widest mt-2">Plataforma do Aluno e Professor</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-4xl">
          <div className="bg-slate-900 border border-slate-800 p-8 rounded-[2.5rem] hover:border-blue-500 transition-all">
            <h3 className="text-2xl font-black text-white mb-2">Portal do Aluno</h3>
            <p className="text-slate-500 text-sm mb-8">Notas, Biblioteca e IA.</p>
            <button onClick={() => handlePortalSelect(UserRole.ALUNO, 'login')} className="w-full py-4 bg-blue-600 text-white rounded-2xl font-black uppercase text-xs mb-3">Login</button>
            <button onClick={() => handlePortalSelect(UserRole.ALUNO, 'register')} className="w-full py-4 bg-slate-800 text-slate-400 rounded-2xl font-black uppercase text-xs">Criar Conta</button>
          </div>
          <div className="bg-slate-900 border border-slate-800 p-8 rounded-[2.5rem] hover:border-emerald-500 transition-all">
            <h3 className="text-2xl font-black text-white mb-2">Portal Docente</h3>
            <p className="text-slate-500 text-sm mb-8">Gestão de Pautas.</p>
            <button onClick={() => handlePortalSelect(UserRole.PROFESSOR, 'login')} className="w-full py-4 bg-emerald-600 text-white rounded-2xl font-black uppercase text-xs mb-3">Entrar</button>
            <button onClick={() => handlePortalSelect(UserRole.PROFESSOR, 'register')} className="w-full py-4 bg-slate-800 text-slate-400 rounded-2xl font-black uppercase text-xs">Registo</button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-md rounded-[3rem] shadow-2xl p-10 space-y-8">
        <div className="flex justify-between items-center">
          <button onClick={() => setView('landing')} className="text-slate-400 font-bold">← Voltar</button>
          <span className="text-[10px] font-black uppercase bg-slate-100 px-3 py-1 rounded-full text-slate-500">{role}</span>
        </div>
        <div className="text-center">
          <h2 className="text-3xl font-black text-slate-900">{view === 'login' ? 'Acesso' : 'Registo'}</h2>
          <p className="text-slate-400 text-xs font-bold uppercase tracking-widest mt-1">Identifica-te no Sistema</p>
        </div>
        {error && <div className="bg-red-50 text-red-600 p-4 rounded-2xl text-[10px] font-black uppercase border border-red-100">{error}</div>}
        <form onSubmit={handleAuthSubmit} className="space-y-4">
          {view === 'register' && (
            <input required type="text" placeholder="Nome Completo" value={name} onChange={e => setName(e.target.value)} className="w-full px-6 py-4 bg-slate-50 rounded-2xl outline-none font-bold border border-slate-100" />
          )}
          <input required type="email" placeholder="E-mail" value={email} onChange={e => setEmail(e.target.value)} className="w-full px-6 py-4 bg-slate-50 rounded-2xl outline-none font-bold border border-slate-100" />
          {role === UserRole.ALUNO && view === 'register' && (
            <select value={selectedTurma} onChange={e => setSelectedTurma(e.target.value)} className="w-full px-6 py-4 bg-slate-50 rounded-2xl font-bold border border-slate-100">
              {MOCK_TURMAS.map(t => <option key={t} value={t}>Turma {t}</option>)}
            </select>
          )}
          <input required type="password" placeholder="Palavra-passe" value={password} onChange={e => setPassword(e.target.value)} className="w-full px-6 py-4 bg-slate-50 rounded-2xl outline-none font-bold border border-slate-100" />
          <button type="submit" disabled={loading} className={`w-full py-5 rounded-[2rem] font-black text-white text-xs uppercase tracking-widest mt-4 ${role === UserRole.ALUNO ? 'bg-blue-600' : 'bg-emerald-600'}`}>
            {loading ? 'A carregar...' : (view === 'login' ? 'Entrar' : 'Finalizar')}
          </button>
        </form>
        <button onClick={() => setView(view === 'login' ? 'register' : 'login')} className="w-full text-[10px] font-black text-slate-400 uppercase tracking-widest">
          {view === 'login' ? 'Não tens conta? Regista-te' : 'Já tens conta? Login'}
        </button>
      </div>
    </div>
  );
};

export default Auth;
