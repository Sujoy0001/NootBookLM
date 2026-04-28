import React, { useState } from "react";
import { MessageSquare, Send, CheckCircle, AlertCircle } from "lucide-react";

export default function FeedbackPage() {
  const [formData, setFormData] = useState({ name: "", email: "", message: "" });
  const [status, setStatus] = useState("idle"); // idle, submitting, success, error
  const [errorMessage, setErrorMessage] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus("submitting");
    setErrorMessage("");

    const formspreeId = import.meta.env.VITE_FORMSPREE_ID;

    if (!formspreeId) {
      setStatus("error");
      setErrorMessage("Formspree ID is not configured. Please add VITE_FORMSPREE_ID to .env");
      return;
    }

    try {
      const response = await fetch(`https://formspree.io/f/${formspreeId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setStatus("success");
        setFormData({ name: "", email: "", message: "" });
      } else {
        const data = await response.json();
        if (Object.hasOwn(data, 'errors')) {
          setErrorMessage(data.errors.map(error => error.message).join(", "));
        } else {
          setErrorMessage("Oops! There was a problem submitting your form");
        }
        setStatus("error");
      }
    } catch (error) {
      setStatus("error");
      setErrorMessage("Oops! There was a network error while submitting.");
    }
  };

  return (
    <div className="h-full w-full px-2 sujoy1 flex flex-col">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white sujoy2 tracking-tight flex items-center gap-3">
          <MessageSquare className="w-8 h-8 text-white" />
          Feedback
        </h1>
        <p className="text-zinc-400 mt-2 max-w-2xl">
          We're always looking to improve RagEngine. Let us know what you think, report a bug, or request a feature!
        </p>
      </div>

      <div className="flex-1 max-w-2xl mx-auto">
        <div className="bg-[#111] border border-white/10 rounded-2xl p-6 md:p-8">
          {status === "success" ? (
            <div className="flex flex-col items-center justify-center py-10 animate-in zoom-in duration-300">
              <CheckCircle className="w-16 h-16 text-green-400 mb-4" />
              <h2 className="text-2xl font-semibold text-white mb-2">Thank You!</h2>
              <p className="text-zinc-400 text-center">Your feedback has been received. We appreciate your help in making RagEngine better.</p>
              <button 
                onClick={() => setStatus("idle")}
                className="mt-8 px-6 py-2 cursor-pointer bg-white/10 hover:bg-white/20 text-white rounded-lg transition-colors font-medium"
              >
                Send Another Message
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              {status === "error" && (
                <div className="p-4 bg-red-500/10 border border-red-500/50 rounded-xl flex items-start gap-3 text-red-400">
                  <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
                  <p className="text-sm">{errorMessage}</p>
                </div>
              )}
              
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label htmlFor="name" className="text-sm font-medium text-zinc-300">Name</label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    required
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full bg-[#0a0a0a] border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-white/30 focus:ring-1 focus:ring-white/30 transition-all"
                    placeholder="John Doe"
                  />
                </div>
                <div className="space-y-2">
                  <label htmlFor="email" className="text-sm font-medium text-zinc-300">Email Address</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full bg-[#0a0a0a] border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-white/30 focus:ring-1 focus:ring-white/30 transition-all"
                    placeholder="john@example.com"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label htmlFor="message" className="text-sm font-medium text-zinc-300">Message</label>
                <textarea
                  id="message"
                  name="message"
                  required
                  rows={5}
                  value={formData.message}
                  onChange={handleChange}
                  className="w-full bg-[#0a0a0a] border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-white/30 focus:ring-1 focus:ring-white/30 transition-all resize-none"
                  placeholder="How can we improve? Did you find a bug?"
                />
              </div>

              <button
                type="submit"
                disabled={status === "submitting"}
                className="w-full cursor-pointer flex items-center justify-center gap-2 bg-white text-black hover:bg-zinc-200 disabled:bg-white/50 disabled:cursor-not-allowed py-3.5 rounded-xl font-bold transition-all duration-200 shadow-[0_0_20px_rgba(255,255,255,0.1)] hover:shadow-[0_0_30px_rgba(255,255,255,0.2)]"
              >
                {status === "submitting" ? (
                  <span className="flex items-center gap-2">
                    <svg className="animate-spin h-5 w-5 text-black" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Sending...
                  </span>
                ) : (
                  <>
                    <Send className="w-5 h-5" />
                    Send Feedback
                  </>
                )}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
