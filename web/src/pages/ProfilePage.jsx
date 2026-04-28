import React, { useEffect, useState } from "react";
import { auth } from "../lib/firebase";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { Trash2, UserX, LoaderCircle, Mail, Key, ShieldAlert } from "lucide-react";
import { useUserData } from "../context/FirebaseContext";

export default function ProfilePage() {
  const [user, setUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [confirmText, setConfirmText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);

  const { data: profileData, loading: profileLoading } = useUserData();

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setAuthLoading(false);
    });

    return () => unsub();
  }, []);

  const handleDelete = async () => {
    if (!user) return;

    setIsDeleting(true);
    try {
      const token = await user.getIdToken();
      const backendUrl = import.meta.env.VITE_NODE_SERVER_URL || "http://localhost:3000";

      const response = await fetch(`${backendUrl}/api/auth/account`, {
        method: "DELETE",
        headers: { "Authorization": `Bearer ${token}` }
      });

      if (!response.ok) {
        throw new Error(await response.text());
      }

      await signOut(auth);
    } catch (err) {
      console.error(err);
      alert("Failed to delete account. Please try again.");
    } finally {
      setIsDeleting(false);
    }
  };

  const loading = authLoading || profileLoading;

  if (loading) {
    return (
      <div className="min-h-full flex flex-col items-center justify-center text-zinc-400">
        <LoaderCircle size={50} className="animate-spin mb-4" />
        <p>Loading profile...</p>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-full flex flex-col items-center justify-center text-zinc-500">
        <UserX size={50} className="mb-4" />
        <p className="text-lg font-medium text-white">No profile data available</p>
        <p className="text-sm mt-1">Please log in first.</p>
      </div>
    );
  }

  const displayName = user.displayName || profileData?.profile?.name || profileData?.name || "N/A";
  const initial = displayName !== "N/A" ? displayName.charAt(0).toUpperCase() : "U";

  return (
    <div className="h-full w-full px-2 sujoy1 flex flex-col mb-16">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white sujoy2 tracking-tight">Your Profile</h1>
        <p className="text-zinc-400 mt-1">Manage your account information and security.</p>
      </div>

      <div className="max-w-3xl mx-auto space-y-6">
        {/* Profile Card */}
        <div className="bg-[#111] border border-white/10 rounded-2xl p-6 md:p-8 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl -mr-32 -mt-32 pointer-events-none" />
          
          <div className="flex flex-col md:flex-row items-start md:items-center gap-6 relative z-10 mb-8">
            <div className="w-24 h-24 rounded-full bg-gradient-to-tr from-zinc-800 to-zinc-600 flex items-center justify-center text-4xl font-bold text-white shadow-xl border border-white/10">
              {initial}
            </div>
            <div>
              <h2 className="text-2xl font-bold text-white">{displayName}</h2>
              <p className="text-zinc-400 flex items-center gap-2 mt-1">
                <Mail className="w-4 h-4" /> {user.email}
              </p>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6 pt-6 border-t border-white/10 relative z-10">
            <div>
              <p className="text-zinc-500 text-xs font-semibold uppercase tracking-wider mb-1">User ID</p>
              <div className="flex items-center gap-2 bg-[#0a0a0a] border border-white/5 p-3 rounded-xl font-mono text-xs text-zinc-300 break-all">
                <Key className="w-4 h-4 shrink-0 text-zinc-500" />
                {user.uid}
              </div>
            </div>
            <div>
              <p className="text-zinc-500 text-xs font-semibold uppercase tracking-wider mb-1">Authentication Provider</p>
              <div className="flex items-center gap-2 bg-[#0a0a0a] border border-white/5 p-3 rounded-xl text-sm text-zinc-300">
                <ShieldAlert className="w-4 h-4 shrink-0 text-zinc-500" />
                {user.providerData[0]?.providerId || 'firebase'}
              </div>
            </div>
          </div>
        </div>

        {/* Danger Zone */}
        <div className="bg-red-500/5 border border-red-500/20 rounded-2xl p-6 md:p-8 relative overflow-hidden">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-red-500/10 rounded-lg">
              <Trash2 className="w-5 h-5 text-red-400" />
            </div>
            <h2 className="text-xl font-semibold text-red-400">Danger Zone</h2>
          </div>

          <p className="text-zinc-400 text-sm mb-6 max-w-xl">
            Permanently delete your account and all associated data. This action cannot be undone. Please type <span className="text-white font-mono bg-white/10 px-1 rounded">{user.email}</span> to confirm.
          </p>

          <div className="flex flex-col md:flex-row gap-4">
            <input
              type="text"
              value={confirmText}
              onChange={(e) => setConfirmText(e.target.value)}
              placeholder="Enter your email"
              className="flex-1 bg-[#0a0a0a] border border-red-500/20 focus:border-red-500/50 rounded-xl px-4 py-3 text-white outline-none transition-colors"
            />

            <button
              onClick={handleDelete}
              disabled={confirmText !== user.email || isDeleting}
              className="md:w-48 flex items-center justify-center cursor-pointer gap-2 bg-red-600/90 hover:bg-red-600 disabled:bg-zinc-800 disabled:text-zinc-500 text-white py-3 rounded-xl transition-all font-semibold"
            >
              {isDeleting ? (
                <LoaderCircle size={18} className="animate-spin" />
              ) : (
                <Trash2 size={18} />
              )}
              {isDeleting ? "Deleting..." : "Delete Account"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}