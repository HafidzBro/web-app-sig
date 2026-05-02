import { useEffect, useState } from "react";
import Papa from "papaparse";
import csvFile from "../data/data.csv?url";

export default function Table() {
    const [data, setData] = useState([]);

    useEffect(() => {
        Papa.parse(csvFile, {
            download: true,
            header: true,
            complete: (res) => setData(res.data),
        });
    }, []);

    return (
        <table border="1" width="100%">
            <thead>
                <tr>
                    <th>Provinsi</th>
                    <th>Luas (Km²)</th>
                    <th>Jumlah Pulau</th>
                </tr>
            </thead>
            <tbody>
                {data.map((d, i) => (
                    <tr key={i}>
                        <td>{d.Provinsi}</td>
                        <td>{d.Luas_Wilayah}</td>
                        <td>{d.Jumlah_Pulau}</td>
                    </tr>
                ))}
            </tbody>
        </table>
    );
}