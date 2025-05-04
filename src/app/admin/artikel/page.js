"use client";
import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import useAuth from "@/hooks/useAuth";
import api from "@/utils/api";
import { toast } from "react-hot-toast";
import ArticleFilters from "@/components/articles/ArticleFilters";
import ArticleTable from "@/components/articles/ArticleTable";
import Navbar from "@/components/Navbar";
import MenuAdmin from "@/components/MenuAdmin";
import Swal from "sweetalert2";



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

  useEffect(() => {
    // if (user?.role !== "Admin") {
    //   router.push("/");
    //   return;
    // }
    debouncedFetchArticles();
  }, [user, router, filters, pagination.page, debouncedFetchArticles]);

  const handleDelete = async (articleId) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    });

    if (!result.isConfirmed) return;

    try {
      await api.delete(`/articles/${articleId}`);
      
      // Show success message
      Swal.fire({
        title: "Deleted!",
        text: "Article has been deleted.",
        icon: "success",
      });

      if (articles.length === 1 && pagination.page > 1) {
        setPagination((prev) => ({ ...prev, page: prev.page - 1 }));
      } else {
        fetchArticles();
      }
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || "Failed to delete article";
      
      Swal.fire({
        title: "Error!",
        text: errorMessage,
        icon: "error",
      });
    }
  };


  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
    setPagination((prev) => ({ ...prev, page: 1 }));
  };

  if (!user || user.role !== "Admin") return null;

  return (
    <div
      className="bg-repeat min-h-screen pb-4"
      style={{
        backgroundImage:
          'url("https://sso.uns.ac.id/module.php/uns/img/symphony.png")',
      }}
    >          <Navbar />
   <div className="px-4 sm:px-6 lg:px-8 mx-auto container">

      <MenuAdmin />
      <div className="bg-white container mx-auto mt-4 border-2 border-gray-300 rounded-2xl">
        <div className="flex flex-col  sm:items-center text-center px-2 py-4">
          <p className="text-2xl sm:text-3xl font-bold text-blue-800 mb-2 sm:mb-0">
            TABEL ARTIKEL
          </p>
        </div>

        <ArticleFilters
          filters={filters}
          onChange={handleFilterChange}
          autoApply
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
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4 py-4 px-2 sm:px-6">
            <div className="text-sm sm:text-base text-center sm:text-left">
              Menampilkan {(pagination.page - 1) * pagination.limit + 1}-
              {Math.min(pagination.page * pagination.limit, pagination.total)} dari{" "}
              {pagination.total} artikel
            </div>
            <div className="flex flex-wrap justify-center gap-2">
              <button
                disabled={pagination.page <= 1}
                onClick={() =>
                  setPagination((prev) => ({ ...prev, page: prev.page - 1 }))
                }
                className="px-3 py-1 border rounded disabled:opacity-50"
              >
                Previous
              </button>

              {[...Array(Math.ceil(pagination.total / pagination.limit)).keys()].map(
                (i) => {
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
                }
              )}

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
    </div>
  );
};

export default ManageArticlesPage;