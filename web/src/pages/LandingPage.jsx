import React from 'react';
import { Link } from 'react-router-dom';
import { FileText, MessagesSquare, UploadCloud, Zap } from 'lucide-react';

export default function LandingPage() {
  return (
    <div className="flex-1 flex flex-col items-center justify-center container mx-auto px-6 py-20 pb-32">
      
      {/* Hero Section */}
      <div className="text-center max-w-4xl mx-auto mb-20 animate-fade-in flex flex-col items-center">
        <div className="inline-flex flex-row items-center px-4 py-2 rounded-full mb-8 text-sm text-slate-600 dark:text-slate-300 bg-white/40 dark:bg-white/5 border border-slate-200 dark:border-white/10 backdrop-blur-md shadow-sm">
          <Zap size={16} className="mr-2 text-fuchsia-500 dark:text-fuchsia-400" />
          <span className="font-medium">The smart workspace for your documents</span>
        </div>
        
        <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-8 text-slate-900 dark:text-white leading-tight">
          Chat with your <br className="hidden md:block"/>
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 via-purple-500 to-fuchsia-500 dark:from-indigo-400 dark:via-purple-400 dark:to-fuchsia-400">
            Knowledge Base.
          </span>
        </h1>
        
        <p className="text-lg md:text-xl text-slate-600 dark:text-slate-300 mb-10 max-w-2xl mx-auto leading-relaxed">
          Upload PDFs, Markdown, and TXT files. Instantly ask questions, extract insights, and summarize complex topics using our advanced RAG pipeline.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center w-full">
          <Link to="/register" className="btn btn-primary px-8 py-4 text-lg w-full sm:w-auto shadow-lg shadow-indigo-500/30 hover:shadow-indigo-500/50">
            Start for free
          </Link>
          <a href="#features" className="btn btn-secondary px-8 py-4 text-lg w-full sm:w-auto bg-white/50 hover:bg-white/80 dark:bg-white/5 dark:hover:bg-white/10 backdrop-blur-md">
            Learn More
          </a>
        </div>
      </div>

      {/* Features Section */}
      <div id="features" className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full max-w-5xl animate-fade-in delay-200">
        
        <div className="glass-panel p-8 group hover:-translate-y-2 transition-all duration-300 hover:shadow-xl hover:shadow-indigo-500/10 dark:hover:shadow-indigo-500/20">
          <div className="w-14 h-14 rounded-2xl mb-6 bg-indigo-100 dark:bg-indigo-500/10 border border-indigo-200 dark:border-indigo-500/20 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
            <UploadCloud size={28} className="text-indigo-600 dark:text-indigo-400" />
          </div>
          <h3 className="text-xl font-bold mb-3 text-slate-900 dark:text-white">Any Document</h3>
          <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Upload up to 50MB of PDFs, Markdown, or text files directly to your secure workspace.</p>
        </div>

        <div className="glass-panel p-8 group hover:-translate-y-2 transition-all duration-300 hover:shadow-xl hover:shadow-fuchsia-500/10 dark:hover:shadow-fuchsia-500/20">
          <div className="w-14 h-14 rounded-2xl mb-6 bg-fuchsia-100 dark:bg-fuchsia-500/10 border border-fuchsia-200 dark:border-fuchsia-500/20 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
            <MessagesSquare size={28} className="text-fuchsia-600 dark:text-fuchsia-400" />
          </div>
          <h3 className="text-xl font-bold mb-3 text-slate-900 dark:text-white">Instant Chat</h3>
          <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Engage in natural conversation with your data. Get exact citations and profound insights in seconds.</p>
        </div>

        <div className="glass-panel p-8 group hover:-translate-y-2 transition-all duration-300 hover:shadow-xl hover:shadow-slate-500/10 dark:hover:shadow-slate-500/20">
          <div className="w-14 h-14 rounded-2xl mb-6 bg-slate-100 dark:bg-slate-500/10 border border-slate-200 dark:border-slate-500/30 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
            <FileText size={28} className="text-slate-700 dark:text-slate-300" />
          </div>
          <h3 className="text-xl font-bold mb-3 text-slate-900 dark:text-white">API First</h3>
          <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Fully documented API routes. Integrate our semantic search and ingestion pipeline into your apps.</p>
        </div>

      </div>
    </div>
  );
}
