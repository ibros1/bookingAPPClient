import { motion } from "framer-motion";
import { Loader2 } from "lucide-react";

interface LoadingPagesProps {
  message?: string;
}

const LoadingPages: React.FC<LoadingPagesProps> = ({
  message = "Loading, please wait...",
}) => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-white dark:bg-slate-900 transition-colors duration-300">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="flex flex-col items-center space-y-6"
        role="status"
        aria-live="polite"
      >
        {/* Spinner */}
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 1.2, ease: "linear" }}
        >
          <Loader2 className="w-16 h-16 text-indigo-500" />
        </motion.div>

        {/* Message */}
        <motion.h1
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.8 }}
          className="text-2xl font-semibold text-gray-800 dark:text-gray-200 tracking-wide"
        >
          {message}
        </motion.h1>
      </motion.div>
    </div>
  );
};

export default LoadingPages;
