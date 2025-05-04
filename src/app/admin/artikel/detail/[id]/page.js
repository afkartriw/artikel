"use client";
import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import api from "@/utils/api";
import { toast } from "react-hot-toast";
import Link from "next/link";
import { CalendarDays } from "lucide-react"; // pastikan kamu install dan impor icon ini
import Navbar from "@/components/Navbar";

const ArticleDetailPage = () => {
  const router = useRouter();
  const { id } = useParams();
  const [article, setArticle] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchArticle = async () => {
      try {
        const { data } = await api.get(`/articles/${id}`);
        setArticle(data);
      } catch (error) {
        toast.error("Failed to load article");
        router.push("/admin/artikel");
      } finally {
        setIsLoading(false);
      }
    };

    fetchArticle();
  }, [id, router]);

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      </div>
    );
  }

  if (!article) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-white p-6 rounded shadow text-center">
          <p>Article not found</p>
          <Link href="/admin/artikel" className="text-blue-600 hover:underline">
            Back to articles
          </Link>
        </div>
      </div>
    );
  }

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
        <div className="bg-white max-w-screen-lg mx-auto my-10 rounded-2xl border-gray-300 border-2">
          <div className="flex justify-center items-center py-4 border-b border-gray-300">
            <p className="text-2xl sm:text-3xl font-bold text-center">
              Detail Artikel
            </p>
          </div>

          <div className=" rounded-b-2xl shadow pt-4">
            <img
              src={
                article.imageUrl ||
                "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRfPV3mMYlF-fb8Z8ClaWUc8DoqS6J612gEZQ&s"
              }
              alt="Article thumbnail"
              onError={(e) => {
                e.target.src =
                  "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRfPV3mMYlF-fb8Z8ClaWUc8DoqS6J612gEZQ&s";
              }}
              className="w-full h-48 sm:h-64 lg:h-[350px] object-cover rounded-2xl mb-4"
            />
            <div className="p-4 sm:p-6">
              <div className="mb-4 text-sm text-gray-500">
                <div className="flex flex-col sm:flex-row sm:justify-between items-start sm:items-center gap-2">
                  <div>
                    <div className="flex items-center">
                      <CalendarDays size={16} className="mr-1" />
                      {new Date(article.createdAt).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      })}
                    </div>
                    <div className="text-xs text-gray-400">
                      Updated:{" "}
                      {new Date(article.updatedAt).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      })}
                    </div>
                  </div>
                  <div>
                    <span className="inline-block bg-blue-200 text-blue-800 text-xs px-2 py-1 rounded-full uppercase font-semibold tracking-wide">
                      {article.category?.name || "Uncategorized"}
                    </span>
                  </div>
                </div>
              </div>

              <h2 className="text-xl sm:text-2xl font-bold mb-4">
                {article.title}
              </h2>

              <div
                className="prose max-w-none border-y-2 border-dashed border-gray-300 py-4 text-justify"
                dangerouslySetInnerHTML={{ __html: article.content }}
              />

              <div className="mt-8 border-gray-200">
                <span className="font-bold mb-2 block">Penulis :</span>
                <div className="flex items-center mt-2">
                  <div className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center mr-3 text-lg font-semibold">
                    {article.user?.username?.charAt(0).toUpperCase()}
                  </div>
                  <div className="flex flex-col">
                    <span className="font-medium">
                      {article.user?.username}
                    </span>
                    <span className="text-sm text-gray-500 capitalize">
                      {article.user?.role?.toLowerCase()}
                    </span>
                  </div>
                </div>
              </div>

              <div className="mt-8">
                <Link
                  href="/admin/artikel"
                  className="text-blue-600 hover:underline"
                >
                  &larr; Kembali ke tabel artikel
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ArticleDetailPage;
