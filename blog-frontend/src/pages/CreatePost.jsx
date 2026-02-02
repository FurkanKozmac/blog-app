import { useState, useEffect } from 'react';
import api from '../api/axiosConfig';
import { useNavigate } from 'react-router-dom';

const CreatePost = () => {
    const [post, setPost] = useState({ title: '', content: '', categoryId: '' });
    const [image, setImage] = useState(null);
    const [categories, setCategories] = useState([]);
    const navigate = useNavigate();

    // Kategorileri backend'den çekelim
    useEffect(() => {
        api.get('/categories').then(res => setCategories(res.data));
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        // Form verilerini hazırlayalım (Backend'deki @ModelAttribute yapısına uygun)
        const formData = new FormData();
        formData.append('title', post.title);
        formData.append('content', post.content);
        if (post.categoryId) formData.append('categoryId', post.categoryId);
        if (image) formData.append('image', image);

        try {
            await api.post('/posts', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            alert("Yazı başarıyla paylaşıldı!");
            navigate('/');
        } catch (err) {
            console.error(err);
            alert("Hata oluştu!");
        }
    };

    return (
        <div className="max-w-2xl mx-auto bg-white p-8 rounded-3xl shadow-lg border border-gray-100 mt-10">
            <h2 className="text-3xl font-bold mb-6 text-gray-800">Yeni Yazı Oluştur</h2>
            <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                    <label className="block text-sm font-semibold text-gray-600 mb-1">Başlık</label>
                    <input type="text" required className="w-full p-3 border rounded-xl outline-none focus:ring-2 focus:ring-blue-500"
                           onChange={e => setPost({...post, title: e.target.value})} />
                </div>

                <div>
                    <label className="block text-sm font-semibold text-gray-600 mb-1">Kategori</label>
                    <select className="w-full p-3 border rounded-xl outline-none focus:ring-2 focus:ring-blue-500"
                            onChange={e => setPost({...post, categoryId: e.target.value})}>
                        <option value="">Kategori Seçin</option>
                        {categories.map(cat => (
                            <option key={cat.id} value={cat.id}>{cat.name}</option>
                        ))}
                    </select>
                </div>

                <div>
                    <label className="block text-sm font-semibold text-gray-600 mb-1">Kapak Fotoğrafı</label>
                    <input type="file" className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                           onChange={e => setImage(e.target.files[0])} />
                </div>

                <div>
                    <label className="block text-sm font-semibold text-gray-600 mb-1">İçerik</label>
                    <textarea required rows="6" className="w-full p-3 border rounded-xl outline-none focus:ring-2 focus:ring-blue-500"
                              onChange={e => setPost({...post, content: e.target.value})}></textarea>
                </div>

                <button type="submit" className="w-full bg-blue-600 text-white font-bold py-3 rounded-xl hover:bg-blue-700 transition">
                    Yayınla
                </button>
            </form>
        </div>
    );
};

export default CreatePost;