const NotFound = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-purple-100 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full text-center">
        {/* Error Icon */}
        <div className="flex justify-center mb-8">
          <div className="w-32 h-32 bg-purple-100 rounded-full flex items-center justify-center">
            <svg className="w-16 h-16 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
        </div>

        <h1 className="text-6xl font-bold text-purple-900 mb-4">404</h1>
        <h2 className="text-2xl font-semibold text-purple-800 mb-4">Halaman Tidak Ditemukan</h2>
      </div>
    </div>
  );
};

export default NotFound;
