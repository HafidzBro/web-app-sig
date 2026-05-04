import React from "react";
import Table from "../components/Table";

// Import file CSV kamu sebagai raw string (fitur bawaan Vite)
// Pastikan path '../data/data.csv' sesuai dengan lokasi file CSV kamu
import csvData from "../data/data.csv?raw";

export default function DataReference() {
  // Fungsi untuk mendownload data CSV
  const handleExportCSV = () => {
    // 1. Ubah raw data CSV menjadi Blob
    const blob = new Blob([csvData], { type: "text/csv;charset=utf-8;" });

    // 2. Buat URL sementara untuk file tersebut
    const url = URL.createObjectURL(blob);

    // 3. Buat elemen <a> (link) secara gaib untuk memicu download
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "Data_Nusantara_BPS_2025.csv"); // Nama file saat didownload
    document.body.appendChild(link);

    // 4. Klik link tersebut secara otomatis, lalu hapus
    link.click();
    document.body.removeChild(link);
  };

  return (
    <main className="p-6 h-[calc(100vh-64px)] overflow-y-auto bg-slate-50">
      {/* Wrapper bergaya Card Modern */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden flex flex-col">
        {/* Bagian Header Card */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-6 border-b border-slate-200 gap-4">
          <div>
            <h2 className="text-xl font-bold text-slate-900">
              Master Data References
            </h2>
            <p className="text-sm text-slate-500 mt-1">
              Data referensi Luas Wilayah dan Jumlah Pulau per Provinsi
              berdasarkan BPS 2025.
            </p>
          </div>

          {/* Tombol Export */}
          <button
            onClick={handleExportCSV}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-semibold transition-all shadow-sm text-sm"
          >
            <span className="material-symbols-outlined text-[18px]">
              download
            </span>
            Export CSV
          </button>
        </div>

        {/* Bagian Tabel */}
        <div className="p-0 overflow-x-auto">
          <Table />
        </div>
      </div>
    </main>
  );
}
