"use client";
import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import api from "@/utils/api";
import { toast } from "react-hot-toast";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import { CalendarDays } from "lucide-react";

const ArticleDetailPage = () => {
  const router = useRouter();
  const { id } = useParams();
  const [article, setArticle] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [relatedArticles, setRelatedArticles] = useState([]);

  useEffect(() => {
    const fetchArticle = async () => {
      try {
        const { data } = await api.get(`/articles/${id}`);
        setArticle(data);

        // Ambil semua artikel (limit besar agar bisa difilter)
        const res = await api.get("/articles", { params: { limit: 100 } });
        const allArticles = res.data.data;

        // Filter artikel dari kategori yang sama, selain artikel ini
        const related = allArticles
          .filter(
            (a) =>
              data?.categoryId &&
              a.categoryId === data.categoryId &&
              a.id !== data.id
          )
          .slice(0, 3); // maksimal 3 artikel

        setRelatedArticles(related);
      } catch (error) {
        toast.error("Failed to load article");
        router.push("/user/artikel");
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
          <Link href="/user/artikel" className="text-blue-600 hover:underline">
            Back to articles
          </Link>
        </div>
      </div>
    );
  }

  return (
    <>
      <Navbar />
      <div className="px-4 sm:px-6 lg:px-8 mx-auto container py-8"> 
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Article - spans 3 columns */}
          <div className="lg:col-span-2 bg-gray-100 rounded-2xl shadow">
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
              className="w-full h-64 lg:h-[350px] object-cover rounded-2xl mb-4"
            />
            <div className="p-6">
              <div className="mb-4 text-sm text-gray-500">
                <div className="flex justify-between items-start">
                  {/* Created Date */}
                  <div>
                    <div className="flex items-center">
                      <CalendarDays size={16} className="mr-1" />
                      {new Date(article.createdAt).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      })}
                    </div>

                    {/* Updated Date */}
                    <div className="text-xs text-gray-400">
                      Updated:{" "}
                      {new Date(article.updatedAt).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      })}
                    </div>
                  </div>

                  {/* Category Badge */}
                  <div>
                    <span className="inline-block bg-blue-200 text-blue-800 text-xs px-2 py-1 rounded-full uppercase font-semibold tracking-wide">
                      {article.category?.name || "Uncategorized"}
                    </span>
                  </div>
                </div>
              </div>

              <h2 className="text-2xl font-bold mb-4">{article.title}</h2>
              <div
                className="prose max-w-none border-y-2 border-dashed border-gray-300 py-4"
                dangerouslySetInnerHTML={{ __html: article.content }}
              />
              <div className="mt-8 border-gray-200">
                <span className="font-bold mb-4">Penulis :</span>
                <div className="flex items-center">
                  <div className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center mr-3">
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
                  href="/user/artikel"
                  className="text-blue-600 hover:underline"
                >
                  &larr; Back to articles
                </Link>
              </div>
            </div>
          </div>

          {/* Related Articles - 1 column */}
          <div className="lg:col-span-1">
            <div>
              <span className="text-2xl font-bold">Related Articles</span>
              <div className="space-y-4 mt-6">
                {relatedArticles.map((rel) => (
                  <Link
                    key={rel.id}
                    href={`/user/artikel/detail/${rel.id}`}
                    className="block bg-white rounded-lg shadow-md overflow-hidden hover:shadow-2xl transition-shadow duration-300"
                  >
                    {/* Gambar */}
                    <div className="h-36 bg-gray-200 flex items-center justify-center">
                      <img
                        src={
                          rel.imageUrl ||
                          "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRfPV3mMYlF-fb8Z8ClaWUc8DoqS6J612gEZQ&s"
                        }
                        alt={rel.title}
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src =
                            "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRfPV3mMYlF-fb8Z8ClaWUc8DoqS6J612gEZQ&s";
                        }}
                        className="w-full h-full object-cover"
                      />
                    </div>

                    {/* Konten */}
                    <div className="p-4">
                      {/* Tanggal dan Kategori */}
                      <div className="flex justify-between items-center text-sm text-gray-500 mb-2">
                        <span className="flex items-center">
                          <CalendarDays size={16} className="mr-1" />
                          {new Date(rel.createdAt).toLocaleDateString("en-US", {
                            year: "numeric",
                            month: "short",
                            day: "numeric",
                          })}
                        </span>
                        <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full uppercase font-semibold tracking-wide">
                          {rel.category?.name || "Uncategorized"}
                        </span>
                      </div>

                      {/* Judul */}
                      <h4 className="font-semibold text-base hover:text-blue-600 transition-colors duration-200">
                        {rel.title}
                      </h4>

                      {/* Konten singkat */}
                      <p
                        className="text-gray-600 mt-2 text-sm line-clamp-2"
                        dangerouslySetInnerHTML={{
                          __html: rel.content || "No content available.",
                        }}
                      />
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ArticleDetailPage;
