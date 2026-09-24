import { useEffect, useMemo, useRef, useState } from "react";
import {
  MapContainer,
  TileLayer,
  GeoJSON,
  ZoomControl,
  useMap,
} from "react-leaflet";
import L from "leaflet";
import { useProvince } from "../context/ProvinceContext";
import "../styles/map.css";

const normalize = (str) => str?.toLowerCase().trim();

const mapModes = [
  { id: "luas", label: "Area", icon: "map" },
  { id: "pulau", label: "Islands", icon: "hub" },
  { id: "ibukota", label: "Capitals", icon: "location_city" },
];

const baseMaps = [
  {
    id: "positron",
    label: "Clean Light",
    icon: "light_mode",
    url: "https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png",
    attribution:
      '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
  },
  {
    id: "osm",
    label: "Street",
    icon: "map",
    url: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
    attribution:
      '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
  },
  {
    id: "satellite",
    label: "Satelit",
    icon: "satellite_alt",
    url: "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
    attribution: "Tiles &copy; Esri &mdash; Source: Esri, USGS",
  },
];

const legends = {
  luas: {
    title: "Area Legend",
    unit: "km2",
    items: [
      { label: "> 50.000", color: "#075985" },
      { label: "10.000 - 50.000", color: "#0284c7" },
      { label: "< 10.000", color: "#93c5fd" },
    ],
  },
  pulau: {
    title: "Islands Legend",
    unit: "pulau",
    items: [
      { label: "> 1.000", color: "#0f766e" },
      { label: "100 - 1.000", color: "#14b8a6" },
      { label: "< 100", color: "#99f6e4" },
    ],
  },
};

function formatNumber(value) {
  return value ? value.toLocaleString("id-ID") : "-";
}

function createSelectedProvince(properties) {
  return {
    provinsi: properties.provinsi,
    ibukota: properties.ibukota,
    luas: properties.luas,
    pulau: properties.jumlah_pulau,
    lat: properties.lat,
    lng: properties.lng,
  };
}

const capitalIcon = L.divIcon({
  className: "capital-marker-icon",
  html: `
    <div class="capital-pin">
      <div class="capital-pin-ring"></div>
      <div class="capital-pin-dot"></div>
    </div>
  `,
  iconSize: [24, 24],
  iconAnchor: [12, 12],
});

function MapControls({ mode, setMode, baseMap, setBaseMap }) {
  return (
    <div className="absolute right-4 top-4 z-[500] flex flex-col items-end gap-2 sm:flex-row sm:items-center">
      {/* Layer Mode Capsule */}
      <div
        className="flex items-center rounded-full border border-slate-200/90 bg-white/95 p-1 shadow-md backdrop-blur-md"
        onMouseDown={(e) => e.stopPropagation()}
        onClick={(e) => e.stopPropagation()}
      >
        {mapModes.map((item) => {
          const isActive = mode === item.id;
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => setMode(item.id)}
              title={item.label}
              className={`group relative flex h-8 items-center rounded-full transition-all duration-300 ease-out cursor-pointer ${
                isActive
                  ? "bg-blue-600 text-white px-3 shadow-xs"
                  : "w-8 justify-center text-slate-500 hover:bg-slate-100 hover:text-slate-900"
              }`}
            >
              <span className="material-symbols-outlined text-[18px] shrink-0">
                {item.icon}
              </span>
              <span
                className={`whitespace-nowrap text-xs font-bold transition-all duration-300 ease-out ${
                  isActive
                    ? "max-w-[80px] opacity-100 ml-1.5"
                    : "max-w-0 opacity-0 overflow-hidden"
                }`}
              >
                {item.label}
              </span>
            </button>
          );
        })}
      </div>

      {/* Base Map Capsule */}
      <div
        className="flex items-center rounded-full border border-slate-200/90 bg-white/95 p-1 shadow-md backdrop-blur-md"
        onMouseDown={(e) => e.stopPropagation()}
        onClick={(e) => e.stopPropagation()}
      >
        {baseMaps.map((b) => {
          const isActive = baseMap === b.id;
          return (
            <button
              key={b.id}
              type="button"
              onClick={() => setBaseMap(b.id)}
              title={`Peta Dasar: ${b.label}`}
              className={`group relative flex h-8 items-center rounded-full transition-all duration-300 ease-out cursor-pointer ${
                isActive
                  ? "bg-slate-900 text-white px-3 shadow-xs"
                  : "w-8 justify-center text-slate-500 hover:bg-slate-100 hover:text-slate-900"
              }`}
            >
              <span className="material-symbols-outlined text-[17px] shrink-0">
                {b.icon}
              </span>
              <span
                className={`whitespace-nowrap text-xs font-bold transition-all duration-300 ease-out ${
                  isActive
                    ? "max-w-[90px] opacity-100 ml-1.5"
                    : "max-w-0 opacity-0 overflow-hidden"
                }`}
              >
                {b.label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

function ResetViewButton() {
  const map = useMap();

  return (
    <div
      className="absolute bottom-[28px] right-[58px] z-[500]"
      onMouseDown={(e) => e.stopPropagation()}
      onClick={(e) => e.stopPropagation()}
      onDoubleClick={(e) => e.stopPropagation()}
    >
      <button
        type="button"
        onClick={() => {
          map.flyTo([-2.5, 118], 5, { duration: 1.2 });
        }}
        className="flex h-[34px] items-center gap-1.5 rounded-lg border border-slate-200 bg-white/95 px-3 text-xs font-bold text-slate-700 shadow-md transition hover:bg-slate-100 hover:text-slate-950 backdrop-blur active:scale-95"
        title="Reset tampilan peta ke seluruh Indonesia"
      >
        <span className="material-symbols-outlined text-[17px] text-blue-600">
          restart_alt
        </span>
        <span>Reset View</span>
      </button>
    </div>
  );
}

function FlyToLocation({ location }) {
  const map = useMap();

  useEffect(() => {
    if (location?.lat && location?.lng) {
      map.flyTo([location.lat, location.lng], 8, { duration: 1.2 });
    }
  }, [location, map]);

  return null;
}

function ResizeMap() {
  const map = useMap();

  useEffect(() => {
    const container = map.getContainer();
    const resizeObserver = new ResizeObserver(() => {
      map.invalidateSize();
    });

    resizeObserver.observe(container);
    setTimeout(() => map.invalidateSize(), 0);

    return () => resizeObserver.disconnect();
  }, [map]);

  return null;
}

function MapLegend({ mode }) {
  const legend = legends[mode];
  if (!legend) return null;

  return (
    <div className="absolute bottom-4 left-4 z-[500] w-52 rounded-lg bg-white/95 p-3 shadow-sm ring-1 ring-slate-200 backdrop-blur">
      <p className="text-[11px] font-bold uppercase tracking-wide text-slate-500">
        {legend.title}
      </p>
      <div className="mt-3 space-y-2">
        {legend.items.map((item) => (
          <div
            key={item.label}
            className="flex items-center justify-between gap-3"
          >
            <div className="flex items-center gap-2">
              <span
                className="h-3 w-6 rounded-sm ring-1 ring-black/5"
                style={{ backgroundColor: item.color }}
              />
              <span className="text-xs font-semibold text-slate-700">
                {item.label}
              </span>
            </div>
            <span className="text-[11px] font-medium text-slate-400">
              {legend.unit}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

function DetailMetric({ icon, label, value, unit }) {
  return (
    <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
      <div className="mb-3 flex h-9 w-9 items-center justify-center rounded-lg bg-blue-50 text-blue-700">
        <span className="material-symbols-outlined text-[20px]">{icon}</span>
      </div>
      <p className="text-[11px] font-bold uppercase tracking-wide text-slate-500">
        {label}
      </p>
      <p className="mt-1 text-xl font-bold text-slate-950">
        {value}
        {unit && (
          <span className="ml-1 text-sm font-semibold text-slate-500">
            {unit}
          </span>
        )}
      </p>
    </div>
  );
}

function ProvinceDetailPanel({ selected }) {
  if (!selected) {
    return (
      <div className="flex min-h-[500px] flex-1 flex-col items-center justify-center bg-slate-50 px-6 text-center text-slate-500">
        <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-xl bg-white text-blue-700 shadow-sm ring-1 ring-slate-200">
          <span className="material-symbols-outlined text-[30px]">
            touch_app
          </span>
        </div>
        <p className="text-sm font-semibold text-slate-700">Pilih provinsi</p>
        <p className="mt-1 max-w-52 text-sm">
          Klik area provinsi atau marker ibu kota untuk melihat detail.
        </p>
      </div>
    );
  }

  return (
    <aside className="flex min-h-[420px] flex-1 flex-col overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm sm:min-h-[500px] max-h-[calc(100vh-2rem)] xl:max-h-[560px]">
      <div className="border-b border-slate-200 bg-slate-950 p-6 text-white">
        <p className="text-xs font-bold uppercase tracking-wider text-blue-200">
          Detail Provinsi
        </p>
        <h2 className="mt-2 text-2xl font-bold tracking-tight">
          {selected.provinsi}
        </h2>
        <div className="mt-4 inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1.5 text-sm text-slate-100 ring-1 ring-white/15">
          <span className="material-symbols-outlined text-[17px]">
            location_city
          </span>
          <span>{selected.ibukota || "-"}</span>
        </div>
      </div>

      <div className="min-h-0 flex-1 space-y-4 overflow-y-auto bg-slate-50 p-5">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
          <DetailMetric
            icon="landscape"
            label="Total Area"
            value={formatNumber(selected.luas)}
            unit="km2"
          />
          <DetailMetric
            icon="water"
            label="Jumlah Pulau"
            value={formatNumber(selected.pulau)}
          />
        </div>

        <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
          <div className="mb-3 flex items-center gap-2 text-slate-700">
            <span className="material-symbols-outlined text-[19px] text-blue-700">
              my_location
            </span>
            <p className="text-sm font-bold">Coordinates</p>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="rounded-md bg-slate-50 p-3">
              <p className="text-[10px] font-bold uppercase tracking-wide text-slate-400">
                Latitude
              </p>
              <p className="mt-1 text-sm font-semibold text-slate-800">
                {selected.lat ? selected.lat.toFixed(4) : "-"}
              </p>
            </div>
            <div className="rounded-md bg-slate-50 p-3 text-right">
              <p className="text-[10px] font-bold uppercase tracking-wide text-slate-400">
                Longitude
              </p>
              <p className="mt-1 text-sm font-semibold text-slate-800">
                {selected.lng ? selected.lng.toFixed(4) : "-"}
              </p>
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
}

export default function MapView({
  filters,
  onManualSelect,
  selectedLocation,
}) {
  const { geoData: baseData, capitalData, isLoading, error: loadError } =
    useProvince();

  const [mode, setMode] = useState("luas");
  const [baseMap, setBaseMap] = useState("positron");
  const [selected, setSelected] = useState(null);

  const selectedFromSearch = useMemo(() => {
    if (!selectedLocation || !baseData) return null;

    const nama = normalize(selectedLocation.provinsi);
    const prov = baseData.features.find(
      (f) => normalize(f.properties.provinsi) === nama,
    );

    return prov ? createSelectedProvince(prov.properties) : null;
  }, [selectedLocation, baseData]);

  const activeSelected = selectedFromSearch || selected;
  const selectedName = normalize(activeSelected?.provinsi);

  // Set default selected to DKI Jakarta on initial load if none selected
  useEffect(() => {
    if (baseData && !selected && !selectedLocation) {
      const jakarta = baseData.features.find(
        (f) => normalize(f.properties.provinsi) === "dki jakarta",
      );
      if (jakarta) {
        setSelected(createSelectedProvince(jakarta.properties));
      }
    }
  }, [baseData, selected, selectedLocation]);

  const dataMap = useMemo(() => {
    if (!baseData) return null;
    if (!filters) return baseData;

    const filteredFeatures = baseData.features.filter((f) => {
      const luas = f.properties.luas || 0;
      const pulau = f.properties.jumlah_pulau || 0;

      let passArea = false;
      if (!filters.area.large && !filters.area.medium && !filters.area.small)
        passArea = true;
      if (filters.area.large && luas >= 50000) passArea = true;
      if (filters.area.medium && luas >= 10000 && luas < 50000) passArea = true;
      if (filters.area.small && luas < 10000) passArea = true;

      let passIsland = false;
      if (filters.islandCount === "all") passIsland = true;
      if (filters.islandCount === ">1000" && pulau > 1000) passIsland = true;
      if (filters.islandCount === "100-1000" && pulau >= 100 && pulau <= 1000)
        passIsland = true;
      if (filters.islandCount === "<100" && pulau < 100) passIsland = true;

      return passArea && passIsland;
    });

    return { ...baseData, features: filteredFeatures };
  }, [baseData, filters]);

  const getColor = (value) => {
    if (mode === "luas") {
      return value > 50000
        ? "#075985"
        : value >= 10000
        ? "#0284c7"
        : "#93c5fd";
    }

    if (mode === "pulau") {
      return value > 1000 ? "#0f766e" : value >= 100 ? "#14b8a6" : "#99f6e4";
    }

    return "#cbd5e1";
  };

  const style = (feature) => {
    const isSelected = normalize(feature.properties.provinsi) === selectedName;

    if (mode === "ibukota") {
      return {
        fillOpacity: isSelected ? 0.25 : 0.05,
        fillColor: "#f59e0b",
        weight: isSelected ? 3.5 : 1,
        color: isSelected ? "#d97706" : "#cbd5e1",
      };
    }

    const value =
      mode === "luas"
        ? feature.properties.luas
        : feature.properties.jumlah_pulau;

    return {
      fillColor: getColor(value),
      weight: isSelected ? 3.5 : 1,
      color: isSelected ? "#1d4ed8" : "#ffffff",
      fillOpacity: isSelected ? 0.95 : 0.78,
    };
  };

  const onEachFeature = (feature, layer) => {
    const p = feature.properties;
    const metricText =
      mode === "luas"
        ? `Luas: ${formatNumber(p.luas)} km²`
        : mode === "pulau"
        ? `Pulau: ${formatNumber(p.jumlah_pulau)} pulau`
        : `Ibu Kota: ${p.ibukota || "-"}`;

    layer.bindTooltip(
      `
      <div class="map-tooltip">
        <span class="map-tooltip-title">${p.provinsi}</span>
        <span class="map-tooltip-sub">${metricText}</span>
      </div>
      `,
      { sticky: true, className: "custom-leaflet-tooltip" },
    );

    layer.on({
      mouseover: (e) => {
        const isSel = normalize(p.provinsi) === selectedName;
        if (!isSel) {
          e.target.setStyle({
            weight: 2.5,
            color: "#2563eb",
            fillOpacity: 0.9,
          });
          e.target.bringToFront();
        }
      },
      mouseout: (e) => {
        const isSel = normalize(p.provinsi) === selectedName;
        if (!isSel) {
          e.target.setStyle(style(feature));
        }
      },
      click: () => {
        if (onManualSelect) onManualSelect();
        setSelected(createSelectedProvince(feature.properties));
        layer.bringToFront();
      },
    });
  };

  const onEachCapital = (f, layer) => {
    const nama = normalize(f.properties.provinsi);
    const prov = baseData?.features.find(
      (d) => normalize(d.properties.provinsi) === nama,
    );

    layer.bindTooltip(
      `
      <div class="map-tooltip">
        <span class="map-tooltip-title">${f.properties.ibukota}</span>
        <span class="map-tooltip-sub">Ibu Kota ${f.properties.provinsi}</span>
      </div>
      `,
      { sticky: true, className: "custom-leaflet-tooltip" },
    );

    layer.on({
      click: () => {
        if (onManualSelect) onManualSelect();

        setSelected({
          provinsi: f.properties.provinsi,
          ibukota: f.properties.ibukota,
          luas: prov?.properties.luas,
          pulau: prov?.properties.jumlah_pulau,
          lat: f.geometry.coordinates[1],
          lng: f.geometry.coordinates[0],
        });
      },
    });
  };

  const activeBaseMapConfig =
    baseMaps.find((b) => b.id === baseMap) || baseMaps[0];

  return (
    <section className="grid h-full grid-cols-1 gap-6 xl:grid-cols-[minmax(0,2fr)_minmax(320px,0.9fr)]">
      <div className="relative z-0 h-[560px] overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
        {/* Layer aktif badge */}
        <div className="absolute left-4 top-4 z-[500] rounded-lg bg-white/95 px-3 py-2 shadow-sm ring-1 ring-slate-200 backdrop-blur">
          <p className="text-[11px] font-bold uppercase tracking-wide text-slate-500">
            Layer aktif
          </p>
          <p className="text-sm font-semibold text-slate-900">
            {mapModes.find((item) => item.id === mode)?.label}
          </p>
        </div>

        {/* Loading Skeleton */}
        {isLoading && (
          <div className="absolute inset-0 z-[600] flex flex-col items-center justify-center bg-slate-100/80 backdrop-blur-xs">
            <div className="h-10 w-10 animate-spin rounded-full border-4 border-blue-600 border-t-transparent"></div>
            <p className="mt-3 text-sm font-bold text-slate-800">
              Memuat data spasial Nusantara...
            </p>
          </div>
        )}

        <MapContainer
          center={[-2.5, 118]}
          zoom={5}
          zoomControl={false}
          className="h-full w-full"
        >
          <ZoomControl position="bottomright" />
          <ResetViewButton />
          <ResizeMap />

          <TileLayer
            key={activeBaseMapConfig.id}
            url={activeBaseMapConfig.url}
            attribution={activeBaseMapConfig.attribution}
          />

          <MapControls
            mode={mode}
            setMode={setMode}
            baseMap={baseMap}
            setBaseMap={setBaseMap}
          />

          {selectedLocation && <FlyToLocation location={selectedLocation} />}

          {dataMap && (
            <GeoJSON
              key={`${JSON.stringify(filters)}-${mode}-${selectedName || "none"}`}
              data={dataMap}
              style={style}
              onEachFeature={onEachFeature}
            />
          )}

          {mode === "ibukota" && capitalData && (
            <GeoJSON
              data={capitalData}
              pointToLayer={(f, latlng) =>
                L.marker(latlng, { icon: capitalIcon })
              }
              onEachFeature={onEachCapital}
            />
          )}
        </MapContainer>

        <MapLegend mode={mode} />

        {loadError && (
          <div className="absolute inset-x-4 top-20 z-[500] rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-700 shadow-sm">
            {loadError}
          </div>
        )}
      </div>

      <ProvinceDetailPanel selected={activeSelected} />
    </section>
  );
}
