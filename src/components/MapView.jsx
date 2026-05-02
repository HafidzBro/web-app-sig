import { useEffect, useState } from "react";
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
export default function MapView() {
    const [dataMap, setDataMap] = useState(null);
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

                setDataMap(merged);

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
        <div style={{ display: "flex", gap: "20px" }}>

            {/* ================= MAP ================= */}
            <div style={{ flex: 2 }}>
                <MapContainer
                    center={[-2.5, 118]}
                    zoom={5}
                    style={{ height: "500px" }}
                >
                    <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

                    <LayerControl setMode={setMode} />

                    {dataMap && (
                        <GeoJSON
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
            <div style={{
                flex: 1,
                background: "white",
                padding: "15px",
                borderRadius: "10px",
                boxShadow: "0 2px 6px rgba(0,0,0,0.1)"
            }}>
                <h3>Detail Provinsi</h3>

                {selected ? (
                    <>
                        {/* SECTION 1 */}
                        <h4>{selected.provinsi}</h4>
                        <p><b>Capital:</b> {selected.ibukota || "-"}</p>

                        {/* SECTION 2 */}
                        <p><b>Total Area:</b> {selected.luas || "-"}</p>
                        <p><b>Jumlah Pulau:</b> {selected.pulau || "-"}</p>
                        <p><b>Latitude:</b> {selected.lat || "-"}</p>
                        <p><b>Longitude:</b> {selected.lng || "-"}</p>
                    </>
                ) : (
                    <p>Klik provinsi atau marker...</p>
                )}
            </div>
        </div>
    );
}