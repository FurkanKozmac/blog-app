import { useState } from "react";
import api from "../api/axiosConfig";
import { useNavigate, Link } from "react-router-dom";

const Register = () => {
  const [formData, setFormData] = useState({ username: "", password: "" });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");
    try {
      // Backend'deki RegisterRequest DTO'suna uygun gönderiyoruz
      await api.post("/auth/signup", formData);
      alert("Kayıt başarılı! Şimdi giriş yapabilirsiniz.");
      navigate("/login");
    } catch (err) {
      setError("Kayıt sırasında bir hata oluştu.");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-[70vh]">
      <div className="bg-white p-10 rounded-3xl shadow-xl w-full max-w-md border border-gray-100 text-center">
        <h2 className="text-3xl font-black text-gray-800 mb-2">
          Aramıza Katıl!
        </h2>
        <p className="text-gray-500 mb-8 text-sm font-medium">
          Hemen bir hesap oluştur ve yazmaya başla.
        </p>

        {error && (
          <div className="mb-4 p-3 bg-red-50 text-red-500 text-sm rounded-xl border border-red-100">
            {error}
          </div>
        )}

        <form onSubmit={handleRegister} className="space-y-5 text-left">
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1 ml-1">
              Kullanıcı Adı
            </label>
            <input
              type="text"
              required
              className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-500 outline-none transition"
              placeholder="Yeni kullanıcı adın"
              onChange={(e) =>
                setFormData({ ...formData, username: e.target.value })
              }
            />
          </div>
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1 ml-1">
              Şifre
            </label>
            <input
              type="password"
              required
              className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-500 outline-none transition"
              placeholder="En az 6 karakter"
              onChange={(e) =>
                setFormData({ ...formData, password: e.target.value })
              }
            />
          </div>
          <button className="w-full bg-gray-900 text-white font-bold py-3 rounded-xl hover:bg-black transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5">
            Kayıt Ol
          </button>
        </form>

        <p className="mt-8 text-sm text-gray-600 font-medium">
          Zaten bir hesabın var mı?{" "}
          <Link to="/login" className="text-blue-600 hover:underline">
            Giriş Yap
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
