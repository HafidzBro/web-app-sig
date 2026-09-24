import { createContext, useContext, useEffect, useState } from "react";
import Papa from "papaparse";

import geojsonUrl from "../data/provinsi.json?url";
import ibukotaUrl from "../data/ibukota.json?url";
import csvFile from "../data/data.csv?url";

const ProvinceContext = createContext(null);

const normalize = (str) => str?.toLowerCase().trim();

const initialSummary = {
  provinces: 0,
  area: 0,
  islands: 0,
  avgArea: 0,
  largestProvince: null,
  smallestProvince: null,
};

export function ProvinceProvider({ children }) {
  const [geoData, setGeoData] = useState(null);
  const [capitalData, setCapitalData] = useState(null);
  const [tableData, setTableData] = useState([]);
  const [summary, setSummary] = useState(initialSummary);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isMounted = true;

    async function fetchData() {
      try {
        setIsLoading(true);
        const [geoResponse, capitalResponse, csvResponse] = await Promise.all([
          fetch(geojsonUrl),
          fetch(ibukotaUrl),
          fetch(csvFile),
        ]);

        if (!geoResponse.ok || !capitalResponse.ok || !csvResponse.ok) {
          throw new Error("Gagal mengambil dataset wilayah.");
        }

        const [geojsonData, ibukotaGeoJSON, csvText] = await Promise.all([
          geoResponse.json(),
          capitalResponse.json(),
          csvResponse.text(),
        ]);

        const parsedCsv = Papa.parse(csvText, { header: true });
        const validRows = parsedCsv.data.filter((item) => item.Provinsi);

        const csvMap = {};
        const capitalMap = {};

        validRows.forEach((row) => {
          const norm = normalize(row.Provinsi);
          csvMap[norm] = {
            luas: parseFloat(row.Luas_Wilayah) || 0,
            jumlah_pulau: parseInt(row.Jumlah_Pulau, 10) || 0,
            ibukota: row.Ibu_Kota_Wilayah || "",
            persentase: parseFloat(row.Persentase_Terhadap_Luas_Wilayah) || 0,
          };
        });

        ibukotaGeoJSON.features.forEach((f) => {
          const norm = normalize(f.properties.provinsi);
          capitalMap[norm] = {
            ibukota: f.properties.ibukota,
            lat: f.geometry.coordinates[1],
            lng: f.geometry.coordinates[0],
          };
        });

        const mergedGeoJSON = {
          ...geojsonData,
          features: geojsonData.features.map((f) => {
            const norm = normalize(f.properties.provinsi);
            return {
              ...f,
              properties: {
                ...f.properties,
                ...csvMap[norm],
                ...capitalMap[norm],
              },
            };
          }),
        };

        // Summary calculations
        let totalArea = 0;
        let totalIslands = 0;
        let largest = null;
        let smallest = null;

        validRows.forEach((item) => {
          const area = Number(item.Luas_Wilayah) || 0;
          const islands = Number(item.Jumlah_Pulau) || 0;
          totalArea += area;
          totalIslands += islands;

          if (!largest || area > (Number(largest.Luas_Wilayah) || 0)) {
            largest = item;
          }
          if (!smallest || area < (Number(smallest.Luas_Wilayah) || Infinity)) {
            smallest = item;
          }
        });

        if (!isMounted) return;

        setTableData(validRows);
        setGeoData(mergedGeoJSON);
        setCapitalData(ibukotaGeoJSON);
        setSummary({
          provinces: validRows.length,
          area: totalArea,
          islands: totalIslands,
          avgArea: validRows.length ? totalArea / validRows.length : 0,
          largestProvince: largest,
          smallestProvince: smallest,
        });
        setError(null);
      } catch (err) {
        if (!isMounted) return;
        setError(err.message || "Terjadi kesalahan saat memuat data.");
      } finally {
        if (isMounted) setIsLoading(false);
      }
    }

    fetchData();

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <ProvinceContext.Provider
      value={{
        geoData,
        capitalData,
        tableData,
        summary,
        isLoading,
        error,
      }}
    >
      {children}
    </ProvinceContext.Provider>
  );
}

export function useProvince() {
  const context = useContext(ProvinceContext);
  if (!context) {
    throw new Error("useProvince must be used within a ProvinceProvider");
  }
  return context;
}
