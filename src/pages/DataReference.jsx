import { useState } from "react";
import Table from "../components/Table";
import { useProvince } from "../context/ProvinceContext";
import csvData from "../data/data.csv?raw";

function formatCompact(value) {
  return Intl.NumberFormat("id-ID", {
    maximumFractionDigits: 1,
    notation: "compact",
  }).format(value);
}

export default function DataReference() {
  const { summary } = useProvince();
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredRows, setFilteredRows] = useState([]);

  const handleExportCSV = () => {
    let outputCsv = csvData;

    // If there is an active search filter, export the filtered rows
    if (searchQuery.trim() && filteredRows.length > 0) {
      const headers = [
        "Provinsi",
        "Ibu_Kota_Wilayah",
        "Luas_Wilayah",
        "Persentase_Terhadap_Luas_Wilayah",
        "Jumlah_Pulau",
      ];
      const rows = filteredRows.map((r) => [
        `"${r.Provinsi}"`,
        `"${r.Ibu_Kota_Wilayah || ""}"`,
        r.Luas_Wilayah,
        r.Persentase_Terhadap_Luas_Wilayah,
        r.Jumlah_Pulau,
      ]);
      outputCsv = [headers.join(","), ...rows.map((r) => r.join(","))].join(
        "\n",
      );
    }

    const blob = new Blob([outputCsv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");

    link.href = url;
    link.setAttribute(
      "download",
      searchQuery.trim()
        ? `Data_Nusantara_Filtered_${searchQuery}.csv`
        : "Data_Nusantara_BPS_2025.csv",
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <main className="h-[calc(100vh-64px)] overflow-y-auto bg-slate-50 p-4 sm:p-6">
      <div className="mb-6 flex flex-col gap-2">
        <p className="text-sm font-semibold text-blue-700">Data Reference</p>
        <h1 className="text-2xl font-bold tracking-tight text-slate-950">
          Master Data Wilayah
        </h1>
      </div>

      {/* Quick Statistics Banner */}
      <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-xs">
          <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
            Total Wilayah
          </p>
          <p className="mt-1 text-2xl font-extrabold text-slate-900">
            {summary.provinces}{" "}
            <span className="text-sm font-medium text-slate-500">Provinsi</span>
          </p>
          <p className="mt-1 text-xs text-slate-500">
            Tersebar di seluruh Indonesia
          </p>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-xs">
          <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
            Rata-rata Luas
          </p>
          <p className="mt-1 text-2xl font-extrabold text-blue-700">
            {formatCompact(summary.avgArea)}{" "}
            <span className="text-sm font-medium text-slate-500">km²</span>
          </p>
          <p className="mt-1 text-xs text-slate-500">Per provinsi rata-rata</p>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-xs">
          <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
            Provinsi Terluas
          </p>
          <p className="mt-1 truncate text-lg font-bold text-slate-900">
            {summary.largestProvince?.Provinsi || "-"}
          </p>
          <p className="mt-0.5 text-xs font-semibold text-teal-700">
            {Number(summary.largestProvince?.Luas_Wilayah || 0).toLocaleString(
              "id-ID",
            )}{" "}
            km²
          </p>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-xs">
          <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
            Provinsi Terkecil
          </p>
          <p className="mt-1 truncate text-lg font-bold text-slate-900">
            {summary.smallestProvince?.Provinsi || "-"}
          </p>
          <p className="mt-0.5 text-xs font-semibold text-amber-700">
            {Number(summary.smallestProvince?.Luas_Wilayah || 0).toLocaleString(
              "id-ID",
            )}{" "}
            km²
          </p>
        </div>
      </div>

      {/* Main Table Section */}
      <section className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
        <div className="flex flex-col gap-4 border-b border-slate-200 p-5 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h2 className="text-xl font-bold text-slate-950">
              Referensi Provinsi
            </h2>
            <p className="mt-1 max-w-2xl text-sm font-medium text-slate-500">
              Data luas wilayah dan jumlah pulau per provinsi berdasarkan dataset
              BPS 2025.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {/* Search Input for Table */}
            <div className="relative min-w-[240px]">
              <span className="material-symbols-outlined pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[18px] text-slate-400">
                search
              </span>
              <input
                type="text"
                placeholder="Cari dalam tabel..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="h-10 w-full rounded-lg border border-slate-200 bg-slate-50 pl-9 pr-8 text-xs font-medium text-slate-700 outline-none transition focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-100"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery("")}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  <span className="material-symbols-outlined text-[16px]">
                    close
                  </span>
                </button>
              )}
            </div>

            <button
              type="button"
              onClick={handleExportCSV}
              className="inline-flex h-10 items-center justify-center gap-2 rounded-lg bg-slate-950 px-4 text-xs font-bold text-white shadow-sm transition hover:bg-slate-800"
            >
              <span className="material-symbols-outlined text-[16px]">
                download
              </span>
              Export CSV
            </button>
          </div>
        </div>

        <div className="bg-slate-50 p-4">
          <Table
            searchQuery={searchQuery}
            onFilteredDataChange={setFilteredRows}
          />
        </div>
      </section>
    </main>
  );
}
