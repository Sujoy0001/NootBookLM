import { useEffect, useState } from "react";
import { auth } from "../lib/firebase";
import { onAuthStateChanged } from "firebase/auth";
import { Navigate } from "react-router-dom";

const LoadingScreen = () => {
  return (
    <div className="min-h-screen bg-zinc-950 text-white flex flex-col items-center justify-center">
      <div className="relative">
        <div className="w-12 h-12 border-2 border-zinc-800 rounded-full"></div>
        <div className="absolute top-0 left-0 w-12 h-12 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
      </div>
    </div>
  );
};

export default function ProtectedRoute({ children }) {
  const [user, setUser] = useState(undefined);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => {
      setUser(u);
    });

    return () => unsub();
  }, []);


  if (user === undefined) {
    return (
        <LoadingScreen />
    );
  }

  if (!user) {
    return <Navigate to="/login" />;
  }

  return children;
}