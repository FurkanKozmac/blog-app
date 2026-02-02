import { useState, useEffect } from "react";
import api from "../api/axiosConfig";

const AdminPanel = () => {
  const [categoryName, setCategoryName] = useState("");
  const [categories, setCategories] = useState([]);

  const fetchCategories = () => {
    api.get("/categories").then((res) => setCategories(res.data));
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleAddCategory = async (e) => {
    e.preventDefault();
    try {
      // Backend'deki CategoryRequest DTO'su 'name' bekliyor
      await api.post("/categories", { name: categoryName });
      setCategoryName("");
      fetchCategories(); // Listeyi güncelle
      alert("Kategori başarıyla eklendi!");
    } catch (err) {
      console.error(err);
      alert("Hata: Yetkiniz olmayabilir veya kategori zaten var.");
    }
  };

  return (
    <div className="max-w-2xl mx-auto mt-10 p-6 bg-white rounded-3xl shadow-lg border border-gray-100">
      <h1 className="text-2xl font-bold mb-6 text-gray-800">
        Admin - Kategori Yönetimi
      </h1>

      <form onSubmit={handleAddCategory} className="flex gap-3 mb-8">
        <input
          type="text"
          value={categoryName}
          onChange={(e) => setCategoryName(e.target.value)}
          placeholder="Yeni kategori adı..."
          className="flex-1 p-3 border rounded-xl outline-none focus:ring-2 focus:ring-blue-500"
          required
        />
        <button className="bg-blue-600 text-white px-6 py-3 rounded-xl font-bold hover:bg-blue-700">
          Ekle
        </button>
      </form>

      <h2 className="font-semibold mb-4 text-gray-600">Mevcut Kategoriler</h2>
      <div className="flex flex-wrap gap-2">
        {categories.map((cat) => (
          <span
            key={cat.id}
            className="px-4 py-2 bg-gray-100 rounded-full text-sm font-medium"
          >
            {cat.name}
          </span>
        ))}
      </div>
    </div>
  );
};

export default AdminPanel;
