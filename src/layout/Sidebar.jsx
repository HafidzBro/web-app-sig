import { Link, useLocation } from "react-router-dom";

export default function Sidebar({ isOpen, onClose }) {
  const location = useLocation();

  const links = [
    { to: "/", label: "Dashboard", icon: "dashboard" },
    { to: "/data", label: "Data Reference", icon: "table_chart" },
  ];

  return (
    <>
      <nav
        className={`fixed left-0 top-0 z-50 flex h-full w-64 flex-col border-r border-slate-800 bg-slate-900 font-inter text-sm font-medium tracking-tight text-white transition-transform duration-300 lg:translate-x-0 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="border-b border-slate-800 p-6">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h1 className="text-base font-bold text-white">Nusantara dalam Angka</h1>
              <p className="text-xs text-slate-400">Geo-Intelligence 2025</p>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="flex h-9 w-9 items-center justify-center rounded-lg text-slate-400 transition hover:bg-slate-800 hover:text-white lg:hidden"
              aria-label="Tutup navigasi"
            >
              <span className="material-symbols-outlined text-[20px]">close</span>
            </button>
          </div>
        </div>

        <div className="flex-1 py-4">
          <ul className="space-y-1">
            {links.map((link) => {
              const isActive = location.pathname === link.to;

              return (
                <li key={link.to}>
                  <Link
                    to={link.to}
                    onClick={onClose}
                    className={`flex items-center gap-3 border-l-4 px-4 py-3 transition-all duration-200 ${
                      isActive
                        ? "border-blue-500 bg-blue-600/20 text-blue-400"
                        : "border-transparent text-slate-400 hover:bg-slate-800 hover:text-white"
                    }`}
                  >
                    <span className="material-symbols-outlined">{link.icon}</span>
                    <span>{link.label}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      </nav>

      {isOpen && (
        <button
          type="button"
          className="fixed inset-0 z-40 bg-slate-950/40 backdrop-blur-[1px] lg:hidden"
          onClick={onClose}
          aria-label="Tutup overlay navigasi"
        />
      )}
    </>
  );
}
