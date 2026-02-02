import { useState } from "react";
import api from "../api/axiosConfig";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [credentials, setCredentials] = useState({
    username: "",
    password: "",
  });
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post("/auth/signin", credentials);

      localStorage.setItem("accessToken", res.data.accessToken);
      localStorage.setItem("refreshToken", res.data.refreshToken);
      localStorage.setItem("userRole", res.data.role);

      // BURAYI DEĞİŞTİR: Backend'den gelen yerine senin yazdığın ismi kaydet
      localStorage.setItem("username", credentials.username);

      navigate("/");
      window.location.reload();
    } catch (err) {
      alert("Giriş başarısız! " + err);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-[70vh]">
      <form
        onSubmit={handleLogin}
        className="bg-white p-8 rounded-3xl shadow-xl w-96 border border-gray-100"
      >
        <h2 className="text-2xl font-bold mb-6 text-center">Hoş Geldin</h2>
        <input
          type="text"
          placeholder="Kullanıcı Adı"
          className="w-full mb-4 p-3 border rounded-xl"
          onChange={(e) =>
            setCredentials({ ...credentials, username: e.target.value })
          }
        />
        <input
          type="password"
          placeholder="Şifre"
          className="w-full mb-6 p-3 border rounded-xl"
          onChange={(e) =>
            setCredentials({ ...credentials, password: e.target.value })
          }
        />
        <button className="w-full bg-blue-600 text-white py-3 rounded-xl font-bold">
          Giriş Yap
        </button>
      </form>
    </div>
  );
};

export default Login;
