import { Outlet } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";

export default function HomeLayout() {
  const isOpen = true; // replace with your toggle state

  return (
    <div className="h-screen w-full text-white flex flex-col">
      
      <Navbar />

      <div className="flex flex-1 overflow-hidden">

        <Sidebar
          className={`${
            isOpen ? "w-64" : "w-16"
          } shrink-0 transition-all duration-300`}
        />

        <main className="flex-1 min-w-0 overflow-y-auto p-6 bg-[#121113]">
          <Outlet />
        </main>

      </div>
    </div>
  );
}