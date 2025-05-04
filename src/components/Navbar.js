"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import useAuth from "@/hooks/useAuth";
import { useState } from "react";
import { ChevronDown, LogOut, Menu, X } from "lucide-react";

const Navbar = () => {
  const { user, logout } = useAuth();
  const router = useRouter();
  const [showDropdown, setShowDropdown] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    router.push("/");
  };

  return (
    <nav className="bg-indigo-600 text-white shadow-lg sticky top-0 z-50">
      <div className="px-4 sm:px-6 lg:px-8 mx-auto container">
        <div className="flex items-center justify-between h-16">
          {/* Left side - Logo/Brand */}
          <div className="flex items-center">
            <Link
              href="/"
              className="text-xl font-bold hover:text-indigo-200 transition-colors"
            >
              Artikel-App
            </Link>
          </div>

          {/* Desktop Navigation - Hidden on mobile */}
          <div className="hidden md:flex items-center space-x-4">
            {user ? (
              <>


                {/* User profile dropdown - only on desktop */}
                <div className="relative ml-2">
                  <button
                    onClick={() => setShowDropdown(!showDropdown)}
                    className="flex items-center space-x-2 focus:outline-none"
                    aria-expanded={showDropdown}
                    aria-haspopup="true"
                  >
                    <div className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center overflow-hidden">
                      <img
                        src="https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_640.png"
                        alt="Profile"
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="text-left ml-2">
                      <div className="text-sm font-medium">{user.username}</div>
                      <div className="text-xs text-gray-200 capitalize">
                        {user.role.toLowerCase()}
                      </div>
                    </div>
                    <ChevronDown
                      className={`transition-transform ${
                        showDropdown ? "rotate-180" : ""
                      }`}
                    />
                  </button>

                  {showDropdown && (
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50">
                      <button
                        onClick={handleLogout}
                        className="flex items-center w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        <LogOut className="w-4 h-4 mr-2" />
                        Logout
                      </button>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <>
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

          {/* Mobile menu button - Hidden on desktop */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-white hover:text-white hover:bg-indigo-700 focus:outline-none transition-colors"
              aria-expanded={mobileMenuOpen}
            >
              <span className="sr-only">
                {mobileMenuOpen ? "Close menu" : "Open menu"}
              </span>
              {mobileMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>

      {/* Mobile menu - Show/hide based on menu state */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t-2">
          <div className="px-2 space-y-1 sm:px-3">
            {user ? (
              <>

              </>
            ) : (
              <>
                <Link
                  href="/"
                  className="block px-3 py-2 rounded-md text-base font-medium hover:bg-indigo-600 transition-colors"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Login
                </Link>
                <Link
                  href="/register"
                  className="block px-3 py-2 rounded-md text-base font-medium hover:bg-indigo-600 transition-colors"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Register
                </Link>
              </>
            )}
          </div>
          {user && (
            <div className="pt-4 pb-3 ">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center overflow-hidden">
                    <img
                      src="https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_640.png"
                      alt="Profile"
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>
                <div className="ml-3">
                  <div className="text-base font-medium">{user.username}</div>
                  <div className="text-sm text-indigo-200 capitalize">
                    {user.role.toLowerCase()}
                  </div>
                </div>
              </div>
              <div className="mt-3">
                <button
                  onClick={() => {
                    handleLogout();
                    setMobileMenuOpen(false);
                  }}
                  className="bg-red-600 flex items-center w-full px-3 py-2 rounded-md text-base font-medium text-white hover:bg-indigo-600 transition-colors"
                >
                  <LogOut className="w-5 h-5 mr-2" />
                  Logout
                </button>
              </div>
            </div>
          )}
        </div>
      )}</div>
    </nav>
  );
};

export default Navbar;
