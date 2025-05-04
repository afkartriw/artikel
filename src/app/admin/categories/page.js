"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import useAuth from "@/hooks/useAuth";
import api from "@/utils/api";
import { toast } from "react-hot-toast";
import Navbar from "@/components/Navbar";
import { Plus } from "lucide-react";
import CategoriesTable from "@/components/categories/CategoriesTable";
import MenuAdmin from "@/components/MenuAdmin";
import Swal from "sweetalert2";


const ManageCategoriesPage = () => {
  const { user } = useAuth();
  const router = useRouter();
  const [categories, setCategories] = useState([]);
  const [allCategories, setAllCategories] = useState([]); // Store all categories for frontend filtering
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    search: "",
  });
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 1,
  });

  const fetchData = async (page = 1) => {
    try {
      setLoading(true);
      const { data } = await api.get(
        `/categories?page=${page}&limit=${pagination.limit}`
      );

      setAllCategories(data.data); // Store all categories
      setCategories(data.data); // Initially set categories to all data
      setPagination({
        page: data.currentPage,
        limit: pagination.limit,
        total: data.totalData,
        totalPages: data.totalPages,
      });
    } catch (error) {
      toast.error("Failed to fetch categories");
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // if (user?.role !== "Admin") {
    //   router.push("/");
    //   return;
    // }
    fetchData();
  }, [user, router]);

  useEffect(() => {
    if (filters.search === "") {
      // If search is empty, show all categories
      setCategories(allCategories);
    } else {
      // Filter categories based on search term
      const filtered = allCategories.filter(category =>
        category.name.toLowerCase().includes(filters.search.toLowerCase())
      );
      setCategories(filtered);
    }
  }, [filters.search, allCategories]);

  const handleDelete = async (categoryId) => {
    const result = await Swal.fire({
      title: "Delete Category?",
      html: "<span style='color:#f8bb86'>Warning:</span> Articles in this category will become uncategorized.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "Cancel",
      focusCancel: true,
      backdrop: `
        rgba(0,0,0,0.7)
        url("/images/nyan-cat.gif")
        left top
        no-repeat
      `
    });
  
    if (!result.isConfirmed) return;
  
    try {
      await api.delete(`/categories/${categoryId}`);
      
      Swal.fire({
        title: "Deleted!",
        text: "Category has been deleted.",
        icon: "success",
        timer: 1500,
        timerProgressBar: true,
        showConfirmButton: false
      });
      
      fetchData(pagination.page);
    } catch (error) {
      Swal.fire({
        title: "Delete Failed!",
        html: `
          <div>
            <p>Make sure no articles are using this category.</p>
            ${error.response?.data?.message ? 
              `<p class="error-detail">${error.response.data.message}</p>` : ''}
          </div>
        `,
        icon: "error",
        confirmButtonText: "OK",
        scrollbarPadding: false
      });
    }
  };

  const handlePageChange = (newPage) => {
    fetchData(newPage);
  };

  if (!user || user.role !== "Admin") return null;

  return (
    <div
      className="bg-repeat min-h-screen pb-4"
      style={{
        backgroundImage:
          'url("https://sso.uns.ac.id/module.php/uns/img/symphony.png")',
      }}
    >
      <Navbar />
      <div className="px-4 sm:px-6 lg:px-8 mx-auto container">
        <MenuAdmin />
        <div className="bg-white container mx-auto mt-4 border-2 border-gray-300 rounded-2xl py-6">
          <div className="flex justify-center items-center mb-4">
            <p className="text-2xl sm:text-3xl font-bold text-blue-800">
              TABEL KATEGORI
            </p>
          </div>

          {/* Filter Section */}
          <div className="bg-white border-y-2 border-gray-300 py-4 px-4 sm:px-6">
            <div className="flex flex-col sm:flex-row sm:justify-between gap-y-4 sm:items-end">
              {/* Left: Add Button */}
              <button
                onClick={() => router.push("/admin/categories/create")}
                className="w-full sm:w-auto flex items-center justify-center gap-2 bg-green-600 text-white font-semibold px-4 py-2 rounded hover:bg-green-700 transition"
              >
                <Plus size={18} />
                TAMBAH KATEGORI
              </button>

              {/* Right: Filter */}
              <div className="flex flex-col sm:flex-row gap-3 sm:items-end w-full sm:w-auto">
                {/* All Button */}
                <button
                  onClick={() => setFilters({ search: "" })}
                  className={`px-4 py-2 border-b-2 transition w-full sm:w-auto text-center ${
                    filters.search === ""
                      ? "border-blue-800 font-semibold text-blue-800"
                      : "border-transparent hover:border-b-blue-800"
                  }`}
                >
                  All
                </button>

                {/* Search Input */}
                <div className="w-full sm:w-64">
                  <input
                    type="text"
                    name="search"
                    value={filters.search}
                    onChange={(e) => setFilters({ search: e.target.value })}
                    placeholder="Cari Kategori"
                    className="w-full px-3 py-2 border rounded-md"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Table */}
          <CategoriesTable
            categories={categories}
            loading={loading}
            pagination={pagination}
            onDelete={handleDelete}
            onPageChange={handlePageChange}
            searchTerm={filters.search}
          />
        </div>
      </div>
    </div>
  );
};

export default ManageCategoriesPage;
