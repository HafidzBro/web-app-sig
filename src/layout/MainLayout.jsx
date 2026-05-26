import { useState } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import TopBar from "./TopBar";

export default function MainLayout() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-slate-50 font-inter text-slate-800">
      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
      <TopBar onMenuClick={() => setIsSidebarOpen(true)} />

      <div className="pt-16 lg:ml-64">
        <Outlet />
      </div>
    </div>
  );
}
