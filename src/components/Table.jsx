import { useMemo, useState } from "react";
import { useProvince } from "../context/ProvinceContext";

function formatNumber(value) {
  return Number(value || 0).toLocaleString("id-ID");
}

export default function Table({ searchQuery = "", onFilteredDataChange }) {
  const { tableData, isLoading } = useProvince();
  const [sortColumn, setSortColumn] = useState("No");
  const [sortDirection, setSortDirection] = useState("asc");

  const handleSort = (column) => {
    if (sortColumn === column) {
      setSortDirection((prev) => (prev === "asc" ? "desc" : "asc"));
    } else {
      setSortColumn(column);
      setSortDirection("asc");
    }
  };

  const processedData = useMemo(() => {
    let result = [...tableData];

    // Filter by query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      result = result.filter(
        (item) =>
          item.Provinsi.toLowerCase().includes(q) ||
          item.Ibu_Kota_Wilayah?.toLowerCase().includes(q),
      );
    }

    // Sort
    if (sortColumn === "Provinsi") {
      result.sort((a, b) =>
        sortDirection === "asc"
          ? a.Provinsi.localeCompare(b.Provinsi)
          : b.Provinsi.localeCompare(a.Provinsi),
      );
    } else if (sortColumn === "Ibukota") {
      result.sort((a, b) => {
        const valA = a.Ibu_Kota_Wilayah || "";
        const valB = b.Ibu_Kota_Wilayah || "";
        return sortDirection === "asc"
          ? valA.localeCompare(valB)
          : valB.localeCompare(valA);
      });
    } else if (sortColumn === "Luas_Wilayah") {
      result.sort((a, b) => {
        const numA = Number(a.Luas_Wilayah) || 0;
        const numB = Number(b.Luas_Wilayah) || 0;
        return sortDirection === "asc" ? numA - numB : numB - numA;
      });
    } else if (sortColumn === "Jumlah_Pulau") {
      result.sort((a, b) => {
        const numA = Number(a.Jumlah_Pulau) || 0;
        const numB = Number(b.Jumlah_Pulau) || 0;
        return sortDirection === "asc" ? numA - numB : numB - numA;
      });
    }

    if (onFilteredDataChange) {
      onFilteredDataChange(result);
    }

    return result;
  }, [tableData, searchQuery, sortColumn, sortDirection, onFilteredDataChange]);

  const renderSortIcon = (column) => {
    if (sortColumn !== column) {
      return (
        <span className="material-symbols-outlined text-[16px] text-slate-500 opacity-40 transition group-hover:opacity-100">
          unfold_more
        </span>
      );
    }
    return (
      <span className="material-symbols-outlined text-[16px] text-blue-400">
        {sortDirection === "asc" ? "arrow_upward" : "arrow_downward"}
      </span>
    );
  };

  if (isLoading) {
    return (
      <div className="flex h-64 items-center justify-center rounded-xl border border-slate-200 bg-white">
        <div className="flex flex-col items-center gap-2">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-600 border-t-transparent"></div>
          <p className="text-sm font-semibold text-slate-500">
            Memuat data tabel...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-xs">
      <div className="max-h-[calc(100vh-320px)] overflow-auto">
        <table className="w-full min-w-[760px] border-collapse text-sm">
          <thead className="sticky top-0 z-10 border-b border-slate-200 bg-slate-950 text-left text-[11px] font-bold uppercase tracking-wide text-slate-200 select-none">
            <tr>
              <th
                onClick={() => handleSort("No")}
                className="group w-16 cursor-pointer px-5 py-4 transition hover:bg-slate-900"
              >
                <div className="flex items-center gap-1">
                  <span>No</span>
                  {renderSortIcon("No")}
                </div>
              </th>
              <th
                onClick={() => handleSort("Provinsi")}
                className="group cursor-pointer px-5 py-4 transition hover:bg-slate-900"
              >
                <div className="flex items-center gap-1">
                  <span>Provinsi</span>
                  {renderSortIcon("Provinsi")}
                </div>
              </th>
              <th
                onClick={() => handleSort("Ibukota")}
                className="group cursor-pointer px-5 py-4 transition hover:bg-slate-900"
              >
                <div className="flex items-center gap-1">
                  <span>Ibu Kota</span>
                  {renderSortIcon("Ibukota")}
                </div>
              </th>
              <th
                onClick={() => handleSort("Luas_Wilayah")}
                className="group cursor-pointer px-5 py-4 text-right transition hover:bg-slate-900"
              >
                <div className="flex items-center justify-end gap-1">
                  <span>Luas Wilayah</span>
                  {renderSortIcon("Luas_Wilayah")}
                </div>
              </th>
              <th
                onClick={() => handleSort("Jumlah_Pulau")}
                className="group cursor-pointer px-5 py-4 text-right transition hover:bg-slate-900"
              >
                <div className="flex items-center justify-end gap-1">
                  <span>Jumlah Pulau</span>
                  {renderSortIcon("Jumlah_Pulau")}
                </div>
              </th>
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-100 bg-white">
            {processedData.length === 0 ? (
              <tr>
                <td
                  colSpan={5}
                  className="py-12 text-center text-sm font-medium text-slate-500"
                >
                  <span className="material-symbols-outlined mb-1 block text-3xl text-slate-300">
                    search_off
                  </span>
                  Tidak ada provinsi yang cocok dengan pencarian.
                </td>
              </tr>
            ) : (
              processedData.map((item, index) => (
                <tr
                  key={item.Provinsi}
                  className="transition hover:bg-blue-50/50"
                >
                  <td className="px-5 py-4">
                    <span className="inline-flex h-7 min-w-7 items-center justify-center rounded-full bg-slate-100 px-2 text-xs font-bold text-slate-600">
                      {index + 1}
                    </span>
                  </td>
                  <td className="px-5 py-4">
                    <div className="font-bold text-slate-900">
                      {item.Provinsi}
                    </div>
                  </td>
                  <td className="px-5 py-4 text-slate-600 font-medium">
                    {item.Ibu_Kota_Wilayah || "-"}
                  </td>
                  <td className="px-5 py-4 text-right font-semibold tabular-nums text-slate-700">
                    {formatNumber(item.Luas_Wilayah)}
                    <span className="ml-1 text-xs font-bold text-slate-400">
                      km²
                    </span>
                  </td>
                  <td className="px-5 py-4 text-right">
                    <span className="inline-flex items-center rounded-full bg-teal-50 px-3 py-1 text-sm font-bold tabular-nums text-teal-700 ring-1 ring-teal-100">
                      {formatNumber(item.Jumlah_Pulau)}
                    </span>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      <div className="flex items-center justify-between border-t border-slate-200 bg-slate-50 px-5 py-3 text-xs font-medium text-slate-500">
        <span>Menampilkan {processedData.length} dari {tableData.length} provinsi</span>
      </div>
    </div>
  );
}
