import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../api/axiosConfig";

const EditPost = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [post, setPost] = useState({ title: "", content: "", categoryId: "" });
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    // Mevcut verileri ve kategorileri çek
    api.get(`/posts/${id}`).then((res) => {
      setPost({
        title: res.data.title,
        content: res.data.content,
        categoryId: res.data.categoryId || "",
      });
    });
    api.get("/categories").then((res) => setCategories(res.data));
  }, [id]);

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      // Backend'deki updatePost metoduna uygun olarak gönderiyoruz
      // Not: Eğer backend'de resim güncelleme yoksa sadece JSON gönderiyoruz
      await api.put(`/posts/${id}`, {
        title: post.title,
        content: post.content,
        categoryId: post.categoryId,
      });
      alert("Yazı başarıyla güncellendi!");
      navigate(`/post/${id}`);
    } catch (err) {
      alert("Güncelleme başarısız!");
    }
  };

  return (
    <div className="max-w-2xl mx-auto bg-white p-8 rounded-3xl shadow-lg mt-10 border border-gray-100">
      <h2 className="text-3xl font-bold mb-6">Yazıyı Düzenle</h2>
      <form onSubmit={handleUpdate} className="space-y-5">
        <input
          className="w-full p-4 border rounded-2xl outline-none focus:ring-2 focus:ring-blue-500"
          value={post.title}
          onChange={(e) => setPost({ ...post, title: e.target.value })}
          placeholder="Başlık"
        />
        <select
          className="w-full p-4 border rounded-2xl outline-none focus:ring-2 focus:ring-blue-500"
          value={post.categoryId}
          onChange={(e) => setPost({ ...post, categoryId: e.target.value })}
        >
          <option value="">Kategori Değiştir</option>
          {categories.map((cat) => (
            <option key={cat.id} value={cat.id}>
              {cat.name}
            </option>
          ))}
        </select>
        <textarea
          className="w-full p-4 border rounded-2xl outline-none focus:ring-2 focus:ring-blue-500"
          rows="10"
          value={post.content}
          onChange={(e) => setPost({ ...post, content: e.target.value })}
        />
        <button className="w-full bg-blue-600 text-white font-bold py-4 rounded-2xl hover:bg-blue-700 transition">
          Değişiklikleri Kaydet
        </button>
      </form>
    </div>
  );
};

export default EditPost;
