import React from 'react';
import { Outlet } from 'react-router-dom'; // 1. Import Outlet dari react-router-dom
import Sidebar from './Sidebar';
import TopBar from './TopBar';

export default function MainLayout() { // 2. Hapus { children } dari sini
  return (
    <div className="bg-slate-50 min-h-screen font-inter text-slate-800">
      <Sidebar />
      <TopBar />
      
      {/* 3. Komponen halaman (Dashboard/DataReference) akan muncul di dalam Outlet ini */}
      <div className="ml-64 pt-16">
        <Outlet /> 
      </div>
      
    </div>
  );
}
// import Sidebar from "./Sidebar";
// import TopBar from "./TopBar";
// import { Outlet } from "react-router-dom";

// export default function MainLayout() {
//     return (
//         <div style={{ display: "flex" }}>
//             <Sidebar />
//             <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
//                 <TopBar />
//                 <div style={{ padding: "20px", background: "#f9fafb", flex: 1 }}>
//                     <Outlet />
//                 </div>

//             </div>
//         </div>
//     );
// }