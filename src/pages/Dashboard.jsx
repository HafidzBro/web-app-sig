
import React, { useState } from 'react';
import MapView from "../components/MapView";
import SummaryCard from "../components/SummaryCard";

export default function Dashboard() {
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [draftFilters, setDraftFilters] = useState({
    area: { large: true, medium: false, small: false },
    islandCount: '100-1000'
  });

  const [appliedFilters, setAppliedFilters] = useState(draftFilters);

  const handleAreaChange = (scale) => {
    setDraftFilters(prev => ({
      ...prev,
      area: { ...prev.area, [scale]: !prev.area[scale] }
    }));
  };

  const handleApply = () => {
    setAppliedFilters(draftFilters);
    setIsFilterOpen(false); // Opsional: tutup laci setelah apply
  };

  const handleReset = () => {
    const defaultFilters = {
      area: { large: true, medium: true, small: true },
      islandCount: 'all'
    };
    setDraftFilters(defaultFilters);
    setAppliedFilters(defaultFilters);
  };
  return (
    <>
      <main className="p-6 h-[calc(100vh-64px)] overflow-y-auto relative">
        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <div className="bg-white p-4 rounded-lg shadow-sm border border-slate-200 flex items-center justify-between">
            <div>
              <p className="text-slate-500 text-sm mb-1">Total Provinces</p>
              <h3 className="text-3xl font-bold text-slate-900">38</h3>
            </div>
            <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
              <span className="material-symbols-outlined">flag</span>
            </div>
          </div>
          
          <div className="bg-white p-4 rounded-lg shadow-sm border border-slate-200 flex items-center justify-between">
            <div>
              <p className="text-slate-500 text-sm mb-1">Total Area</p>
              <h3 className="text-3xl font-bold text-slate-900">1.9M <span className="text-lg text-slate-500">km²</span></h3>
            </div>
            <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
              <span className="material-symbols-outlined">landscape</span>
            </div>
          </div>

          <div className="bg-white p-4 rounded-lg shadow-sm border border-slate-200 flex items-center justify-between">
            <div>
              <p className="text-slate-500 text-sm mb-1">Total Islands</p>
              <h3 className="text-3xl font-bold text-slate-900">17,508</h3>
            </div>
            <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
              <span className="material-symbols-outlined">water</span>
            </div>
          </div>
        </div>

        {/* Search Bar & Tombol Pemicu Sidebar Filter */}
        <div className="mb-4 flex justify-between items-center">
          
          {/* Search Bar */}
          <div className="relative w-80 shadow-sm rounded-lg">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-lg">search</span>
            <input 
              type="text" 
              placeholder="Cari Provinsi atau Ibu Kota..." 
              className="w-full pl-10 pr-4 py-2 bg-white border border-slate-200 text-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-sm"
            />
          </div>

          {/* Tombol Advanced Filters */}
          <button 
            onClick={() => setIsFilterOpen(true)}
            className="flex items-center gap-2 bg-white border border-slate-200 text-slate-700 px-4 py-2 rounded-lg shadow-sm hover:bg-slate-50 transition-colors font-semibold text-sm"
          >
            <span className="material-symbols-outlined text-[18px]">filter_alt</span>
            Advanced Filters
          </button>
        </div>

        {/* Map Area */}
        <div className="mb-6">
          {/* Ini dia cara memanggil komponen MapView kamu! */}
          <MapView filters={appliedFilters}/>
        </div>
      </main>

      {/* Laci Filter Samping (Dengan Animasi Buka Tutup) */}
      <aside 
        className={`bg-white font-inter text-sm fixed right-0 top-16 h-[calc(100vh-64px)] w-80 shadow-2xl border-l border-slate-200 z-50 flex flex-col p-6 overflow-y-auto transition-transform duration-300 ease-in-out ${
          isFilterOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="flex justify-between items-start mb-6">
          <div>
            <h2 className="text-lg font-semibold text-slate-900">Advanced Filters</h2>
            <p className="text-slate-500 text-xs mt-1">Nusantara dalam angka</p>
          </div>
          {/* Tombol Silang (X) */}
          <button 
            onClick={() => setIsFilterOpen(false)}
            className="text-slate-400 hover:text-slate-600 bg-slate-100 hover:bg-slate-200 p-1 rounded-full transition-colors"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>
        <div className="flex-1 overflow-y-auto pr-2 space-y-6">
            {/*Detail Provinsi*/}
           
          {/* Typology */}
        <div>
            <label className="block text-xs font-semibold text-slate-500 mb-2">TIPOLOGI</label>
            <select className="w-full bg-slate-50 border border-slate-200 rounded-md py-2 px-3 text-slate-700 outline-none">
              <option>Provinsi Daratan</option>
              <option>Provinsi Kepulauan</option>
            </select>
        </div>

          {/* Area Scale */}
          <div>
            <label className="block text-xs font-semibold text-slate-500 mb-2">AREA SCALE (KM²)</label>
            <div className="space-y-2">
              <label className="flex items-center gap-3 p-2 hover:bg-slate-50 cursor-pointer rounded">
                <input type="checkbox" checked={draftFilters.area.large} onChange={() => handleAreaChange('large')} className="w-4 h-4 accent-blue-600" />
                <span className="text-slate-700">&gt; 50.000</span>
              </label>
              <label className="flex items-center gap-3 p-2 hover:bg-slate-50 cursor-pointer rounded">
                <input type="checkbox" checked={draftFilters.area.medium} onChange={() => handleAreaChange('medium')} className="w-4 h-4 accent-blue-600" />
                <span className="text-slate-700">10.000 - 50.000</span>
              </label>
              <label className="flex items-center gap-3 p-2 hover:bg-slate-50 cursor-pointer rounded">
                <input type="checkbox" checked={draftFilters.area.small} onChange={() => handleAreaChange('small')} className="w-4 h-4 accent-blue-600" />
                <span className="text-slate-700">&lt; 10.000</span>
              </label>
            </div>
          </div>

          {/* Island Count */}
          <div>
            <label className="block text-xs font-semibold text-slate-500 mb-2">ISLAND COUNT</label>
            <div className="space-y-2">
              <label className="flex items-center gap-3 p-2 hover:bg-slate-50 cursor-pointer rounded">
                <input type="radio" checked={draftFilters.islandCount === '>1000'} onChange={() => setDraftFilters({...draftFilters, islandCount: '>1000'})} className="w-4 h-4 accent-blue-600" />
                <span className="text-slate-700">&gt; 1.000</span>
              </label>
              <label className="flex items-center gap-3 p-2 hover:bg-slate-50 cursor-pointer rounded">
                <input type="radio" checked={draftFilters.islandCount === '100-1000'} onChange={() => setDraftFilters({...draftFilters, islandCount: '100-1000'})} className="w-4 h-4 accent-blue-600" />
                <span className="text-slate-700">100 - 1.000</span>
              </label>
              <label className="flex items-center gap-3 p-2 hover:bg-slate-50 cursor-pointer rounded">
                <input type="radio" checked={draftFilters.islandCount === '<100'} onChange={() => setDraftFilters({...draftFilters, islandCount: '<100'})} className="w-4 h-4 accent-blue-600" />
                <span className="text-slate-700">&lt; 100</span>
              </label>
            </div>
          </div>

          {/* Active Filters Chips */}
         

        </div>

        <div className="mt-6 pt-4 border-t border-slate-200 flex gap-3">
          <button onClick={handleReset} className="flex-1 bg-white border border-slate-200 text-slate-700 py-2 px-4 rounded font-semibold hover:bg-slate-50 transition-colors">
            Reset
          </button>
          <button onClick={handleApply} className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded font-semibold transition-colors shadow-sm">
            Apply Filters
          </button>
        </div>
      </aside>
      
      {/* Overlay Gelap (Opsional, biar makin kerasa pop-up nya) */}
      {isFilterOpen && (
        <div 
          className="fixed inset-0 bg-black/20 z-40"
          onClick={() => setIsFilterOpen(false)}
        ></div>
      )}
    </>
  );
}

// import React, { useState } from 'react';
// import MapView from "../components/MapView";
// import SummaryCard from "../components/SummaryCard";

// export default function Dashboard() {
//   const [isFilterOpen, setIsFilterOpen] = useState(false);

//   return (
//     <>
//       <main className="p-6 h-[calc(100vh-64px)] overflow-y-auto relative">
//         {/* KPI Cards */}
//         <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
//           <div className="bg-white p-4 rounded-lg shadow-sm border border-slate-200 flex items-center justify-between">
//             <div>
//               <p className="text-slate-500 text-sm mb-1">Total Provinces</p>
//               <h3 className="text-3xl font-bold text-slate-900">38</h3>
//             </div>
//             <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
//               <span className="material-symbols-outlined">flag</span>
//             </div>
//           </div>
          
//           <div className="bg-white p-4 rounded-lg shadow-sm border border-slate-200 flex items-center justify-between">
//             <div>
//               <p className="text-slate-500 text-sm mb-1">Total Area</p>
//               <h3 className="text-3xl font-bold text-slate-900">1.9M <span className="text-lg text-slate-500">km²</span></h3>
//             </div>
//             <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
//               <span className="material-symbols-outlined">landscape</span>
//             </div>
//           </div>

//           <div className="bg-white p-4 rounded-lg shadow-sm border border-slate-200 flex items-center justify-between">
//             <div>
//               <p className="text-slate-500 text-sm mb-1">Total Islands</p>
//               <h3 className="text-3xl font-bold text-slate-900">17,508</h3>
//             </div>
//             <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
//               <span className="material-symbols-outlined">water</span>
//             </div>
//           </div>
//         </div>

//         {/* Search Bar & Tombol Pemicu Sidebar Filter */}
//         <div className="mb-4 flex justify-between items-center">
          
//           {/* Search Bar */}
//           <div className="relative w-80 shadow-sm rounded-lg">
//             <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-lg">search</span>
//             <input 
//               type="text" 
//               placeholder="Cari Provinsi atau Ibu Kota..." 
//               className="w-full pl-10 pr-4 py-2 bg-white border border-slate-200 text-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-sm"
//             />
//           </div>

//           {/* Tombol Advanced Filters */}
//           <button 
//             onClick={() => setIsFilterOpen(true)}
//             className="flex items-center gap-2 bg-white border border-slate-200 text-slate-700 px-4 py-2 rounded-lg shadow-sm hover:bg-slate-50 transition-colors font-semibold text-sm"
//           >
//             <span className="material-symbols-outlined text-[18px]">filter_alt</span>
//             Advanced Filters
//           </button>
//         </div>

//         {/* Map Area */}
//         <div className="mb-6">
//           {/* Ini dia cara memanggil komponen MapView kamu! */}
//           <MapView />
//         </div>
//       </main>

//       {/* Laci Filter Samping (Dengan Animasi Buka Tutup) */}
//       <aside 
//         className={`bg-white font-inter text-sm fixed right-0 top-16 h-[calc(100vh-64px)] w-80 shadow-2xl border-l border-slate-200 z-50 flex flex-col p-6 overflow-y-auto transition-transform duration-300 ease-in-out ${
//           isFilterOpen ? 'translate-x-0' : 'translate-x-full'
//         }`}
//       >
//         <div className="flex justify-between items-start mb-6">
//           <div>
//             <h2 className="text-lg font-semibold text-slate-900">Advanced Filters</h2>
//             <p className="text-slate-500 text-xs mt-1">Refine Spatial Data</p>
//           </div>
//           {/* Tombol Silang (X) */}
//           <button 
//             onClick={() => setIsFilterOpen(false)}
//             className="text-slate-400 hover:text-slate-600 bg-slate-100 hover:bg-slate-200 p-1 rounded-full transition-colors"
//           >
//             <span className="material-symbols-outlined text-[20px]">close</span>
//           </button>
//         </div>

//         {/* 3 Tabs Navigation (Baru Ditambah) */}
//         <div className="flex gap-2 mb-6 border-b border-slate-200 pb-2">
//           <button className="text-blue-600 bg-blue-50 rounded-lg flex-1 py-2 px-2 flex flex-col items-center gap-1 hover:bg-blue-100 transition-colors">
//             <span className="material-symbols-outlined text-lg">category</span>
//             <span className="text-[10px] font-medium">Typology</span>
//           </button>
//           <button className="text-slate-500 hover:text-slate-700 flex-1 py-2 px-2 flex flex-col items-center gap-1 hover:bg-slate-50 rounded-lg transition-colors">
//             <span className="material-symbols-outlined text-lg">layers</span>
//             <span className="text-[10px] font-medium">Area Scale</span>
//           </button>
//           <button className="text-slate-500 hover:text-slate-700 flex-1 py-2 px-2 flex flex-col items-center gap-1 hover:bg-slate-50 rounded-lg transition-colors">
//             <span className="material-symbols-outlined text-lg">filter_alt</span>
//             <span className="text-[10px] font-medium">Island Count</span>
//           </button>
//         </div>

//         <div className="flex-1 overflow-y-auto pr-2 space-y-6">
//           {/* Typology */}
//           <div>
//             <label className="block text-xs font-semibold text-slate-500 mb-2">Tipologi</label>
//             <select className="w-full bg-slate-50 border border-slate-200 rounded-md py-2 px-3 text-slate-700 outline-none">
//               <option>Provinsi Daratan</option>
//               <option>Provinsi Kepulauan</option>
//             </select>
//           </div>

//           {/* Area Scale */}
//           <div>
//             <label className="block text-xs font-semibold text-slate-500 mb-2">AREA SCALE (KM²)</label>
//             <div className="space-y-2">
//               <label className="flex items-center gap-3 p-2 hover:bg-slate-50 cursor-pointer rounded">
//                 <input type="checkbox" className="w-4 h-4 accent-blue-600" defaultChecked />
//                 <span className="text-slate-700">&gt; 50.000</span>
//               </label>
//               <label className="flex items-center gap-3 p-2 hover:bg-slate-50 cursor-pointer rounded">
//                 <input type="checkbox" className="w-4 h-4 accent-blue-600" />
//                 <span className="text-slate-700">10.000 - 50.000</span>
//               </label>
//               <label className="flex items-center gap-3 p-2 hover:bg-slate-50 cursor-pointer rounded">
//                 <input type="checkbox" className="w-4 h-4 accent-blue-600" />
//                 <span className="text-slate-700">&lt; 10.000</span>
//               </label>
//             </div>
//           </div>

//           {/* Island Count (Baru Ditambah) */}
//           <div>
//             <label className="block text-xs font-semibold text-slate-500 mb-2">ISLAND COUNT</label>
//             <div className="space-y-2">
//               <label className="flex items-center gap-3 p-2 hover:bg-slate-50 cursor-pointer rounded">
//                 <input type="radio" name="island_count" className="w-4 h-4 accent-blue-600" />
//                 <span className="text-slate-700">&gt; 1.000</span>
//               </label>
//               <label className="flex items-center gap-3 p-2 hover:bg-slate-50 cursor-pointer rounded">
//                 <input type="radio" name="island_count" className="w-4 h-4 accent-blue-600" defaultChecked />
//                 <span className="text-slate-700">100 - 1.000</span>
//               </label>
//               <label className="flex items-center gap-3 p-2 hover:bg-slate-50 cursor-pointer rounded">
//                 <input type="radio" name="island_count" className="w-4 h-4 accent-blue-600" />
//                 <span className="text-slate-700">&lt; 100</span>
//               </label>
//             </div>
//           </div>

//           {/* Active Filters Chips (Baru Ditambah) */}
//           <div className="pt-4 border-t border-slate-200">
//             <label className="block text-xs font-semibold text-slate-500 mb-2">ACTIVE FILTERS</label>
//             <div className="flex flex-wrap gap-2">
//               <div className="inline-flex items-center gap-1 bg-slate-100 border border-slate-200 rounded-full px-3 py-1 text-xs text-slate-700">
//                 Mainland Province
//                 <button className="hover:text-red-500 text-slate-400 flex items-center justify-center transition-colors">
//                   <span className="material-symbols-outlined text-[14px]">close</span>
//                 </button>
//               </div>
//               <div className="inline-flex items-center gap-1 bg-slate-100 border border-slate-200 rounded-full px-3 py-1 text-xs text-slate-700">
//                 Area &gt; 50k
//                 <button className="hover:text-red-500 text-slate-400 flex items-center justify-center transition-colors">
//                   <span className="material-symbols-outlined text-[14px]">close</span>
//                 </button>
//               </div>
//             </div>
//           </div>

//         </div>

//         <div className="mt-6 pt-4 border-t border-slate-200 flex gap-3">
//           <button className="flex-1 bg-white border border-slate-200 text-slate-700 py-2 px-4 rounded font-semibold hover:bg-slate-50 transition-colors">
//             Reset
//           </button>
//           <button className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded font-semibold transition-colors shadow-sm">
//             Apply Filters
//           </button>
//         </div>
//       </aside>
      
//       {/* Overlay Gelap (Opsional, biar makin kerasa pop-up nya) */}
//       {isFilterOpen && (
//         <div 
//           className="fixed inset-0 bg-black/20 z-40"
//           onClick={() => setIsFilterOpen(false)}
//         ></div>
//       )}
//     </>
//   );
// }

/*
import MapView from "../components/MapView";
import SummaryCard from "../components/SummaryCard";

export default function Dashboard() {
    return (
        <div>
            <div style={{ display: "flex", gap: "10px" }}>
                <SummaryCard title="Provinces" value="38" />
                <SummaryCard title="Total Area" value="1,904,569 km²" />
                <SummaryCard title="Islands" value="17,504" />
            </div>

            <div style={{ marginTop: "20px" }}>
                <MapView />
            </div>
        </div>
    );
}
 */
