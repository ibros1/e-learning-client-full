import { motion } from "framer-motion";
import { Award, BookOpenCheck, UserCheck } from "lucide-react";

const LearningPaths = () => {
  return (
    <div>
      {" "}
      <section className="py-12 md:py-16 px-4 sm:px-6 bg-gray-50 dark:bg-[#091025]  mx-auto">
        <div className="text-center mb-8 md:mb-12">
          <h2 className="text-2xl md:text-3xl font-bold mb-2 md:mb-4">
            Structured Learning Paths
          </h2>
          <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto text-sm md:text-base">
            Follow our curated paths to master skills systematically
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-8">
          <motion.div
            whileHover={{ y: -5 }}
            className="bg-white dark:bg-gray-900 rounded-lg md:rounded-xl p-5 md:p-8 shadow-sm hover:shadow-md transition-all border border-gray-200 dark:border-gray-800"
          >
            <div className="flex items-center gap-3 md:gap-4 mb-4 md:mb-6">
              <div className="p-2 md:p-3 bg-blue-100 dark:bg-blue-900/50 rounded-lg">
                <BookOpenCheck className="w-5 h-5 md:w-6 md:h-6 text-blue-600 dark:text-blue-400" />
              </div>
              <h3 className="text-lg md:text-xl font-medium md:font-semibold">
                Beginner Path
              </h3>
            </div>
            <p className="text-gray-600 dark:text-gray-300 mb-4 md:mb-6 text-sm md:text-base">
              Start your journey with foundational courses designed for complete
              beginners.
            </p>
            <ul className="space-y-2 md:space-y-3 mb-6 md:mb-8">
              {["Intro to Programming", "Web Basics", "Digital Literacy"].map(
                (item, index) => (
                  <li
                    key={index}
                    className="flex items-center gap-2 text-gray-700 dark:text-gray-300 text-sm md:text-base"
                  >
                    <div className="w-1.5 h-1.5 md:w-2 md:h-2 rounded-full bg-blue-500"></div>
                    {item}
                  </li>
                )
              )}
            </ul>
            <button className="w-full py-2.5 md:py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition text-sm md:text-base">
              Start Learning
            </button>
          </motion.div>

          <motion.div
            whileHover={{ y: -5 }}
            className="bg-white dark:bg-gray-900 rounded-lg md:rounded-xl p-5 md:p-8 shadow-sm hover:shadow-md transition-all border border-gray-200 dark:border-gray-800"
          >
            <div className="flex items-center gap-3 md:gap-4 mb-4 md:mb-6">
              <div className="p-2 md:p-3 bg-purple-100 dark:bg-purple-900/50 rounded-lg">
                <Award className="w-5 h-5 md:w-6 md:h-6 text-purple-600 dark:text-purple-400" />
              </div>
              <h3 className="text-lg md:text-xl font-medium md:font-semibold">
                Intermediate Path
              </h3>
            </div>
            <p className="text-gray-600 dark:text-gray-300 mb-4 md:mb-6 text-sm md:text-base">
              Build on your basics with more advanced concepts and practical
              projects.
            </p>
            <ul className="space-y-2 md:space-y-3 mb-6 md:mb-8">
              {[
                "Advanced Programming",
                "Data Structures",
                "APIs & Services",
              ].map((item, index) => (
                <li
                  key={index}
                  className="flex items-center gap-2 text-gray-700 dark:text-gray-300 text-sm md:text-base"
                >
                  <div className="w-1.5 h-1.5 md:w-2 md:h-2 rounded-full bg-purple-500"></div>
                  {item}
                </li>
              ))}
            </ul>
            <button className="w-full py-2.5 md:py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-medium transition text-sm md:text-base">
              Continue Path
            </button>
          </motion.div>

          <motion.div
            whileHover={{ y: -5 }}
            className="bg-white dark:bg-gray-900 rounded-lg md:rounded-xl p-5 md:p-8 shadow-sm hover:shadow-md transition-all border border-gray-200 dark:border-gray-800"
          >
            <div className="flex items-center gap-3 md:gap-4 mb-4 md:mb-6">
              <div className="p-2 md:p-3 bg-teal-100 dark:bg-teal-900/50 rounded-lg">
                <UserCheck className="w-5 h-5 md:w-6 md:h-6 text-teal-600 dark:text-teal-400" />
              </div>
              <h3 className="text-lg md:text-xl font-medium md:font-semibold">
                Advanced Path
              </h3>
            </div>
            <p className="text-gray-600 dark:text-gray-300 mb-4 md:mb-6 text-sm md:text-base">
              Master complex topics and prepare for professional certifications.
            </p>
            <ul className="space-y-2 md:space-y-3 mb-6 md:mb-8">
              {["System Design", "Machine Learning", "Cloud Architecture"].map(
                (item, index) => (
                  <li
                    key={index}
                    className="flex items-center gap-2 text-gray-700 dark:text-gray-300 text-sm md:text-base"
                  >
                    <div className="w-1.5 h-1.5 md:w-2 md:h-2 rounded-full bg-teal-500"></div>
                    {item}
                  </li>
                )
              )}
            </ul>
            <button className="w-full py-2.5 md:py-3 bg-teal-600 hover:bg-teal-700 text-white rounded-lg font-medium transition text-sm md:text-base">
              Master Skills
            </button>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default LearningPaths;
