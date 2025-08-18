import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus } from "lucide-react";

const FAQ = () => {
  const [openFAQIndex, setOpenFAQIndex] = useState<number | null>(null);
  const toggleFAQ = (idx: number) => {
    setOpenFAQIndex(openFAQIndex === idx ? null : idx);
  };

  return (
    <div>
      {" "}
      <section className="py-12 md:py-16 px-4 sm:px-6 bg-gray-50 dark:bg-[#091025] max-w-4xl mx-auto">
        <div className="text-center mb-8 md:mb-12">
          <h2 className="text-2xl md:text-3xl font-bold mb-2 md:mb-4">
            Frequently Asked Questions
          </h2>
          <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto text-sm md:text-base">
            Find answers to common questions about our platform
          </p>
        </div>

        <div className="space-y-3 md:space-y-4">
          {[
            {
              question: "What is this platform about?",
              answer:
                "Our platform is a comprehensive learning management system designed to help you acquire new skills through expert-led courses. We focus on practical, job-relevant skills that you can apply immediately in your career.",
            },
            {
              question: "Can I learn at my own pace?",
              answer:
                "Absolutely! All our courses are self-paced, allowing you to learn whenever and wherever you want. You'll have lifetime access to course materials so you can revisit them anytime.",
            },
            {
              question: "Do you provide certificates?",
              answer:
                "Yes, we offer verifiable certificates of completion for every course you finish successfully. These certificates can be shared on LinkedIn and added to your resume to showcase your skills.",
            },
            {
              question: "Is there a free trial?",
              answer:
                "We offer a 7-day free trial for all new users. During this period, you can access most of our course content to decide if our platform is right for you before committing to a subscription.",
            },
          ].map((faq, idx) => {
            const isOpen = openFAQIndex === idx;

            return (
              <motion.div
                key={idx}
                layout
                className="bg-white dark:bg-gray-900 rounded-lg md:rounded-xl shadow-sm hover:shadow-md transition cursor-pointer"
                onClick={() => toggleFAQ(idx)}
              >
                <div className="p-4 md:p-6 flex justify-between items-center">
                  <h3 className="font-medium md:font-semibold text-sm md:text-base lg:text-lg">
                    {faq.question}
                  </h3>
                  <motion.div
                    animate={{ rotate: isOpen ? 180 : 0 }}
                    transition={{ duration: 0.2 }}
                    className="text-gray-500 dark:text-gray-400"
                  >
                    <Plus size={18} />
                  </motion.div>
                </div>
                <AnimatePresence>
                  {isOpen && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.2 }}
                      className="px-4 md:px-6 pb-4 md:pb-6"
                    >
                      <p className="text-gray-600 dark:text-gray-300 text-xs md:text-sm">
                        {faq.answer}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </div>
      </section>
    </div>
  );
};

export default FAQ;
