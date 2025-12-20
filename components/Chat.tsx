
import React, { useState, useRef, useEffect } from 'react';
import { User, ChatMessage } from '../types';

interface ChatProps {
  user: User;
}

const Chat: React.FC<ChatProps> = ({ user }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputText, setInputText] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    const newMessage: ChatMessage = {
      id: Date.now().toString(),
      senderId: user.id,
      senderName: user.name,
      text: inputText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages([...messages, newMessage]);
    setInputText('');

    // Simulate auto-reply for demo
    setTimeout(() => {
      const reply: ChatMessage = {
        id: (Date.now() + 1).toString(),
        senderId: 'system',
        senderName: 'Colega de Turma',
        text: 'Olá! Estás a estudar para a prova de Biologia?',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, reply]);
    }, 1500);
  };

  return (
    <div className="flex flex-col h-[calc(100vh-120px)] bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
      {/* Chat Header */}
      <header className="p-4 border-b bg-slate-50 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold">
            G
          </div>
          <div>
            <h3 className="font-bold text-slate-800">Bate-papo Geral</h3>
            <p className="text-xs text-green-500 font-medium">● 42 online</p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <button className="p-2 hover:bg-slate-200 rounded-full transition-colors text-slate-600" title="Chamada de Voz">
            📞
          </button>
          <button className="p-2 hover:bg-slate-200 rounded-full transition-colors text-slate-600" title="Videochamada">
            📹
          </button>
        </div>
      </header>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] bg-slate-50/50">
        {messages.length === 0 && (
          <div className="flex flex-col items-center justify-center h-full text-slate-400 space-y-2">
            <span className="text-4xl">💬</span>
            <p className="text-sm">Inicia uma conversa com colegas e professores.</p>
          </div>
        )}
        {messages.map((msg) => (
          <div key={msg.id} className={`flex ${msg.senderId === user.id ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[70%] ${msg.senderId === user.id ? 'bg-blue-600 text-white rounded-t-2xl rounded-bl-2xl shadow-blue-100' : 'bg-white text-slate-800 rounded-t-2xl rounded-br-2xl border border-slate-100'} p-3 shadow-sm`}>
              {msg.senderId !== user.id && (
                <p className="text-[10px] font-bold text-blue-500 uppercase mb-1">{msg.senderName}</p>
              )}
              <p className="text-sm">{msg.text}</p>
              <p className={`text-[9px] mt-1 text-right ${msg.senderId === user.id ? 'text-blue-100' : 'text-slate-400'}`}>
                {msg.timestamp}
              </p>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <form onSubmit={handleSendMessage} className="p-4 bg-white border-t flex items-center space-x-3">
        <button type="button" className="p-2 text-slate-400 hover:text-blue-600 transition-colors">
          🎙️
        </button>
        <button type="button" className="p-2 text-slate-400 hover:text-blue-600 transition-colors">
          📎
        </button>
        <input 
          type="text"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder="Escreve uma mensagem..."
          className="flex-1 bg-slate-100 border-none rounded-full px-4 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
        />
        <button 
          type="submit"
          className="bg-blue-600 text-white w-10 h-10 rounded-full flex items-center justify-center hover:bg-blue-700 transition-all shadow-lg disabled:opacity-50"
          disabled={!inputText.trim()}
        >
          ➔
        </button>
      </form>
    </div>
  );
};

export default Chat;
