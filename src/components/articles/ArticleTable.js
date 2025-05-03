"use client";
import { Eye, Pencil, Trash } from "lucide-react";

const ArticleTable = ({ articles, loading, onDelete, onEdit, onDetail }) => {
  if (loading)
    return <div className="text-center py-8">Loading articles...</div>;

  return (
    <div className="px-6 py-4">
      <table className="w-full border rounded">
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
              <td className="p-2 border border-gray-300 ">
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
                  <button
                    onClick={() => onDetail(article.id)}
                    className="border-2 border-gray-300 p-2 rounded-xl flex items-center justify-center cursor-pointer bg-gray-600 hover:bg-gray-800"
                  >
                    <Eye size={20} className="text-white" />
                  </button>
                  <button
                    onClick={() => onEdit(article.id)}
                    className="border-2 border-gray-300 p-2 rounded-xl flex items-center justify-center cursor-pointer bg-blue-500 hover:bg-blue-800"
                  >
                    <Pencil size={20} className="text-white" />
                  </button>
                  <button
                    onClick={() => onDelete(article.id)}
                    className="border-2 border-gray-300 p-2 rounded-xl flex items-center justify-center cursor-pointer bg-red-500 hover:bg-red-800"
                  >
                    <Trash size={20} className="text-white" />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ArticleTable;
