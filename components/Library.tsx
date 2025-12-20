
import React, { useState } from 'react';
import { User } from '../types';
import { SUBJECTS, EDUCATIONAL_LINKS } from '../constants';

interface LibraryProps {
  user: User;
}

const Library: React.FC<LibraryProps> = ({ user }) => {
  const [view, setView] = useState<'subjects' | 'links'>('subjects');

  return (
    <div className="space-y-6">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Biblioteca Digital</h2>
          <p className="text-slate-500">Conteúdos curriculares e externos.</p>
        </div>
        <div className="inline-flex bg-slate-200 p-1 rounded-xl">
          <button 
            onClick={() => setView('subjects')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${view === 'subjects' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-600 hover:text-slate-900'}`}
          >
            Disciplinas
          </button>
          <button 
            onClick={() => setView('links')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${view === 'links' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-600 hover:text-slate-900'}`}
          >
            Aulas & Vídeos
          </button>
        </div>
      </header>

      {view === 'subjects' ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {SUBJECTS.map((sub) => (
            <div key={sub.id} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 hover:border-blue-200 transition-all group">
              <div className="flex items-start justify-between">
                <div className="w-12 h-12 bg-slate-50 rounded-xl flex items-center justify-center text-2xl group-hover:bg-blue-50 transition-colors">
                  {sub.icon}
                </div>
                <button className="text-blue-600 opacity-0 group-hover:opacity-100 transition-opacity">
                  <span className="text-lg">➔</span>
                </button>
              </div>
              <h3 className="mt-4 font-bold text-slate-800 text-lg">{sub.name}</h3>
              <div className="mt-4 space-y-2">
                <div className="flex items-center text-xs text-slate-500">
                  <span className="mr-2">📄</span> PDF's de Aula
                </div>
                <div className="flex items-center text-xs text-slate-500">
                  <span className="mr-2">📝</span> Questionários
                </div>
                <div className="flex items-center text-xs text-slate-500">
                  <span className="mr-2">🎥</span> Mini-aulas
                </div>
              </div>
              <button className="w-full mt-6 py-2 bg-slate-50 text-slate-600 text-xs font-bold rounded-lg group-hover:bg-blue-600 group-hover:text-white transition-all uppercase tracking-wider">
                Ver Conteúdo
              </button>
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {EDUCATIONAL_LINKS.map((link, idx) => (
            <a 
              key={idx} 
              href={link.url} 
              target="_blank" 
              rel="noopener noreferrer"
              className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-center space-x-6 hover:shadow-md transition-all group"
            >
              <div className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center text-3xl group-hover:scale-105 transition-transform">
                🔗
              </div>
              <div className="flex-1">
                <h3 className="font-bold text-slate-800 group-hover:text-blue-600">{link.name}</h3>
                <p className="text-sm text-slate-500 mt-1">{link.desc}</p>
                <p className="text-xs text-blue-500 mt-2 font-medium">Aceder link externo ↗</p>
              </div>
            </a>
          ))}
        </div>
      )}
    </div>
  );
};

export default Library;
