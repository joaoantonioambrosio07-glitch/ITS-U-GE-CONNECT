
import React, { useState, useEffect, useRef } from 'react';

const FounderProfile: React.FC = () => {
  const [avatarUrl, setAvatarUrl] = useState<string>("https://imagizer.imageshack.com/img923/6411/zS0nWh.jpg");
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Carregar avatar do localStorage na inicialização para persistência local
  useEffect(() => {
    const savedAvatar = localStorage.getItem('founder_avatar');
    if (savedAvatar) {
      setAvatarUrl(savedAvatar);
    }
  }, []);

  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Limite de 3MB para o avatar em base64 (devido ao limite do localStorage)
      if (file.size > 3 * 1024 * 1024) {
        alert("A imagem selecionada é muito pesada. Por favor, escolhe uma imagem com menos de 3MB.");
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        setAvatarUrl(base64String);
        localStorage.setItem('founder_avatar', base64String);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="max-w-4xl mx-auto animate-fadeIn pb-20">
      <div className="bg-white rounded-[3rem] shadow-2xl border border-slate-100 overflow-hidden">
        {/* Banner com Gradiente Moderno */}
        <div className="bg-gradient-to-r from-blue-700 via-blue-600 to-indigo-800 h-32 md:h-56 w-full relative">
          <div className="absolute -bottom-16 left-8 md:left-12">
            <div 
              className="relative w-32 h-32 md:w-44 md:h-44 rounded-[2.5rem] border-8 border-white overflow-hidden bg-slate-200 shadow-2xl group cursor-pointer ring-1 ring-slate-100"
              onClick={handleAvatarClick}
              title="Clique para mudar a foto do Jorge Anselmo"
            >
              <img 
                src={avatarUrl} 
                alt="Jorge Anselmo" 
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-all duration-300 flex flex-col items-center justify-center">
                <span className="text-white text-3xl mb-1">📸</span>
                <span className="text-white text-[10px] font-black uppercase tracking-widest">Alterar Foto</span>
              </div>
            </div>
            <input 
              type="file" 
              ref={fileInputRef} 
              onChange={handleFileChange} 
              className="hidden" 
              accept="image/*"
            />
          </div>
        </div>
        
        <div className="pt-24 pb-12 px-8 md:px-16">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-slate-50 pb-8 mb-10">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <h2 className="text-4xl font-black text-slate-900 tracking-tight">Jorge Anselmo</h2>
                <div className="flex items-center bg-blue-50 text-blue-600 px-3 py-1 rounded-full gap-1.5 border border-blue-100">
                  <span className="text-xs">✔</span>
                  <span className="text-[10px] font-black uppercase tracking-widest">Fundador Verificado</span>
                </div>
              </div>
              <p className="text-blue-600 font-bold text-lg">Idealizador & Desenvolvedor Principal do ITS Uíge Connect</p>
            </div>
            <div className="bg-slate-50/80 px-8 py-5 rounded-[2rem] border border-slate-100 text-center md:text-right shadow-sm">
              <p className="text-[10px] text-slate-400 uppercase font-black tracking-[0.3em] mb-1">Nascimento</p>
              <p className="text-slate-800 font-black text-xl">23 de Março de 2010</p>
            </div>
          </div>

          <div className="space-y-8">
            <div className="relative">
              <span className="absolute -top-6 -left-4 text-7xl text-blue-200 opacity-50 font-serif">“</span>
              <p className="text-slate-700 leading-relaxed text-xl italic bg-blue-50/30 p-10 rounded-[3rem] border-l-[12px] border-blue-600 shadow-inner relative z-10">
                Jorge Anselmo é um estudante angolano visionário que acredita no poder transformador da união entre tecnologia, educação e saúde. Movido pelo sonho ambicioso de ingressar na Medicina e especializar-se em Neurocirurgia, ele dedica-se com afinco à inovação no Instituto Técnico de Saúde do Uíge.
              </p>
            </div>
            
            <div className="prose prose-slate max-w-none text-slate-600 leading-relaxed text-lg space-y-4">
              <p>
                A sua paixão pela informática levou-o a idealizar o <strong>ITS Uíge Connect</strong>, uma plataforma concebida para elevar o padrão de ensino da 10ª classe e facilitar a comunicação académica. Jorge acredita que a tecnologia deve ser um aliado fundamental para optimizar a formação profissional em Angola.
              </p>
              <p>
                Aos 14 anos, ele demonstra um compromisso social e ética invulgares, encarando este projecto como uma ferramenta de empoderamento para os seus colegas. Este sistema é o reflexo da sua dedicação em construir um futuro onde o conhecimento e a eficiência digital caminham lado a lado.
              </p>
            </div>
          </div>

          <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white border border-slate-100 p-8 rounded-[2.5rem] text-center shadow-sm hover:shadow-2xl hover:-translate-y-1 transition-all group">
              <div className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center text-3xl mx-auto mb-5 group-hover:scale-110 transition-transform">🧠</div>
              <h4 className="font-black text-slate-800 text-xs uppercase tracking-widest mb-1">Foco Académico</h4>
              <p className="text-sm text-slate-500 font-medium">Futuro Neurocirurgião</p>
            </div>
            <div className="bg-white border border-slate-100 p-8 rounded-[2.5rem] text-center shadow-sm hover:shadow-2xl hover:-translate-y-1 transition-all group">
              <div className="w-16 h-16 bg-emerald-50 rounded-2xl flex items-center justify-center text-3xl mx-auto mb-5 group-hover:scale-110 transition-transform">🇦🇴</div>
              <h4 className="font-black text-slate-800 text-xs uppercase tracking-widest mb-1">Patriotismo</h4>
              <p className="text-sm text-slate-500 font-medium">Orgulho Angolano (Uíge)</p>
            </div>
            <div className="bg-white border border-slate-100 p-8 rounded-[2.5rem] text-center shadow-sm hover:shadow-2xl hover:-translate-y-1 transition-all group">
              <div className="w-16 h-16 bg-orange-50 rounded-2xl flex items-center justify-center text-3xl mx-auto mb-5 group-hover:scale-110 transition-transform">💻</div>
              <h4 className="font-black text-slate-800 text-xs uppercase tracking-widest mb-1">Inovação</h4>
              <p className="text-sm text-slate-500 font-medium">Software p/ Educação</p>
            </div>
          </div>

          <div className="mt-20 pt-12 border-t border-slate-50 flex flex-col items-center">
             <div className="flex gap-6 mb-10">
                <button className="w-14 h-14 bg-slate-900 text-white rounded-[1.5rem] flex items-center justify-center hover:bg-blue-600 hover:shadow-xl hover:shadow-blue-500/30 transition-all text-xl">📱</button>
                <button className="w-14 h-14 bg-slate-900 text-white rounded-[1.5rem] flex items-center justify-center hover:bg-blue-600 hover:shadow-xl hover:shadow-blue-500/30 transition-all text-xl">📧</button>
                <button className="w-14 h-14 bg-slate-900 text-white rounded-[1.5rem] flex items-center justify-center hover:bg-blue-600 hover:shadow-xl hover:shadow-blue-500/30 transition-all text-xl">🌐</button>
             </div>
             <p className="text-slate-400 font-black text-[11px] uppercase tracking-[0.5em] text-center">
                "O esforço constante é o segredo do sucesso."
             </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FounderProfile;
