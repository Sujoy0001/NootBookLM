import React from "react";
import { Bot, Smile } from "lucide-react";

export default function Header() {
  return (
    <header className="w-full border-b border-gray-200 bg-white sujoy1">
      <div className="max-w-7xl mx-auto flex items-center justify-between px-6 py-3">

        <div className="flex items-center gap-2 text-2xl font-semibold">
          NotebookLM
        </div>

        <nav className="flex items-center gap-8 text-lg">

          <a href="#" className="font-medium underline underline-offset-4 text-gray-900">
            Overview
          </a>

          <a href="#" className="font-medium hover:text-green-800 text-gray-900">
            Login
          </a>

          <button className="border border-black px-5 py-2 rounded-xl bg-black text-white cursor-pointer transition">
            Register
          </button>

        </nav>

      </div>
    </header>
  );
}