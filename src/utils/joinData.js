const normalize = (str) => str?.toLowerCase().trim();

export const joinGeoJSONWithCSV = (geojson, csvData) => {
    const map = {};

    csvData.forEach((item) => {
        if (item.Provinsi) {
            map[normalize(item.Provinsi)] = {
                luas: parseFloat(item.Luas_Wilayah_Km2),
                jumlah_pulau: parseInt(item.Jumlah_Pulau),
                ibu_kota: item.Ibu_Kota_Wilayah,
                lat: parseFloat(item.lat),
                lng: parseFloat(item.lng),
                persentase_luas: parseFloat(item.Persentase_Terhadap_Luas_Wilayah),
            };
        }
    });

    return {
        ...geojson,
        features: geojson.features.map((feature) => {
            const nama = normalize(feature.properties.PROVINSI);
            const data = map[nama] || {};

            return {
                ...feature,
                properties: {
                    ...feature.properties,
                    ...data,
                },
            };
        }),
    };
};