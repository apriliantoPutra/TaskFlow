import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import Alert from "../components/Alert";
import { API_URL } from "../api.js";

const Register = () => {
  const Navigate = useNavigate();
  const [alert, setAlert] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setAlert(null);

    const username = e.target.username.value;
    const email = e.target.email.value;
    const password = e.target.password.value;
    const confirmPassword = e.target.confirmPassword.value;
    if (password != confirmPassword) {
      return setAlert({ type: "error", message: "Password dan Konfirmasi Password tidak sesuai" });
    }

    try {
      const res = await fetch(`${API_URL}/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, email, password }),
      });

      const data = await res.json();
      if (!res.ok) {
        return setAlert({ type: "error", message: data.error || "Terjadi kesalahan saat register" });
      }

      setAlert({ type: "success", message: data.message || "Pendaftaran berhasil! Silakan cek email Anda untuk verifikasi." });
      setTimeout(() => Navigate("/verify"), 2000);
    } catch (err) {
      setAlert({ type: "error", message: err.message || "Terjadi kesalahan saat mendaftar" });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-purple-100 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <form onSubmit={handleSubmit} className="mt-8 space-y-3 bg-white p-8 rounded-2xl shadow-lg border border-purple-100">
          <div className="text-center">
            <div onClick={() => Navigate("/")} className="flex justify-center items-center mb-2 cursor-pointer">
              <div className="w-10 h-10 bg-purple-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">T</span>
              </div>
              <span className="ml-2 text-2xl font-bold text-purple-900">TaskFlow</span>
            </div>
            <p className="mt-2 text-purple-600">Bergabung dengan TaskFlow hari ini</p>
          </div>
          {alert && <Alert type={alert.type} message={alert.message} />}
          <div className="space-y-4">
            <input
              id="username"
              name="username"
              type="text"
              required
              className="w-full px-4 py-3 border border-purple-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition duration-150"
              placeholder="Username"
            />

            <input id="email" name="email" type="email" required className="w-full px-4 py-3 border border-purple-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition duration-150" placeholder="Email" />

            <input
              id="password"
              name="password"
              type="password"
              required
              className="w-full px-4 py-3 border border-purple-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition duration-150"
              placeholder="Password"
            />

            <input
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              required
              className="w-full px-4 py-3 border border-purple-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition duration-150"
              placeholder="Konfirmasi Password"
            />
          </div>

          <div>
            <button type="submit" className="w-full py-3 px-4 bg-purple-600 hover:bg-purple-700 text-white font-medium rounded-lg transition duration-150 shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500">
              Daftar
            </button>
          </div>

          <div className="text-center">
            <p className="text-purple-600">
              Sudah punya akun?{" "}
              <Link to="/login" className="font-medium text-purple-600 hover:text-purple-500 underline">
                Masuk di sini
              </Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Register;
