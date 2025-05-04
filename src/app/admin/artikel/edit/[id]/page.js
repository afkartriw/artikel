'use client';
import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import api from '@/utils/api';
import Swal from 'sweetalert2';
import RichTextEditor from '@/components/articles/RichTextEditor';
import Navbar from '@/components/Navbar';
import Link from 'next/link';
import ArticlePreview from '@/components/articles/ArticlePreview';

const EditArticlePage = () => {
  const router = useRouter();
  const { id } = useParams();
  const [formData, setFormData] = useState({
    title: '',
    categoryId: '',
    content: '',
    imageUrl: ''
  });
  const [selectedImage, setSelectedImage] = useState(null);
  const [categories, setCategories] = useState([]);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [showPreview, setShowPreview] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch article data
        const { data: article } = await api.get(`/articles/${id}`);
        setFormData({
          title: article.title,
          content: article.content,
          categoryId: article.categoryId,
          imageUrl: article.imageUrl || ''
        });

        // Fetch categories
        const { data: categoriesData } = await api.get('/categories');
        setCategories(categoriesData.data || []);
      } catch (error) {
        Swal.fire({
          title: 'Gagal!',
          text: 'Gagal memuat data artikel',
          icon: 'error',
          confirmButtonColor: '#3085d6',
        }).then(() => {
          router.push('/admin/artikel');
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [id, router]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const handleContentChange = (value) => {
    setFormData((prev) => ({ ...prev, content: value }));
    if (errors.content) {
      setErrors((prev) => ({ ...prev, content: '' }));
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validasi file
    if (file.size > 2 * 1024 * 1024) {
      Swal.fire({
        title: 'Ukuran gambar terlalu besar',
        text: 'Maksimal 2MB',
        icon: 'warning',
        confirmButtonColor: '#3085d6',
      });
      return;
    }

    if (!file.type.match('image.*')) {
      Swal.fire({
        title: 'Format tidak didukung',
        text: 'Hanya file gambar yang diizinkan',
        icon: 'warning',
        confirmButtonColor: '#3085d6',
      });
      return;
    }

    setSelectedImage(file);
    setFormData(prev => ({ ...prev, imageUrl: URL.createObjectURL(file) }));
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.title || formData.title.length < 10) {
      newErrors.title = 'Judul minimal 10 karakter';
    }
    if (!formData.categoryId) {
      newErrors.categoryId = 'Kategori wajib dipilih';
    }
    if (!formData.content || formData.content.trim().length < 50) {
      newErrors.content = 'Konten minimal 50 karakter';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handlePreview = () => {
    if (!validateForm()) {
      Swal.fire({
        title: 'Form tidak valid',
        text: 'Periksa kembali inputan Anda',
        icon: 'warning',
        confirmButtonColor: '#3085d6',
      });
      return;
    }
    setShowPreview(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) {
      Swal.fire({
        title: 'Form tidak valid',
        text: 'Periksa kembali inputan Anda',
        icon: 'warning',
        confirmButtonColor: '#3085d6',
      });
      return;
    }

    const result = await Swal.fire({
      title: 'Perbarui Artikel?',
      text: 'Anda yakin ingin menyimpan perubahan artikel ini?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Ya, Simpan!',
      cancelButtonText: 'Batal',
    });

    if (!result.isConfirmed) return;

    setIsSubmitting(true);

    try {
      let imageUrl = formData.imageUrl;
      
      // Upload new image if selected
      if (selectedImage) {
        const formData = new FormData();
        formData.append('image', selectedImage);
        
        const uploadResponse = await api.post('/upload', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
        
        imageUrl = uploadResponse.data.imageUrl;
      }

      const payload = {
        title: formData.title,
        content: formData.content,
        categoryId: formData.categoryId,
        ...(imageUrl && { imageUrl }),
      };

      await api.put(`/articles/${id}`, payload);
      
      await Swal.fire({
        title: 'Berhasil!',
        text: 'Artikel berhasil diperbarui',
        icon: 'success',
        confirmButtonColor: '#3085d6',
      });
      
      router.push('/admin/artikel');
    } catch (error) {
      console.error('Update error:', error);
      const errorMessage = error.response?.data?.message || 'Gagal memperbarui artikel';
      
      await Swal.fire({
        title: 'Gagal!',
        text: errorMessage,
        icon: 'error',
        confirmButtonColor: '#3085d6',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <>
      <Navbar />
      {showPreview ? (
        <ArticlePreview
          title={formData.title}
          content={formData.content}
          categoryId={formData.categoryId}
          categories={categories}
          selectedImage={selectedImage}
          existingImageUrl={formData.imageUrl}
          onBackToEdit={() => setShowPreview(false)}
          onSubmit={handleSubmit}
          isSubmitting={isSubmitting}
        />
      ) : (
        <div
          className="min-h-screen py-6 px-4 sm:py-10 sm:px-6 bg-gray-100"
          style={{
            backgroundImage: 'url("https://sso.uns.ac.id/module.php/uns/img/symphony.png")',
            backgroundRepeat: "repeat",
          }}
        >
          <div className="w-full max-w-5xl mx-auto bg-white rounded-2xl shadow-md overflow-hidden border border-gray-200">
            <div className="px-4 sm:px-6 py-5">
              <p className="text-2xl sm:text-3xl font-bold text-gray-800">EDIT ARTIKEL</p>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="border-y border-gray-200 px-4 sm:px-6 py-4 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="col-span-1 md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Judul Artikel
                    </label>
                    <input
                      type="text"
                      name="title"
                      placeholder="Masukkan judul artikel"
                      value={formData.title}
                      onChange={handleChange}
                      className={`w-full p-3 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400 ${
                        errors.title ? "border-red-500" : "border-gray-300"
                      }`}
                    />
                    {errors.title && (
                      <p className="text-sm text-red-500 mt-1">{errors.title}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Kategori
                    </label>
                    <select
                      name="categoryId"
                      value={formData.categoryId}
                      onChange={handleChange}
                      className={`w-full p-3 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400 ${
                        errors.categoryId ? "border-red-500" : "border-gray-300"
                      }`}
                    >
                      <option value="">Pilih Kategori</option>
                      {categories.map((cat) => (
                        <option key={cat.id} value={cat.id}>
                          {cat.name}
                        </option>
                      ))}
                    </select>
                    {errors.categoryId && (
                      <p className="text-sm text-red-500 mt-1">{errors.categoryId}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Gambar Utama
                    </label>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="w-full p-3 border rounded-lg border-gray-300 shadow-sm cursor-pointer"
                    />
                    {(selectedImage || formData.imageUrl) && (
                      <div className="mt-3">
                        <img
                          src={selectedImage ? URL.createObjectURL(selectedImage) : formData.imageUrl}
                          alt="Preview"
                          className="w-full h-48 object-cover rounded-lg border"
                          onError={(e) => {
                            e.target.src =
                              "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRfPV3mMYlF-fb8Z8ClaWUc8DoqS6J612gEZQ&s";
                          }}
                        />
                      </div>
                    )}
                  </div>

                  <div className="col-span-1 md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Konten Artikel
                    </label>
                    <RichTextEditor
                      value={formData.content}
                      onChange={handleContentChange}
                      placeholder="Tulis konten artikel di sini..."
                    />
                    {errors.content && (
                      <p className="text-sm text-red-500 mt-1">{errors.content}</p>
                    )}
                  </div>
                </div>
              </div>
              <div className="flex flex-col sm:flex-row justify-between items-center gap-4 border-t border-gray-200 px-4 sm:px-6 py-4">
                <Link
                  href="/admin/artikel"
                  className="w-full sm:w-auto inline-flex justify-center items-center px-4 py-2 bg-gray-500 hover:bg-gray-700 text-white rounded-md transition"
                >
                  Kembali
                </Link>
                <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
                  <button
                    type="button"
                    onClick={handlePreview}
                    className="w-full sm:w-auto inline-flex justify-center items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition"
                  >
                    Preview
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full sm:w-auto inline-flex justify-center items-center px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-md transition disabled:opacity-50"
                  >
                    {isSubmitting ? 'Menyimpan...' : 'Simpan'}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default EditArticlePage;