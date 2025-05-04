"use client";
import { Eye, Pencil, Trash } from "lucide-react";

const ArticleTable = ({ articles, loading, onDelete, onEdit, onDetail }) => {
  if (loading)
    return <div className="text-center py-8">Loading articles...</div>;

  return (
    <div className="px-4 py-4">
      {/* Desktop Table */}
      <div className="hidden md:block">
        <table className="w-full border rounded overflow-x-auto">
          <thead>
            <tr className="bg-blue-500 text-white">
              <th className="p-2 border border-gray-300">No.</th>
              <th className="p-2 border border-gray-300">Judul</th>
              <th className="p-2 border border-gray-300">Penulis</th>
              <th className="p-2 border border-gray-300">Kategori</th>
              <th className="p-2 border border-gray-300">Tanggal</th>
              <th className="p-2 border border-gray-300 w-32">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {articles.map((article, index) => (
              <tr key={article.id} className="hover:bg-gray-100 text-center">
                <td className="p-2 border border-gray-300">{index + 1}</td>
                <td className="p-2 border border-gray-300 text-start">
                  {article.title}
                </td>
                <td className="p-2 border border-gray-300">
                  {article.user?.username}
                </td>
                <td className="p-2 border border-gray-300">
                  {article.category?.name}
                </td>
                <td className="p-2 border border-gray-300">
                  {new Date(article.createdAt).toLocaleDateString("id-ID", {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  })}
                </td>
                <td className="p-2 border border-gray-300">
                  <div className="flex justify-center gap-x-2">
                    <ActionButtons
                      id={article.id}
                      onDetail={onDetail}
                      onEdit={onEdit}
                      onDelete={onDelete}
                    />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile Card View */}
      <div className="md:hidden space-y-4">
        {articles.map((article, index) => (
          <div
            key={article.id}
            className="border rounded-lg shadow-sm p-4 bg-white"
          >
            <div className="text-sm text-gray-500 mb-2">#{index + 1}</div>
            <div className="mb-1">
              <span className="font-semibold">Judul:</span> {article.title}
            </div>
            <div className="mb-1">
              <span className="font-semibold">Penulis:</span>{" "}
              {article.user?.username}
            </div>
            <div className="mb-1">
              <span className="font-semibold">Kategori:</span>{" "}
              {article.category?.name}
            </div>
            <div className="mb-3">
              <span className="font-semibold">Tanggal:</span>{" "}
              {new Date(article.createdAt).toLocaleDateString("id-ID", {
                day: "numeric",
                month: "long",
                year: "numeric",
              })}
            </div>
            <div className="flex justify-end gap-2">
              <ActionButtons
                id={article.id}
                onDetail={onDetail}
                onEdit={onEdit}
                onDelete={onDelete}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const ActionButtons = ({ id, onDetail, onEdit, onDelete }) => (
  <>
    <button
      onClick={() => onDetail(id)}
      className="border-2 border-gray-300 p-2 rounded-xl flex items-center justify-center cursor-pointer bg-gray-600 hover:bg-gray-800"
    >
      <Eye size={20} className="text-white" />
    </button>
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

export default ArticleTable;
