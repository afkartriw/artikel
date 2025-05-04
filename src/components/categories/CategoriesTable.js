'use client';
import { Pencil, Trash } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { toast } from 'react-hot-toast';

const CategoriesTable = ({
  categories,
  loading,
  pagination,
  onDelete,
  onPageChange,
}) => {
  const router = useRouter();

  const handleDelete = async (categoryId) => {
    if (!confirm('Delete this category? Articles in this category will be uncategorized.')) return;
    try {
      await onDelete(categoryId);
      toast.success('Category deleted');
    } catch (error) {
      toast.error('Delete failed. Make sure no articles are using this category.');
    }
  };

  if (loading) {
    return <div className="text-center py-8">Loading categories...</div>;
  }

  return (
    <div className="px-4 py-4 sm:px-6">
      {/* Desktop Table */}
      <div className="hidden md:block">
        <table className="w-full border rounded overflow-x-auto">
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
            {categories.length === 0 ? (
              <tr>
                <td colSpan="5" className="text-center py-4 text-gray-500">
                  {filters.search ? 'No matching categories found' : 'Belum ada kategori'}
                </td>
              </tr>
            ) : (
              categories.map((category, index) => (
                <tr key={category.id} className="hover:bg-gray-100 text-center">
                  <td className="p-2 border border-gray-300">
                    {(pagination.page - 1) * pagination.limit + index + 1}
                  </td>
                  <td className="p-2 border border-gray-300 text-start">{category.name}</td>
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
                      <ActionButtons
                        id={category.id}
                        onEdit={(id) => router.push(`/admin/categories/edit/${id}`)}
                        onDelete={handleDelete}
                      />
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Mobile Card View */}
      <div className="md:hidden space-y-4">
        {categories.length === 0 ? (
          <div className="text-center py-4 text-gray-500">
            {filters.search ? 'No matching categories found' : 'Belum ada kategori'}
          </div>
        ) : (
          categories.map((category, index) => (
            <div
              key={category.id}
              className="border rounded-lg shadow-sm p-4 bg-white"
            >
              <div className="text-sm text-gray-500 mb-2">
                #{(pagination.page - 1) * pagination.limit + index + 1}
              </div>
              <div className="mb-1">
                <span className="font-semibold">Nama:</span> {category.name}
              </div>
              <div className="mb-1">
                <span className="font-semibold">Dibuat:</span>{" "}
                {new Date(category.createdAt).toLocaleDateString("id-ID", {
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                })}
              </div>
              <div className="mb-3">
                <span className="font-semibold">Diubah:</span>{" "}
                {new Date(category.updatedAt).toLocaleDateString("id-ID", {
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                })}
              </div>
              <div className="flex justify-end gap-2">
                <ActionButtons
                  id={category.id}
                  onEdit={(id) => router.push(`/admin/categories/edit/${id}`)}
                  onDelete={handleDelete}
                />
              </div>
            </div>
          ))
        )}
      </div>

      {/* Pagination Controls */}
      {pagination.total > 0 && (
        <div className="flex flex-col sm:flex-row justify-between items-center py-4 px-6 gap-4">
          <div className="text-sm text-gray-600">
            Menampilkan {(pagination.page - 1) * pagination.limit + 1} -{" "}
            {Math.min(pagination.page * pagination.limit, pagination.total)} dari {pagination.total}
          </div>
          <div className="flex space-x-2 items-center">
            <button
              disabled={pagination.page <= 1}
              onClick={() => onPageChange(pagination.page - 1)}
              className="px-3 py-1 border rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100"
            >
              Previous
            </button>

            {Array.from({ length: pagination.totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                onClick={() => onPageChange(page)}
                className={`px-3 py-1 border rounded min-w-[36px] ${
                  pagination.page === page
                    ? "bg-blue-600 text-white"
                    : "hover:bg-gray-200"
                }`}
              >
                {page}
              </button>
            ))}

            <button
              disabled={pagination.page >= pagination.totalPages}
              onClick={() => onPageChange(pagination.page + 1)}
              className="px-3 py-1 border rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

const ActionButtons = ({ id, onEdit, onDelete }) => (
  <>
    <button
      onClick={() => onEdit(id)}
      className="border-2 border-gray-300 p-2 rounded-xl flex items-center justify-center cursor-pointer bg-blue-500 hover:bg-blue-800"
    >
      <Pencil size={20} className="text-white" />
    </button>
    <button
      onClick={() => onDelete(id)}
      className="border-2 border-gray-300 p-2 rounded-xl flex items-center justify-center cursor-pointer bg-red-500 hover:bg-red-800"
    >
      <Trash size={20} className="text-white" />
    </button>
  </>
);

export default CategoriesTable;