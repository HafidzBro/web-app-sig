# Nusantara dalam Angka

Aplikasi web SIG berbasis React, Vite, Leaflet, dan Tailwind CSS untuk menampilkan data wilayah provinsi Indonesia. Aplikasi memuat peta interaktif, filter luas wilayah dan jumlah pulau, pencarian provinsi atau ibu kota, panel detail provinsi, serta tabel referensi data.

## Fitur Utama

- **Peta Interaktif Spasial Indonesia:**
  - Layer tematik luas wilayah (choropleth), jumlah pulau, dan sebaran ibu kota provinsi.
  - Pilihan Base Map: **Clean Light (CartoDB Positron)**, **Street (OSM)**, dan **Satelit (ESRI)** dengan atribusi standar.
  - Hover tooltip informatif instan pada poligon provinsi dan titik ibu kota.
  - Pin kustom beranimasi untuk titik ibu kota.
  - Tombol **Reset View** satu klik untuk kembali ke tampilan menyeluruh kepulauan Indonesia.
- **Pencarian & Filter Cerdas:**
  - Pencarian cepat provinsi / ibu kota dengan efek fly-to otomatis.
  - Advanced Filter berdasarkan skala luas wilayah (besar/menengah/kecil) dan kuantitas pulau.
- **Tabel & Master Data Terpadu:**
  - Sorting kolom tabel (berdasarkan nama provinsi, ibu kota, luas wilayah, dan jumlah pulau).
  - Pencarian instan langsung di dalam tabel.
  - Quick statistics banner (total provinsi, rata-rata luas wilayah, provinsi terluas & terkecil).
  - Ekspor CSV data master atau data hasil pencarian.
- **Arsitektur Performa Tinggi:**
  - Manajemen state terpusat via `ProvinceContext` (Single Source of Truth), menghilangkan duplikasi fetch dan parse file CSV & GeoJSON.
  - Indikator pemuatan data (loading state) halus.


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
