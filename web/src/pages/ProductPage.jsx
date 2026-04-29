import React from 'react';
import { Zap, FileText, Lock, Cpu, Database, Search } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function ProductPage() {
  return (
    <div className="min-h-screen bg-black text-white sujoy1">
      <div className="max-w-4xl mx-auto px-8 py-14">
        {/* Hero Section */}
        <div className="mb-20 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6 sujoy2">
            The RAG Engine
          </h1>
          <p className="text-xl text-gray-400 mb-8">
            Upload any document and interact with it instantly using Retrieval-Augmented Generation.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-12">
          <FeatureCard 
            icon={<FileText className="w-6 h-6 text-white" />}
            title="Multi-Format Support"
            description="Upload PDF, TXT, or Markdown files easily."
          />
          <FeatureCard 
            icon={<Zap className="w-6 h-6 text-white" />}
            title="Instant Retrieval"
            description="Ask questions and get answers instantly without hallucinations."
          />
          <FeatureCard 
            icon={<Lock className="w-6 h-6 text-white" />}
            title="Enterprise Security"
            description="Your documents are encrypted at rest and in transit."
          />
          <FeatureCard 
            icon={<Search className="w-6 h-6 text-white" />}
            title="Semantic Search"
            description="Find exactly what you mean using advanced vector similarity."
          />
        </div>
      </div>
    </div>
  );
}

function FeatureCard({ icon, title, description }) {
  return (
    <div className="flex flex-col gap-2 text-lg sujoy2">
      <div className="mb-2">
        {icon}
      </div>
      <h3 className="text-xl font-semibold">{title}</h3>
      <p className="text-gray-400 text-md">{description}</p>
    </div>
  );
}
