import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ProvinceProvider } from "./context/ProvinceContext";
import MainLayout from "./layout/MainLayout";
import Dashboard from "./pages/Dashboard";
import DataReference from "./pages/DataReference";

export default function App() {
  return (
    <ProvinceProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<MainLayout />}>
            <Route index element={<Dashboard />} />
            <Route path="data" element={<DataReference />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </ProvinceProvider>
  );
}