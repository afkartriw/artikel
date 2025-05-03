"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";
import useAuth from "@/hooks/useAuth";

const AuthForm = ({ type, isAdminRegister = false }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { login, register } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      let result;
      if (type === "login") {
        result = await login(username, password);
      } else {
        result = await register(
          username,
          password,
          isAdminRegister ? "Admin" : "User"
        );
      }

      if (result.success) {
        toast.success(
          type === "login" ? "Login successful!" : "Registration successful!"
        );
        if (type === "register" && !isAdminRegister) {
          router.push("/");
        }
      } else {
        toast.error(result.message || "An error occurred");
      }
    } catch (error) {
      toast.error("An unexpected error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="pt-20">
      <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md">
        <p className="text-2xl font-bold mb-6 text-center">
          {isAdminRegister
            ? "Admin Registration"
            : type === "login"
            ? "Login"
            : "User Registration"}
        </p>
        <form onSubmit={handleSubmit} className="space-y-4">
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
              placeholder="Masukan Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              required
            />
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
              placeholder="Masukan Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              required
            />
          </div>
          <div>
            <button
              type="submit"
              disabled={isLoading}
              className={`cursor-pointer w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 ${
                isLoading ? "opacity-50 cursor-not-allowed" : ""
              }`}
            >
              {isLoading
                ? "Processing..."
                : type === "login"
                ? "Login"
                : "Register"}
            </button>
          </div>
        </form>
        {type === "login" && (
          <div className="mt-4 text-center">
            <p className="text-sm text-gray-600">
              Don't have an account?{" "}
              <button
                onClick={() => router.push("/register")}
                className="text-indigo-600 hover:text-indigo-500 font-medium cursor-pointer"
              >
                Register here
              </button>
            </p>
          </div>
        )}

        {type === "register" && (
          <div className="mt-4 text-center">
            <p className="text-sm text-gray-600">
              Sudah memiliki akun?{" "}
              <button
                onClick={() => router.push("/")}
                className="text-indigo-600 hover:text-indigo-500 font-medium cursor-pointer"
              >
                Login di sini
              </button>
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AuthForm;
