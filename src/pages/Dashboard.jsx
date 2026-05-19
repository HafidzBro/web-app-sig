import { useMemo, useState } from "react";
import MapView from "../components/MapView";
import SummaryCard from "../components/SummaryCard";

const defaultFilters = {
  area: { large: true, medium: true, small: true },
  islandCount: "all",
};

const summaryItems = [
  { title: "Total Provinces", value: "38", icon: "flag", tone: "blue" },
  { title: "Total Area", value: "1.9M", unit: "km2", icon: "landscape", tone: "teal" },
  { title: "Total Islands", value: "17,508", icon: "water", tone: "amber" },
];

function SearchBox({ value, data, onChange, onSelect, onClear }) {
  const results = useMemo(() => {
    const query = value.trim().toLowerCase();
    if (!query) return [];

    return data.filter(
      (item) =>
        item.provinsi.toLowerCase().includes(query) ||
        item.ibukota?.toLowerCase().includes(query),
    );
  }, [data, value]);

  return (
    <div className="relative w-full max-w-md">
      <span className="material-symbols-outlined pointer-events-none absolute left-3 top-1/2 z-10 -translate-y-1/2 text-[20px] text-slate-400">
        search
      </span>
      <input
        type="text"
        placeholder="Cari Provinsi / Ibukota..."
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="h-11 w-full rounded-lg border border-slate-200 bg-white pl-10 pr-11 text-sm font-medium text-slate-700 shadow-sm outline-none transition focus:border-blue-400 focus:ring-4 focus:ring-blue-100"
      />

      {value && (
        <button
          type="button"
          onClick={onClear}
          className="absolute right-2 top-1/2 z-10 flex h-7 w-7 -translate-y-1/2 items-center justify-center rounded-md text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
          aria-label="Hapus pencarian"
        >
          <span className="material-symbols-outlined text-[18px]">close</span>
        </button>
      )}

      {results.length > 0 && (
        <div className="absolute z-50 mt-2 max-h-72 w-full overflow-auto rounded-lg border border-slate-200 bg-white py-2 shadow-xl">
          {results.map((item) => (
            <button
              key={`${item.provinsi}-${item.ibukota}`}
              type="button"
              onClick={() => onSelect(item)}
              className="flex w-full items-center justify-between gap-3 px-4 py-3 text-left transition hover:bg-slate-50"
            >
              <span>
                <span className="block text-sm font-bold text-slate-900">{item.provinsi}</span>
                <span className="block text-xs text-slate-500">{item.ibukota}</span>
              </span>
              <span className="material-symbols-outlined text-[18px] text-slate-300">
                arrow_forward
              </span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

function FilterOption({ checked, label, description, onChange }) {
  return (
    <label
      className={`flex cursor-pointer items-start gap-3 rounded-lg border p-3.5 transition ${
        checked
          ? "border-blue-200 bg-blue-50/70 text-blue-950"
          : "border-slate-200 bg-white text-slate-700 hover:border-slate-300 hover:bg-slate-50"
      }`}
    >
      <input
        type="checkbox"
        checked={checked}
        onChange={onChange}
        className="sr-only"
      />
      <span
        className={`mt-1 h-2.5 w-2.5 shrink-0 rounded-full ${
          checked ? "bg-blue-600 ring-4 ring-blue-100" : "bg-slate-300"
        }`}
      />
      <span>
        <span className="block text-sm font-bold">{label}</span>
        {description && (
          <span className="mt-0.5 block text-xs font-medium text-slate-500">
            {description}
          </span>
        )}
      </span>
    </label>
  );
}

function FilterDrawer({
  isOpen,
  draftFilters,
  onClose,
  onApply,
  onReset,
  onAreaChange,
  setDraftFilters,
}) {
  return (
    <>
      <aside
        className={`fixed right-0 top-16 z-50 flex h-[calc(100vh-64px)] w-full max-w-sm flex-col border-l border-slate-200 bg-white shadow-2xl transition-transform duration-300 ease-out ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="border-b border-slate-200 bg-slate-950 p-6 text-white">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-blue-200">
                Spatial Filters
              </p>
              <h2 className="mt-1 text-xl font-bold">Advanced Filters</h2>
              <p className="mt-1 text-sm text-slate-300">Default menampilkan semua data.</p>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="flex h-9 w-9 items-center justify-center rounded-lg bg-white/10 text-slate-200 transition hover:bg-white/20 hover:text-white"
              aria-label="Close filters"
            >
              <span className="material-symbols-outlined text-[20px]">close</span>
            </button>
          </div>
        </div>

        <div className="flex-1 space-y-7 overflow-y-auto bg-slate-50 p-6">
          <div>
            <label className="mb-3 block text-xs font-bold uppercase tracking-wide text-slate-500">
              Area Scale (km2)
            </label>
            <div className="space-y-2">
              <FilterOption
                checked={draftFilters.area.large}
                label="> 50.000"
                description="Provinsi dengan luas wilayah besar"
                onChange={() => onAreaChange("large")}
              />
              <FilterOption
                checked={draftFilters.area.medium}
                label="10.000 - 50.000"
                description="Provinsi dengan luas wilayah menengah"
                onChange={() => onAreaChange("medium")}
              />
              <FilterOption
                checked={draftFilters.area.small}
                label="< 10.000"
                description="Provinsi dengan luas wilayah kecil"
                onChange={() => onAreaChange("small")}
              />
            </div>
          </div>

          <div>
            <label className="mb-3 block text-xs font-bold uppercase tracking-wide text-slate-500">
              Island Count
            </label>
            <div className="space-y-2">
              <FilterOption
                checked={draftFilters.islandCount === "all"}
                label="Semua"
                description="Tampilkan seluruh jumlah pulau"
                onChange={() => setDraftFilters({ ...draftFilters, islandCount: "all" })}
              />
              <FilterOption
                checked={draftFilters.islandCount === ">1000"}
                label="> 1.000"
                description="Provinsi dengan pulau sangat banyak"
                onChange={() => setDraftFilters({ ...draftFilters, islandCount: ">1000" })}
              />
              <FilterOption
                checked={draftFilters.islandCount === "100-1000"}
                label="100 - 1.000"
                description="Provinsi dengan pulau menengah"
                onChange={() => setDraftFilters({ ...draftFilters, islandCount: "100-1000" })}
              />
              <FilterOption
                checked={draftFilters.islandCount === "<100"}
                label="< 100"
                description="Provinsi dengan pulau sedikit"
                onChange={() => setDraftFilters({ ...draftFilters, islandCount: "<100" })}
              />
            </div>
          </div>
        </div>

        <div className="flex gap-3 border-t border-slate-200 p-5">
          <button
            type="button"
            onClick={onReset}
            className="h-11 flex-1 rounded-lg border border-slate-200 bg-white px-4 text-sm font-bold text-slate-700 transition hover:bg-slate-50"
          >
            Reset
          </button>
          <button
            type="button"
            onClick={onApply}
            className="h-11 flex-1 rounded-lg bg-blue-600 px-4 text-sm font-bold text-white shadow-sm transition hover:bg-blue-700"
          >
            Apply Filters
          </button>
        </div>
      </aside>

      {isOpen && (
        <button
          type="button"
          className="fixed inset-0 z-40 bg-slate-950/30 backdrop-blur-[1px]"
          onClick={onClose}
          aria-label="Close filter overlay"
        />
      )}
    </>
  );
}

export default function Dashboard() {
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [draftFilters, setDraftFilters] = useState(defaultFilters);
  const [appliedFilters, setAppliedFilters] = useState(defaultFilters);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchData, setSearchData] = useState([]);
  const [selectedLocation, setSelectedLocation] = useState(null);

  const handleAreaChange = (scale) => {
    setDraftFilters((prev) => ({
      ...prev,
      area: { ...prev.area, [scale]: !prev.area[scale] },
    }));
  };

  const handleApply = () => {
    setAppliedFilters(draftFilters);
    setIsFilterOpen(false);
  };

  const handleReset = () => {
    setDraftFilters(defaultFilters);
    setAppliedFilters(defaultFilters);
  };

  const handleSelect = (item) => {
    setSearchQuery(item.provinsi);
    setSelectedLocation(item);
  };

  const handleClearSearch = () => {
    setSearchQuery("");
    setSelectedLocation(null);
  };

  return (
    <>
      <main className="h-[calc(100vh-64px)] overflow-y-auto bg-slate-50 p-6">
        <div className="mb-6 flex flex-col gap-2">
          <p className="text-sm font-semibold text-blue-700">Dashboard</p>
          <h1 className="text-2xl font-bold tracking-tight text-slate-950">
            Peta Wilayah Indonesia
          </h1>
        </div>

        <div className="mb-6 grid grid-cols-1 gap-5 md:grid-cols-3">
          {summaryItems.map((item) => (
            <SummaryCard key={item.title} {...item} />
          ))}
        </div>

        <div className="mb-5 flex flex-col gap-3 rounded-xl border border-slate-200 bg-white p-4 shadow-sm lg:flex-row lg:items-center lg:justify-between">
          <SearchBox
            value={searchQuery}
            data={searchData}
            onChange={setSearchQuery}
            onSelect={handleSelect}
            onClear={handleClearSearch}
          />

          <button
            type="button"
            onClick={() => setIsFilterOpen(true)}
            className="inline-flex h-11 items-center justify-center gap-2 rounded-lg border border-slate-200 bg-slate-950 px-4 text-sm font-bold text-white shadow-sm transition hover:bg-slate-800"
          >
            <span className="material-symbols-outlined text-[18px]">filter_alt</span>
            Advanced Filters
          </button>
        </div>

        <MapView
          filters={appliedFilters}
          onDataLoaded={setSearchData}
          selectedLocation={selectedLocation}
        />
      </main>

      <FilterDrawer
        isOpen={isFilterOpen}
        draftFilters={draftFilters}
        onClose={() => setIsFilterOpen(false)}
        onApply={handleApply}
        onReset={handleReset}
        onAreaChange={handleAreaChange}
        setDraftFilters={setDraftFilters}
      />
    </>
  );
}
