import React from "react";
import "../src/index.css";
import Header from "./components/Navbar";

export default function App() {
  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-between text-center">

      <Header />

      <div className="p-2 flex flex-col items-center justify-center">
        <h1 className="text-7xl font-bold text-black sujoy1">
          Hello, <span className="text-gradient">NootBookLM!</span>
        </h1>

        <p className="max-w-3xl text-xl text-gray-600 mt-6 leading-relaxed">
          Upload PDFs, Markdown, and TXT files. Instantly ask questions, extract insights, and summarize complex topics using our advanced RAG pipeline.
        </p>

        <div className="flex gap-4 mt-8 sujoy1">
          <button className="bg-black text-white px-8 py-3 rounded-xl text-lg font-medium hover:opacity-90 transition cursor-pointer">
            Try NotebookLM
          </button>

          <button className="bg-white border-2 border-black text-black px-8 py-3 rounded-xl text-lg font-medium hover:bg-gray-100 transition cursor-pointer">
            Login
          </button>
        </div>
      </div>

      <div className="flex justify-center mb-8">
         <h2 className="text-3xl italic text-gray-600 text-gradient">
          Your AI-Powered Research Partner
        </h2>
      </div>
    </div>
  );
}