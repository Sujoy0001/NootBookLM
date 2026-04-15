import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { 
  signInWithPopup, 
  createUserWithEmailAndPassword 
} from "firebase/auth";
import { Mail, Lock, ArrowLeft } from "lucide-react";
import { FaGoogle, FaGithub } from "react-icons/fa";
import { auth, googleProvider, githubProvider } from "../lib/firebase";
import RegisterUI from "../ui/registerUI";

const GoogleIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05" />
    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
  </svg>
);
 
const GitHubIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0 1 12 6.844a9.59 9.59 0 0 1 2.504.337c1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0 0 22 12.017C22 6.484 17.522 2 12 2z" />
  </svg>
);

export default function Register() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Navigate back to home
  const handleBackToHome = () => {
    navigate("/");
  };

  // Google Login
  const handleGoogle = async () => {
    setLoading(true);
    setError("");
    try {
      await signInWithPopup(auth, googleProvider);
      navigate("/app");
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  // GitHub Login
  const handleGithub = async () => {
    setLoading(true);
    setError("");
    try {
      await signInWithPopup(auth, githubProvider);
      navigate("/app");
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  // Email Register
  const handleEmailRegister = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      setError("Please fill in all fields");
      return;
    }
    if (password.length < 6) {
      setError("Password should be at least 6 characters");
      return;
    }
    
    setLoading(true);
    setError("");
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      navigate("/app");
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-black text-white sujoy1">
      
      <div className="flex items-center justify-between min-h-screen">
        <RegisterUI />
        
        <div className="flex flex-col items-center justify-center w-full px-4">
            <button
                onClick={handleBackToHome}
                className="fixed top-6 left-6 z-50 flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/15 rounded cursor-pointer transition-all duration-200 backdrop-blur-sm"
                aria-label="Go back to home"
            >
                <ArrowLeft size={20} />
                <span className="text-sm font-medium">Back to Home</span>
            </button>

          <div className="w-full text-center mb-8">
            <h1 className="text-4xl font-bold mb-2">Create your free account</h1>
            <p className="text-gray-400">Join us and start your journey</p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="w-full max-w-md mb-4 p-3 bg-red-500/10 border border-red-500/50 rounded-lg text-red-500 text-sm text-center">
              {error}
            </div>
          )}

          {/* Social Login */}
          <div className="w-full max-w-md space-y-3">
            <button
              onClick={handleGoogle}
              disabled={loading}
              className="w-full flex cursor-pointer items-center justify-center gap-3 py-3 px-4 bg-white/5 hover:bg-white/10 border border-white/20 rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <GoogleIcon />
              <span>Continue with Google</span>
            </button>

            <button
              onClick={handleGithub}
              disabled={loading}
              className="w-full flex cursor-pointer items-center justify-center gap-3 py-3 px-4 bg-white/5 hover:bg-white/10 border border-white/20 rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <GitHubIcon />
              <span>Continue with GitHub</span>
            </button>
          </div>

          {/* Divider */}
          <div className="relative w-full max-w-md my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-white/20"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-black text-gray-400">or</span>
            </div>
          </div>

          {/* Email Registration Form */}
          <form onSubmit={handleEmailRegister} className="w-full space-y-4 max-w-md">
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
              <input
                type="email"
                placeholder="Email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={loading}
                className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/20 rounded-lg focus:outline-none focus:border-white/50 transition-all duration-200 disabled:opacity-50"
                required
              />
            </div>

            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
              <input
                type="password"
                placeholder="Password (min. 6 characters)"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={loading}
                className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/20 rounded-lg focus:outline-none focus:border-white/50 transition-all duration-200 disabled:opacity-50"
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 cursor-pointer bg-white text-black font-semibold rounded-lg hover:bg-gray-200 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Creating account..." : "Create Account"}
            </button>
          </form>

          <p className="mt-6 text-sm mx-auto max-w-md text-gray-400">
            By creating an account you agree to the Terms of Service and our Privacy Policy. We'll occasionally send you emails about news, products, and services; you can opt-out anytime.
          </p>

          {/* Login Link */}
          <p className="mt-6 text-sm text-gray-400">
            Already have an account?{" "}
            <button
              onClick={() => navigate("/login")}
              className="text-white hover:underline font-medium cursor-pointer"
            >
              Sign in
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}