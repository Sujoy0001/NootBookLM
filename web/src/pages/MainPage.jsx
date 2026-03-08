import React, { useState } from 'react';
import { UploadCloud, File, MessageSquare, Send, Trash2 } from 'lucide-react';

export default function MainPage() {
  const [documents, setDocuments] = useState([
    { id: 1, name: 'Project_Requirements.pdf', type: 'pdf', date: 'Just now' },
    { id: 2, name: 'Architecture_v2.md', type: 'md', date: '2 hours ago' }
  ]);
  const [messages, setMessages] = useState([
    { role: 'assistant', text: 'Hello! I am your Notebook AI. Which document would you like to discuss today?' }
  ]);
  const [input, setInput] = useState('');

  const handleSend = (e) => {
    e.preventDefault();
    if (!input.trim()) return;
    
    // Add user message
    const newMessages = [...messages, { role: 'user', text: input }];
    setMessages(newMessages);
    setInput('');
    
    // Simulate AI response
    setTimeout(() => {
      setMessages([...newMessages, { role: 'assistant', text: 'This is a simulated response. Once the Node.js backend is connected, I will search your uploaded documents using the RAG pipeline to provide a highly accurate answer.'}]);
    }, 1000);
  };

  return (
    <div className="flex flex-1 h-[calc(100vh-70px)] overflow-hidden bg-slate-50 dark:bg-slate-900 transition-colors duration-300">
      
      {/* Sidebar: Documents */}
      <div className="glass-panel w-80 m-4 rounded-l-2xl flex flex-col p-0 overflow-hidden shadow-lg border-r border-slate-200 dark:border-white/10 shrink-0">
        <div className="p-6 border-b border-slate-200 dark:border-white/10 bg-slate-100/50 dark:bg-black/20">
          <h3 className="mb-5 text-xl font-semibold flex items-center gap-2 text-slate-800 dark:text-white">
            <File size={20} className="text-indigo-600 dark:text-indigo-400" /> Sources
          </h3>
          <button className="btn btn-secondary w-full flex justify-center py-3 bg-white hover:bg-slate-50 dark:bg-white/5 dark:hover:bg-white/10 border border-slate-200 dark:border-white/10 shadow-sm transition-all text-slate-700 dark:text-slate-200">
            <UploadCloud size={18} /> Upload PDF / MD / TXT
          </button>
        </div>
        
        <div className="flex-1 overflow-y-auto p-4 scrollbar-thin scrollbar-thumb-slate-300 dark:scrollbar-thumb-slate-700">
          <div className="text-xs uppercase text-slate-500 dark:text-slate-400 mb-4 font-semibold tracking-wider">
            Active Documents
          </div>
          {documents.map(doc => (
            <div key={doc.id} className="animate-fade-in flex flex-row items-center justify-between p-3 bg-white dark:bg-white/5 rounded-xl mb-2 border border-slate-200 dark:border-white/10 transition-all duration-200 hover:bg-slate-50 dark:hover:bg-white/10 hover:border-indigo-300 dark:hover:border-indigo-500/50 cursor-pointer group">
              <div className="flex items-center gap-3 overflow-hidden">
                <File size={16} className="text-fuchsia-500 shrink-0" />
                <div className="whitespace-nowrap overflow-hidden text-ellipsis text-sm font-medium text-slate-700 dark:text-slate-200">
                  {doc.name}
                </div>
              </div>
              <button className="btn-icon w-7 h-7 border-none bg-transparent hover:text-red-500 text-slate-400 dark:text-slate-500 transition-colors p-0 flex items-center justify-center">
                <Trash2 size={14} />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Main Area: Chat */}
      <div className="flex-1 m-4 ml-0 rounded-r-2xl p-0 flex flex-col relative bg-white dark:bg-[#0f172a] shadow-lg border border-slate-200 dark:border-white/10 overflow-hidden">
        
        {/* Top Gradient Fade */}
        <div className="absolute top-0 left-0 right-0 h-24 bg-gradient-to-b from-white via-white/80 to-transparent dark:from-[#0f172a] dark:via-[#0f172a]/80 z-10 pointer-events-none"></div>

        {/* Chat Messages */}
        <div className="flex-1 overflow-y-auto pt-24 pb-32 px-6 md:px-12 flex flex-col gap-6 scrollbar-thin scrollbar-thumb-slate-300 dark:scrollbar-thumb-slate-700">
          {messages.map((msg, idx) => (
            <div key={idx} className={`animate-fade-in flex \${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`
                max-w-[85%] md:max-w-[75%] p-5 rounded-2xl backdrop-blur-md shadow-sm leading-relaxed text-base
                \${msg.role === 'user' 
                  ? 'bg-gradient-to-br from-indigo-500 to-fuchsia-500 text-white rounded-br-md shadow-indigo-500/25 border-none' 
                  : 'bg-slate-50 dark:bg-[#1e293b] border border-slate-200 dark:border-white/5 text-slate-800 dark:text-slate-200 rounded-bl-md shadow-black/5'}
              `}>
                <div className={`flex items-center gap-2 mb-2 text-xs font-semibold uppercase tracking-widest \${msg.role === 'user' ? 'text-white/80' : 'text-indigo-600 dark:text-indigo-400'}`}>
                  {msg.role === 'user' ? 'You' : <><MessageSquare size={14} /> Notebook AI</>}
                </div>
                <div className="whitespace-pre-wrap">{msg.text}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Input Area */}
        <div className="absolute bottom-6 left-6 right-6 md:left-12 md:right-12 z-20">
          <div className="glass-panel p-2 pl-6 rounded-full border border-slate-300 dark:border-indigo-500/30 bg-white/90 dark:bg-slate-900/90 shadow-xl shadow-slate-200/50 dark:shadow-black/50 backdrop-blur-xl">
            <form className="flex gap-2 items-center" onSubmit={handleSend}>
              <input 
                className="flex-1 border-none bg-transparent shadow-none p-0 text-base text-slate-800 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-0" 
                placeholder="Ask a question about your documents..." 
                value={input}
                onChange={e => setInput(e.target.value)}
              />
              <button type="submit" className="btn btn-primary px-6 py-3 rounded-full shadow-md hover:shadow-lg transition-all flex items-center gap-2">
                <Send size={18} /> <span className="hidden sm:inline">Ask</span>
              </button>
            </form>
          </div>
        </div>
      </div>

    </div>
  );
}
