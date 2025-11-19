import { Link, useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";
import Alert from "../components/Alert";

const Login = () => {
  const Navigate = useNavigate();
  const location = useLocation();

  // baca alert dari state (logout atau protected)
  const [alert, setAlert] = useState(location.state ? { type: location.state.type, message: location.state.message } : null);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const email = e.target.email.value;
    const password = e.target.password.value;

    try {
      const res = await fetch("http://localhost:5000/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        // tampilkan alert error
        setAlert({ type: "error", message: data.message || "Email/password salah" });
        return;
      }

      // alert success
      setAlert({ type: "success", message: "Login berhasil, mengarahkan ke halaman task" });
      // simpan token
      localStorage.setItem("token", data.accessToken);

      setTimeout(() => Navigate("/task"), 2000);
    } catch {
      setAlert({ type: "error", message: "Terjadi kesalahan server" });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-purple-100 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <form onSubmit={handleSubmit} className="mt-8 space-y-6 bg-white p-8 rounded-2xl shadow-lg border border-purple-100">
          <div className="text-center">
            <div className="flex justify-center items-center mb-2 cursor-pointer" onClick={() => Navigate("/")}>
              <div className="w-10 h-10 bg-purple-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">T</span>
              </div>
              <span className="ml-2 text-2xl font-bold text-purple-900">TaskFlow</span>
            </div>
            <p className="mt-2 text-purple-600">Kelola tugas Anda dengan lebih efisien</p>
          </div>

          {/* tampilkan alert */}
          {alert && <Alert type={alert.type} message={alert.message} />}

          <div className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-purple-700 mb-1">
                Email
              </label>
              <input
                id="email"
                name="email"
                type="text"
                required
                className="w-full px-4 py-3 border border-purple-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition duration-150"
                placeholder="Masukkan email Anda"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-purple-700 mb-1">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                className="w-full px-4 py-3 border border-purple-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition duration-150"
                placeholder="Masukkan password Anda"
              />
            </div>
          </div>

          <div>
            <button type="submit" className="w-full py-3 px-4 bg-purple-600 hover:bg-purple-700 text-white font-medium rounded-lg transition duration-150 shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500">
              Masuk
            </button>
          </div>

          <div className="text-center">
            <p className="text-purple-600">
              Belum punya akun?{" "}
              <Link to="/register" className="font-medium text-purple-600 hover:text-purple-500 underline">
                Daftar di sini
              </Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
