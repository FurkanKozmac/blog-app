import axios from "axios";

// Base URL (Vite environment variable'dan okur)
const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8080/api";

const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// 1. REQUEST INTERCEPTOR (İstek Atılmadan Önce)
api.interceptors.request.use(
  (config) => {
    // Her istekte localStorage'dan token'ı alıp Header'a ekliyoruz
    const token = localStorage.getItem("accessToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error),
);

// 2. RESPONSE INTERCEPTOR (Cevap Geldikten Sonra)
api.interceptors.response.use(
  (response) => response, // Başarılıysa elleme, devam et
  async (error) => {
    const originalRequest = error.config;

    // Eğer hata 401 ise VE daha önce bu isteği tekrar denemediysek (_retry)
    if (
      error.response &&
      error.response.status === 401 &&
      !originalRequest._retry
    ) {
      originalRequest._retry = true; // Sonsuz döngüye girmesin diye işaretliyoruz

      try {
        const refreshToken = localStorage.getItem("refreshToken");

        // Eğer refresh token yoksa yapacak bir şey yok, çıkış yap
        if (!refreshToken) {
          throw new Error("No refresh token");
        }

        // Backend'den yeni token iste
        const res = await axios.post(`${BASE_URL}/auth/refresh`, {
          refreshToken: refreshToken,
        });

        if (res.status === 200) {
          // Yeni tokenları kaydet
          const { accessToken, refreshToken: newRefreshToken } = res.data;
          localStorage.setItem("accessToken", accessToken);

          // Backend yeni bir refresh token da dönüyorsa onu da güncelle
          if (newRefreshToken) {
            localStorage.setItem("refreshToken", newRefreshToken);
          }

          // Axios'un varsayılan header'ını güncelle
          api.defaults.headers.common["Authorization"] =
            `Bearer ${accessToken}`;

          // Başarısız olan orijinal isteğin header'ını güncelle
          originalRequest.headers["Authorization"] = `Bearer ${accessToken}`;

          // Orijinal isteği TEKRAR GÖNDER
          return api(originalRequest);
        }
      } catch (refreshError) {
        // Refresh token da patladıysa (süresi dolmuşsa) kullanıcıyı at
        console.error("Oturum yenilenemedi:", refreshError);
        localStorage.clear();
        window.location.href = "/login"; // Login sayfasına yönlendir
      }
    }

    return Promise.reject(error);
  },
);

export default api;
