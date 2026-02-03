import { useState, useEffect } from "react";
import api from "../api/axiosConfig";
import { Activity, Database, HardDrive, Plus, Server } from "lucide-react"; // İkonlar

const AdminPanel = () => {
  const [activeTab, setActiveTab] = useState("dashboard"); // Tab yönetimi

  // Dashboard State'leri
  const [health, setHealth] = useState(null);
  const [metrics, setMetrics] = useState(null);

  // Kategori State'leri
  const [categoryName, setCategoryName] = useState("");
  const [categories, setCategories] = useState([]);

  // Verileri Çek
  useEffect(() => {
    fetchCategories();
    fetchSystemHealth();
  }, []);

  const fetchCategories = () => {
    api.get("/categories").then((res) => setCategories(res.data));
  };

  const fetchSystemHealth = async () => {
    try {
      const healthRes = await api.get("/actuator/health");
      setHealth(healthRes.data);
    } catch (err) {
      console.error("Sağlık verileri çekilemedi", err);
    }
  };

  const handleAddCategory = async (e) => {
    e.preventDefault();
    try {
      await api.post("/categories", { name: categoryName });
      setCategoryName("");
      fetchCategories();
      alert("Kategori eklendi!");
    } catch (err) {
      alert("Hata oluştu.");
    }
  };

  return (
    <div className="max-w-5xl mx-auto py-10 px-4">
      <h1 className="text-3xl font-black text-gray-800 mb-8">Yönetim Paneli</h1>

      {/* TAB BUTONLARI */}
      <div className="flex gap-4 mb-8 border-b border-gray-200 pb-4">
        <button
          onClick={() => setActiveTab("dashboard")}
          className={`flex items-center gap-2 px-6 py-2 rounded-xl font-bold transition-all ${
            activeTab === "dashboard"
              ? "bg-blue-600 text-white shadow-md"
              : "bg-white text-gray-600 hover:bg-gray-100"
          }`}
        >
          <Activity size={18} /> Sistem Durumu
        </button>
        <button
          onClick={() => setActiveTab("categories")}
          className={`flex items-center gap-2 px-6 py-2 rounded-xl font-bold transition-all ${
            activeTab === "categories"
              ? "bg-blue-600 text-white shadow-md"
              : "bg-white text-gray-600 hover:bg-gray-100"
          }`}
        >
          <Plus size={18} /> Kategori Yönetimi
        </button>
      </div>

      {/* --- TAB 1: DASHBOARD (SAĞLIK) --- */}
      {activeTab === "dashboard" && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Genel Durum Kartı */}
          <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
            <div className="flex items-center gap-3 mb-2 text-gray-500">
              <Server className="text-blue-500" />
              <span className="font-bold text-sm uppercase">Genel Durum</span>
            </div>
            <div
              className={`text-3xl font-black ${health?.status === "UP" ? "text-green-500" : "text-red-500"}`}
            >
              {health?.status || "Yükleniyor..."}
            </div>
          </div>

          {/* Database Kartı */}
          <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
            <div className="flex items-center gap-3 mb-2 text-gray-500">
              <Database className="text-purple-500" />
              <span className="font-bold text-sm uppercase">Veritabanı</span>
            </div>
            <div className="text-2xl font-bold text-gray-800">
              {health?.components?.db?.details?.database || "PostgreSQL"}
            </div>
            <div
              className={`text-sm font-bold ${health?.components?.db?.status === "UP" ? "text-green-500" : "text-red-500"}`}
            >
              {health?.components?.db?.status === "UP"
                ? "Bağlı ve Çalışıyor"
                : "Bağlantı Hatası"}
            </div>
          </div>

          {/* Disk Kartı */}
          <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
            <div className="flex items-center gap-3 mb-2 text-gray-500">
              <HardDrive className="text-orange-500" />
              <span className="font-bold text-sm uppercase">Disk Alanı</span>
            </div>
            <div className="text-xl font-bold text-gray-800">
              {health?.components?.diskSpace?.details?.free
                ? (
                    health.components.diskSpace.details.free /
                    1024 /
                    1024 /
                    1024
                  ).toFixed(2) + " GB Boş"
                : "Hesaplanıyor..."}
            </div>
          </div>
        </div>
      )}

      {/* --- TAB 2: KATEGORİ YÖNETİMİ (Eski Kodun) --- */}
      {activeTab === "categories" && (
        <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
          <h2 className="text-xl font-bold mb-6">Yeni Kategori Ekle</h2>
          <form onSubmit={handleAddCategory} className="flex gap-4 mb-8">
            <input
              type="text"
              value={categoryName}
              onChange={(e) => setCategoryName(e.target.value)}
              placeholder="Kategori adı..."
              className="flex-1 p-3 border rounded-xl outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button className="bg-green-600 text-white px-6 rounded-xl font-bold hover:bg-green-700">
              Ekle
            </button>
          </form>

          <div className="flex flex-wrap gap-3">
            {categories.map((cat) => (
              <span
                key={cat.id}
                className="px-4 py-2 bg-gray-50 border border-gray-200 rounded-full font-medium text-gray-600"
              >
                {cat.name}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminPanel;
