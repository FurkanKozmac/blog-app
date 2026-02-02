import { Link, useNavigate, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import api from "../api/axiosConfig";

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [token, setToken] = useState(localStorage.getItem("accessToken"));
  const [role, setRole] = useState(localStorage.getItem("userRole"));
  const [searchQuery, setSearchQuery] = useState("");

  // Her sayfa veya konum değiştiğinde yetkileri kontrol et
  useEffect(() => {
    setToken(localStorage.getItem("accessToken"));
    setRole(localStorage.getItem("userRole"));
  }, [location]);

  const handleSearch = (e) => {
    if (e.key === "Enter") {
      if (searchQuery.trim()) {
        navigate(`/?query=${searchQuery}`); // Home'a yönlendirir
      } else {
        navigate("/"); // Boşsa ana sayfaya döner
      }
    }
  };

  const handleLogout = async () => {
    const refreshToken = localStorage.getItem("refreshToken");

    if (refreshToken) {
      try {
        await api.post("/auth/logout", { refreshToken: refreshToken });
        console.log("Backend oturumu kapatıldı.");
      } catch (err) {
        console.error("Çıkış hatası:", err);
      }
    }

    localStorage.clear();
    setToken(null);
    setRole(null);
    navigate("/login");
  };

  return (
    <nav className="sticky top-0 z-50 bg-white border-b border-gray-200 shadow-sm py-4 px-8 flex justify-between items-center">
      {/* Logo */}
      <Link
        to="/"
        className="text-2xl font-black text-blue-600 tracking-tighter"
      >
        F<span className="text-gray-800">K hub</span>
      </Link>

      <div className="flex-1 max-w-sm mx-8 hidden sm:block">
        <input
          type="text"
          placeholder="Yazılarda ara..."
          className="w-full bg-gray-100 border-none rounded-full px-5 py-2 outline-none focus:ring-2 focus:ring-blue-500 text-sm transition-all"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onKeyDown={handleSearch}
        />
      </div>

      {/* Menü Linkleri */}
      <div className="flex items-center gap-6">
        <Link
          to="/"
          className="text-gray-600 hover:text-blue-600 font-medium transition"
        >
          Ana Sayfa
        </Link>

        {token ? (
          /* GİRİŞ YAPMIŞ KULLANICI */
          <div className="flex items-center gap-4">
            {role === "ROLE_ADMIN" && (
              <Link
                to="/admin"
                className="text-blue-600 font-semibold border-b-2 border-transparent hover:border-blue-600 transition-all"
              >
                Admin Paneli
              </Link>
            )}

            <Link
              to="/create-post"
              className="bg-blue-600 text-white px-5 py-2 rounded-full font-bold hover:bg-blue-700 transition shadow-md"
            >
              Yazı Yaz
            </Link>

            <button
              onClick={handleLogout}
              className="text-red-500 font-semibold hover:text-red-700 transition"
            >
              Çıkış
            </button>
          </div>
        ) : (
          /* GİRİŞ YAPMAMIŞ KULLANICI */
          <div className="flex items-center gap-4">
            <Link
              to="/login"
              className="text-gray-600 font-bold hover:text-blue-600 transition"
            >
              Giriş Yap
            </Link>

            <Link
              to="/register"
              className="bg-gray-800 text-white px-5 py-2 rounded-full font-bold hover:bg-black transition shadow-md"
            >
              Üye Ol
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
