import React from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import "../src/index.css";
import Header from "./components/Navbar";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<open />} />
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>
    </Router>
  );
}

function Landing() {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 flex flex-col items-center justify-between text-center transition-colors duration-300">
      <Header />

      <div className="p-2 flex flex-col items-center justify-center">
        <h1 className="text-7xl font-bold text-black dark:text-white sujoy1">
          Hello, <span className="text-gradient hover:scale-105 transition-transform duration-300 inline-block">NootBookLM!</span>
        </h1>

        <p className="max-w-3xl text-xl text-gray-600 dark:text-gray-300 mt-6 leading-relaxed">
          Upload PDFs, Markdown, and TXT files. Instantly ask questions, extract insights, and summarize complex topics using our advanced RAG pipeline.
        </p>

        <div className="flex gap-4 mt-8 sujoy1">
          <Link to="/login" className="bg-black dark:bg-white text-white dark:text-black px-8 py-3 rounded-xl text-lg font-medium hover:opacity-90 transition shadow-lg hover:shadow-xl cursor-pointer">
            Get Started
          </Link>
        </div>
      </div>

      <div className="flex justify-center mb-8">
         <h2 className="text-3xl italic text-gray-600 dark:text-gray-400 text-gradient hover:opacity-80 transition-opacity">
          Your AI-Powered Research Partner
        </h2>
      </div>
    </div>
  );
}