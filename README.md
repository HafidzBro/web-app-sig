# Nusantara dalam Angka

Aplikasi web SIG berbasis React, Vite, Leaflet, dan Tailwind CSS untuk menampilkan data wilayah provinsi Indonesia. Aplikasi memuat peta interaktif, filter luas wilayah dan jumlah pulau, pencarian provinsi atau ibu kota, panel detail provinsi, serta tabel referensi data.

## Fitur

- Peta provinsi Indonesia dengan layer luas wilayah, jumlah pulau, dan ibu kota.
- Pencarian provinsi atau ibu kota dengan fokus otomatis ke lokasi terpilih.
- Filter wilayah berdasarkan skala luas dan jumlah pulau.
- Ringkasan total provinsi, luas wilayah, dan jumlah pulau dari dataset CSV.
- Tabel referensi data dan ekspor CSV.
- Layout responsif dengan sidebar desktop dan drawer navigasi di layar kecil.

## Menjalankan Proyek

```bash
npm install
npm run dev
```

Build produksi:

```bash
npm run build
npm run preview
```

Validasi kode:

```bash
npm run lint
```

## Struktur Data

- `src/data/data.csv`: data luas wilayah, persentase luas, dan jumlah pulau per provinsi.
- `src/data/provinsi.json`: GeoJSON batas wilayah provinsi.
- `src/data/ibukota.json`: GeoJSON titik ibu kota provinsi.

Nama provinsi pada ketiga file data perlu konsisten agar proses penggabungan data peta berjalan lengkap.
