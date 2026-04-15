import '../index.css'
import React from 'react';
import { Link } from 'react-router-dom';

const navLinks = ["Product", "Solutions", "Docs", "Pricing", "Resources"];

const LoginIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4" />
    <polyline points="10 17 15 12 10 7" />
    <line x1="15" y1="12" x2="3" y2="12" />
  </svg>
);

const RegisterIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
    <circle cx="9" cy="7" r="4" />
    <line x1="19" y1="8" x2="19" y2="14" />
    <line x1="22" y1="11" x2="16" y2="11" />
  </svg>
);

export default function SaasAIHeader() {
  return (
    <header className="bg-black border-b border-white/20 px-8 py-3 flex items-center justify-between z-90 sujoy1">
      <div className="flex items-center gap-12">
        <span className="text-white text-4xl font-bold tracking-wide sujoy3">
          RAGENGINE
        </span>

        <nav className="flex items-center gap-0.5">
          {navLinks.map((link) => (
            <a
              key={link}
              href="#"
              className="text-[#b0b0b0] px-3 py-1.5 rounded-md hover:text-white hover:bg-white/5 transition-colors duration-150 no-underline"
            >
              {link}
            </a>
          ))}
        </nav>
      </div>

      <div className="flex items-center gap-2">
        <Link to="/login" className="flex items-center text-[#c8c8c8] text-md px-7.5 py-2.5 rounded-full border-2 border-white/20 hover:border-white/40 hover:text-white transition-colors duration-150 bg-transparent cursor-pointer">
          Log in
        </Link>

        <Link to="/register" className="flex items-center text-black text-md font-medium px-7.5 py-2.5 rounded-full bg-white hover:bg-gray-200 transition-colors duration-150 cursor-pointer">
          Register
        </Link>
      </div>
    </header>
  );
}