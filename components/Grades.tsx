
import React, { useState } from 'react';
import { User, UserRole, Grade } from '../types';
import { SUBJECTS, MOCK_TURMAS } from '../constants';
import { db } from '../services/supabase';

interface GradesProps {
  user: User;
  grades: Grade[];
  onUpdate: () => void;
}

const Grades: React.FC<GradesProps> = ({ user, grades, onUpdate }) => {
  const [showAdd, setShowAdd] = useState(false);
  const [loading, setLoading] = useState(false);
  const [selectedTurma, setSelectedTurma] = useState(user.turma || MOCK_TURMAS[0]);
  const [formData, setFormData] = useState({
    studentName: '',
    subjectId: SUBJECTS[0].id,
    value: 10,
    term: 1,
    type: 'TEST' as Grade['type'],
    comment: ''
  });

  const mockStudents: Record<string, string[]> = {
    'A1': ['António José', 'Beatriz Silva', 'Carlos Manuel', 'Delfina Pinto'],
    'A2': ['Emanuel Costa', 'Filomena Dias', 'Gelson Cruz', 'Helena Jorge'],
    'A3': ['Iracelma Neto', 'João Paulo', 'Kianda Luz', 'Leonel Varela'],
    'A4': ['Margarida Faria', 'Nuno Miguel', 'Osvaldo Luís', 'Paula Santos'],
  };

  const currentStudents = mockStudents[selectedTurma] || [];

  const handleAddGrade = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.studentName) return;
    setLoading(true);
    
    const newGrade = {
      studentId: formData.studentName.toLowerCase().replace(/\s+/g, '_'),
      studentName: formData.studentName,
      subjectId: formData.subjectId,
      value: formData.value,
      term: formData.term,
      type: formData.type,
      comment: formData.comment,
      date: new Date().toISOString(),
      published: true
    };

    try {
      const { error } = await db.grades.insert(newGrade);
      if (!error) {
        await onUpdate();
        setShowAdd(false);
        alert("Nota lançada com sucesso!");
      } else {
        throw error;
      }
    } catch (err) {
      alert("Erro ao lançar nota.");
    } finally {
      setLoading(false);
    }
  };

  const togglePublish = async (id: string, currentStatus: boolean) => {
    try {
      const { error } = await db.grades.update(id, { published: !currentStatus });
      if (!error) {
        await onUpdate();
      }
    } catch (err) {
      alert("Erro ao atualizar publicação.");
    }
  };

  return (
    <div className="space-y-6 animate-fadeIn pb-20">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-black text-slate-900 tracking-tight">
            {user.role === UserRole.ALUNO ? 'Minhas Notas Oficiais' : 'Lançamento de Notas'}
          </h2>
          <p className="text-slate-500 font-medium">
            {user.role === UserRole.ALUNO ? 'Resultados da 10ª Classe.' : 'Gestão de pautas do ITS Uíge.'}
          </p>
        </div>
        {(user.role === UserRole.PROFESSOR || user.role === UserRole.ADMIN) && (
          <button 
            onClick={() => setShowAdd(!showAdd)}
            className="bg-green-600 text-white px-8 py-3 rounded-2xl text-[10px] font-black tracking-widest uppercase shadow-xl hover:bg-green-700 transition-all"
          >
            {showAdd ? 'Cancelar' : '+ Nova Nota'}
          </button>
        )}
      </header>

      {user.role === UserRole.ALUNO ? (
        <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-slate-900 text-white">
              <tr>
                <th className="px-6 py-5 text-[10px] font-black uppercase tracking-widest">Disciplina</th>
                <th className="px-6 py-5 text-[10px] font-black uppercase tracking-widest text-center">MAC</th>
                <th className="px-6 py-5 text-[10px] font-black uppercase tracking-widest text-center">NPP</th>
                <th className="px-6 py-5 text-[10px] font-black uppercase tracking-widest text-center">NPT</th>
                <th className="px-6 py-5 text-[10px] font-black uppercase tracking-widest text-center">Média</th>
                <th className="px-6 py-5 text-[10px] font-black uppercase tracking-widest text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {SUBJECTS.map(subject => {
                const subjectGrades = grades.filter(g => g.published && g.studentId === user.id && g.subjectId === subject.id);
                const avg = subjectGrades.length > 0 ? subjectGrades.reduce((a, b) => a + b.value, 0) / subjectGrades.length : 0;
                return (
                  <tr key={subject.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-5 flex items-center space-x-3">
                      <span className="text-2xl">{subject.icon}</span>
                      <span className="font-black text-slate-800 text-sm">{subject.name}</span>
                    </td>
                    <td className="px-6 py-5 text-center font-bold text-slate-500">{subjectGrades.filter(g => g.type === 'CONTINUOUS').map(g => g.value).join(', ') || '-'}</td>
                    <td className="px-6 py-5 text-center font-bold text-slate-500">{subjectGrades.filter(g => g.type === 'TEST').map(g => g.value).join(', ') || '-'}</td>
                    <td className="px-6 py-5 text-center font-bold text-slate-500">{subjectGrades.filter(g => g.type === 'EXAM').map(g => g.value).join(', ') || '-'}</td>
                    <td className={`px-6 py-5 text-center font-black text-xl ${avg >= 10 ? 'text-blue-600' : 'text-red-500'}`}>{avg > 0 ? avg.toFixed(1) : '-'}</td>
                    <td className="px-6 py-5 text-center">
                       {avg > 0 && <span className={`px-3 py-1 rounded-full text-[9px] font-black ${avg >= 10 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>{avg >= 10 ? 'APROVADO' : 'REPROVADO'}</span>}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="space-y-6">
          <div className="bg-white p-4 rounded-3xl border border-slate-100 shadow-sm flex items-center space-x-2 overflow-x-auto">
            {MOCK_TURMAS.map(t => (
              <button key={t} onClick={() => setSelectedTurma(t)} className={`px-8 py-2.5 rounded-2xl text-[10px] font-black tracking-widest transition-all ${selectedTurma === t ? 'bg-slate-900 text-white' : 'text-slate-400 hover:bg-slate-50'}`}>TURMA {t}</button>
            ))}
          </div>
          {showAdd && (
            <form onSubmit={handleAddGrade} className="bg-white p-10 rounded-[3rem] shadow-xl border border-slate-100 animate-slideDown space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-slate-400 uppercase ml-1">Aluno</label>
                  <select required value={formData.studentName} onChange={e => setFormData({...formData, studentName: e.target.value})} className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl font-bold">
                    <option value="">Escolher Aluno...</option>
                    {currentStudents.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-slate-400 uppercase ml-1">Disciplina</label>
                  <select value={formData.subjectId} onChange={e => setFormData({...formData, subjectId: e.target.value})} className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl font-bold">
                    {SUBJECTS.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                  </select>
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-slate-400 uppercase ml-1">Nota</label>
                  <input required type="number" min="0" max="20" step="0.1" value={formData.value} onChange={e => setFormData({...formData, value: Number(e.target.value)})} className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl font-black text-blue-600" />
                </div>
              </div>
              <button disabled={loading} type="submit" className="w-full bg-blue-600 text-white py-5 rounded-[2rem] font-black text-sm uppercase tracking-widest hover:bg-blue-700 shadow-xl disabled:opacity-50 transition-all">{loading ? 'A Gravar...' : 'Lançar Nota'}</button>
            </form>
          )}
          <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-slate-50 border-b border-slate-100">
                <tr>
                  <th className="px-6 py-5 text-[10px] font-black text-slate-400 uppercase">Aluno</th>
                  <th className="px-6 py-5 text-[10px] font-black text-slate-400 uppercase">Disciplina</th>
                  <th className="px-6 py-5 text-[10px] font-black text-slate-400 uppercase text-center">Nota</th>
                  <th className="px-6 py-5 text-[10px] font-black text-slate-400 uppercase text-center">Estado</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {grades.length === 0 ? <tr><td colSpan={4} className="px-6 py-20 text-center text-slate-300 italic">Sem notas.</td></tr> : grades.map(grade => (
                  <tr key={grade.id} className="hover:bg-slate-50">
                    <td className="px-6 py-5 font-black text-slate-800">{grade.studentName}</td>
                    <td className="px-6 py-5 text-slate-500 font-bold uppercase">{SUBJECTS.find(s => s.id === grade.subjectId)?.name}</td>
                    <td className={`px-6 py-5 text-center font-black text-lg ${grade.value >= 10 ? 'text-blue-600' : 'text-red-500'}`}>{grade.value.toFixed(1)}</td>
                    <td className="px-6 py-5 text-center">
                      <button onClick={() => togglePublish(grade.id, grade.published)} className={`px-4 py-2 rounded-xl text-[9px] font-black uppercase transition-all ${grade.published ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700'}`}>{grade.published ? 'Publicado' : 'Publicar'}</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default Grades;
