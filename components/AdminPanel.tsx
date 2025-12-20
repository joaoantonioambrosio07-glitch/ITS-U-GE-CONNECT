
import React, { useState } from 'react';
import { User, UserRole, Subject } from '../types';
import { SUBJECTS, MOCK_TURMAS } from '../constants';

const AdminPanel: React.FC = () => {
  const [activeSubTab, setActiveSubTab] = useState<'users' | 'classes' | 'stats' | 'moderation'>('users');

  return (
    <div className="space-y-6 animate-fadeIn">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-black text-slate-900">Consola de Administração</h2>
          <p className="text-slate-500 font-medium">Bem-vindo, Jorge Anselmo. Tens controlo total sobre o sistema.</p>
        </div>
        <div className="flex bg-slate-200 p-1 rounded-2xl">
           <button 
             onClick={() => setActiveSubTab('users')}
             className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${activeSubTab === 'users' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500'}`}
           >
             UTILIZADORES
           </button>
           <button 
             onClick={() => setActiveSubTab('classes')}
             className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${activeSubTab === 'classes' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500'}`}
           >
             TURMAS & CURSOS
           </button>
           <button 
             onClick={() => setActiveSubTab('moderation')}
             className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${activeSubTab === 'moderation' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500'}`}
           >
             MODERAÇÃO
           </button>
        </div>
      </header>

      {/* Main Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-blue-600 p-6 rounded-3xl text-white shadow-lg shadow-blue-100">
           <p className="text-blue-100 text-[10px] font-bold uppercase tracking-widest">Total Utilizadores</p>
           <p className="text-3xl font-black">412</p>
        </div>
        <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
           <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest">Professores Pendentes</p>
           <p className="text-3xl font-black text-orange-500">5</p>
        </div>
        <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
           <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest">Mensagens Hoje</p>
           <p className="text-3xl font-black text-slate-800">1.2k</p>
        </div>
        <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
           <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest">Status Sistema</p>
           <p className="text-3xl font-black text-green-500">OK</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {activeSubTab === 'users' && (
          <>
            <div className="lg:col-span-2 bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
               <div className="p-6 border-b border-slate-50 flex justify-between items-center">
                  <h3 className="font-bold text-slate-800">Aprovação de Professores</h3>
                  <span className="bg-orange-100 text-orange-700 text-[10px] font-bold px-2 py-1 rounded">PENDENTES</span>
               </div>
               <div className="divide-y divide-slate-50">
                  {[
                    { name: 'Dr. Alberto Cassange', subject: 'Biologia', email: 'alberto@its-uige.edu', date: 'Há 15 min' },
                    { name: 'Eng. Manuel Sotto', subject: 'Física', email: 'manuel@its-uige.edu', date: 'Há 1h' },
                    { name: 'Dra. Isabel Neto', subject: 'Química', email: 'isabel@its-uige.edu', date: 'Há 3h' },
                  ].map((prof, i) => (
                    <div key={i} className="p-4 flex items-center justify-between hover:bg-slate-50 transition-colors">
                       <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center font-bold text-slate-500">{prof.name[0]}</div>
                          <div>
                             <p className="text-sm font-bold text-slate-800">{prof.name}</p>
                             <p className="text-xs text-slate-400">{prof.subject} • {prof.date}</p>
                          </div>
                       </div>
                       <div className="flex space-x-2">
                          <button className="px-4 py-2 bg-blue-600 text-white text-[10px] font-bold rounded-xl hover:bg-blue-700 transition-all">APROVAR</button>
                          <button className="px-4 py-2 bg-slate-100 text-slate-400 text-[10px] font-bold rounded-xl hover:bg-red-50 hover:text-red-500 transition-all">RECUSAR</button>
                       </div>
                    </div>
                  ))}
               </div>
            </div>
            <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-6">
               <h3 className="font-bold text-slate-800 mb-6">Registo de Atividades</h3>
               <div className="space-y-4">
                  {[
                    { action: 'Nota alterada', user: 'Prof. Manuel', target: 'João Pinto', time: '5m' },
                    { action: 'Novo aluno registado', user: 'Sistema', target: 'Ana Bela (A2)', time: '12m' },
                    { action: 'Comunicado urgente', user: 'Admin Jorge', target: 'Todas Turmas', time: '1h' },
                    { action: 'Professor banido', user: 'Admin Jorge', target: 'Dr. Falso', time: '3h' },
                  ].map((log, i) => (
                    <div key={i} className="flex items-start space-x-3 text-xs">
                       <div className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-1.5"></div>
                       <div>
                          <p className="font-bold text-slate-700">{log.action}</p>
                          <p className="text-slate-400">{log.user} → {log.target}</p>
                          <p className="text-[10px] text-slate-300 mt-1">{log.time} atrás</p>
                       </div>
                    </div>
                  ))}
               </div>
            </div>
          </>
        )}

        {activeSubTab === 'classes' && (
          <div className="lg:col-span-3 grid grid-cols-1 md:grid-cols-4 gap-4">
             {MOCK_TURMAS.map(turma => (
               <div key={turma} className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm hover:border-blue-200 transition-all cursor-pointer">
                  <div className="flex justify-between items-start mb-4">
                     <span className="text-2xl font-black text-blue-600">{turma}</span>
                     <span className="bg-slate-100 text-slate-500 text-[9px] font-bold px-2 py-1 rounded">10ª CLASSE</span>
                  </div>
                  <p className="text-sm font-bold text-slate-800">42 Alunos</p>
                  <p className="text-xs text-slate-400 mt-1">10 Professores Atribuídos</p>
                  <button className="w-full mt-6 py-2 bg-slate-50 text-slate-600 text-[10px] font-bold rounded-xl hover:bg-slate-900 hover:text-white transition-all">GERIR TURMA</button>
               </div>
             ))}
             <div className="bg-slate-50 border-2 border-dashed border-slate-200 p-6 rounded-3xl flex flex-col items-center justify-center text-center group hover:bg-white hover:border-blue-300 transition-all cursor-pointer">
                <span className="text-2xl mb-2 group-hover:scale-125 transition-transform">➕</span>
                <p className="text-xs font-bold text-slate-400 group-hover:text-blue-600">Criar Nova Turma</p>
             </div>
          </div>
        )}

        {activeSubTab === 'moderation' && (
          <div className="lg:col-span-3 bg-white rounded-3xl border border-slate-100 shadow-sm p-6">
             <div className="flex justify-between items-center mb-6">
                <h3 className="font-bold text-slate-800">Alertas de Moderação (IA Detectada)</h3>
                <button className="text-xs text-blue-600 font-bold hover:underline">Limpar Filtros</button>
             </div>
             <div className="space-y-4">
                {[
                  { user: 'Anon_123', turma: 'A3', content: 'Uso de linguagem inapropriada no chat geral.', level: 'MÉDIO' },
                  { user: 'Aluno_A1', turma: 'A1', content: 'Tentativa de upload de arquivo suspeito.', level: 'ALTO' },
                ].map((alert, i) => (
                  <div key={i} className="p-4 bg-slate-50 rounded-2xl flex items-center justify-between">
                     <div>
                        <p className="text-sm font-bold text-slate-800">{alert.user} ({alert.turma})</p>
                        <p className="text-xs text-slate-500 mt-1">{alert.content}</p>
                     </div>
                     <div className="flex items-center space-x-4">
                        <span className={`text-[9px] font-black px-2 py-1 rounded ${alert.level === 'ALTO' ? 'bg-red-100 text-red-700' : 'bg-orange-100 text-orange-700'}`}>{alert.level}</span>
                        <button className="text-xs text-red-600 font-bold hover:underline">Banir</button>
                        <button className="text-xs text-blue-600 font-bold hover:underline">Ignorar</button>
                     </div>
                  </div>
                ))}
             </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminPanel;
