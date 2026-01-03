
import React, { useState } from 'react';
import { User, UserRole, Announcement } from '../types';
import { MOCK_TURMAS } from '../constants';
import { db } from '../services/supabase';

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
    type: 'AVISO'
  });

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    const newAnn: any = {
      title: formData.title,
      message: formData.message,
      senderId: user.id,
      senderName: user.name,
      priority: formData.priority,
      targetTurmas: [formData.targetTurma],
      createdAt: new Date().toISOString(),
      readBy: [],
      type: formData.type
    };

    const { data, error } = await db.announcements.insert(newAnn);
    if (!error) {
      onUpdate([{ ...newAnn, id: Date.now().toString() }, ...announcements]);
      setShowCreate(false);
      setFormData({ title: '', message: '', priority: 'NORMAL', targetTurma: 'ALL', type: 'AVISO' });
    }
  };

  const markAsRead = (id: string) => {
    // Local read marking could be added to DB if needed
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
            className="bg-blue-600 text-white px-6 py-3 rounded-2xl text-sm font-bold shadow-xl hover:bg-blue-700 transition-all"
          >
            {showCreate ? '✕ Cancelar' : '+ Publicar Conteúdo'}
          </button>
        )}
      </header>

      {showCreate && user.role === UserRole.PROFESSOR && (
        <form onSubmit={handleCreate} className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100 animate-slideDown space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest">Título do Conteúdo</label>
              <input 
                required
                type="text"
                value={formData.title}
                onChange={e => setFormData({...formData, title: e.target.value})}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="space-y-2">
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest">Turma</label>
              <select 
                value={formData.targetTurma}
                onChange={e => setFormData({...formData, targetTurma: e.target.value})}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl"
              >
                <option value="ALL">TODAS</option>
                {MOCK_TURMAS.map(t => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>
          </div>
          <div className="space-y-2">
            <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest">Mensagem Detalhada</label>
            <textarea 
              required rows={5}
              value={formData.message}
              onChange={e => setFormData({...formData, message: e.target.value})}
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-2 focus:ring-blue-500"
            ></textarea>
          </div>
          <button type="submit" className="w-full bg-blue-600 text-white py-4 rounded-2xl font-black text-lg hover:bg-blue-700 shadow-xl">
            Publicar Agora 🚀
          </button>
        </form>
      )}

      <div className="space-y-6">
        {announcements.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-3xl border border-slate-100 border-dashed">
            <p className="text-slate-400 font-medium italic">Nenhum conteúdo partilhado.</p>
          </div>
        ) : (
          announcements.map(ann => (
            <div key={ann.id} className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 relative overflow-hidden">
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white font-black">{ann.senderName.charAt(0)}</div>
                  <div>
                    <h4 className="font-black text-slate-800 uppercase text-[10px] tracking-widest">{ann.senderName}</h4>
                    <p className="text-[9px] text-slate-400">{new Date(ann.createdAt).toLocaleDateString()}</p>
                  </div>
                </div>
                <span className={`px-2 py-1 rounded-full text-[8px] font-black tracking-widest border ${priorityColors[ann.priority]}`}>{ann.priority}</span>
              </div>
              <h3 className="text-lg font-black text-slate-900 mb-2">{ann.title}</h3>
              <p className="text-slate-600 text-sm leading-relaxed whitespace-pre-wrap">{ann.message}</p>
              <div className="mt-4 pt-4 border-t border-slate-50 flex items-center text-[9px] font-black text-slate-400 uppercase tracking-widest">
                <span>🎯 {ann.targetTurmas[0] === 'ALL' ? 'Geral' : `Turma ${ann.targetTurmas[0]}`}</span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Announcements;
