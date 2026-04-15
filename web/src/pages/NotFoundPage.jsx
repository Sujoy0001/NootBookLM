import { Link } from "react-router-dom";

export default function NotFoundPage() {
  return (
    <div className="h-full w-full flex items-center justify-center bg-[#121113] text-white sujoy2">
      
      <div className="text-center px-6">
        
        {/* 404 */}
        <h1 className="text-7xl font-bold mb-4 tracking-tight">
          404
        </h1>

        {/* Message */}
        <p className="text-zinc-400 text-lg mb-6">
          Page not found. The page you’re looking for doesn’t exist.
        </p>

        {/* Button */}
        <Link
          to="/app"
          className="inline-block px-6 py-2.5 rounded bg-white text-black font-medium hover:bg-gray-200 transition"
        >
          Go back home
        </Link>

      </div>
    </div>
  );
}