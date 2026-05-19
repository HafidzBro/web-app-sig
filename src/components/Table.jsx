import { useEffect, useState } from "react";
import Papa from "papaparse";
import csvFile from "../data/data.csv?url";

function formatNumber(value) {
  return Number(value || 0).toLocaleString("id-ID");
}

export default function Table() {
  const [data, setData] = useState([]);

  useEffect(() => {
    Papa.parse(csvFile, {
      download: true,
      header: true,
      complete: (res) => {
        const validData = res.data.filter((item) => item.Provinsi);
        setData(validData);
      },
    });
  }, []);

  return (
    <div className="overflow-hidden rounded-xl border border-slate-200 bg-white">
      <div className="max-h-[calc(100vh-250px)] overflow-auto">
        <table className="w-full min-w-[720px] border-collapse text-sm">
          <thead className="sticky top-0 z-10 border-b border-slate-200 bg-slate-950 text-left text-[11px] font-bold uppercase tracking-wide text-slate-200">
            <tr>
              <th className="w-16 px-5 py-4">No</th>
              <th className="px-5 py-4">Provinsi</th>
              <th className="px-5 py-4 text-right">Luas Wilayah</th>
              <th className="px-5 py-4 text-right">Jumlah Pulau</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-100 bg-white">
            {data.map((item, index) => (
              <tr key={item.Provinsi} className="transition hover:bg-blue-50/50">
                <td className="px-5 py-4">
                  <span className="inline-flex h-7 min-w-7 items-center justify-center rounded-full bg-slate-100 px-2 text-xs font-bold text-slate-500">
                    {index + 1}
                  </span>
                </td>
                <td className="px-5 py-4">
                  <div className="font-bold text-slate-900">{item.Provinsi}</div>
                  <div className="mt-1 text-xs font-medium text-slate-500">
                    Data wilayah provinsi
                  </div>
                </td>
                <td className="px-5 py-4 text-right font-semibold tabular-nums text-slate-700">
                  {formatNumber(item.Luas_Wilayah)}
                  <span className="ml-1 text-xs font-bold text-slate-400">km2</span>
                </td>
                <td className="px-5 py-4 text-right">
                  <span className="inline-flex items-center rounded-full bg-teal-50 px-3 py-1 text-sm font-bold tabular-nums text-teal-700 ring-1 ring-teal-100">
                    {formatNumber(item.Jumlah_Pulau)}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
