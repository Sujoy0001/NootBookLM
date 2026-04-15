import { LogOut, User } from "lucide-react";
import { signOut } from "firebase/auth";
import { auth } from "../lib/firebase";
import { useNavigate } from "react-router-dom";

export default function Navbar() {
  const navigate = useNavigate();

  const logout = async () => {
    await signOut(auth);
    navigate("/login");
  };

  return (
    <div className="h-16 border-b border-gray-800 flex items-center justify-between px-6">

      <h2 className="text-lg font-medium">Dashboard</h2>

      <div className="flex items-center gap-4">

        <div className="flex items-center gap-2 text-gray-300">
          <User size={18} />
          User
        </div>

        <button
          onClick={logout}
          className="flex items-center gap-2 text-sm border px-3 py-1.5 rounded-lg hover:bg-gray-900"
        >
          <LogOut size={16} />
          Logout
        </button>

      </div>

    </div>
  );
}