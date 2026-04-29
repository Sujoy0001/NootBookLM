import React from 'react';
import { BookOpen, Upload, MessageSquare, Terminal } from 'lucide-react';

export default function DocsPage() {
  return (
    <div className="min-h-screen bg-zinc-950 text-white sujoy1 flex flex-col">
      
      <div className="flex-grow flex flex-col md:flex-row max-w-7xl mx-auto w-full">
        {/* Sidebar */}
        <aside className="w-full md:w-64 border-r border-zinc-800 p-6 hidden md:block">
          <nav className="sticky top-24 space-y-8">
            <div>
              <h4 className="font-bold text-zinc-400 mb-4 uppercase tracking-wider text-sm">Getting Started</h4>
              <ul className="space-y-3">
                <li><a href="#quickstart" className="text-white hover:text-indigo-400 transition-colors">Quickstart</a></li>
                <li><a href="#authentication" className="text-zinc-400 hover:text-white transition-colors">Authentication</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-zinc-400 mb-4 uppercase tracking-wider text-sm">Core Concepts</h4>
              <ul className="space-y-3">
                <li><a href="#uploading" className="text-zinc-400 hover:text-white transition-colors">Uploading Documents</a></li>
                <li><a href="#querying" className="text-zinc-400 hover:text-white transition-colors">Querying</a></li>
                <li><a href="#limits" className="text-zinc-400 hover:text-white transition-colors">Limits & Quotas</a></li>
              </ul>
            </div>
          </nav>
        </aside>

        {/* Content */}
        <main className="flex-grow p-8 md:p-12 max-w-4xl">
          <div className="mb-12">
            <h1 className="text-5xl font-bold mb-4 sujoy2">Documentation</h1>
            <p className="text-xl text-zinc-400">Everything you need to integrate and use RAG Engine effectively.</p>
          </div>

          <section id="quickstart" className="mb-16 scroll-mt-24">
            <h2 className="text-3xl font-bold mb-6 flex items-center gap-3">
              <BookOpen className="text-indigo-400" /> Quickstart
            </h2>
            <p className="text-zinc-300 mb-6 leading-relaxed">
              Get up and running in minutes. RAG Engine is designed to be plug-and-play. You don't need to worry about vector databases, embedding models, or complex pipelines.
            </p>
            <div className="bg-zinc-900 rounded-xl p-6 border border-zinc-800 font-mono text-sm text-zinc-300">
              <p className="mb-2 text-zinc-500"># 1. Create an account and login</p>
              <p className="mb-2 text-zinc-500"># 2. Go to the Dashboard</p>
              <p className="mb-2 text-zinc-500"># 3. Upload your first document</p>
              <p className="text-zinc-500"># 4. Start asking questions!</p>
            </div>
          </section>

          <section id="authentication" className="mb-16 scroll-mt-24">
            <h2 className="text-3xl font-bold mb-6 flex items-center gap-3">
              <Terminal className="text-purple-400" /> Authentication
            </h2>
            <p className="text-zinc-300 mb-4 leading-relaxed">
              We use secure, enterprise-grade authentication backed by Firebase. You have multiple ways to access your RAG Engine workspace:
            </p>
            <ul className="list-disc list-inside text-zinc-300 mb-6 space-y-2 ml-4">
              <li><strong>Email/Password:</strong> Standard secure login with email verification.</li>
              <li><strong>Google OAuth:</strong> One-click sign in using your existing Google Workspace or Gmail account.</li>
              <li><strong>GitHub OAuth:</strong> Direct login for developers using their GitHub credentials.</li>
            </ul>
            <div className="bg-zinc-800/50 border-l-4 border-indigo-500 p-4 rounded-r-lg">
              <p className="text-sm text-zinc-300">
                <strong className="text-white">Security Note:</strong> We never store plain text passwords. All authentication tokens are handled securely via encrypted sessions.
              </p>
            </div>
          </section>

          <section id="uploading" className="mb-16 scroll-mt-24">
            <h2 className="text-3xl font-bold mb-6 flex items-center gap-3">
              <Upload className="text-emerald-400" /> Uploading Documents
            </h2>
            <p className="text-zinc-300 mb-4 leading-relaxed">
              We currently support the following file formats for direct processing:
            </p>
            <ul className="list-disc list-inside text-zinc-300 mb-6 space-y-2 ml-4">
              <li>PDF (.pdf)</li>
              <li>Markdown (.md)</li>
              <li>Text (.txt)</li>
              <li>Word (.docx)</li>
              <li>Python (.py)</li>
              <li>JavaScript (.js)</li>
              <li>TypeScript (.ts)</li>
              <li>Java (.java)</li>
              <li>C++ (.cpp)</li>
              <li>HTML (.html)</li>
              <li>CSS (.css)</li>
              <li>JSON (.json)</li>
            </ul>
            <div className="bg-zinc-800/50 border-l-4 border-yellow-500 p-4 rounded-r-lg">
              <p className="text-sm text-zinc-300">
                <strong className="text-white">Note:</strong> Maximum file size is currently limited to 5MB per file to ensure optimal processing speed.
              </p>
            </div>
          </section>

          <section id="querying" className="mb-16 scroll-mt-24">
            <h2 className="text-3xl font-bold mb-6 flex items-center gap-3">
              <MessageSquare className="text-blue-400" /> Querying Context
            </h2>
            <p className="text-zinc-300 mb-4 leading-relaxed">
              When you ask a question, our pipeline automatically retrieves the most relevant chunks from your uploaded documents and uses them to generate a precise answer.
            </p>
            <div className="bg-zinc-900 rounded-xl p-6 border border-zinc-800 mb-6">
              <h4 className="text-sm font-bold text-zinc-400 mb-3 uppercase">Best Practices for Prompts</h4>
              <ul className="space-y-3 text-sm text-zinc-300">
                <li className="flex items-start gap-2">
                  <span className="text-green-400">✓</span>
                  Be specific: "What is the revenue growth reported in Q3?"
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-red-400">✗</span>
                  Avoid vague queries: "Tell me about the company."
                </li>
              </ul>
            </div>
          </section>

          <section id="limits" className="mb-16 scroll-mt-24">
            <h2 className="text-3xl font-bold mb-6 flex items-center gap-3">
              <BookOpen className="text-red-400" /> Limits & Quotas
            </h2>
            <p className="text-zinc-300 mb-4 leading-relaxed">
              To ensure high performance for all users, we enforce the following limits on the free tier:
            </p>
            <div className="overflow-hidden rounded-xl border border-zinc-800 bg-zinc-900 mb-6">
              <table className="w-full text-left text-sm text-zinc-300">
                <thead className="bg-zinc-800 text-xs uppercase text-zinc-400">
                  <tr>
                    <th className="px-6 py-4">Resource</th>
                    <th className="px-6 py-4">Free Tier Limit</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-800">
                  <tr>
                    <td className="px-6 py-4 font-medium text-white">Total Storage</td>
                    <td className="px-6 py-4">5 MB total</td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4 font-medium text-white">Queries</td>
                    <td className="px-6 py-4">10 queries / day</td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4 font-medium text-white">Rate Limit</td>
                    <td className="px-6 py-4">5 requests / minute</td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4 font-medium text-white">Url Support</td>
                    <td className="px-6 py-4">Yes</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <p className="text-zinc-400 text-sm italic">
              Need more? Check out our Pricing page to upgrade to the Pro or Enterprise tiers for unlimited queries and massive file support.
            </p>
          </section>

        </main>
      </div>
    </div>
  );
}
