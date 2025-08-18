import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-gradient-to-tr dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 px-4">
      <div className="text-center">
        <motion.h1
          className="text-8xl font-extrabold text-gray-900 dark:text-white drop-shadow-lg"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          404
        </motion.h1>
        <motion.p
          className="mt-4 text-lg md:text-xl text-gray-600 dark:text-gray-300"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          Oops! The page you’re looking for doesn’t exist.
        </motion.p>
        <motion.button
          onClick={() => navigate("/")}
          className="mt-6 px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl shadow-lg transition duration-300"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          Back to Homepage
        </motion.button>
      </div>
    </div>
  );
};

export default NotFound;
