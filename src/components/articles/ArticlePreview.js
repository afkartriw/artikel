"use client";
import { CalendarDays } from "lucide-react";

const ArticlePreview = ({
  title,
  content,
  categoryId,
  categories,
  selectedImage,
  existingImageUrl,
  onBackToEdit,
  onSubmit,
  isSubmitting,
}) => {
  const getCategoryName = () => {
    return (
      categories.find((cat) => cat.id === categoryId)?.name || "Uncategorized"
    );
  };

  const getImageUrl = () => {
    if (selectedImage) return URL.createObjectURL(selectedImage);
    if (existingImageUrl) return existingImageUrl;
    return "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRfPV3mMYlF-fb8Z8ClaWUc8DoqS6J612gEZQ&s";
  };

  return (
    <div
      className="w-full min-h-screen px-4 py-8 bg-repeat"
      style={{
        backgroundImage:
          'url("https://sso.uns.ac.id/module.php/uns/img/symphony.png")',
      }}
    >
      <div className="bg-white sm:mx-10 lg:mx-20 my-6 sm:my-10 rounded-2xl border-gray-300 border-2 max-w-7xl mx-auto">
        <div className="flex justify-center items-center py-4 border-b border-gray-300">
          <p className="text-3xl font-bold">Preview Artikel</p>
        </div>

        <div className="lg:col-span-2  rounded-b-2xl shadow pt-4">
          <img
            src={getImageUrl()}
            alt="Article thumbnail"
            onError={(e) => {
              e.target.src =
                "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRfPV3mMYlF-fb8Z8ClaWUc8DoqS6J612gEZQ&s";
            }}
            className="w-full aspect-[16/9] object-cover rounded-2xl mb-4"
          />
          <div className="p-6">
            <div className="mb-4 text-sm text-gray-500">
              <div className="flex justify-between items-start">
                <div>
                  <div className="flex items-center">
                    <CalendarDays size={16} className="mr-1" />
                    {new Date().toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    })}
                  </div>
                  <div className="text-xs text-gray-400">
                    Updated:{" "}
                    {new Date().toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    })}
                  </div>
                </div>
                <div>
                  <span className="inline-block bg-blue-200 text-blue-800 text-xs px-2 py-1 rounded-full uppercase font-semibold tracking-wide">
                    {getCategoryName()}
                  </span>
                </div>
              </div>
            </div>

            <h2 className="text-2xl font-bold mb-4">{title}</h2>

            <div
              className="prose max-w-none border-y-2 border-dashed border-gray-300 py-4"
              dangerouslySetInnerHTML={{ __html: content }}
            />

            <div className="mt-8 border-gray-200">
              <span className="font-bold mb-4">Penulis :</span>
              <div className="flex items-center mt-2">
                <div className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center mr-3">
                  {"Y".toUpperCase()}
                </div>
                <div className="flex flex-col">
                  <span className="font-medium">You</span>
                  <span className="text-sm text-gray-500 capitalize">
                    admin
                  </span>
                </div>
              </div>
            </div>

            <div className="mt-8 flex flex-col md:flex-row justify-between gap-4">
  <button
    onClick={onBackToEdit}
    className="w-full md:w-auto inline-flex justify-center items-center px-4 py-2 bg-gray-500 hover:bg-gray-700 text-white rounded-md transition"
  >
    Kembali
  </button>
  <button
    onClick={onSubmit}
    disabled={isSubmitting}
    className="w-full md:w-auto inline-flex justify-center items-center px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-md transition disabled:opacity-50 cursor-pointer"
  >
    {isSubmitting ? "Menyimpan..." : "Simpan"}
  </button>
</div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default ArticlePreview;