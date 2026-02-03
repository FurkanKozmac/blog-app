import { useEffect, useState } from "react";
import api from "../api/axiosConfig";
import { useNavigate, useLocation } from "react-router-dom";
import { ChevronLeft, ChevronRight } from "lucide-react"; // İkonlar için

const Home = () => {
  const [posts, setPosts] = useState([]);
  const [categories, setCategories] = useState([]);

  // Pagination State'leri
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  const navigate = useNavigate();
  const location = useLocation();

  const queryParams = new URLSearchParams(location.search);
  const query = queryParams.get("query");
  const selectedCategoryId = queryParams.get("category");

  // 1. Kategorileri Çek
  useEffect(() => {
    api.get("/categories").then((res) => setCategories(res.data));
  }, []);

  // 2. Kategori veya Arama değişirse sayfayı başa sar (0)
  useEffect(() => {
    setCurrentPage(0);
  }, [query, selectedCategoryId]);

  // 3. Verileri Çek (Sayfa, Arama veya Kategori değişince çalışır)
  useEffect(() => {
    let fetchUrl = `/posts?page=${currentPage}&size=6`; // Sayfa başı 6 post (Grid için ideal)

    if (query) {
      fetchUrl = `/posts/search?query=${query}&page=${currentPage}&size=6`;
    } else if (selectedCategoryId) {
      fetchUrl = `/posts/category/${selectedCategoryId}?page=${currentPage}&size=6`;
    }

    api
      .get(fetchUrl)
      .then((res) => {
        setPosts(res.data.content);
        setTotalPages(res.data.totalPages); // Backend'den gelen toplam sayfa sayısı
      })
      .catch((err) => console.log("Veri çekilemedi:"));

    // Sayfa değiştiğinde en üste kaydır
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [query, selectedCategoryId, currentPage]);

  // Sayfa Değiştirme Fonksiyonu
  const handlePageChange = (newPage) => {
    if (newPage >= 0 && newPage < totalPages) {
      setCurrentPage(newPage);
    }
  };

  return (
    <div className="max-w-6xl mx-auto py-8 px-4">
      {/* KATEGORİ FİLTRELEME ŞERİDİ */}
      <div className="flex items-center gap-3 overflow-x-auto pb-4 no-scrollbar border-b border-gray-100 mb-8">
        <button
          onClick={() => navigate("/")}
          className={`px-5 py-2 rounded-full text-sm font-bold whitespace-nowrap transition-all ${
            !selectedCategoryId && !query
              ? "bg-blue-600 text-white shadow-md"
              : "bg-white text-gray-600 border border-gray-200 hover:bg-gray-50"
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
                : "bg-white text-gray-600 border border-gray-200 hover:bg-gray-50"
            }`}
          >
            {cat.name}
          </button>
        ))}
      </div>

      {/* POST LİSTESİ */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {posts.length > 0 ? (
          posts.map((post) => (
            <div
              key={post.id}
              onClick={() => navigate(`/post/${post.id}`)}
              className="bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 cursor-pointer overflow-hidden group flex flex-col h-full"
            >
              <div className="h-56 overflow-hidden relative">
                {post.imageUrl ? (
                  <img
                    src={post.imageUrl}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                ) : (
                  <div className="w-full h-full bg-gray-200 flex items-center justify-center text-gray-400">
                    Görsel Yok
                  </div>
                )}
                <span className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest text-blue-600 shadow-sm">
                  {post.categoryName}
                </span>
              </div>

              <div className="p-6 flex flex-col flex-1">
                <h2 className="text-xl font-bold text-gray-800 line-clamp-2 group-hover:text-blue-600 mb-3">
                  {post.title}
                </h2>
                <p className="text-gray-500 text-sm line-clamp-3 mb-4 flex-1">
                  {post.content}
                </p>

                <div className="flex items-center justify-between text-xs text-gray-400 mt-auto pt-4 border-t border-gray-50">
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
          <div className="col-span-full text-center py-20">
            <p className="text-gray-400 text-lg">
              Bu kategoride henüz yazı bulunmuyor.
            </p>
            {query || selectedCategoryId ? (
              <button
                onClick={() => navigate("/")}
                className="mt-4 text-blue-600 font-bold hover:underline"
              >
                Tüm yazıları gör
              </button>
            ) : null}
          </div>
        )}
      </div>

      {/* --- PAGINATION (SAYFALAMA) --- */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-4 mt-16">
          {/* Önceki Sayfa */}
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 0}
            className="p-3 rounded-full bg-white border border-gray-200 text-gray-600 hover:bg-blue-50 hover:text-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-sm"
          >
            <ChevronLeft size={20} />
          </button>

          {/* Sayfa Numaraları */}
          <div className="flex gap-2">
            {[...Array(totalPages)].map((_, index) => (
              <button
                key={index}
                onClick={() => handlePageChange(index)}
                className={`w-10 h-10 rounded-full font-bold text-sm transition-all ${
                  currentPage === index
                    ? "bg-blue-600 text-white shadow-md scale-110"
                    : "bg-white text-gray-600 border border-gray-200 hover:bg-gray-50"
                }`}
              >
                {index + 1}
              </button>
            ))}
          </div>

          {/* Sonraki Sayfa */}
          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages - 1}
            className="p-3 rounded-full bg-white border border-gray-200 text-gray-600 hover:bg-blue-50 hover:text-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-sm"
          >
            <ChevronRight size={20} />
          </button>
        </div>
      )}
    </div>
  );
};

export default Home;
