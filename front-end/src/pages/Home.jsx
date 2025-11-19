import { useNavigate } from "react-router-dom";

function Home() {
  const Navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-purple-100">
      <nav className="bg-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <div className="flex-shrink-0 flex items-center">
                <div className="w-8 h-8 bg-purple-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-sm">T</span>
                </div>
                <span className="ml-2 text-xl font-bold text-purple-900">TaskFlow</span>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <button onClick={() => Navigate("/login")} className="px-4 py-2 text-purple-700 font-medium hover:text-purple-900 transition duration-150 cursor-pointer">
                Login
              </button>
              <button onClick={() => Navigate("/register")} className="px-6 py-2 bg-purple-600 text-white font-medium rounded-lg hover:bg-purple-700 transition duration-150 shadow-md cursor-pointer">
                Register
              </button>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-purple-900 mb-6">
            Kelola Tugas Anda dengan
            <span className="text-purple-600 block">Lebih Efisien</span>
          </h1>
          <p className="text-xl text-purple-700 mb-8 max-w-3xl mx-auto">TaskFlow adalah aplikasi management task modern yang membantu Anda mengorganisir, melacak, dan menyelesaikan tugas-tugas dengan mudah dan efektif.</p>

          <div className="flex justify-center space-x-4 mb-16">
            <button className="px-8 py-3 bg-purple-600 text-white font-medium rounded-lg hover:bg-purple-700 transition duration-150 shadow-lg">Mulai Sekarang</button>
            <a href="#feature" className="px-8 py-3 border border-purple-600 text-purple-600 font-medium rounded-lg hover:bg-purple-50 transition duration-150">
              Pelajari Lebih Lanjut
            </a>
          </div>
        </div>

        <div id="feature" className="grid md:grid-cols-3 gap-8 mb-16">
          <div className="bg-white p-6 rounded-xl shadow-md border border-purple-100">
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-purple-900 mb-2">Organisasi Mudah</h3>
            <p className="text-purple-700">Kelola semua tugas Anda dalam satu tempat dengan antarmuka yang intuitif dan mudah digunakan.</p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-md border border-purple-100">
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-purple-900 mb-2">Prioritas Waktu</h3>
            <p className="text-purple-700">Atur deadline dan prioritas tugas untuk memastikan Anda selalu menyelesaikan yang terpenting dahulu.</p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-md border border-purple-100">
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-purple-900 mb-2">Notifikasi Pemberitahuan</h3>
            <p className="text-purple-700">sistem pemberitahuan email otomatis untuk memastikan pengguna tidak melewatkan tugas penting. Notifikasi ini dikirim secara terjadwal berdasarkan status dan tenggat waktu task.</p>
          </div>
        </div>

        <div className="bg-purple-600 rounded-2xl p-8 text-center text-white">
          <h2 className="text-3xl font-bold mb-4">Siap Meningkatkan Produktivitas?</h2>
          <p className="text-purple-100 mb-6 text-lg">Bergabung dengan ribuan pengguna yang telah meningkatkan efisiensi kerja mereka dengan TaskFlow.</p>
          <button className="px-8 py-3 bg-white text-purple-600 font-bold rounded-lg hover:bg-purple-50 transition duration-150 shadow-lg">Daftar Sekarang - Gratis!</button>
        </div>
      </div>

      <footer className="bg-purple-900 text-white py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-purple-200">© 2024 TaskFlow. All rights reserved. Management Task Application</p>
        </div>
      </footer>
    </div>
  );
}
export default Home;
