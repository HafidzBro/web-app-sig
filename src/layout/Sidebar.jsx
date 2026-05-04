import React from "react";
import { Link, useLocation } from "react-router-dom";

export default function Sidebar() {
  // BACA URL SAAT INI:
  const location = useLocation();

  return (
    <nav className="bg-slate-900 text-white font-inter text-sm font-medium tracking-tight w-64 border-r border-slate-800 fixed left-0 top-0 h-full z-40 flex flex-col">
      {/* Bagian Logo & Judul */}
      <div className="p-6 border-b border-slate-800">
        <div className="flex items-center gap-3">
          <div>
            <h1 className="text-white font-bold text-base">
              Nusantara dalam Angka
            </h1>
            <p className="text-slate-400 text-xs">Geo-Inteligence 2025</p>
          </div>
        </div>
      </div>

      {/* Bagian Menu Navigasi Dinamis */}
      <div className="flex-1 py-4">
        <ul className="space-y-1">
          <li>
            <Link
              to="/"
              // Logika dinamis: Jika URL adalah "/", pakai warna biru. Jika tidak, pakai warna abu-abu.
              className={`py-3 px-4 flex items-center gap-3 transition-all duration-200 border-l-4 ${
                location.pathname === "/"
                  ? "bg-blue-600/20 text-blue-400 border-blue-500" // <--- STYLE AKTIF
                  : "text-slate-400 border-transparent hover:text-white hover:bg-slate-800" // <--- STYLE PASIF
              }`}
            >
              <span className="material-symbols-outlined">dashboard</span>
              <span>Dashboard</span>
            </Link>
          </li>
          <li>
            <Link
              to="/data"
              // Logika dinamis: Jika URL adalah "/data", pakai warna biru. Jika tidak, pakai warna abu-abu.
              className={`py-3 px-4 flex items-center gap-3 transition-all duration-200 border-l-4 ${
                location.pathname === "/data"
                  ? "bg-blue-600/20 text-blue-400 border-blue-500" // <--- STYLE AKTIF
                  : "text-slate-400 border-transparent hover:text-white hover:bg-slate-800" // <--- STYLE PASIF
              }`}
            >
              <span className="material-symbols-outlined">table_chart</span>
              <span>Data Reference</span>
            </Link>
          </li>
        </ul>
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
