
import React, { useState } from 'react';
import { User, UserRole, Grade } from '../types';
import { SUBJECTS, MOCK_TURMAS } from '../constants';

interface GradesProps {
  user: User;
  grades: Grade[];
  onUpdate: (gs: Grade[]) => void;
}

const Grades: React.FC<GradesProps> = ({ user, grades, onUpdate }) => {
  const [showAdd, setShowAdd] = useState(false);
  const [selectedTurma, setSelectedTurma] = useState(user.turma || MOCK_TURMAS[0]);
  const [formData, setFormData] = useState({
    studentName: '',
    subjectId: SUBJECTS[0].id,
    value: 10,
    term: 1,
    type: 'TEST' as Grade['type'],
    comment: ''
  });

  const mockStudents = {
    'A1': ['António José', 'Beatriz Silva', 'Carlos Manuel', 'Delfina Pinto'],
    'A2': ['Emanuel Costa', 'Filomena Dias', 'Gelson Cruz', 'Helena Jorge'],
    'A3': ['Iracelma Neto', 'João Paulo', 'Kianda Luz', 'Leonel Varela'],
    'A4': ['Margarida Faria', 'Nuno Miguel', 'Osvaldo Luís', 'Paula Santos'],
  };

  const currentStudents = mockStudents[selectedTurma as keyof typeof mockStudents] || [];

  const handleAddGrade = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.studentName) return;
    
    const newGrade: Grade = {
      id: Date.now().toString(),
      studentId: formData.studentName.toLowerCase().replace(/\s+/g, '_'),
      studentName: formData.studentName,
      subjectId: formData.subjectId,
      value: formData.value,
      term: formData.term,
      type: formData.type,
      comment: formData.comment,
      date: new Date().toISOString(),
      published: false
    };
    onUpdate([...grades, newGrade]);
    setShowAdd(false);
  };

  const togglePublish = (id: string) => {
    onUpdate(grades.map(g => g.id === id ? { ...g, published: !g.published } : g));
  };

  const publishAll = () => {
    onUpdate(grades.map(g => ({ ...g, published: true })));
  };

  // Logic to calculate status and averages per subject for the student
  const getStudentGradesBySubject = () => {
    const studentGrades = grades.filter(g => g.published && g.studentId === user.id);
    const subjectsMap: Record<string, { continuous: number[], tests: number[], exams: number[] }> = {};

    studentGrades.forEach(g => {
      if (!subjectsMap[g.subjectId]) {
        subjectsMap[g.subjectId] = { continuous: [], tests: [], exams: [] };
      }
      if (g.type === 'CONTINUOUS') subjectsMap[g.subjectId].continuous.push(g.value);
      if (g.type === 'TEST') subjectsMap[g.subjectId].tests.push(g.value);
      if (g.type === 'EXAM') subjectsMap[g.subjectId].exams.push(g.value);
    });

    return subjectsMap;
  };

  const filteredGradesForTeacher = grades.filter(g => g.studentId.includes(''));

  return (
    <div className="space-y-6 animate-fadeIn">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">
            {user.role === UserRole.ALUNO ? 'Minhas Notas Oficiais' : 'Lançamento de Notas'}
          </h2>
          <p className="text-slate-500">
            {user.role === UserRole.ALUNO 
              ? 'Área restrita para consulta de resultados académicos.' 
              : 'Registo de avaliações e publicação de pautas.'}
          </p>
        </div>
        {user.role === UserRole.PROFESSOR && (
          <div className="flex space-x-2">
            <button 
              onClick={publishAll}
              className="bg-blue-600 text-white px-4 py-2 rounded-xl text-sm font-bold shadow-lg hover:bg-blue-700 transition-all"
            >
              🚀 Publicar Pautas
            </button>
            <button 
              onClick={() => setShowAdd(!showAdd)}
              className="bg-green-600 text-white px-4 py-2 rounded-xl text-sm font-bold shadow-lg hover:bg-green-700 transition-all"
            >
              {showAdd ? 'Cancelar' : '+ Nova Nota'}
            </button>
          </div>
        )}
      </header>

      {user.role === UserRole.ALUNO ? (
        <div className="space-y-6">
          <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
            <table className="w-full text-left">
              <thead className="bg-slate-900 text-white">
                <tr>
                  <th className="px-4 py-4 text-xs font-bold uppercase tracking-wider">Disciplina</th>
                  <th className="px-4 py-4 text-xs font-bold uppercase tracking-wider text-center">Contínua</th>
                  <th className="px-4 py-4 text-xs font-bold uppercase tracking-wider text-center">Prova Prof.</th>
                  <th className="px-4 py-4 text-xs font-bold uppercase tracking-wider text-center">Trimestral</th>
                  <th className="px-4 py-4 text-xs font-bold uppercase tracking-wider text-center">Média</th>
                  <th className="px-4 py-4 text-xs font-bold uppercase tracking-wider text-center">Observação</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {SUBJECTS.map(subject => {
                  const subjectGrades = grades.filter(g => g.published && g.studentId === user.id && g.subjectId === subject.id);
                  const cont = subjectGrades.filter(g => g.type === 'CONTINUOUS').map(g => g.value);
                  const tests = subjectGrades.filter(g => g.type === 'TEST').map(g => g.value);
                  const exams = subjectGrades.filter(g => g.type === 'EXAM').map(g => g.value);
                  
                  const avg = subjectGrades.length > 0 ? subjectGrades.reduce((a, b) => a + b.value, 0) / subjectGrades.length : 0;
                  const status = avg === 0 ? '---' : avg >= 10 ? 'APROVADO' : 'REPROVADO';

                  return (
                    <tr key={subject.id} className="hover:bg-slate-50 transition-colors">
                      <td className="px-4 py-4">
                        <div className="flex items-center space-x-3">
                          <span className="text-xl">{subject.icon}</span>
                          <span className="font-bold text-slate-700 text-sm">{subject.name}</span>
                        </div>
                      </td>
                      <td className="px-4 py-4 text-center font-medium text-slate-600">
                        {cont.length > 0 ? cont.join(' | ') : '---'}
                      </td>
                      <td className="px-4 py-4 text-center font-medium text-slate-600">
                        {tests.length > 0 ? tests.join(' | ') : '---'}
                      </td>
                      <td className="px-4 py-4 text-center font-medium text-slate-600">
                        {exams.length > 0 ? exams.join(' | ') : '---'}
                      </td>
                      <td className={`px-4 py-4 text-center font-black text-lg ${avg >= 10 ? 'text-blue-600' : avg > 0 ? 'text-red-500' : 'text-slate-300'}`}>
                        {avg > 0 ? avg.toFixed(1) : '---'}
                      </td>
                      <td className="px-4 py-4 text-center">
                        {status !== '---' && (
                          <span className={`px-3 py-1 rounded-full text-[10px] font-black tracking-widest ${status === 'APROVADO' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                            {status}
                          </span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          <div className="bg-blue-600 rounded-2xl p-6 text-white shadow-xl shadow-blue-100 flex items-center justify-between">
             <div>
                <p className="text-blue-100 text-xs font-bold uppercase tracking-widest mb-1">Média Global do Aluno</p>
                <h3 className="text-4xl font-black">
                  {(grades.filter(g => g.published && g.studentId === user.id).reduce((a, b) => a + b.value, 0) / (grades.filter(g => g.published && g.studentId === user.id).length || 1)).toFixed(2)}
                </h3>
             </div>
             <div className="text-6xl opacity-20">🎓</div>
          </div>
        </div>
      ) : (
        /* Teacher View */
        <div className="space-y-6">
          <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm space-y-4">
            <div className="flex items-center space-x-2 overflow-x-auto pb-2">
              <span className="text-xs font-bold text-slate-400 uppercase whitespace-nowrap mr-2">Turmas Disponíveis:</span>
              {MOCK_TURMAS.map(t => (
                <button 
                  key={t}
                  onClick={() => setSelectedTurma(t)}
                  className={`px-6 py-2 rounded-xl text-sm font-bold whitespace-nowrap transition-all ${selectedTurma === t ? 'bg-slate-800 text-white shadow-md' : 'text-slate-500 hover:bg-slate-50'}`}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>

          {showAdd && (
            <form onSubmit={handleAddGrade} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 animate-slideDown space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Selecionar Aluno</label>
                  <select 
                    required
                    value={formData.studentName}
                    onChange={e => setFormData({...formData, studentName: e.target.value})}
                    className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl"
                  >
                    <option value="">Escolha um aluno de {selectedTurma}...</option>
                    {currentStudents.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Disciplina</label>
                  <select 
                    value={formData.subjectId}
                    onChange={e => setFormData({...formData, subjectId: e.target.value})}
                    className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl"
                  >
                    {SUBJECTS.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Nota (0 - 20)</label>
                  <input 
                    required
                    type="number"
                    min="0"
                    max="20"
                    step="0.1"
                    value={formData.value}
                    onChange={e => setFormData({...formData, value: Number(e.target.value)})}
                    className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl font-bold text-blue-600"
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Trimestre</label>
                  <select 
                    value={formData.term}
                    onChange={e => setFormData({...formData, term: Number(e.target.value)})}
                    className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl"
                  >
                    <option value={1}>1º Trimestre</option>
                    <option value={2}>2º Trimestre</option>
                    <option value={3}>3º Trimestre</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Tipo de Avaliação</label>
                  <select 
                    value={formData.type}
                    onChange={e => setFormData({...formData, type: e.target.value as Grade['type']})}
                    className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl"
                  >
                    <option value="CONTINUOUS">Avaliação Contínua</option>
                    <option value="TEST">Prova do Professor</option>
                    <option value="EXAM">Prova Trimestral</option>
                  </select>
                </div>
              </div>
              <button type="submit" className="w-full bg-green-600 text-white py-3 rounded-xl font-bold hover:bg-green-700 shadow-lg">
                Confirmar Lançamento
              </button>
            </form>
          )}

          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
            <table className="w-full text-left">
              <thead className="bg-slate-50 border-b border-slate-100">
                <tr>
                  <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Aluno</th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Disciplina</th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-center">Nota</th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-center">Estado</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {filteredGradesForTeacher.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="px-6 py-10 text-center text-slate-400 italic">Nenhuma nota registada.</td>
                  </tr>
                ) : (
                  filteredGradesForTeacher.map(grade => (
                    <tr key={grade.id} className="hover:bg-slate-50 transition-colors">
                      <td className="px-6 py-4 font-bold text-slate-800 text-sm">{grade.studentName}</td>
                      <td className="px-6 py-4 text-slate-600 text-sm">{SUBJECTS.find(s => s.id === grade.subjectId)?.name}</td>
                      <td className={`px-6 py-4 text-center font-bold text-lg ${grade.value >= 10 ? 'text-blue-600' : 'text-red-500'}`}>{grade.value.toFixed(1)}</td>
                      <td className="px-6 py-4 text-center">
                        <button 
                          onClick={() => togglePublish(grade.id)}
                          className={`px-3 py-1 rounded-lg text-[10px] font-bold ${grade.published ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700'}`}
                        >
                          {grade.published ? '✓ PUBLICADO' : '📤 PUBLICAR'}
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default Grades;
