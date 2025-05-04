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
          params: { page: 1, limit: 100 },
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
    <div className="bg-white px-4 sm:px-6 py-4 border-y-2 border-gray-300">
      <div className="flex flex-col md:flex-row md:justify-between md:items-end gap-4">
        
        {/* Kiri: Tombol Tambah Artikel */}
        <div className="md:w-auto w-full">
          <button
            onClick={() => router.push("/admin/artikel/create")}
            className="flex items-center gap-2 bg-green-600 text-white font-semibold px-4 py-2 rounded hover:bg-green-700 w-full md:w-auto justify-center md:justify-start"
          >
            <Plus size={18} />
            TAMBAH ARTIKEL
          </button>
        </div>
  
        {/* Kanan: Filter */}
        <div className="flex flex-col md:flex-row md:items-end md:justify-end gap-4 w-full md:w-auto">
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
          <div className="w-full md:w-64">
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
          </div>
  
          {/* Filter Judul */}
          <div className="w-full md:w-64">
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
