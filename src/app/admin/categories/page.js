'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import useAuth from '@/hooks/useAuth';
import api from '@/utils/api';
import { toast } from 'react-hot-toast';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import { Plus, Eye, Pencil, Trash } from 'lucide-react';

const ManageCategoriesPage = () => {
  const { user } = useAuth();
  const router = useRouter();
  const [allCategories, setAllCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    search: '',
  });
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
  });

  const fetchData = async (page = 1, query = '') => {
    try {
      setLoading(true);
      const { data } = await api.get('/categories', {
        params: {
          page,
          limit: pagination.limit,
          search: query,
        },
      });
      setAllCategories(data.data);
      setPagination((prev) => ({
        ...prev,
        page: data.currentPage,
        total: data.totalData,
      }));
    } catch (error) {
      toast.error('Failed to fetch categories');
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user?.role !== 'Admin') {
      router.push('/');
      return;
    }
    fetchData(pagination.page, filters.search);
  }, [user, router, pagination.page, pagination.limit, filters.search]);

  const handleDelete = async (categoryId) => {
    if (!confirm('Delete this category? Articles in this category will be uncategorized.')) return;

    try {
      await api.delete(`/categories/${categoryId}`);
      toast.success('Category deleted');
      fetchData(pagination.page, filters.search);
    } catch (error) {
      toast.error('Delete failed. Make sure no articles are using this category.');
    }
  };

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
    setPagination(prev => ({ ...prev, page: 1 }));
  };

  if (!user || user.role !== 'Admin') return null;

  return (
    <div className="bg-repeat min-h-screen" style={{
      backgroundImage: 'url("https://sso.uns.ac.id/module.php/uns/img/symphony.png")',
    }}>
      <Navbar />
      <div className="bg-white container mx-auto mt-10 border-2 border-gray-300 rounded-2xl">
        <div className="flex justify-center items-center px-6 py-4">
          <p className="text-3xl font-bold">TABEL KATEGORI</p>
        </div>

        {/* Filter Section */}
        <div className="bg-white px-6 py-4 border-y-2 border-gray-300">
          <div className="flex justify-between flex-wrap items-end">
            {/* Left: Add Category Button */}
            <button
              onClick={() => router.push("/admin/categories/create")}
              className="flex items-center gap-2 bg-green-600 text-white font-semibold px-4 py-2 rounded hover:bg-green-700 cursor-pointer"
            >
              <Plus size={18} />
              TAMBAH KATEGORI
            </button>

            {/* Right: Filters */}
            <div className="flex flex-wrap gap-4 items-end">
              {/* All Button */}
              <button
                onClick={() => handleFilterChange({ search: '' })}
                className={`px-4 py-2 border-b-2 cursor-pointer ${
                  filters.search === ""
                    ? "border-blue-800 font-semibold text-blue-800"
                    : "border-transparent hover:border-b-blue-800"
                }`}
              >
                All
              </button>

              {/* Search Input */}
              <div className="w-64">
                <input
                  type="text"
                  name="search"
                  value={filters.search}
                  onChange={(e) => handleFilterChange({ search: e.target.value })}
                  placeholder="Cari Kategori"
                  className="w-full px-3 py-2 border rounded-md"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Categories Table */}
        <div className="px-6 py-4">
          <table className="w-full border rounded">
            <thead>
              <tr className="bg-blue-500 text-white">
                <th className="p-2 border border-gray-300">No.</th>
                <th className="p-2 border border-gray-300">Nama Kategori</th>
                <th className="p-2 border border-gray-300">Tanggal Dibuat</th>
                <th className="p-2 border border-gray-300">Tanggal Diubah</th>
                <th className="p-2 border border-gray-300 w-32">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="5" className="p-4 text-center">
                    Loading...
                  </td>
                </tr>
              ) : allCategories.length === 0 ? (
                <tr>
                  <td colSpan="5" className="p-4 text-center text-gray-500">
                    {filters.search ? 'Tidak ada kategori yang cocok' : 'Belum ada kategori'}
                  </td>
                </tr>
              ) : (
                allCategories.map((category, index) => (
                  <tr key={category.id} className="hover:bg-gray-100 text-center">
                    <td className="p-2 border border-gray-300">
                      {(pagination.page - 1) * pagination.limit + index + 1}
                    </td>
                    <td className="p-2 border border-gray-300 text-start">
                      {category.name}
                    </td>
                    <td className="p-2 border border-gray-300">
                      {new Date(category.createdAt).toLocaleDateString("id-ID", {
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                      })}
                    </td>
                    <td className="p-2 border border-gray-300">
                      {new Date(category.updatedAt).toLocaleDateString("id-ID", {
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                      })}
                    </td>
                    <td className="p-2 border border-gray-300">
                      <div className="flex justify-center gap-x-2">
                        <button
                          onClick={() => router.push(`/admin/categories/edit/${category.id}`)}
                          className="border-2 border-gray-300 p-2 rounded-xl flex items-center justify-center cursor-pointer bg-blue-500 hover:bg-blue-800"
                        >
                          <Pencil size={20} className="text-white" />
                        </button>
                        <button
                          onClick={() => handleDelete(category.id)}
                          className="border-2 border-gray-300 p-2 rounded-xl flex items-center justify-center cursor-pointer bg-red-500 hover:bg-red-800"
                        >
                          <Trash size={20} className="text-white" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

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

              {[...Array(Math.max(1, Math.ceil(pagination.total / pagination.limit))).keys()].map((i) => {
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
                  pagination.page >= Math.ceil(pagination.total / pagination.limit)
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

export default ManageCategoriesPage;