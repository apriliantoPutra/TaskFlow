import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import Alert from "../components/Alert";

const EmailVerify = () => {
  const Navigate = useNavigate();
  const [alert, setAlert] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setAlert(null);

    const email = e.target.email.value;
    const token = e.target.token.value;

    try {
      const res = await fetch("http://localhost:5000/api/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, token }),
      });

      const data = await res.json();
      if (!res.ok) {
        return setAlert({ type: "error", message: data.message || "Token verifikasi salah" });
      }

      localStorage.setItem("token", data.accessToken);

      setAlert({ type: "success", message: data.message || "Verifikasi berhasil!" });
      setTimeout(() => Navigate("/task"), 2000);
    } catch (err) {
      setAlert({ type: "error", message: err.message || "Terjadi kesalahan saat verifikasi" });
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
            <p className="mt-2 text-purple-600">Verifikasi dengan token pada email Anda</p>
          </div>
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
              <label htmlFor="token" className="block text-sm font-medium text-purple-700 mb-1">
                Token
              </label>
              <input
                id="token"
                name="token"
                type="text"
                required
                className="w-full px-4 py-3 border border-purple-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition duration-150"
                placeholder="Masukkan Token Anda"
              />
            </div>
          </div>

          <div>
            <button type="submit" className="w-full py-3 px-4 bg-purple-600 hover:bg-purple-700 text-white font-medium rounded-lg transition duration-150 shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500">
              Verifikasi
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EmailVerify;
