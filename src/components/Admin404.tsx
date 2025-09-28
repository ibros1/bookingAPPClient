import { Link } from "react-router-dom";

const AdminNotFound = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-4 text-center bg-gray-50 dark:bg-[#101828]">
      <h1 className="text-9xl font-extrabold text-gray-300 dark:text-gray-600 animate-pulse">
        404
      </h1>
      <h2 className="text-4xl font-semibold mt-4 text-gray-800 dark:text-gray-100">
        Page Not Found
      </h2>
      <p className="mt-2 text-gray-500 dark:text-gray-400">
        The page you are looking for doesn’t exist.
      </p>

      <div className="mt-6 flex flex-col sm:flex-row gap-4">
        <Link
          to="/dashboard/admin"
          className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all shadow-lg"
        >
          Go to Dashboard
        </Link>
        <Link
          to="/dashboard/admin"
          className="px-6 py-3 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-all"
        >
          Go Home
        </Link>
      </div>
    </div>
  );
};

export default AdminNotFound;
