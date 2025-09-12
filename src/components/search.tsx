import { useState } from "react";
import { Search as SearchIcon, X } from "lucide-react";

const Search = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Search Icon (click to open popup) */}
      <button
        onClick={() => setIsOpen(true)}
        className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition"
      >
        <SearchIcon className="w-6 h-6 text-gray-700 dark:text-gray-300 cursor-pointer" />
      </button>

      {/* Search Popup Overlay */}
      {isOpen && (
        <div className="fixed inset-0 z-50 bg-white dark:bg-[#020618] bg-opacity-90 dark:bg-opacity-95 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="relative w-full max-w-lg">
            <input
              autoFocus
              type="text"
              className="w-full pl-12 pr-4 py-3 rounded-2xl bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 focus:border-blue-500 focus:ring-2 focus:ring-blue-400 outline-none transition duration-200 text-gray-800 dark:text-gray-200 placeholder-gray-400 dark:placeholder-gray-500"
              placeholder="Search Something..."
            />
            {/* Search Icon */}
            <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500 w-5 h-5" />

            {/* Close Button */}
            <button
              onClick={() => setIsOpen(false)}
              className="absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition"
            >
              <X className="w-6 h-6 text-gray-700 dark:text-gray-300 cursor-pointer" />
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default Search;
