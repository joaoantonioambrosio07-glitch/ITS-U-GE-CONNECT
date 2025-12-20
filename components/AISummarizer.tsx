
import React, { useState } from 'react';
import { getStudySummary } from '../services/geminiService';

const AISummarizer: React.FC = () => {
  const [topic, setTopic] = useState('');
  const [summary, setSummary] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!topic.trim()) return;

    setIsLoading(true);
    setError('');
    setSummary('');

    try {
      const result = await getStudySummary(topic);
      if (result) {
        setSummary(result);
      } else {
        setError("Não foi possível gerar o resumo. Tente novamente.");
      }
    } catch (err) {
      setError("Ocorreu um erro ao comunicar com a IA. Verifique sua conexão.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <header className="text-center">
        <div className="inline-block p-3 bg-blue-100 rounded-full mb-4">
          <span className="text-3xl">✨</span>
        </div>
        <h2 className="text-2xl font-bold text-slate-800">Resumo Inteligente com IA</h2>
        <p className="text-slate-500 mt-2">Introduz um tema da 10ª classe para obteres uma explicação simplificada.</p>
      </header>

      <form onSubmit={handleGenerate} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 space-y-4">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">Tema ou Conteúdo</label>
          <input 
            type="text"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            placeholder="Ex: Fotossíntese, Equações de 2º grau, Sistema Circulatório..."
            className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none"
            disabled={isLoading}
          />
        </div>
        <button 
          type="submit"
          disabled={isLoading || !topic.trim()}
          className="w-full bg-blue-600 text-white py-3 rounded-xl font-bold hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg shadow-blue-200"
        >
          {isLoading ? (
            <span className="flex items-center justify-center">
              <svg className="animate-spin h-5 w-5 mr-3 border-2 border-white/30 border-t-white rounded-full" viewBox="0 0 24 24"></svg>
              Processando Resumo...
            </span>
          ) : 'Gerar Resumo Educativo'}
        </button>
      </form>

      {error && (
        <div className="bg-red-50 text-red-600 p-4 rounded-xl border border-red-100 text-sm">
          ⚠️ {error}
        </div>
      )}

      {summary && (
        <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 prose prose-slate max-w-none animate-slideUp">
          <div className="flex justify-between items-center mb-6 border-b pb-4">
            <h3 className="text-xl font-bold text-slate-800 m-0">Resultado da IA</h3>
            <button 
              onClick={() => window.print()}
              className="text-xs text-blue-600 font-medium hover:underline"
            >
              Imprimir / PDF
            </button>
          </div>
          <div className="whitespace-pre-wrap text-slate-700 leading-relaxed">
            {summary}
          </div>
          <div className="mt-8 pt-6 border-t border-slate-100 text-xs text-slate-400 italic">
            * Este resumo foi gerado por IA para fins de estudo. Não substitui o manual escolar.
          </div>
        </div>
      )}
    </div>
  );
};

export default AISummarizer;
