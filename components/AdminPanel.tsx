
import React, { useState } from 'react';
import { User, UserRole } from '../types';
import { MOCK_TURMAS } from '../constants';
import { db } from '../services/supabase';

interface AdminPanelProps {
  allUsers: User[];
  onUpdate: () => void;
}

const AdminPanel: React.FC<AdminPanelProps> = ({ allUsers, onUpdate }) => {
  const [activeSubTab, setActiveSubTab] = useState<'users' | 'classes' | 'moderation'>('users');
  const [loadingAction, setLoadingAction] = useState<string | null>(null);

  const handleStatusChange = async (userId: string, newStatus: string) => {
    if (loadingAction) return;
    setLoadingAction(userId);
    try {
      const { error } = await db.profiles.updateStatus(userId, newStatus);
      if (!error) {
        await onUpdate();
        alert(`Utilizador ${newStatus === 'APPROVED' ? 'aprovado' : 'atualizado'} com sucesso.`);
      } else {
        throw error;
      }
    } catch (err) {
      alert("Erro na operação.");
    } finally {
      setLoadingAction(null);
    }
  };

  const handleBanUser = async (userId: string) => {
    if (!confirm("Tens a certeza que desejas BANIR este utilizador?")) return;
    setLoadingAction(userId);
    try {
      const { error } = await db.profiles.updateStatus(userId, 'BANNED');
      if (!error) {
        await onUpdate();
        alert("Utilizador banido.");
      } else {
        throw error;
      }
    } catch (err) {
      alert("Erro ao banir.");
    } finally {
      setLoadingAction(null);
    }
  };

  const handleManageTurma = (turma: string) => {
    const students = allUsers.filter(u => u.turma === turma && u.role === UserRole.ALUNO);
    alert(`Turma ${turma}: ${students.length} alunos registados.`);
  };

  const pendingProfessors = allUsers.filter(u => u.role === UserRole.PROFESSOR && (u.status === 'PENDING' || !u.status));
  const activeStudents = allUsers.filter(u => u.role === UserRole.ALUNO && u.status !== 'BANNED');

  return (
    <div className="space-y-6 animate-fadeIn pb-20">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-black text-slate-900 tracking-tight">Consola de Administração</h2>
          <p className="text-slate-500 font-medium">Gestão centralizada do sistema</p>
        </div>
        <div className="flex bg-slate-200/50 p-1.5 rounded-2xl border border-slate-200">
           {['users', 'classes', 'moderation'].map((tab) => (
             <button 
               key={tab}
               onClick={() => setActiveSubTab(tab as any)}
               className={`px-6 py-2.5 rounded-xl text-[10px] font-black tracking-widest uppercase ${activeSubTab === tab ? 'bg-white text-blue-600 shadow-xl' : 'text-slate-500'}`}
             >
               {tab === 'users' ? 'Utilizadores' : tab === 'classes' ? 'Turmas' : 'Moderação'}
             </button>
           ))}
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-blue-600 p-8 rounded-[2.5rem] text-white shadow-2xl">
           <p className="text-blue-100 text-[10px] font-black uppercase tracking-widest">Utilizadores</p>
           <p className="text-5xl font-black mt-2">{allUsers.length}</p>
        </div>
        <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm text-center">
           <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest">Pendentes</p>
           <p className="text-5xl font-black text-orange-500 mt-2">{pendingProfessors.length}</p>
        </div>
        <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm text-center">
           <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest">Alunos</p>
           <p className="text-5xl font-black text-slate-800 mt-2">{activeStudents.length}</p>
        </div>
        <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm text-center">
           <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest">Servidor</p>
           <div className="flex items-center justify-center gap-2 mt-4 text-green-500">
              <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
              <span className="font-black uppercase text-xs">Ativo</span>
           </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {activeSubTab === 'users' && (
          <>
            <div className="lg:col-span-2 bg-white rounded-[3rem] border border-slate-100 shadow-sm overflow-hidden">
               <div className="p-8 border-b border-slate-50 flex justify-between items-center bg-slate-50/30">
                  <h3 className="font-black text-slate-800 uppercase text-xs">Validação de Docentes</h3>
               </div>
               <div className="divide-y divide-slate-50 max-h-[600px] overflow-y-auto">
                  {pendingProfessors.length === 0 ? (
                    <div className="p-20 text-center text-slate-400 font-bold italic">Nenhum pedido de acesso pendente.</div>
                  ) : (
                    pendingProfessors.map((prof) => (
                      <div key={prof.id} className="p-8 flex items-center justify-between hover:bg-slate-50 transition-all">
                         <div className="flex items-center space-x-5">
                            <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center font-black text-white text-2xl">{prof.name[0]}</div>
                            <div>
                               <p className="text-lg font-black text-slate-800">{prof.name}</p>
                               <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Docente</p>
                            </div>
                         </div>
                         <div className="flex gap-3">
                            <button 
                              disabled={!!loadingAction}
                              onClick={() => handleStatusChange(prof.id, 'APPROVED')}
                              className="px-6 py-3 bg-blue-600 text-white text-[10px] font-black rounded-2xl hover:bg-blue-700 disabled:opacity-50 uppercase shadow-lg"
                            >
                              {loadingAction === prof.id ? '...' : 'APROVAR'}
                            </button>
                            <button 
                              disabled={!!loadingAction}
                              onClick={() => handleBanUser(prof.id)}
                              className="px-6 py-3 bg-red-50 text-red-600 text-[10px] font-black rounded-2xl hover:bg-red-600 hover:text-white disabled:opacity-50 uppercase"
                            >
                              RECUSAR
                            </button>
                         </div>
                      </div>
                    ))
                  )}
               </div>
            </div>
            <div className="bg-white rounded-[3rem] border border-slate-100 shadow-sm p-10">
               <h3 className="font-black text-slate-800 uppercase text-xs mb-8">Alunos Registados</h3>
               <div className="space-y-4 max-h-[500px] overflow-y-auto pr-4">
                  {activeStudents.map((student) => (
                    <div key={student.id} className="p-5 bg-slate-50 rounded-3xl flex items-center justify-between group">
                       <div>
                          <p className="text-sm font-black text-slate-800">{student.name}</p>
                          <span className="text-[9px] font-black bg-blue-100 text-blue-600 px-2 py-0.5 rounded-full">T-{student.turma}</span>
                       </div>
                       <button onClick={() => handleBanUser(student.id)} className="opacity-0 group-hover:opacity-100 w-10 h-10 bg-red-50 text-red-500 rounded-xl flex items-center justify-center hover:bg-red-500 hover:text-white transition-all">🚫</button>
                    </div>
                  ))}
               </div>
            </div>
          </>
        )}
        {activeSubTab === 'classes' && (
          <div className="lg:col-span-3 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
             {MOCK_TURMAS.map(turma => (
               <div key={turma} className="bg-white p-10 rounded-[3rem] border border-slate-100 shadow-sm hover:border-blue-300 transition-all">
                  <div className="flex justify-between items-start mb-6">
                     <span className="text-5xl font-black text-slate-900">{turma}</span>
                     <div className="bg-blue-50 text-blue-600 text-[10px] font-black px-4 py-1.5 rounded-full uppercase">10ª Classe</div>
                  </div>
                  <p className="text-sm font-black text-slate-800 mb-8">{activeStudents.filter(s => s.turma === turma).length} Estudantes</p>
                  <button onClick={() => handleManageTurma(turma)} className="w-full py-4 bg-slate-900 text-white text-[11px] font-black rounded-2xl hover:bg-blue-600 transition-all uppercase tracking-widest">Gerir Pauta</button>
               </div>
             ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminPanel;
