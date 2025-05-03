"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import api from "@/utils/api";
import { toast } from "react-hot-toast";
import { Plus } from "lucide-react";

const ArticleFilters = ({ filters, onChange, autoApply }) => {
  const router = useRouter();
  const [categories, setCategories] = useState([]);
  const [categoriesLoading, setCategoriesLoading] = useState(false);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setCategoriesLoading(true);
        const { data } = await api.get("/categories", {
          params: {
            page: 1,
            limit: 100, // Fetch all categories or a reasonable large number
          },
        });
        setCategories(data.data);
      } catch (error) {
        console.error("Failed to fetch categories:", error);
        toast.error("Failed to load categories");
      } finally {
        setCategoriesLoading(false);
      }
    };

    fetchCategories();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    const newFilters = { ...filters, [name]: value };
    onChange(newFilters);
  };

  return (
    <div className="bg-white px-6 py-4 border-y-2 border-gray-300">
      <div className="flex justify-between flex-wrap items-end">
        {/* Kiri: Tombol Tambah Artikel */}
        <button
          onClick={() => router.push("/admin/artikel/create")}
          className="flex items-center gap-2 bg-green-600 text-white font-semibold px-4 py-2 rounded hover:bg-green-700 cursor-pointer"
        >
          <Plus size={18} />
          TAMBAH ARTIKEL
        </button>

        {/* Kanan: Filter */}
        <div className="flex flex-wrap gap-4 items-end">
          {/* Tombol All */}
          <button
            onClick={() =>
              onChange({
                title: "",
                category: "",
              })
            }
            className={`px-4 py-2 border-b-2 cursor-pointer ${
              filters.title === "" && filters.category === ""
                ? "border-blue-800 font-semibold text-blue-800"
                : "border-transparent hover:border-b-blue-800"
            }`}
          >
            All
          </button>

          {/* Filter Kategori */}
          <div className="w-64">
            <select
              name="category"
              value={filters.category}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded-md"
              disabled={categoriesLoading}
            >
              <option value="">Cari Kategori</option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
            {categoriesLoading && (
              <p className="text-sm text-gray-500 mt-1">
                Loading categories...
              </p>
            )}
          </div>

          {/* Filter Judul */}
          <div className="w-64">
            <input
              type="text"
              name="title"
              value={filters.title}
              onChange={handleChange}
              placeholder="Cari Judul"
              className="w-full px-3 py-2 border rounded-md"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ArticleFilters;
