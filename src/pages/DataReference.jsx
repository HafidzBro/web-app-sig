import Table from "../components/Table";
import csvData from "../data/data.csv?raw";

export default function DataReference() {
  const handleExportCSV = () => {
    const blob = new Blob([csvData], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");

    link.href = url;
    link.setAttribute("download", "Data_Nusantara_BPS_2025.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <main className="h-[calc(100vh-64px)] overflow-y-auto bg-slate-50 p-6">
      <div className="mb-6 flex flex-col gap-2">
        <p className="text-sm font-semibold text-blue-700">Data Reference</p>
        <h1 className="text-2xl font-bold tracking-tight text-slate-950">
          Master Data Wilayah
        </h1>
      </div>

      <section className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
        <div className="flex flex-col gap-4 border-b border-slate-200 p-6 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h2 className="text-xl font-bold text-slate-950">Referensi Provinsi</h2>
            <p className="mt-1 max-w-2xl text-sm font-medium text-slate-500">
              Data luas wilayah dan jumlah pulau per provinsi berdasarkan dataset BPS 2025.
            </p>
          </div>

          <button
            type="button"
            onClick={handleExportCSV}
            className="inline-flex h-11 items-center justify-center gap-2 rounded-lg bg-slate-950 px-4 text-sm font-bold text-white shadow-sm transition hover:bg-slate-800"
          >
            <span className="material-symbols-outlined text-[18px]">download</span>
            Export CSV
          </button>
        </div>

        <div className="bg-slate-50 p-4">
          <Table />
        </div>
      </section>
    </main>
  );
}
