"use client";
import { CalendarDays } from "lucide-react";
import Link from "next/link";

const ArticleTable = ({ articles, loading }) => {
  if (loading)
    return <div className="text-center py-8">Loading articles...</div>;

  return (
    <div className="max-w-8xl mx-auto py-8">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {articles.map((article) => (
          <Link
            key={article.id}
            href={`/user/artikel/detail/${article.id}`}
            className="block bg-white rounded-lg shadow-md overflow-hidden hover:shadow-2xl transition-shadow duration-300"
          >
            {/* Article Image */}
            <div className="h-48 bg-gray-200 flex items-center justify-center">
                <img
                  src={article.imageUrl ||
                    "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRfPV3mMYlF-fb8Z8ClaWUc8DoqS6J612gEZQ&s"
                  }
                  alt={article.title}
                  className="w-full h-full object-cover"
                />
            </div>

            <div className="p-6">
              {/* Date and Category */}
              <div className="flex justify-between items-center mb-4 text-sm text-gray-500">
                <span className="flex items-center">
                  <CalendarDays size={20} className="mr-2" />
                  {new Date(article.createdAt).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                  })}
                </span>
                <span className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full uppercase font-semibold tracking-wide">
                  {article.category?.name || "Uncategorized"}
                </span>
              </div>

              {/* Title */}
              <span className="text-xl font-bold mb-2 hover:text-blue-600 transition-colors duration-200">
                {article.title}
              </span>

              {/* Content Excerpt */}
              <p
                className="text-gray-600 my-4 line-clamp-3 h-20"
                dangerouslySetInnerHTML={{
                  __html:
                    article.content ||
                    "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
                }}
              />

              {/* Author */}
              <div className="text-sm text-gray-500">
                By {article.user?.username || "Unknown Author"}
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default ArticleTable;
