import React from 'react';

export default function TopBar() {
  return (
    <header className="bg-white/80 backdrop-blur-md font-inter text-sm antialiased border-b border-slate-200 shadow-sm fixed top-0 right-0 left-64 z-30 flex items-center justify-between px-8 h-16">
      <div className="flex items-center gap-8 h-full">
        <div className="text-lg font-extrabold text-slate-900"> Nusantara dalam Angka</div>
        <nav className="h-full hidden md:flex items-center gap-6">
    
        </nav>
      </div>
      <div className="flex items-center gap-4">
        <button className="text-slate-500 hover:text-blue-600 transition-colors">
          <span className="material-symbols-outlined">notifications</span>
        </button>
        <button className="text-slate-500 hover:text-blue-600 transition-colors">
          <span className="material-symbols-outlined">account_circle</span>
        </button>
      </div>
    </header>
  );
}

// export default function TopBar() {
//     return (
//         <div style={{
//             height: "60px",
//             background: "white",
//             display: "flex",
//             alignItems: "center",
//             padding: "0 20px",
//             boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
//             fontWeight: "bold",
//             fontSize: "18px",
//             border: "1px solid #e5e7eb",
//         }}>
//             Nusantara dalam Angka
//         </div>
//     );
// }