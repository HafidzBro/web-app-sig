import { useEffect, useState } from "react";
import Papa from "papaparse";
// Pastikan path ini sesuai dengan struktur foldermu
import csvFile from "../data/data.csv?url";

export default function Table() {
  const [data, setData] = useState([]);

  useEffect(() => {
    Papa.parse(csvFile, {
      download: true,
      header: true,
      // Filter untuk membuang baris kosong kalau ada di akhir file CSV
      complete: (res) => {
        const validData = res.data.filter((item) => item.Provinsi);
        setData(validData);
      },
    });
  }, []);

  return (
    <div className="w-full overflow-x-auto">
      <table className="w-full border-collapse text-sm text-slate-600">
        {/* === HEADER TABEL === */}
        <thead className="bg-slate-50 text-slate-500 uppercase text-[11px] font-bold tracking-wider border-y border-slate-200">
          <tr>
            <th className="px-6 py-4 text-left">Provinsi</th>
            <th className="px-6 py-4 text-right">Luas (Km²)</th>
            <th className="px-6 py-4 text-right">Jumlah Pulau</th>
          </tr>
        </thead>

        {/* === ISI TABEL === */}
        <tbody className="divide-y divide-slate-100">
          {data.map((item, index) => (
            <tr
              key={index}
              className="hover:bg-blue-50/50 transition-colors group"
            >
              {/* Kolom Provinsi */}
              <td className="px-6 py-3 font-medium text-slate-900 whitespace-nowrap">
                {item.Provinsi}
              </td>

              {/* Kolom Luas */}
              <td className="px-6 py-3 text-right tabular-nums">
                {Number(item.Luas_Wilayah).toLocaleString("id-ID")}
              </td>

              {/* Kolom Jumlah Pulau */}
              <td className="px-6 py-3 text-right tabular-nums">
                {Number(item.Jumlah_Pulau).toLocaleString("id-ID")}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
