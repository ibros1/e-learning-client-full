import { ArrowRight, BookOpen, Code, Cpu, Globe } from "lucide-react";
import { motion } from "framer-motion";
const Categories = () => {
  return (
    <div>
      {" "}
      <section className="py-12 md:py-16 px-4 sm:px-6 bg-gray-50 dark:bg-[#091025]  mx-auto">
        <div className="text-center mb-8 md:mb-12">
          <h2 className="text-2xl md:text-3xl font-bold mb-2 md:mb-4">
            Explore Our Categories
          </h2>
          <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto text-sm md:text-base">
            Discover courses in various fields to boost your skills and career
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          <motion.div
            whileHover={{ y: -5 }}
            className="bg-white dark:bg-gray-900 rounded-xl md:rounded-xl p-4 md:p-6 shadow-sm hover:shadow-md transition-all cursor-pointer border border-gray-200 dark:border-gray-800"
          >
            <div className="flex items-center gap-3 md:gap-4 mb-4 md:mb-5">
              <div className="p-2 md:p-3 bg-indigo-100 dark:bg-indigo-900/50 rounded-lg">
                <Code className="w-5 h-5 md:w-6 md:h-6 text-indigo-600 dark:text-indigo-400" />
              </div>
              <h3 className="text-lg md:text-xl font-medium md:font-semibold">
                Web Development
              </h3>
            </div>
            <p className="text-gray-600 dark:text-gray-300 mb-4 md:mb-6 text-sm md:text-base">
              Master the skills to build responsive, high-performance websites
              and applications.
            </p>
            <button className="text-indigo-600 dark:text-indigo-400 font-medium flex items-center gap-1 md:gap-2 group text-sm md:text-base">
              Explore{" "}
              <ArrowRight
                size={14}
                className="group-hover:translate-x-1 transition"
              />
            </button>
          </motion.div>

          <motion.div
            whileHover={{ y: -5 }}
            className="bg-white dark:bg-gray-900 rounded-lg md:rounded-xl p-4 md:p-6 shadow-sm hover:shadow-md transition-all cursor-pointer border border-gray-200 dark:border-gray-800"
          >
            <div className="flex items-center gap-3 md:gap-4 mb-4 md:mb-5">
              <div className="p-2 md:p-3 bg-green-100 dark:bg-green-900/50 rounded-lg">
                <Cpu className="w-5 h-5 md:w-6 md:h-6 text-green-600 dark:text-green-400" />
              </div>
              <h3 className="text-lg md:text-xl font-medium md:font-semibold">
                Data Science
              </h3>
            </div>
            <p className="text-gray-600 dark:text-gray-300 mb-4 md:mb-6 text-sm md:text-base">
              Dive into data analysis, machine learning, and visualization
              techniques.
            </p>
            <button className="text-green-600 dark:text-green-400 font-medium flex items-center gap-1 md:gap-2 group text-sm md:text-base">
              Explore{" "}
              <ArrowRight
                size={14}
                className="group-hover:translate-x-1 transition"
              />
            </button>
          </motion.div>

          <motion.div
            whileHover={{ y: -5 }}
            className="bg-white dark:bg-gray-900 rounded-xl md:rounded-xl p-4 md:p-6 shadow-sm hover:shadow-md transition-all cursor-pointer border border-gray-200 dark:border-gray-800"
          >
            <div className="flex items-center gap-3 md:gap-4 mb-4 md:mb-5">
              <div className="p-2 md:p-3 bg-pink-100 dark:bg-pink-900/50 rounded-xl">
                <BookOpen className="w-5 h-5 md:w-6 md:h-6 text-pink-600 dark:text-pink-400" />
              </div>
              <h3 className="text-lg md:text-xl font-medium md:font-semibold">
                UI/UX Design
              </h3>
            </div>
            <p className="text-gray-600 dark:text-gray-300 mb-4 md:mb-6 text-sm md:text-base">
              Learn to craft beautiful, intuitive interfaces that users love to
              interact with.
            </p>
            <button className="text-pink-600 dark:text-pink-400 font-medium flex items-center gap-1 md:gap-2 group text-sm md:text-base">
              Explore{" "}
              <ArrowRight
                size={14}
                className="group-hover:translate-x-1 transition"
              />
            </button>
          </motion.div>

          <motion.div
            whileHover={{ y: -5 }}
            className="bg-white dark:bg-gray-900 rounded-xl md:rounded-xl p-4 md:p-6 shadow-sm hover:shadow-md transition-all cursor-pointer border border-gray-200 dark:border-gray-800"
          >
            <div className="flex items-center gap-3 md:gap-4 mb-4 md:mb-5">
              <div className="p-2 md:p-3 bg-yellow-100 dark:bg-yellow-900/50 rounded-xl">
                <Globe className="w-5 h-5 md:w-6 md:h-6 text-yellow-600 dark:text-yellow-400" />
              </div>
              <h3 className="text-lg md:text-xl font-medium md:font-semibold">
                Virtual Classroom
              </h3>
            </div>
            <p className="text-gray-600 dark:text-gray-300 mb-4 md:mb-6 text-sm md:text-base">
              Virtual learning environment known as a learning platform for
              modern education.
            </p>
            <button className="text-yellow-600 dark:text-yellow-400 font-medium flex items-center gap-1 md:gap-2 group text-sm md:text-base">
              Explore{" "}
              <ArrowRight
                size={14}
                className="group-hover:translate-x-1 transition"
              />
            </button>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Categories;
