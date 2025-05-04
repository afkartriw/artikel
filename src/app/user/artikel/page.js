"use client";
import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import useAuth from "@/hooks/useAuth";
import api from "@/utils/api";
import { toast } from "react-hot-toast";
import ArticleTableUser from "@/components/articles/ArticleTableUser";
import Navbar from "@/components/Navbar";

const ManageArticlesPage = () => {
  const { user } = useAuth();
  const router = useRouter();
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState([]);
  const [categoriesLoading, setCategoriesLoading] = useState(false);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 9,
    total: 0,
  });
  const [filters, setFilters] = useState({
    title: "",
    category: "",
  });

  const debounce = (func, delay) => {
    let timer;
    return (...args) => {
      clearTimeout(timer);
      timer = setTimeout(() => func.apply(this, args), delay);
    };
  };

  const fetchArticles = useCallback(async () => {
    try {
      setLoading(true);
      const params = {
        page: pagination.page,
        limit: pagination.limit,
        ...filters,
      };
      const { data } = await api.get("/articles", { params });
      setArticles(data.data);
      setPagination({
        page: data.page,
        limit: data.limit,
        total: data.total,
      });
    } catch (error) {
      toast.error("Failed to fetch articles");
    } finally {
      setLoading(false);
    }
  }, [filters, pagination.page, pagination.limit]);

  const debouncedFetchArticles = useCallback(debounce(fetchArticles, 500), [
    fetchArticles,
  ]);

  const fetchCategories = useCallback(async () => {
    try {
      setCategoriesLoading(true);
      const { data } = await api.get("/categories", {
        params: { page: 1, limit: 100 },
      });
      setCategories(data.data);
    } catch (error) {
      toast.error("Failed to load categories");
    } finally {
      setCategoriesLoading(false);
    }
  }, []);

  useEffect(() => {
    // if (user?.role !== "User") {
    //   router.push("/");
    //   return;
    // }
    fetchCategories();
    debouncedFetchArticles();
  }, [
    user,
    router,
    filters,
    pagination.page,
    debouncedFetchArticles,
    fetchCategories,
  ]);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    const newFilters = { ...filters, [name]: value };
    setFilters(newFilters);
    setPagination((prev) => ({ ...prev, page: 1 }));
  };

  if (!user || user.role !== "User") return null;

  return (
<>
  <Navbar />
  <div
      className="w-full min-h-screen px-4 py-8 bg-repeat"
      style={{
        backgroundImage:
          'url("https://sso.uns.ac.id/module.php/uns/img/symphony.png")',
      }}
    >
  <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6">
    <div className="mb-6">
      {/* Judul */}
      <span className="text-3xl sm:text-5xl font-bold">Artikel Kami</span>

      {/* Baris: Deskripsi + Filter */}
      <div className="flex flex-col gap-4 mt-4 md:flex-row md:items-center md:justify-between">
        {/* Deskripsi */}
        <span className="text-base sm:text-lg text-gray-600 max-w-md">
          “Temukan informasi, wawasan, dan inspirasi terkini dalam satu tempat baca yang cerdas dan terpercaya.”
        </span>

        {/* Filter */}
        <div className="flex flex-wrap gap-3 items-center overflow-x-auto">
          {/* Tombol All */}
          <button
            onClick={() => {
              setFilters({ title: "", category: "" });
              setPagination((prev) => ({ ...prev, page: 1 }));
            }}
            className={`px-4 py-2 border-b-2 whitespace-nowrap ${
              filters.title === "" && filters.category === ""
                ? "border-blue-800 font-semibold text-blue-800"
                : "border-transparent hover:border-b-blue-800"
            }`}
          >
            All
          </button>

          {/* Kategori */}
          <select
            name="category"
            value={filters.category}
            onChange={handleFilterChange}
            className="px-3 py-2 border rounded-md min-w-[150px] text-sm bg-white"
            disabled={categoriesLoading}
          >
            <option value="">Kategori</option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>

          {/* Input Judul */}
          <input
            type="text"
            name="title"
            value={filters.title}
            onChange={handleFilterChange}
            placeholder="Cari judul...."
            className="px-3 py-2 border rounded-md min-w-[200px] text-sm bg-white"
          />
        </div>
      </div>
    </div>

    <ArticleTableUser
      articles={articles}
      loading={loading}
      onDetail={(id) => router.push(`/user/artikel/detail/${id}`)}
    />

    {/* Pagination */}
    {pagination.total > 0 && (
      <div className="flex flex-col sm:flex-row justify-between items-center mt-6 gap-3 text-sm">
        <div>
          Menampilkan {(pagination.page - 1) * pagination.limit + 1}-
          {Math.min(pagination.page * pagination.limit, pagination.total)} dari{" "}
          {pagination.total}
        </div>
        <div className="flex flex-wrap gap-1 items-center">
          <button
            disabled={pagination.page <= 1}
            onClick={() =>
              setPagination((prev) => ({ ...prev, page: prev.page - 1 }))
            }
            className="px-3 py-1 border rounded disabled:opacity-50"
          >
            Previous
          </button>
          {[
            ...Array(
              Math.max(1, Math.ceil(pagination.total / pagination.limit))
            ).keys(),
          ].map((i) => {
            const page = i + 1;
            return (
              <button
                key={page}
                onClick={() =>
                  setPagination((prev) => ({ ...prev, page }))
                }
                className={`px-3 py-1 border rounded ${
                  pagination.page === page
                    ? "bg-blue-600 text-white"
                    : "hover:bg-gray-200"
                }`}
              >
                {page}
              </button>
            );
          })}
          <button
            disabled={
              pagination.page >=
              Math.ceil(pagination.total / pagination.limit)
            }
            onClick={() =>
              setPagination((prev) => ({ ...prev, page: prev.page + 1 }))
            }
            className="px-3 py-1 border rounded disabled:opacity-50"
          >
            Next
          </button>
        </div>
      </div>
    )}
  </div></div>
</>

  );
};

export default ManageArticlesPage;
