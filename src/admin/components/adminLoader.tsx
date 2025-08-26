"use client";

import { motion } from "framer-motion";

const AdminLoader = () => {
  return (
    <div className="w-screen h-screen flex items-center justify-center bg-white dark:bg-[#091025] text-black dark:text-white">
      <motion.div
        className="w-12 h-12 border-4 border-t-transparent border-current rounded-full"
        animate={{ rotate: 360 }}
        transition={{
          repeat: Infinity,
          ease: "linear",
          duration: 1,
        }}
      />
    </div>
  );
};

export default AdminLoader;
