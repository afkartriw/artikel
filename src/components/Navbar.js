"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import useAuth from "@/hooks/useAuth";
import { useState } from "react";
import { ChevronDown, LogOut, Menu } from "lucide-react";

const Navbar = () => {
  const { user, logout } = useAuth();
  const router = useRouter();
  const [showDropdown, setShowDropdown] = useState(false);

  const handleLogout = () => {
    logout();
    router.push("/");
  };

  // Style for role badges
  const getRoleBadgeStyle = (role) => {
    switch (role) {
      case "Admin":
        return "bg-red-500 text-white";
      case "User":
        return "bg-green-500 text-white";
      default:
        return "bg-gray-500 text-white";
    }
  };

  return (
    <nav className="bg-indigo-600 text-white shadow-lg sticky top-0 z-50 h-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Left side - Logo/Brand */}
          <div className="flex-shrink-0 flex items-center">
            <Link
              href="/"
              className="text-xl font-bold hover:text-indigo-200 transition-colors"
            >
              Artikel-App
            </Link>
          </div>

          {/* Right side - Navigation */}
          <div className="hidden md:block">
            <div className="ml-10 flex items-center space-x-4">
              {user ? (
                <>
                  {/* Admin-only links */}
                  {user.role === "Admin" && (
                    <Link
                      href="/admin/artikel"
                      className="px-3 py-2 rounded-md text-sm font-medium hover:bg-indigo-700 transition-colors"
                    >
                      Artikel
                    </Link>
                  )}

                  {user.role === "Admin" && (
                    <Link
                      href="/admin/categories"
                      className="px-3 py-2 rounded-md text-sm font-medium hover:bg-indigo-700 transition-colors"
                    >
                      Kategori
                    </Link>
                  )}

                  {/* User profile dropdown */}
                  <div className="relative ml-4">
                    <button
                      onClick={() => setShowDropdown(!showDropdown)}
                      className="flex items-center space-x-2 focus:outline-none"
                    >
                      {/* Profile image (static) */}
                      <div className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center overflow-hidden">
                        <img
                          src="https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_640.png" // Ganti dengan path gambar profil Anda
                          alt="Profile"
                          className="w-full h-full object-cover"
                        />
                      </div>
                      
                      {/* User info */}
                      <div className="text-left ml-2 mr-5">
                        <div className="text-sm font-medium">{user.username}</div>
                        <div className="text-xs text-gray-200 capitalize">{user.role.toLowerCase()}</div>
                      </div>
                      
                      {/* Dropdown arrow */}
                      <ChevronDown />
                    </button>

                    {/* Dropdown menu */}
                    {showDropdown && (
                     <div className="absolute right-0 mt-2 w-40 bg-white rounded-md shadow-lg py-1 z-50">
                     <button
                       onClick={handleLogout}
                       className="flex items-center w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer"
                     >
                       <LogOut className="w-4 h-4 mr-2" color="black" />
                       Logout
                     </button>
                   </div>
                    )}
                  </div>
                </>
              ) : (
                <>
                  {/* Public links when not logged in */}
                  <Link
                    href="/"
                    className="px-3 py-2 rounded-md text-sm font-medium hover:bg-indigo-700 transition-colors"
                  >
                    Login
                  </Link>
                  <Link
                    href="/register"
                    className="px-3 py-2 rounded-md text-sm font-medium hover:bg-indigo-700 transition-colors"
                  >
                    Register
                  </Link>
                </>
              )}
            </div>
          </div>

          {/* Mobile menu button (hidden on larger screens) */}
          <div className="md:hidden flex items-center">
            {user && (
              <div className="mr-4 flex items-center space-x-2">
                <span
                  className={`text-xs px-2 py-1 rounded-full ${getRoleBadgeStyle(
                    user.role
                  )}`}
                >
                  {user.role}
                </span>
              </div>
            )}
            <button className="inline-flex items-center justify-center p-2 rounded-md hover:bg-indigo-700 focus:outline-none">
              {/* Hamburger icon */}
              <Menu />
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu (hidden by default) */}
      <div className="md:hidden hidden">
        <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
          {user ? (
            <>
              <Link
                href={
                  user.role === "Admin" ? "/admin-dashboard" : "/user-dashboard"
                }
                className="block px-3 py-2 rounded-md text-base font-medium hover:bg-indigo-700"
              >
                Dashboard
              </Link>
              {user.role === "Admin" && (
                <Link
                  href="/admin/users"
                  className="block px-3 py-2 rounded-md text-base font-medium hover:bg-indigo-700"
                >
                  Manage Users
                </Link>
              )}
              <button
                onClick={handleLogout}
                className="block w-full text-left px-3 py-2 rounded-md text-base font-medium hover:bg-indigo-700"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link
                href="/"
                className="block px-3 py-2 rounded-md text-base font-medium hover:bg-indigo-700"
              >
                Login
              </Link>
              <Link
                href="/register"
                className="block px-3 py-2 rounded-md text-base font-medium hover:bg-indigo-700"
              >
                Register
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;