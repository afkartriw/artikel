"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, FileText, Folder } from "lucide-react";

const MenuAdmin = () => {
  const pathname = usePathname();

  const menuItems = [
    {
      href: "/admin/artikel",
      label: "TABEL ARTIKEL",
      icon: <FileText size={24} className="mr-2" />,
    },
    {
      href: "/admin/categories",
      label: "TABEL KATEGORI",
      icon: <Folder size={24} className="mr-2" />,
    },
  ];

  return (
    <div className="container mx-auto mt-10">
      <div className="flex flex-col md:flex-row gap-4 md:gap-6">
        {menuItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <div
              key={item.href}
              className={`relative w-full md:w-1/2 transition-all duration-300 ${
                isActive ? "cursor-default" : "hover:scale-[1.02]"
              }`}
            >
              {isActive ? (
                <div
                  className={`flex items-center justify-center p-2 md:p-4 rounded-xl border-2 border-blue-500 bg-gradient-to-r from-blue-50 to-blue-100 shadow-md`}
                >
                  {item.icon}
                  <p className="text-xl sm:text-2xl font-bold text-blue-800">
                    {item.label}
                  </p>
                </div>
              ) : (
                <Link href={item.href} passHref>
                  <div
                    className={`flex items-center justify-center p-2 md:p-4 rounded-xl border-2 border-gray-300 bg-white hover:border-blue-300 hover:bg-blue-50 shadow-sm hover:shadow-md transition-all duration-300`}
                  >
                    {item.icon}
                    <p className="text-xl sm:text-2xl font-bold text-blue-800">
                      {item.label}
                    </p>
                  </div>
                </Link>
              )}
              
              {isActive && (
                <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-4 h-4 bg-blue-500 rotate-45"></div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default MenuAdmin;