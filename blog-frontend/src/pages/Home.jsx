import { useEffect, useState } from "react";
import api from "../api/axiosConfig";
import { useNavigate, useLocation } from "react-router-dom";

const Home = () => {
  const [posts, setPosts] = useState([]);
  const [categories, setCategories] = useState([]); // Kategoriler için state
  const navigate = useNavigate();
  const location = useLocation();

  const queryParams = new URLSearchParams(location.search);
  const query = queryParams.get("query");
  const selectedCategoryId = queryParams.get("category"); // URL'den kategori ID'sini al

  useEffect(() => {
    // 1. Kategorileri her ihtimale karşı çek (Filtre barı için)
    api.get("/categories").then((res) => setCategories(res.data));
  }, []);

  useEffect(() => {
    // 2. Filtreleme Mantığı
    let fetchUrl = "/posts";

    if (query) {
      fetchUrl = `/posts/search?query=${query}`;
    } else if (selectedCategoryId) {
      fetchUrl = `/posts/category/${selectedCategoryId}`;
    }

    api
      .get(fetchUrl)
      .then((res) => setPosts(res.data.content))
      .catch((err) => console.log("Veri çekilemedi:", err));
  }, [query, selectedCategoryId]); // Kategori veya arama değiştikçe çalış

  return (
    <div className="max-w-5xl mx-auto py-6 px-4">
      {/* --- KATEGORİ FİLTRELEME ŞERİDİ --- */}
      <div className="flex items-center gap-3 overflow-x-auto pb-6 no-scrollbar border-b border-gray-100 mb-8">
        <button
          onClick={() => navigate("/")}
          className={`px-5 py-2 rounded-full text-sm font-bold whitespace-nowrap transition-all ${
            !selectedCategoryId && !query
              ? "bg-blue-600 text-white shadow-md"
              : "bg-gray-100 text-gray-600 hover:bg-gray-200"
          }`}
        >
          Hepsi
        </button>

        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => navigate(`/?category=${cat.id}`)}
            className={`px-5 py-2 rounded-full text-sm font-bold whitespace-nowrap transition-all ${
              selectedCategoryId == cat.id
                ? "bg-blue-600 text-white shadow-md"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
          >
            {cat.name}
          </button>
        ))}
      </div>

      {/* Başlık Bölümü */}
      <div className="mb-10 text-center">
        <h1 className="text-3xl font-black text-gray-800">
          {query
            ? `"${query}" Araması`
            : selectedCategoryId
              ? categories.find((c) => c.id == selectedCategoryId)?.name
              : "Keşfet"}
        </h1>
      </div>

      {/* Post Listesi */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {posts.length > 0 ? (
          posts.map((post) => (
            <div
              key={post.id}
              onClick={() => navigate(`/post/${post.id}`)}
              className="bg-white rounded-3xl shadow-xs hover:shadow-xl transition-all duration-300 border border-gray-100 cursor-pointer overflow-hidden group"
            >
              {post.imageUrl && (
                <div className="h-52 overflow-hidden">
                  <img
                    src={post.imageUrl}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
              )}
              <div className="p-6">
                <span className="text-blue-600 text-[10px] font-black uppercase tracking-widest">
                  {post.categoryName}
                </span>
                <h2 className="text-xl font-bold text-gray-800 mt-2 line-clamp-2 group-hover:text-blue-600">
                  {post.title}
                </h2>
                <div className="mt-4 flex items-center justify-between text-xs text-gray-400">
                  <span className="font-bold text-gray-600">
                    @{post.authorName}
                  </span>
                  <span>
                    {new Date(post.createdAt).toLocaleDateString("tr-TR")}
                  </span>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-full text-center py-20 text-gray-400 italic">
            Bu kategoride henüz yazı bulunmuyor.
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;
