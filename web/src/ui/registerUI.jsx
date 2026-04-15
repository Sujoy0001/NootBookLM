import React from "react";
import { LuBrainCircuit } from "react-icons/lu";

export default function RegisterUI() {
    return (
        <section className="relative w-full max-w-xl h-screen bg-black overflow-hidden flex items-center justify-center sujoy1">

            <div className="absolute inset-0">
                <div className="w-full h-full bg-linear-to-br from-teal-500/20 via-black to-orange-500/20"></div>
            </div>

            <div className="absolute inset-0 opacity-70 
                bg-[radial-gradient(circle,#22c55e_1px,transparent_1px)] 
                bg-[size:14px_14px]">
            </div>

            <div className="absolute inset-0 bg-black/20"></div>

            <div className="relative z-10 flex flex-col items-center text-center px-6">

                <div className="flex items-center justify-center mb-6">
                    <LuBrainCircuit className="text-6xl" />
                </div>

                <h1 className="text-white text-3xl md:text-5xl font-bold leading-tight max-w-2xl">
                    Build on RAG without <br />
                    slowing down.
                </h1>

            </div>
        </section>
    )
}