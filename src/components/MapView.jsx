import { useEffect, useState, useMemo } from "react";
import { MapContainer, TileLayer, GeoJSON, useMap } from "react-leaflet";
import Papa from "papaparse";
import L from "leaflet";

import geojsonData from "../data/provinsi.json";
import ibukotaGeoJSON from "../data/ibukota.json";
import csvFile from "../data/data.csv?url";
import "../styles/map.css";

const normalize = (str) => str?.toLowerCase().trim();

/* =========================
   CONTROL
========================= */
function LayerControl({ setMode }) {
    const map = useMap();

    useEffect(() => {
        const control = L.control({ position: "topright" });

        control.onAdd = function () {
            const div = L.DomUtil.create("div", "custom-control");

            div.innerHTML = `
                <button id="btn-area">Area</button>
                <button id="btn-pulau">Islands</button>
                <button id="btn-ibukota">Capitals</button>
            `;

            return div;
        };

        control.addTo(map);

        setTimeout(() => {
            document.getElementById("btn-area").onclick = () => setMode("luas");
            document.getElementById("btn-pulau").onclick = () => setMode("pulau");
            document.getElementById("btn-ibukota").onclick = () => setMode("ibukota");
        }, 0);

        return () => control.remove();
    }, [map, setMode]);

    return null;
}

/* =========================
   MAIN
========================= */
export default function MapView({filters}) {
    const [baseData, setBaseData] = useState(null);
    const [mode, setMode] = useState("luas");
    const [selected, setSelected] = useState(null); // 🔥 penting

    useEffect(() => {
        Papa.parse(csvFile, {
            download: true,
            header: true,
            complete: (res) => {

                const csvMap = {};
                const capitalMap = {};

                /* ================= CSV ================= */
                res.data.forEach((d) => {
                    if (d.Provinsi) {
                        csvMap[normalize(d.Provinsi)] = {
                            luas: parseFloat(d.Luas_Wilayah) || 0,
                            jumlah_pulau: parseInt(d.Jumlah_Pulau) || 0,
                        };
                    }
                });

                /* ================= IBUKOTA ================= */
                ibukotaGeoJSON.features.forEach((f) => {
                    const nama = normalize(f.properties.provinsi);

                    capitalMap[nama] = {
                        ibukota: f.properties.ibukota,
                        lat: f.geometry.coordinates[1],
                        lng: f.geometry.coordinates[0],
                    };
                });

                /* ================= FINAL JOIN ================= */
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

                /* 🔥 DEFAULT KE JAKARTA */
                const jakarta = merged.features.find(
                    (f) => normalize(f.properties.provinsi) === "dki jakarta"
                );

                if (jakarta) {
                    setSelected({
                        provinsi: jakarta.properties.provinsi,
                        ibukota: jakarta.properties.ibukota,
                        luas: jakarta.properties.luas,
                        pulau: jakarta.properties.jumlah_pulau,
                        lat: jakarta.properties.lat,
                        lng: jakarta.properties.lng
                    });
                }
            },
        });
        
    }, []);
    // Tambahkan ini di bawah useEffect Papa.parse
        const dataMap = useMemo(() => {
        if (!baseData) return null;
        if (!filters) return baseData;

        const filteredFeatures = baseData.features.filter((f) => {
            const luas = f.properties.luas || 0;
            const pulau = f.properties.jumlah_pulau || 0;

            // Filter Area
            let passArea = false;
            if (!filters.area.large && !filters.area.medium && !filters.area.small) passArea = true;
            if (filters.area.large && luas >= 50000) passArea = true;
            if (filters.area.medium && luas >= 10000 && luas < 50000) passArea = true;
            if (filters.area.small && luas < 10000) passArea = true;

            // Filter Island
            let passIsland = false;
            if (filters.islandCount === 'all') passIsland = true;
            if (filters.islandCount === '>1000' && pulau > 1000) passIsland = true;
            if (filters.islandCount === '100-1000' && pulau >= 100 && pulau <= 1000) passIsland = true;
            if (filters.islandCount === '<100' && pulau < 100) passIsland = true;

            return passArea && passIsland;
        });

        return { ...baseData, features: filteredFeatures };
    }, [baseData, filters]);

    /* =========================
       COLOR
    ========================= */
    const getColor = (value, mode) => {
        if (mode === "luas") {
            return value > 70000 ? "#084081" :
                value > 40000 ? "#2b8cbe" :
                    "#a6bddb";
        }

        if (mode === "pulau") {
            return value > 300 ? "#084081" :
                value > 150 ? "#2b8cbe" :
                    "#a6bddb";
        }

        return "#ccc";
    };

    const style = (feature) => {
        if (mode === "ibukota") return { fillOpacity: 0 };

        const value =
            mode === "luas"
                ? feature.properties.luas
                : feature.properties.jumlah_pulau;

        return {
            fillColor: getColor(value, mode),
            weight: 1,
            color: "white",
            fillOpacity: 0.7,
        };
    };

    /* =========================
       CLICK POLYGON
    ========================= */
    const onEachFeature = (feature, layer) => {
        layer.on({
            click: () => {
                setSelected({
                    provinsi: feature.properties.provinsi,
                    ibukota: feature.properties.ibukota,
                    luas: feature.properties.luas,
                    pulau: feature.properties.jumlah_pulau,
                    lat: feature.properties.lat,
                    lng: feature.properties.lng
                });
            }
        });
    };

    /* =========================
       CLICK MARKER
    ========================= */
    const onEachCapital = (f, layer) => {
        layer.on({
            click: () => {
                setSelected({
                    provinsi: f.properties.provinsi,
                    ibukota: f.properties.ibukota,
                    lat: f.geometry.coordinates[1],
                    lng: f.geometry.coordinates[0]
                });
            }
        });
    };

    return (
        <div className="flex flex-col lg:flex-row gap-6 h-full">

            {/* ================= MAP ================= */}
            <div className="flex-[2] bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden relative z-0">
                <MapContainer
                    center={[-2.5, 118]}
                    zoom={5}
                    style={{ height: "500px", width: "100%" }}
                >
                    <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

                    <LayerControl setMode={setMode} />

                    {dataMap && (
                        <GeoJSON
                            key={JSON.stringify(filters)}
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
            </div>

            {/* ================= DETAIL PANEL ================= */}
            <div className="flex-1 bg-white rounded-xl shadow-sm border border-slate-200 flex flex-col overflow-hidden min-h-[500px]">
                {selected ? (
                    <>
                        {/* Header Panel (Background Biru Muda) */}
                        <div className="bg-[#f4f7fc] p-6 border-b border-slate-200">
                            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Detail Provinsi</p>
                            <h2 className="text-2xl font-bold text-slate-900 mb-1.5">{selected.provinsi}</h2>
                            <div className="flex items-center text-sm text-slate-600 gap-1.5">
                                <span className="material-symbols-outlined text-[16px]">location_city</span>
                                <span>Capital: {selected.ibukota || "-"}</span>
                            </div>
                        </div>

                        {/* Body Panel (Data Asli) */}
                        <div className="p-6 flex-1 flex flex-col">
                            
                            {/* Total Area */}
                            <div className="border-b border-slate-100 pb-4 mb-4">
                                <p className="text-[10px] font-bold text-slate-500 mb-1 uppercase tracking-wider">Total Area</p>
                                <p className="text-lg font-bold text-slate-800">
                                    {selected.luas ? selected.luas.toLocaleString('id-ID') : "-"} <span className="text-sm font-semibold text-slate-500">km²</span>
                                </p>
                            </div>

                            {/* Jumlah Pulau */}
                            <div className="border-b border-slate-100 pb-4 mb-4">
                                <p className="text-[10px] font-bold text-slate-500 mb-1 uppercase tracking-wider">Jumlah Pulau</p>
                                <p className="text-lg font-bold text-slate-800">
                                    {selected.pulau ? selected.pulau.toLocaleString('id-ID') : "-"}
                                </p>
                            </div>

                            {/* Coordinates (Dibuat kotak rapi) */}
                            <div className="pb-4">
                                <p className="text-[10px] font-bold text-slate-500 mb-2 uppercase tracking-wider">Coordinates</p>
                                <div className="flex justify-between items-center bg-slate-50 p-3 rounded-lg border border-slate-100">
                                    <div className="flex flex-col">
                                        <span className="text-[10px] text-slate-400 uppercase font-semibold">Latitude</span>
                                        <span className="text-sm font-medium text-slate-700">{selected.lat ? selected.lat.toFixed(4) : "-"}</span>
                                    </div>
                                    <div className="h-6 w-px bg-slate-200"></div>
                                    <div className="flex flex-col text-right">
                                        <span className="text-[10px] text-slate-400 uppercase font-semibold">Longitude</span>
                                        <span className="text-sm font-medium text-slate-700">{selected.lng ? selected.lng.toFixed(4) : "-"}</span>
                                    </div>
                                </div>
                            </div>

                        </div>
                    </>
                ) : (
                    <div className="p-6 flex flex-col items-center justify-center h-full text-slate-400 text-center bg-slate-50/50">
                        <span className="material-symbols-outlined text-5xl mb-3 opacity-50">touch_app</span>
                        <p className="text-sm font-medium">Klik provinsi atau marker di peta<br/>untuk melihat detail.</p>
                    </div>
                )}
            </div>
        </div>
    );
   
}


/* desain lama */
// return (
//         <div style={{ display: "flex", gap: "20px" }}>

//             {/* ================= MAP ================= */}
//             <div style={{ flex: 2 }}>
//                 <MapContainer
//                     center={[-2.5, 118]}
//                     zoom={5}
//                     style={{ height: "500px" }}
//                 >
//                     <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

//                     <LayerControl setMode={setMode} />

//                     {dataMap && (
//                         <GeoJSON
//                             data={dataMap}
//                             style={style}
//                             onEachFeature={onEachFeature}
//                         />
//                     )}

//                     {mode === "ibukota" && (
//                         <GeoJSON
//                             data={ibukotaGeoJSON}
//                             pointToLayer={(f, latlng) => L.marker(latlng)}
//                             onEachFeature={onEachCapital}
//                         />
//                     )}
//                 </MapContainer>
//             </div>

//             {/* ================= DETAIL PANEL ================= */}
//             <div style={{
//                 flex: 1,
//                 background: "white",
//                 padding: "15px",
//                 borderRadius: "10px",
//                 boxShadow: "0 2px 6px rgba(0,0,0,0.1)"
//             }}>
//                 <h3>Detail Provinsi</h3>

//                 {selected ? (
//                     <>
//                         {/* SECTION 1 */}
//                         <h4>{selected.provinsi}</h4>
//                         <p><b>Capital:</b> {selected.ibukota || "-"}</p>

//                         {/* SECTION 2 */}
//                         <p><b>Total Area:</b> {selected.luas || "-"}</p>
//                         <p><b>Jumlah Pulau:</b> {selected.pulau || "-"}</p>
//                         <p><b>Latitude:</b> {selected.lat || "-"}</p>
//                         <p><b>Longitude:</b> {selected.lng || "-"}</p>
//                     </>
//                 ) : (
//                     <p>Klik provinsi atau marker...</p>
//                 )}
//             </div>
//         </div>
//     ); 