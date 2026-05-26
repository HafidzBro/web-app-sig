export default function TopBar({ onMenuClick }) {
  return (
    <header className="fixed left-0 right-0 top-0 z-30 flex h-16 items-center gap-3 border-b border-slate-200 bg-white/85 px-4 text-sm antialiased shadow-sm backdrop-blur-md sm:px-6 lg:left-64 lg:px-8">
      <button
        type="button"
        onClick={onMenuClick}
        className="flex h-10 w-10 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-700 shadow-sm transition hover:bg-slate-50 lg:hidden"
        aria-label="Buka navigasi"
      >
        <span className="material-symbols-outlined text-[22px]">menu</span>
      </button>
      <div className="truncate text-lg font-extrabold text-slate-900">
        Nusantara dalam Angka
      </div>
    </header>
  );
}
