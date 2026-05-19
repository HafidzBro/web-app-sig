import { useEffect, useMemo, useState } from "react";
import { MapContainer, TileLayer, GeoJSON, ZoomControl, useMap } from "react-leaflet";
import Papa from "papaparse";
import L from "leaflet";

import geojsonData from "../data/provinsi.json";
import ibukotaGeoJSON from "../data/ibukota.json";
import csvFile from "../data/data.csv?url";
import "../styles/map.css";

const normalize = (str) => str?.toLowerCase().trim();

const mapModes = [
  { id: "luas", label: "Area", icon: "map" },
  { id: "pulau", label: "Islands", icon: "hub" },
  { id: "ibukota", label: "Capitals", icon: "location_city" },
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

function LayerControl({ mode, setMode }) {
  const map = useMap();

  useEffect(() => {
    const control = L.control({ position: "topright" });

    control.onAdd = function () {
      const div = L.DomUtil.create("div", "custom-control");
      L.DomEvent.disableClickPropagation(div);

      div.innerHTML = mapModes
        .map(
          (item) => `
            <button
              type="button"
              data-mode="${item.id}"
              class="${mode === item.id ? "is-active" : ""}"
              title="${item.label}"
            >
              <span class="material-symbols-outlined">${item.icon}</span>
              <span>${item.label}</span>
            </button>
          `,
        )
        .join("");

      div.querySelectorAll("button").forEach((button) => {
        button.addEventListener("click", () => setMode(button.dataset.mode));
      });

      return div;
    };

    control.addTo(map);

    return () => control.remove();
  }, [map, mode, setMode]);

  return null;
}

function FlyToLocation({ location }) {
  const map = useMap();

  useEffect(() => {
    if (location) {
      map.flyTo([location.lat, location.lng], 8);
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
          <div key={item.label} className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <span
                className="h-3 w-6 rounded-sm ring-1 ring-black/5"
                style={{ backgroundColor: item.color }}
              />
              <span className="text-xs font-semibold text-slate-700">{item.label}</span>
            </div>
            <span className="text-[11px] font-medium text-slate-400">{legend.unit}</span>
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
        {unit && <span className="ml-1 text-sm font-semibold text-slate-500">{unit}</span>}
      </p>
    </div>
  );
}

function ProvinceDetailPanel({ selected }) {
  if (!selected) {
    return (
      <div className="flex min-h-[500px] flex-1 flex-col items-center justify-center bg-slate-50 px-6 text-center text-slate-500">
        <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-xl bg-white text-blue-700 shadow-sm ring-1 ring-slate-200">
          <span className="material-symbols-outlined text-[30px]">touch_app</span>
        </div>
        <p className="text-sm font-semibold text-slate-700">Pilih provinsi</p>
        <p className="mt-1 max-w-52 text-sm">
          Klik area provinsi atau marker ibu kota untuk melihat detail.
        </p>
      </div>
    );
  }

  return (
    <aside className="flex min-h-[500px] flex-1 flex-col overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
      <div className="border-b border-slate-200 bg-slate-950 p-6 text-white">
        <p className="text-xs font-bold uppercase tracking-wider text-blue-200">
          Detail Provinsi
        </p>
        <h2 className="mt-2 text-2xl font-bold tracking-tight">{selected.provinsi}</h2>
        <div className="mt-4 inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1.5 text-sm text-slate-100 ring-1 ring-white/15">
          <span className="material-symbols-outlined text-[17px]">location_city</span>
          <span>{selected.ibukota || "-"}</span>
        </div>
      </div>

      <div className="flex-1 space-y-4 bg-slate-50 p-5">
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

export default function MapView({ filters, onDataLoaded, selectedLocation }) {
  const [baseData, setBaseData] = useState(null);
  const [mode, setMode] = useState("luas");
  const [selected, setSelected] = useState(null);
  const selectedName = normalize(selected?.provinsi);

  useEffect(() => {
    Papa.parse(csvFile, {
      download: true,
      header: true,
      complete: (res) => {
        const csvMap = {};
        const capitalMap = {};

        res.data.forEach((d) => {
          if (d.Provinsi) {
            csvMap[normalize(d.Provinsi)] = {
              luas: parseFloat(d.Luas_Wilayah) || 0,
              jumlah_pulau: parseInt(d.Jumlah_Pulau) || 0,
            };
          }
        });

        ibukotaGeoJSON.features.forEach((f) => {
          const nama = normalize(f.properties.provinsi);

          capitalMap[nama] = {
            ibukota: f.properties.ibukota,
            lat: f.geometry.coordinates[1],
            lng: f.geometry.coordinates[0],
          };
        });

        const merged = {
          ...geojsonData,
          features: geojsonData.features.map((f) => {
            const nama = normalize(f.properties.provinsi);

            return {
              ...f,
              properties: {
                ...f.properties,
                ...csvMap[nama],
                ...capitalMap[nama],
              },
            };
          }),
        };

        setBaseData(merged);

        if (onDataLoaded) {
          const list = merged.features.map((f) => ({
            provinsi: f.properties.provinsi,
            ibukota: f.properties.ibukota,
            lat: f.properties.lat,
            lng: f.properties.lng,
          }));
          onDataLoaded(list);
        }

        const jakarta = merged.features.find(
          (f) => normalize(f.properties.provinsi) === "dki jakarta",
        );

        if (jakarta) {
          setSelected(createSelectedProvince(jakarta.properties));
        }
      },
    });
  }, [onDataLoaded]);

  useEffect(() => {
    if (selectedLocation && baseData) {
      const nama = normalize(selectedLocation.provinsi);
      const prov = baseData.features.find(
        (f) => normalize(f.properties.provinsi) === nama,
      );

      if (prov) {
        // Search selection comes from the dashboard and must update the map detail panel.
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setSelected(createSelectedProvince(prov.properties));
      }
    }
  }, [selectedLocation, baseData]);

  const dataMap = useMemo(() => {
    if (!baseData) return null;
    if (!filters) return baseData;

    const filteredFeatures = baseData.features.filter((f) => {
      const luas = f.properties.luas || 0;
      const pulau = f.properties.jumlah_pulau || 0;

      let passArea = false;
      if (!filters.area.large && !filters.area.medium && !filters.area.small) passArea = true;
      if (filters.area.large && luas >= 50000) passArea = true;
      if (filters.area.medium && luas >= 10000 && luas < 50000) passArea = true;
      if (filters.area.small && luas < 10000) passArea = true;

      let passIsland = false;
      if (filters.islandCount === "all") passIsland = true;
      if (filters.islandCount === ">1000" && pulau > 1000) passIsland = true;
      if (filters.islandCount === "100-1000" && pulau >= 100 && pulau <= 1000) passIsland = true;
      if (filters.islandCount === "<100" && pulau < 100) passIsland = true;

      return passArea && passIsland;
    });

    return { ...baseData, features: filteredFeatures };
  }, [baseData, filters]);

  const getColor = (value) => {
    if (mode === "luas") {
      return value > 50000 ? "#075985" : value >= 10000 ? "#0284c7" : "#93c5fd";
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
        fillOpacity: isSelected ? 0.18 : 0,
        fillColor: "#f59e0b",
        weight: isSelected ? 3 : 1,
        color: isSelected ? "#f59e0b" : "#cbd5e1",
      };
    }

    const value =
      mode === "luas" ? feature.properties.luas : feature.properties.jumlah_pulau;

    return {
      fillColor: getColor(value),
      weight: isSelected ? 4 : 1,
      color: isSelected ? "#f59e0b" : "white",
      fillOpacity: isSelected ? 0.95 : 0.78,
      dashArray: isSelected ? "6 4" : undefined,
    };
  };

  const onEachFeature = (feature, layer) => {
    layer.on({
      click: () => {
        setSelected(createSelectedProvince(feature.properties));
        layer.bringToFront();
      },
    });
  };

  const onEachCapital = (f, layer) => {
    layer.on({
      click: () => {
        const nama = normalize(f.properties.provinsi);
        const prov = baseData?.features.find(
          (d) => normalize(d.properties.provinsi) === nama,
        );

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

  return (
    <section className="grid h-full grid-cols-1 gap-6 xl:grid-cols-[minmax(0,2fr)_minmax(320px,0.9fr)]">
      <div className="relative z-0 h-[560px] overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
        <div className="absolute left-4 top-4 z-[500] rounded-lg bg-white/95 px-3 py-2 shadow-sm ring-1 ring-slate-200 backdrop-blur">
          <p className="text-[11px] font-bold uppercase tracking-wide text-slate-500">
            Layer aktif
          </p>
          <p className="text-sm font-semibold text-slate-900">
            {mapModes.find((item) => item.id === mode)?.label}
          </p>
        </div>

        <MapContainer
          center={[-2.5, 118]}
          zoom={5}
          zoomControl={false}
          className="h-full w-full"
        >
          <ZoomControl position="bottomright" />
          <ResizeMap />
          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

          <LayerControl mode={mode} setMode={setMode} />

          {selectedLocation && <FlyToLocation location={selectedLocation} />}

          {dataMap && (
            <GeoJSON
              key={`${JSON.stringify(filters)}-${mode}-${selectedName || "none"}`}
              data={dataMap}
              style={style}
              onEachFeature={onEachFeature}
            />
          )}

          {mode === "ibukota" && (
            <GeoJSON
              data={ibukotaGeoJSON}
              pointToLayer={(f, latlng) => L.marker(latlng)}
              onEachFeature={onEachCapital}
            />
          )}
        </MapContainer>

        <MapLegend mode={mode} />
      </div>

      <ProvinceDetailPanel selected={selected} />
    </section>
  );
}
