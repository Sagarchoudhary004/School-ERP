const NotFound = () => {
  return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <div className="text-center">
        <div className="w-20 h-20 rounded-full bg-slate-100 flex items-center justify-center mx-auto mb-6">
          <span className="text-3xl font-bold text-slate-400">404</span>
        </div>
        <h1 className="text-2xl font-bold text-slate-800 mb-2">Page Not Found</h1>
        <p className="text-slate-500 mb-6">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <a
          href="/Dashboard"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 text-white text-sm font-medium hover:bg-blue-700 transition"
        >
          Go to Dashboard
        </a>
      </div>
    </div>
  );
};

export default NotFound;
