"use client";
import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import useAuth from "@/hooks/useAuth";
import api from "@/utils/api";
import { toast } from "react-hot-toast";
import ArticleFilters from "@/components/articles/ArticleFilters";
import ArticleTable from "@/components/articles/ArticleTable";
import Navbar from "@/components/Navbar";

const ManageArticlesPage = () => {
  const { user } = useAuth();
  const router = useRouter();
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
  });
  const [filters, setFilters] = useState({
    title: "",
    category: "",
  });

  // Debounce function to prevent too many API calls while typing
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

  // Debounced version of fetchArticles
  const debouncedFetchArticles = useCallback(debounce(fetchArticles, 500), [
    fetchArticles,
  ]);

  useEffect(() => {
    if (user?.role !== "Admin") {
      router.push("/");
      return;
    }
    debouncedFetchArticles();
  }, [user, router, filters, pagination.page, debouncedFetchArticles]);

  const handleDelete = async (articleId) => {
    if (!confirm("Are you sure you want to delete this article?")) return;

    try {
      await api.delete(`/articles/${articleId}`);
      toast.success("Article deleted successfully");

      if (articles.length === 1 && pagination.page > 1) {
        setPagination((prev) => ({ ...prev, page: prev.page - 1 }));
      } else {
        fetchArticles();
      }
    } catch (error) {
      console.error("Delete error:", error);
      const errorMessage =
        error.response?.data?.message || "Failed to delete article";
      toast.error(errorMessage);
    }
  };

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
    setPagination((prev) => ({ ...prev, page: 1 }));
  };

  if (!user || user.role !== "Admin") return null;

  return (
    <div className="bg-repeat min-h-screen" style={{
      backgroundImage: 'url("https://sso.uns.ac.id/module.php/uns/img/symphony.png")',
    }}>
      <Navbar />
      <div className="bg-white container mx-auto mt-10 border-2 border-gray-300 rounded-2xl">
        <div className="flex justify-center items-center px-6 py-4">
          <p className="text-3xl font-bold">TABEL ARTIKEL</p>

        </div>

        <ArticleFilters
          filters={filters}
          onChange={handleFilterChange}
          autoApply // Add this prop to indicate filters should be applied automatically
        />

        <ArticleTable
          articles={articles}
          loading={loading}
          onDelete={handleDelete}
          onEdit={(id) => router.push(`/admin/artikel/edit/${id}`)}
          onDetail={(id) => router.push(`/admin/artikel/detail/${id}`)}
        />

        {/* Pagination Controls */}
        {pagination.total > 0 && (
          <div className="flex justify-between items-center py-4 px-6">
            <div>
              Showing {(pagination.page - 1) * pagination.limit + 1}-
              {Math.min(pagination.page * pagination.limit, pagination.total)}{" "}
              of {pagination.total}
            </div>
            <div className="flex space-x-2 items-center">
              <button
                disabled={pagination.page <= 1}
                onClick={() =>
                  setPagination((prev) => ({ ...prev, page: prev.page - 1 }))
                }
                className="px-3 py-1 border rounded disabled:opacity-50 cursor-pointer"
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
                    onClick={() => setPagination((prev) => ({ ...prev, page }))}
                    className={`px-3 py-1 border rounded cursor-pointer ${
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
                className="px-3 py-1 border rounded disabled:opacity-50 cursor-pointer"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ManageArticlesPage;
