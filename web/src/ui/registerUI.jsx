import React from "react";
import { LuBrainCircuit } from "react-icons/lu";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function RegisterUI() {
    const navigate = useNavigate();
    const handleBackToHome = () => navigate("/");

    return (
        <section className="fixed w-full max-w-xl min-h-[calc(100vh-4rem)] bg-black flex items-center justify-center overflow-hidden">

            {/* Back Button */}
            <button
                onClick={handleBackToHome}
                className="fixed top-22 left-6 z-50 flex items-center gap-2 px-8 py-2 cursor-pointer
                bg-white/10 hover:bg-white/20 text-white rounded-lg
                transition backdrop-blur-md border border-white/10
                focus:outline-none focus:ring-2 focus:ring-white/40"
            >
                <ArrowLeft size={18} />
                <span className="text-sm font-medium">Back</span>
            </button>

            {/* Background Gradient */}
            <div className="absolute inset-0 bg-gradient-to-br from-teal-500/20 via-black to-orange-500/20 pointer-events-none" />

            {/* Grid Pattern */}
            <div className="absolute inset-0 opacity-40 pointer-events-none
                bg-[radial-gradient(circle,#22c55e_1px,transparent_1px)] 
                bg-[size:16px_16px]" />

            {/* Content */}
            <div className="relative z-10 flex flex-col items-center text-center px-6 w-full max-w-xl">

                <LuBrainCircuit className="text-5xl md:text-6xl mb-6 text-white" />

                <h1 className="text-white text-3xl md:text-5xl font-bold leading-tight">
                    Build on RAG without <br />
                    slowing down.
                </h1>

                <p className="text-gray-400 mt-4 max-w-md">
                    Create your account and start building AI-powered apps faster and smarter.
                </p>

            </div>
        </section>
    );
}