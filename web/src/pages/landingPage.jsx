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

            <div className="absolute bottom-0 left-0 z-10 p-10 max-w-4xl flex flex-col sujoy1">

                <p className="text-sm text-gray-300 mb-4 tracking-widest uppercase">
                    A Modern AI Platform
                </p>

                <h1 className="text-white text-4xl md:text-6xl font-semibold leading-tight max-w-3xl">
                    Instant RAG Infrastructure <br />
                    for Teams and Applications
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