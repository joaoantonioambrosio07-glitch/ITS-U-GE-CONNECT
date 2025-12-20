
import React from 'react';

const FounderProfile: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto animate-fadeIn">
      <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="bg-blue-600 h-32 md:h-48 w-full relative">
          <div className="absolute -bottom-16 left-8 md:left-12">
            <div className="w-32 h-32 md:w-40 md:h-40 rounded-2xl border-4 border-white overflow-hidden bg-slate-200 shadow-lg">
              <img 
                src="https://imagizer.imageshack.com/img923/6411/zS0nWh.jpg" 
                alt="Jorge Anselmo" 
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
        
        <div className="pt-20 pb-12 px-8 md:px-12">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-50 pb-6 mb-8">
            <div>
              <h2 className="text-3xl font-bold text-slate-800">Jorge Anselmo</h2>
              <p className="text-blue-600 font-medium">Fundador & Desenvolvedor do ITS Uíge Connect</p>
            </div>
            <div className="text-left md:text-right">
              <p className="text-xs text-slate-400 uppercase font-bold tracking-widest">Nascimento</p>
              <p className="text-slate-700 font-semibold">23 de Março de 2010</p>
            </div>
          </div>

          <div className="prose prose-slate max-w-none">
            <p className="text-slate-700 leading-relaxed text-lg italic bg-slate-50 p-6 rounded-2xl border-l-4 border-blue-500">
              Jorge Anselmo é um estudante angolano visionário que acredita no poder transformador da união entre tecnologia, educação e saúde. Nascido a 23 de Março de 2010, Jorge dedica-se com afinco aos seus estudos no Instituto Técnico de Saúde do Uíge, movido pelo sonho ambicioso de ingressar na Medicina e especializar-se em Neurocirurgia. A sua paixão pela inovação tecnológica levou-o a idealizar e criar o ITS Uíge Connect, uma plataforma concebida para elevar o padrão de ensino e facilitar a comunicação académica entre colegas e professores. Com uma visão focada no futuro, ele procura utilizar as ferramentas digitais para optimizar a formação em saúde, demonstrando um profundo compromisso social e ética profissional desde tenra idade. Jorge encara este projecto como um passo fundamental para apoiar a sua geração, acreditando que o esforço constante e a aplicação prática do conhecimento são as chaves para o progresso de Angola. Esta aplicação é o reflexo da sua dedicação em construir um sistema educativo mais moderno e eficiente para todos os alunos da 10ª classe.
            </p>
          </div>

          <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-slate-50 p-6 rounded-2xl text-center">
              <span className="text-2xl mb-2 block">🧠</span>
              <h4 className="font-bold text-slate-800 text-sm">Especialização</h4>
              <p className="text-xs text-slate-500">Futuro Neurocirurgião</p>
            </div>
            <div className="bg-slate-50 p-6 rounded-2xl text-center">
              <span className="text-2xl mb-2 block">🇦🇴</span>
              <h4 className="font-bold text-slate-800 text-sm">Nacionalidade</h4>
              <p className="text-xs text-slate-500">Angolana</p>
            </div>
            <div className="bg-slate-50 p-6 rounded-2xl text-center">
              <span className="text-2xl mb-2 block">💻</span>
              <h4 className="font-bold text-slate-800 text-sm">Interesse</h4>
              <p className="text-xs text-slate-500">Tecnologia & Saúde</p>
            </div>
          </div>
        </div>
      </div>
      
      <p className="text-center text-slate-400 text-xs mt-8">
        "O conhecimento é a única ferramenta que ninguém pode nos tirar."
      </p>
    </div>
  );
};

export default FounderProfile;
