import React from 'react';
import { GraduationCap, Briefcase, Building2 } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function SolutionsPage() {
  return (
    <div className="min-h-screen bg-black text-white sujoy1">
      <div className="max-w-4xl mx-auto px-8 py-24">
        {/* Header Section */}
        <div className="mb-20 text-left">
          <h1 className="text-4xl md:text-5xl font-bold mb-6 sujoy3">
            Solutions
          </h1>
          <p className="text-xl text-gray-400">
            RAG Engine adapts to your specific workflow and needs.
          </p>
        </div>

        {/* Solutions List */}
        <div className="space-y-16">
          <SolutionItem 
            icon={<GraduationCap className="w-8 h-8 text-white" />}
            title="Academic Research"
            description="Digest massive academic papers, journals, and textbooks in minutes. Extract citations and summarize methodologies for your literature review."
          />
          
          <SolutionItem 
            icon={<Briefcase className="w-8 h-8 text-white" />}
            title="Business Intelligence"
            description="Turn lengthy financial reports and competitor analysis into actionable intelligence. Ask direct questions about revenue numbers or strategic initiatives."
          />
          
          <SolutionItem 
            icon={<Building2 className="w-8 h-8 text-white" />}
            title="Legal & Compliance"
            description="Navigate complex contracts and compliance documents with ease. Find specific clauses and assess risks instantly."
          />
        </div>
        
        {/* CTA */}
        <div className="mt-24 pt-12 border-t border-gray-800">
          <p className="text-lg mb-6">Ready to improve your workflow?</p>
          <Link to="/login" className="bg-white text-black px-6 py-2 rounded-md font-medium hover:bg-gray-200 transition">
            Start using RAG Engine
          </Link>
        </div>
      </div>
    </div>
  );
}

function SolutionItem({ icon, title, description }) {
  return (
    <div className="flex flex-col md:flex-row gap-6 items-start">
      <div className="flex-shrink-0 p-4 bg-gray-900 rounded-lg">
        {icon}
      </div>
      <div>
        <h3 className="text-2xl font-bold mb-2">{title}</h3>
        <p className="text-gray-400 leading-relaxed">{description}</p>
      </div>
    </div>
  );
}
