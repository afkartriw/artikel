"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import api from "@/utils/api";
import { toast } from "react-hot-toast";
import RichTextEditor from "@/components/articles/RichTextEditor";
import Navbar from "@/components/Navbar";
import Link from "next/link";
import ArticlePreview from "@/components/articles/ArticlePreview";

const CreateArticlePage = () => {
  const router = useRouter();
  const [formData, setFormData] = useState({
    title: "",
    categoryId: "",
    content: "",
  });
  const [selectedImage, setSelectedImage] = useState(null);
  const [categories, setCategories] = useState([]);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPreview, setShowPreview] = useState(false);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const { data } = await api.get("/categories");
        setCategories(data.data || []);
      } catch (error) {
        toast.error("Failed to load categories");
      }
    };
    fetchCategories();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleContentChange = (value) => {
    setFormData((prev) => ({ ...prev, content: value }));
    if (errors.content) setErrors((prev) => ({ ...prev, content: "" }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validasi file
    if (file.size > 2 * 1024 * 1024) {
      toast.error("Ukuran gambar terlalu besar (maksimal 2MB)");
      return;
    }

    if (!file.type.match("image.*")) {
      toast.error("Hanya file gambar yang diizinkan");
      return;
    }

    setSelectedImage(file);
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.title || formData.title.length < 10) {
      newErrors.title = "Judul minimal 10 karakter";
    }
    if (!formData.categoryId) {
      newErrors.categoryId = "Kategori wajib dipilih";
    }
    if (!formData.content || formData.content.trim().length < 50) {
      newErrors.content = "Konten minimal 50 karakter";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handlePreview = () => {
    if (!validateForm()) {
      toast.error("Periksa kembali inputan Anda");
      return;
    }
    setShowPreview(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) {
      toast.error("Periksa kembali inputan Anda");
      return;
    }

    setIsSubmitting(true);
    try {
      let imageUrl = null;

      if (selectedImage) {
        const formData = new FormData();
        formData.append("image", selectedImage);

        const uploadResponse = await api.post("/upload", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
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

      await api.post("/articles", payload);
      toast.success("Artikel berhasil dibuat");
      router.push("/admin/artikel");
    } catch (error) {
      toast.error(error.response?.data?.message || "Gagal membuat artikel");
    } finally {
      setIsSubmitting(false);
    }
  };

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
          onBackToEdit={() => setShowPreview(false)}
          onSubmit={handleSubmit}
          isSubmitting={isSubmitting}
        />
      ) : (
        <div
          className="min-h-screen py-6 sm:py-10 px-4 sm:px-6 bg-gray-100"
          style={{
            backgroundImage:
              'url("https://sso.uns.ac.id/module.php/uns/img/symphony.png")',
            backgroundRepeat: "repeat",
          }}
        >
          <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-md overflow-hidden border border-gray-200">
            <div className="px-6 py-5">
              <p className="text-3xl font-bold text-blue-800">TAMBAH ARTIKEL</p>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="border-y border-gray-200 px-6 py-4 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="col-span-2">
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
                      <p className="text-sm text-red-500 mt-1">
                        {errors.title}
                      </p>
                    )}
                  </div>

                  <div className="col-span-2 md:col-span-1">
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
                      <p className="text-sm text-red-500 mt-1">
                        {errors.categoryId}
                      </p>
                    )}
                  </div>

                  <div className="col-span-2 md:col-span-1">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Gambar Utama
                    </label>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="w-full p-3 border rounded-lg border-gray-300 shadow-sm cursor-pointer"
                    />
                    {selectedImage && (
                      <div className="mt-3">
                        <img
                          src={URL.createObjectURL(selectedImage)}
                          alt="Preview"
                          className="h-48 object-cover rounded-lg border"
                        />
                      </div>
                    )}
                  </div>

                  <div className="col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Konten Artikel
                    </label>
                    <RichTextEditor
                      value={formData.content}
                      onChange={handleContentChange}
                      placeholder="Tulis konten artikel di sini..."
                      error={errors.content}
                    />
                    {errors.content && (
                      <p className="text-sm text-red-500 mt-1">
                        {errors.content}
                      </p>
                    )}
                  </div>
                </div>
              </div>
              <div className="flex justify-between items-center border-gray-200 px-6 py-4">
                <Link
                  href="/admin/artikel"
                  className="inline-flex items-center px-4 py-2 bg-gray-500 hover:bg-gray-700 text-white rounded-md transition"
                >
                  Kembali
                </Link>
                <div className="space-x-3">
                  <button
                    type="button"
                    onClick={handlePreview}
                    className="inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition"
                  >
                    Preview
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="inline-flex items-center px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-md transition disabled:opacity-50 cursor-pointer"
                  >
                    {isSubmitting ? "Menyimpan..." : "Simpan"}
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

export default CreateArticlePage;