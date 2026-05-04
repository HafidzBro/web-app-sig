
import React from 'react';
import { Link } from 'react-router-dom';

export default function Sidebar() {
  return (
    <nav className="bg-slate-900 text-white font-inter text-sm font-medium tracking-tight w-64 border-r border-slate-800 fixed left-0 top-0 h-full z-40 flex flex-col">
      {/* Bagian Logo & Judul */}
      <div className="p-6 border-b border-slate-800">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center text-xl font-bold text-white tracking-tight">N</div>
          <div>
            <h1 className="text-white font-bold text-base">Nusantara</h1>
            <p className="text-slate-400 text-xs">Geo-Inteligence 2025</p>
          </div>
        </div>
      </div>

      {/* Bagian Menu Navigasi (Sudah pakai Link dari react-router-dom) */}
      <div className="flex-1 py-4">
        <ul className="space-y-1">
          <li>
            <Link 
              to="/" 
              className="bg-blue-600/20 text-blue-400 border-l-4 border-blue-500 py-3 px-4 flex items-center gap-3 hover:bg-slate-800 transition-all duration-200"
            >
              <span className="material-symbols-outlined">dashboard</span>
              <span>Dashboard</span>
            </Link>
          </li>
          <li>
            <Link 
              to="/data" 
              className="text-slate-400 hover:text-white py-3 px-4 transition-colors border-l-4 border-transparent flex items-center gap-3 hover:bg-slate-800 transition-all duration-200"
            >
              <span className="material-symbols-outlined">table_chart</span>
              <span>Data Reference</span>
            </Link>
          </li>
        </ul>
      </div>

      {/* Bagian Bawah */}
      <div className="p-6 border-t border-slate-800">
        <button className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded transition-colors text-sm font-semibold flex items-center justify-center gap-2">
          <span className="material-symbols-outlined text-sm">download</span>
          Export Data
        </button>
      </div>
    </nav>
  );
}

/* import { Link } from "react-router-dom";

export default function Sidebar() {
    return (
        <div style={{
            width: "220px",
            height: "100vh",
            background: "#1e3a8a",
            color: "white",
            padding: "20px"
        }}>
            <h2>Nusantara</h2>

            <Link to="/" style={{ display: "block", margin: "10px 0", color: "white" }}>
                Dashboard
            </Link>
            <Link to="/data" style={{ display: "block", margin: "10px 0", color: "white" }}>
                Data Reference
            </Link>
        </div>
    );
} */