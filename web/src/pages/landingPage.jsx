import GradientBlinds from "../ui/landingUI";
import Header from "../components/Header";
import { Link } from "react-router-dom";

export default function LandingPage() {
  return (
    <>
        <section className="relative w-full h-[calc(100vh-72.5px)] bg-black overflow-hidden">
            <div className="absolute inset-0">
                <GradientBlinds
                gradientColors={['#00ffcc', '#0066ff']}
                angle={0}
                noise={0.3}
                blindCount={12}
                blindMinWidth={50}
                spotlightRadius={0.5}
                spotlightSoftness={1}
                spotlightOpacity={1}
                mouseDampening={0.15}
                distortAmount={0}
                shineDirection="left"
                mixBlendMode="lighten"
                />
            </div>

            <div className="absolute bottom-0 left-0 z-10 p-3 md:p-10 max-w-5xl flex flex-col sujoy1">

                <p className="text-sm text-gray-300 mb-4 tracking-widest uppercase">
                  Turn Your Documents Into a Smart Chatbot — Instantly
                </p>

                <h1 className="text-white text-4xl md:text-6xl font-bold leading-tight w-full">
                    The Ultimate RAG Solution  <br /> for Effortless Chatbot Creation
                </h1>

                <div className="mt-8 flex gap-4">
                    <Link to="/register" className="bg-white text-black cursor-pointer px-6 py-3 rounded-full font-medium hover:bg-gray-200 transition">
                        Get started
                    </Link>

                    <Link to="/docs" className="border border-gray-500 cursor-pointer text-white px-6 py-3 rounded-full hover:border-white transition">
                        Read the docs
                    </Link>
                </div>

            </div>
        </section>
    </>
  );
}