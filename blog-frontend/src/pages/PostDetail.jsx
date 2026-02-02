import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../api/axiosConfig";
import {
  Trash2,
  MessageCircle,
  User,
  Calendar,
  Tag,
  Pencil,
} from "lucide-react"; // Pencil eklendi

const PostDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [post, setPost] = useState(null);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [loading, setLoading] = useState(true);

  const currentUsername = localStorage.getItem("username");
  const userRole = localStorage.getItem("userRole");

  useEffect(() => {
    fetchPostAndComments();
  }, [id]);

  const fetchPostAndComments = async () => {
    try {
      setLoading(true);
      const postRes = await api.get(`/posts/${id}`);
      setPost(postRes.data);

      const commentRes = await api.get(`/comments/post/${id}`);
      setComments(commentRes.data.content || []);

      setLoading(false);
    } catch (err) {
      console.error("Veri yükleme hatası:", err);
      setLoading(false);
    }
  };

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    try {
      await api.post("/comments", {
        postId: Number(id),
        content: newComment,
      });
      setNewComment("");
      fetchPostAndComments();
    } catch (err) {
      alert("Yorum gönderilemedi. Oturumunuz kapanmış olabilir.");
    }
  };

  const handleDeleteComment = async (commentId) => {
    if (window.confirm("Bu yorumu silmek istediğinize emin misiniz?")) {
      try {
        await api.delete(`/comments/${commentId}`);
        fetchPostAndComments();
      } catch (err) {
        alert("Yorum silinemedi!");
      }
    }
  };

  const handleDeletePost = async () => {
    if (
      window.confirm(
        "Bu yazıyı silmek istediğinize emin misiniz? Bu işlem geri alınamaz.",
      )
    ) {
      try {
        await api.delete(`/posts/${id}`);
        alert("Yazı başarıyla silindi.");
        navigate("/");
      } catch (err) {
        alert("Silme yetkiniz yok veya bir hata oluştu.");
      }
    }
  };

  if (loading)
    return (
      <div className="flex justify-center mt-20 animate-pulse text-gray-500 font-medium">
        Yazı yükleniyor...
      </div>
    );
  if (!post)
    return (
      <div className="text-center mt-20 text-red-500 font-bold">
        Yazı bulunamadı!
      </div>
    );

  const canDelete =
    post.authorName === currentUsername || userRole === "ROLE_ADMIN";

  return (
    <div className="max-w-4xl mx-auto py-10 px-4">
      {/* --- 1. POST İÇERİĞİ --- */}
      <article className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden mb-12">
        {post.imageUrl && (
          <img
            src={post.imageUrl}
            alt={post.title}
            className="w-full h-[400px] object-cover"
          />
        )}
        <div className="p-8 md:p-12">
          <div className="flex justify-between items-start mb-6">
            <div className="flex items-center gap-2 text-blue-600 bg-blue-50 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider">
              <Tag size={14} />
              {post.categoryName || "Genel"}
            </div>

            {/* YETKİLİ KULLANICI BUTONLARI */}
            {canDelete && (
              <div className="flex gap-2">
                {/* DÜZENLE BUTONU */}
                <button
                  onClick={() => navigate(`/post/edit/${id}`)}
                  className="flex items-center gap-2 bg-blue-50 text-blue-600 hover:bg-blue-600 hover:text-white px-4 py-2 rounded-xl text-sm font-bold transition-all"
                >
                  <Pencil size={16} /> Düzenle
                </button>
                {/* SİL BUTONU */}
                <button
                  onClick={handleDeletePost}
                  className="flex items-center gap-2 bg-red-50 text-red-600 hover:bg-red-600 hover:text-white px-4 py-2 rounded-xl text-sm font-bold transition-all"
                >
                  <Trash2 size={16} /> Yazıyı Sil
                </button>
              </div>
            )}
          </div>

          <h1 className="text-4xl md:text-5xl font-black text-gray-900 leading-tight mb-6">
            {post.title}
          </h1>

          <div className="flex items-center gap-6 text-sm text-gray-500 mb-10 pb-6 border-b border-gray-50">
            <div className="flex items-center gap-2">
              <User size={16} className="text-gray-400" />
              <span className="font-semibold text-gray-700">
                @{post.authorName}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Calendar size={16} className="text-gray-400" />
              <span>
                {new Date(post.createdAt).toLocaleDateString("tr-TR")}
              </span>
            </div>
          </div>

          <div className="text-gray-700 leading-relaxed text-lg md:text-xl whitespace-pre-wrap font-serif">
            {post.content}
          </div>
        </div>
      </article>

      {/* --- 2. YORUMLAR BAŞLIĞI --- */}
      <div className="flex items-center gap-3 mb-8">
        <MessageCircle className="text-blue-600" />
        <h3 className="text-2xl font-bold text-gray-800">
          Yorumlar ({comments.length})
        </h3>
      </div>

      {/* --- 3. YORUM YAZMA FORMU --- */}
      {localStorage.getItem("accessToken") ? (
        <form
          onSubmit={handleCommentSubmit}
          className="mb-12 bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col gap-4"
        >
          <textarea
            className="w-full p-4 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 transition resize-none text-gray-700"
            rows="3"
            placeholder="Düşüncelerini paylaş..."
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            required
          />
          <div className="flex justify-end">
            <button className="bg-blue-600 text-white px-8 py-2.5 rounded-xl font-bold hover:bg-blue-700 transition shadow-md">
              Yorum Yap
            </button>
          </div>
        </form>
      ) : (
        <div className="bg-gray-100 p-6 rounded-2xl text-center text-gray-500 mb-12 italic">
          Yorum yapmak için giriş yapmalısın.
        </div>
      )}

      {/* --- 4. YORUM LİSTESİ --- */}
      <div className="space-y-6">
        {comments.length > 0 ? (
          comments.map((comment) => {
            const canDeleteComment =
              comment.username === currentUsername || userRole === "ROLE_ADMIN";
            return (
              <div
                key={comment.id}
                className="flex gap-4 animate-in fade-in slide-in-from-bottom-2 duration-500"
              >
                <div className="w-10 h-10 bg-gradient-to-tr from-blue-500 to-indigo-600 rounded-full flex items-center justify-center text-white font-bold shrink-0 shadow-md">
                  {comment.username.charAt(0).toUpperCase()}
                </div>
                <div className="flex-1 bg-white p-5 rounded-2xl rounded-tl-none shadow-xs border border-gray-100">
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-bold text-gray-800">
                      @{comment.username}
                    </span>
                    <div className="flex items-center gap-3">
                      <span className="text-xs text-gray-400">
                        {new Date(comment.createdAt).toLocaleDateString(
                          "tr-TR",
                        )}
                      </span>
                      {canDeleteComment && (
                        <button
                          onClick={() => handleDeleteComment(comment.id)}
                          className="text-gray-300 hover:text-red-500 transition-colors"
                        >
                          <Trash2 size={14} />
                        </button>
                      )}
                    </div>
                  </div>
                  <p className="text-gray-600 leading-relaxed">
                    {comment.content}
                  </p>
                </div>
              </div>
            );
          })
        ) : (
          <div className="text-center py-10 text-gray-400">
            Henüz yorum yapılmamış. İlk yorumu sen yap!
          </div>
        )}
      </div>
    </div>
  );
};

export default PostDetail;
