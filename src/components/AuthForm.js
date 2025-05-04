"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import useAuth from "@/hooks/useAuth";

// Schema validasi menggunakan Zod
const authSchema = z.object({
  username: z
    .string()
    .min(3, "Username minimal 3 karakter")
    .max(20, "Username maksimal 20 karakter")
    .regex(/^[a-zA-Z0-9_]+$/, "Hanya boleh huruf, angka, dan underscore (_)"),
  password: z
    .string()
    .min(6, "Password minimal 6 karakter")
    .max(30, "Password maksimal 30 karakter"),
});

const AuthForm = ({ type, isAdminRegister = false }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [serverError, setServerError] = useState(null);
  const { login, register: authRegister } = useAuth(); // 👈 Ubah di sini
  const router = useRouter();

  // Inisialisasi React Hook Form dengan Zod resolver
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(authSchema),
  });

  const onSubmit = async (data) => {
    setIsLoading(true);
    setServerError(null);

    try {
      let result;
      if (type === "login") {
        result = await login(data.username, data.password);
      } else {
        result =     await authRegister(           
          data.username,
          data.password,
          isAdminRegister ? "Admin" : "User"
        );
      }

      if (result.success) {
        toast.success(
          type === "login" ? "Login berhasil!" : "Registrasi berhasil!"
        );
        if (type === "register" && !isAdminRegister) {
          router.push("/");
        }
      } else {
        setServerError(result.message || "Terjadi kesalahan");
      }
    } catch (error) {
      const errorMessage = error.message || "Terjadi kesalahan tak terduga";
      setServerError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center pt-16 p-4">
      <div className="w-full max-w-md mx-auto p-6 bg-white shadow-md border-2 border-gray-300 rounded-2xl">
        <p className="text-2xl font-bold mb-6 text-center">
          {isAdminRegister
            ? "Admin Registration"
            : type === "login"
            ? "Login"
            : "User Registration"}
        </p>

        {/* Tampilkan error dari server */}
        {serverError && (
          <div className="mb-4 p-3 bg-red-50 text-red-600 text-sm rounded-md border border-red-200">
            {serverError}
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label
              htmlFor="username"
              className="block text-sm font-medium text-gray-700"
            >
              Username
            </label>
            <input
              id="username"
              type="text"
              placeholder="Masukkan username"
              {...register("username")}
              className={`mt-1 block w-full px-3 py-2 border ${
                errors.username ? "border-red-500" : "border-gray-300"
              } rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`}
            />
            {errors.username && (
              <p className="mt-1 text-sm text-red-600">{errors.username.message}</p>
            )}
          </div>

          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700"
            >
              Password
            </label>
            <input
              id="password"
              type="password"
              placeholder="Masukkan password"
              {...register("password")}
              className={`mt-1 block w-full px-3 py-2 border ${
                errors.password ? "border-red-500" : "border-gray-300"
              } rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`}
            />
            {errors.password && (
              <p className="mt-1 text-sm text-red-600">{errors.password.message}</p>
            )}
          </div>

          <div>
            <button
              type="submit"
              disabled={isLoading}
              className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors duration-200 ${
                isLoading ? "opacity-50 cursor-not-allowed" : ""
              }`}
            >
              {isLoading
                ? "Memproses..."
                : type === "login"
                ? "Login"
                : "Register"}
            </button>
          </div>
        </form>

        {(type === "login" || type === "register") && (
          <div className="mt-4 text-center">
            <p className="text-sm text-gray-600">
              {type === "login" ? "Belum punya akun?" : "Sudah memiliki akun?"}{" "}
              <button
                onClick={() => router.push(type === "login" ? "/register" : "/")}
                className="text-indigo-600 hover:text-indigo-500 font-medium focus:outline-none focus:underline cursor-pointer"
              >
                {type === "login" ? "Daftar di sini" : "Login di sini"}
              </button>
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AuthForm;