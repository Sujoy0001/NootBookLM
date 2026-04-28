import React, { useEffect, useState } from "react";
import { auth, db } from "../lib/firebase";
import { doc, getDoc } from "firebase/firestore";
import { onAuthStateChanged, deleteUser } from "firebase/auth";
import { Trash2, UserX, LoaderCircle } from "lucide-react";

export default function ProfilePage() {
  const [user, setUser] = useState(null);
  const [profileData, setProfileData] = useState(null);
  const [confirmText, setConfirmText] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        setUser(currentUser);

        const docRef = doc(db, "users", currentUser.uid);
        const snap = await getDoc(docRef);

        if (snap.exists()) {
          setProfileData(snap.data());
        }
      }

      setLoading(false);
    });

    return () => unsub();
  }, []);

  const handleDelete = async () => {
    if (!user) return;

    try {
      await deleteUser(user);
      alert("Account deleted successfully");
    } catch (err) {
      if (err.code === "auth/requires-recent-login") {
        alert("Please login again before deleting account.");
      } else {
        console.error(err);
      }
    }
  };

  // Loading State
  if (loading) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex flex-col items-center justify-center text-zinc-400">
        <LoaderCircle size={50} className="animate-spin mb-4" />
        <p>Loading profile...</p>
      </div>
    );
  }

  // No User State
  if (!user) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex flex-col items-center justify-center text-zinc-500">
        <UserX size={50} className="mb-4" />
        <p className="text-lg font-medium">No profile data available</p>
        <p className="text-sm text-zinc-600">Please log in first.</p>
      </div>
    );
  }

  return (
    <div className="sujoy2 px-2">
      <div className="max-w-3xl mx-auto space-y-8">
        {/* Profile Card */}
        <div className="bg-[#111] border border-zinc-800 rounded-xl p-6">
          <h1 className="text-2xl font-bold mb-6">Profile</h1>

          <div className="space-y-4">
            <div>
              <p className="text-zinc-400 text-sm">Name</p>
              <p className="text-lg">
                {user.displayName || profileData?.name || "N/A"}
              </p>
            </div>

            <div>
              <p className="text-zinc-400 text-sm">Email</p>
              <p className="text-lg">{user.email}</p>
            </div>

            <div>
              <p className="text-zinc-400 text-sm">User ID</p>
              <p className="text-sm text-zinc-500 break-all">{user.uid}</p>
            </div>
          </div>
        </div>

        {/* Danger Zone */}
        <div className="bg-[#111] border border-red-900 rounded-xl p-6">
          <h2 className="text-xl font-semibold mb-4 text-red-400">
            Danger Zone
          </h2>

          <p className="text-zinc-400 text-sm mb-4">
            Type your email to permanently delete your account.
          </p>

          <input
            type="text"
            value={confirmText}
            onChange={(e) => setConfirmText(e.target.value)}
            placeholder="Enter your email"
            className="w-full mb-4 bg-[#0d0d0d] border border-zinc-700 rounded-lg px-4 py-2 text-white outline-none"
          />

          <button
            onClick={handleDelete}
            disabled={confirmText !== user.email}
            className="w-full cursor-pointer flex items-center justify-center gap-2 bg-red-600 disabled:bg-zinc-700 text-white py-3 rounded-lg"
          >
            <Trash2 size={18} />
            Delete Account
          </button>
        </div>
      </div>
    </div>
  );
}