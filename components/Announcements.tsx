
import React, { useState } from 'react';
import { User, UserRole, Announcement } from '../types';
import { MOCK_TURMAS } from '../constants';

interface AnnouncementsProps {
  user: User;
  announcements: Announcement[];
  onUpdate: (anns: Announcement[]) => void;
}

const Announcements: React.FC<AnnouncementsProps> = ({ user, announcements, onUpdate }) => {
  const [showCreate, setShowCreate] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    message: '',
    priority: 'NORMAL' as Announcement['priority'],
    targetTurma: 'ALL',
    type: 'AVISO' // 'AVISO' or 'TEMA'
  });

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    const newAnn: Announcement = {
      id: Date.now().toString(),
      title: formData.title,
      message: formData.message,
      senderId: user.id,
      senderName: user.name,
      priority: formData.priority,
      targetTurmas: [formData.targetTurma],
      createdAt: new Date().toISOString(),
      readBy: []
    };
    onUpdate([newAnn, ...announcements]);
    setShowCreate(false);
    setFormData({ title: '', message: '', priority: 'NORMAL', targetTurma: 'ALL', type: 'AVISO' });
  };

  const markAsRead = (id: string) => {
    if (user.role === UserRole.ALUNO) {
      onUpdate(announcements.map(ann => 
        ann.id === id ? { ...ann, readBy: [...new Set([...ann.readBy, user.id])] } : ann
      ));
    }
  };

  const priorityColors = {
    NORMAL: 'bg-blue-100 text-blue-700 border-blue-200',
    IMPORTANT: 'bg-orange-100 text-orange-700 border-orange-200',
    URGENT: 'bg-red-100 text-red-700 border-red-200',
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Comunicados e Temas de Aula</h2>
          <p className="text-slate-500">
            {user.role === UserRole.PROFESSOR 
              ? 'Publica avisos ou temas de estudo para as tuas turmas.' 
              : 'Informações e conteúdos partilhados pelos teus professores.'}
          </p>
        </div>
        {user.role === UserRole.PROFESSOR && (
          <button 
            onClick={() => setShowCreate(!showCreate)}
            className="bg-blue-600 text-white px-6 py-3 rounded-2xl text-sm font-bold shadow-xl hover:bg-blue-700 transition-all flex items-center space-x-2"
          >
            <span>{showCreate ? '✕ Cancelar' : '+ Publicar Conteúdo'}</span>
          </button>
        )}
      </header>

      {showCreate && user.role === UserRole.PROFESSOR && (
        <form onSubmit={handleCreate} className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100 animate-slideDown space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest">Título do Conteúdo / Tema</label>
              <input 
                required
                type="text"
                value={formData.title}
                onChange={e => setFormData({...formData, title: e.target.value})}
                placeholder="Ex: Resumo sobre Sistema Nervoso"
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 transition-all"
              />
            </div>
            <div className="space-y-2">
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest">Turma de Destino</label>
              <div className="grid grid-cols-2 gap-2">
                <button 
                  type="button"
                  onClick={() => setFormData({...formData, targetTurma: 'ALL'})}
                  className={`px-3 py-2 rounded-xl text-xs font-bold border transition-all ${formData.targetTurma === 'ALL' ? 'bg-blue-600 text-white border-blue-600' : 'bg-slate-50 text-slate-400 border-slate-200'}`}
                >
                  TODAS (GERAL)
                </button>
                {MOCK_TURMAS.map(t => (
                  <button 
                    key={t}
                    type="button"
                    onClick={() => setFormData({...formData, targetTurma: t})}
                    className={`px-3 py-2 rounded-xl text-xs font-bold border transition-all ${formData.targetTurma === t ? 'bg-slate-800 text-white border-slate-800' : 'bg-slate-50 text-slate-400 border-slate-200'}`}
                  >
                    TURMA {t}
                  </button>
                ))}
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest">Tipo de Publicação</label>
              <div className="flex space-x-3">
                <button 
                  type="button"
                  onClick={() => setFormData({...formData, type: 'AVISO'})}
                  className={`flex-1 py-3 rounded-xl text-xs font-bold border transition-all ${formData.type === 'AVISO' ? 'bg-white border-blue-200 text-blue-600 shadow-sm' : 'bg-slate-50 text-slate-400'}`}
                >
                  📢 AVISO OFICIAL
                </button>
                <button 
                  type="button"
                  onClick={() => setFormData({...formData, type: 'TEMA'})}
                  className={`flex-1 py-3 rounded-xl text-xs font-bold border transition-all ${formData.type === 'TEMA' ? 'bg-white border-green-200 text-green-600 shadow-sm' : 'bg-slate-50 text-slate-400'}`}
                >
                  📖 TEMA DE ESTUDO
                </button>
              </div>
            </div>
            <div className="space-y-2">
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest">Prioridade (Apenas para Avisos)</label>
              <div className="flex space-x-2">
                {['NORMAL', 'IMPORTANT', 'URGENT'].map((p) => (
                  <button
                    key={p}
                    type="button"
                    onClick={() => setFormData({...formData, priority: p as Announcement['priority']})}
                    className={`flex-1 py-3 rounded-xl text-[10px] font-bold border transition-all ${formData.priority === p ? 'bg-slate-900 text-white shadow-md' : 'bg-slate-50 text-slate-400'}`}
                  >
                    {p}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest">Mensagem ou Conteúdo Detalhado</label>
            <textarea 
              required
              rows={5}
              value={formData.message}
              onChange={e => setFormData({...formData, message: e.target.value})}
              placeholder="Escreve aqui o comunicado ou o resumo do tema que queres partilhar..."
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-2 focus:ring-blue-500 transition-all"
            ></textarea>
          </div>
          
          <button type="submit" className="w-full bg-blue-600 text-white py-4 rounded-2xl font-black text-lg hover:bg-blue-700 transition-all shadow-xl shadow-blue-100 uppercase tracking-widest">
            Publicar Agora 🚀
          </button>
        </form>
      )}

      <div className="space-y-6">
        {announcements.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-3xl border border-slate-100 border-dashed">
            <span className="text-5xl block mb-4">📭</span>
            <p className="text-slate-400 font-medium italic">Nenhum conteúdo partilhado até ao momento.</p>
          </div>
        ) : (
          announcements.map(ann => {
            const isTopic = ann.title.toLowerCase().includes('tema') || ann.message.length > 200;
            return (
              <div 
                key={ann.id} 
                onClick={() => markAsRead(ann.id)}
                className={`bg-white p-6 rounded-3xl shadow-sm border border-slate-100 hover:border-blue-200 transition-all cursor-pointer relative overflow-hidden ${!ann.readBy.includes(user.id) && user.role === UserRole.ALUNO ? 'ring-2 ring-blue-500 ring-offset-4' : ''}`}
              >
                <div className="flex justify-between items-start mb-6">
                  <div className="flex items-center space-x-4">
                    <div className={`w-12 h-12 ${isTopic ? 'bg-green-100 text-green-600' : 'bg-blue-100 text-blue-600'} rounded-2xl flex items-center justify-center text-xl font-black shadow-inner`}>
                      {ann.senderName.charAt(0)}
                    </div>
                    <div>
                      <h4 className="font-black text-slate-800 uppercase text-xs tracking-widest">{ann.senderName}</h4>
                      <p className="text-[10px] text-slate-400 font-bold mt-0.5">{new Date(ann.createdAt).toLocaleDateString('pt-PT', { day: '2-digit', month: 'long', year: 'numeric' })}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-tighter border ${priorityColors[ann.priority]}`}>
                      {ann.priority}
                    </span>
                    {isTopic && <span className="bg-green-600 text-white px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-tighter">TEMA</span>}
                  </div>
                </div>
                
                <h3 className="text-xl font-black text-slate-900 mb-3">{ann.title}</h3>
                <div className="prose prose-slate max-w-none">
                  <p className="text-slate-600 text-sm leading-relaxed whitespace-pre-wrap">{ann.message}</p>
                </div>
                
                <div className="flex items-center justify-between mt-8 pt-4 border-t border-slate-50">
                  <div className="flex items-center space-x-4 text-[10px] font-black uppercase tracking-widest text-slate-400">
                    <span className="flex items-center"><span className="mr-1">🎯</span> {ann.targetTurmas[0] === 'ALL' ? 'Geral' : `Turma ${ann.targetTurmas[0]}`}</span>
                    {user.role === UserRole.PROFESSOR && (
                      <span className="text-blue-500 flex items-center"><span className="mr-1">👁️</span> {ann.readBy.length} Visualizações</span>
                    )}
                  </div>
                  {user.role === UserRole.ALUNO && (
                    <span className={`text-[10px] font-black uppercase tracking-widest ${ann.readBy.includes(user.id) ? 'text-green-500' : 'text-orange-500 animate-pulse'}`}>
                      {ann.readBy.includes(user.id) ? '✓ Visto' : '🆕 Novo'}
                    </span>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default Announcements;
