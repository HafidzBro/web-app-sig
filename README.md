# Nusantara dalam Angka — Sistem Informasi Geografis Provinsi Indonesia

Platform visualisasi data Sistem Informasi Geografis (SIG / GIS) berbasis web interaktif untuk menampilkan, memfilter, dan menganalisis data spasial serta statistik provinsi di seluruh Indonesia.

**Live:** https://web-app-4eyoox19t-hafidzbro.vercel.app/

---

## Tech Stack

| Layer | Teknologi |
|-------|-----------|
| Framework | React 19 |
| Bundler & Dev Tool | Vite 8 |
| Routing | React Router DOM v7 |
| Mapping Library | Leaflet + React-Leaflet |
| Map Tile Providers | CartoDB Positron, OpenStreetMap, ESRI World Imagery |
| Styling | Tailwind CSS v4 + Custom CSS |
| Data Processing | PapaParse (CSV Parser) + GeoJSON |
| Icons & Typography | Google Material Symbols Outlined + Inter Font |

---

## Fitur Utama

### Peta Spasial Interaktif (GIS)
- **Multi-layer Tematik:** Layer tematik luas wilayah (*choropleth map*), klasifikasi jumlah pulau, serta titik sebaran ibu kota provinsi.
- **Base Map Switcher:** Pilihan peta dasar secara instan antara **Clean Light (CartoDB Positron)**, **Street (OpenStreetMap)**, dan **Satelit (ESRI World Imagery)** dengan atribusi standar resmi.
- **Dynamic Capsule Controls:** Tombol kontrol mode layer dan peta dasar berbentuk kapsul animasi (*dynamic island pill*) yang hemat ruang pandang peta (posisi sejajar di desktop, bertumpuk rapi di layar ponsel).
- **Hover Tooltips:** Tooltip instan saat kursor mengarah ke poligon provinsi atau titik ibu kota dengan ringkasan nama dan metrik angka.
- **Pulse Capital Markers:** Marker ibu kota kustom modern dengan animasi denyut (*pulse ring*) merah.
- **Reset View 1-Klik:** Tombol *Reset View* di samping tombol zoom (`+/-`) untuk mengembalikan fokus kamera ke seluruh kepulauan Nusantara (`[-2.5, 118]`, zoom 5).
- **Detail Panel:** Panel samping interaktif menampilkan metrik luas wilayah, jumlah pulau, ibu kota, serta koordinat lintang (*latitude*) & bujur (*longitude*) provinsi terpilih.

### Dashboard & Filter Spasial
- **Summary Cards:** Kartu ringkasan metrik Total Provinsi, Total Luas Wilayah (km²), dan Total Pulau di Indonesia.
- **Pencarian Cepat:** Kolom pencarian provinsi/ibu kota dengan fitur *fly-to* otomatis ke koordinat lokasi yang dipilih.
- **Advanced Spatial Filter Drawer:** Filter wilayah interaktif berdasarkan skala luas wilayah (>50.000 km², 10.000–50.000 km², <10.000 km²) dan kuantitas pulau (>1.000, 100–1.000, <100 pulau).

### Master Data & Tabel Referensi
- **Tabel Interaktif Berurut (Sortable):** Urutkan data berdasarkan kolom No, Nama Provinsi, Ibu Kota, Luas Wilayah, atau Jumlah Pulau secara *ascending* maupun *descending*.
- **Pencarian Real-Time Tabel:** Input pencarian instan langsung di dalam tabel untuk memfilter nama provinsi atau ibu kota.
- **Quick Statistics Banner:** Kartu statistik cepat untuk total provinsi, rata-rata luas per provinsi, provinsi terluas, dan provinsi terkecil.
- **Smart CSV Export:** Ekspor berkas CSV langsung dari browser untuk seluruh data master atau hasil data terfilter.

### Arsitektur Terpadu & Performa
- **Centralized State (`ProvinceContext`):** *Single Source of Truth* yang mengeliminasi duplikasi *network fetch* dan *parse* berkas CSV/GeoJSON antar komponen.
- **Indikator Pemuatan (*Loading Skeleton*):** Animasi pemuatan data spasial yang halus.
- **Desain Responsif:** Navigasi sidebar desktop dan drawer navigasi mobile yang adaptif untuk berbagai ukuran perangkat.

---

## Setup Lokal

### Prasyarat
- Node.js 18+
- npm / pnpm / yarn

### Instalasi

```bash
# Clone repositori
git clone https://github.com/HafidzBro/web-app-sig.git
cd web-app-sig

# Instalasi dependensi
npm install
```

### Menjalankan Dev Server

```bash
npm run dev
```

Buka peramban di `http://localhost:5173`

### Build Produksi

```bash
# Build bundle produksi
npm run build

# Menjalankan preview build lokal
npm run preview
```

### Pemeriksaan Kode (Linting)

```bash
npm run lint
```

---

## Struktur Proyek

```
src/
├── components/
│   ├── MapView.jsx          # Komponen peta Leaflet, capsule controls, & detail panel
│   ├── SummaryCard.jsx      # Kartu metrik ringkasan dashboard
│   └── Table.jsx            # Tabel data interaktif dengan sorting & live filter
├── context/
│   └── ProvinceContext.jsx  # Central state & data provider (Single Source of Truth)
├── data/
│   ├── data.csv             # Data statistik tabular resmi BPS (luas, persentase, pulau)
│   ├── ibukota.json         # GeoJSON titik koordinat spasial ibu kota
│   └── provinsi.json        # GeoJSON poligon batas administrasi provinsi
├── layout/
│   ├── MainLayout.jsx       # Layout dasar aplikasi pembungkus outlet
│   ├── Sidebar.jsx          # Navigasi samping desktop & mobile drawer
│   └── TopBar.jsx           # Header atas aplikasi
├── pages/
│   ├── Dashboard.jsx        # Halaman utama visualisasi peta SIG & filter drawer
│   └── DataReference.jsx    # Halaman master data, quick stats, & ekspor CSV
├── styles/
│   ├── index.css            # Setup Tailwind CSS v4 & variabel warna tema
│   └── map.css              # Kustomisasi Leaflet, custom tooltip, & pulse pin marker
├── App.jsx                  # Root router & ProvinceProvider
└── main.jsx                 # Entry point aplikasi
```

---

## Dataset (Sumber Data)

| Berkas | Format | Deskripsi |
|--------|--------|-----------|
| `src/data/data.csv` | CSV Tabular | Data statistik resmi (Provinsi, Ibu Kota, Luas Wilayah km², Persentase Luas, Jumlah Pulau) |
| `src/data/provinsi.json` | GeoJSON (Polygon) | Batas wilayah spasial 38 provinsi di Indonesia |
| `src/data/ibukota.json` | GeoJSON (Point) | Koordinat titik geografis (*Point*) seluruh ibu kota provinsi |

---

## Lisensi & Atribusi

- Peta dasar disediakan oleh [CartoDB](https://carto.com/), [OpenStreetMap](https://www.openstreetmap.org/), dan [Esri](https://www.esri.com/).
- Data statistik wilayah bersumber dari Badan Pusat Statistik (BPS) Indonesia 2025.
- Proyek ini dikembangkan untuk keperluan visualisasi Sistem Informasi Geografis (SIG) Indonesia.
