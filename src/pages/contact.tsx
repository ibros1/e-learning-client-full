import { useState } from "react";
import {
  FiMail,
  FiPhone,
  FiMapPin,
  FiSend,
  FiCheckCircle,
} from "react-icons/fi";
import { motion } from "framer-motion";

const Contact = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [recaptcha, setRecaptcha] = useState(false);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = "Name is required";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Invalid email format";
    }

    if (!formData.subject.trim()) {
      newErrors.subject = "Subject is required";
    }

    if (!formData.message.trim()) {
      newErrors.message = "Message is required";
    }

    if (!recaptcha) {
      newErrors.recaptcha = "Please verify you're not a robot";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsSubmitting(true);

    // Simulate API call
    try {
      await new Promise((resolve) => setTimeout(resolve, 1500));
      console.log("Form submitted:", formData);
      setIsSubmitted(true);

      // Reset form after successful submission
      setFormData({ name: "", email: "", subject: "", message: "" });
      setRecaptcha(false);

      // Reset success message after 5 seconds
      setTimeout(() => setIsSubmitted(false), 5000);
    } catch (error) {
      console.error("Submission error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section
      id="contact"
      className="relative h-full pt-8 bg-gray-100 dark:bg-gradient-to-b dark:from-[#0f172a] dark:via-[#0f172a] dark:to-[#1e293b]"
    >
      {/* Decorative elements */}

      <div className="max-w-6xl mx-auto relative z-10">
        {/* Heading with animation */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="text-center mb-14"
        >
          <h2 className="text-4xl md:text-5xl font-extrabold text-gray-900 dark:text-white">
            Get in <span className="text-blue-600">Touch</span>
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-300 mt-4 max-w-2xl mx-auto">
            We'd love to hear from you! Whether you have a question, feedback,
            or just want to say hello — reach out to us.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          {/* Contact Info with animations */}
          <div className="space-y-6">
            {[
              {
                icon: <FiMapPin className="text-blue-600 text-2xl" />,
                title: "Our Location",
                text: "Hargeisa, Somaliland",
              },
              {
                icon: <FiPhone className="text-blue-600 text-2xl" />,
                title: "Phone Number",
                text: "+252 63 6379908",
              },
              {
                icon: <FiMail className="text-blue-600 text-2xl" />,
                title: "Email Address",
                text: "support@surmadd.com",
              },
            ].map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="backdrop-blur-md bg-white  dark:bg-white/5 p-6 rounded-2xl shadow-lg flex items-start gap-4 hover:shadow-2xl transition"
              >
                <div className="mt-1">{item.icon}</div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
                    {item.title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300 mt-1">
                    {item.text}
                  </p>
                </div>
              </motion.div>
            ))}

            {/* Map placeholder */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              viewport={{ once: true }}
              className="mt-8 rounded-xl overflow-hidden shadow-lg"
            >
              <div className="bg-white border-2 border-dashed rounded-xl w-full h-48 dark:bg-gray-800 dark:border-gray-700 flex items-center justify-center">
                <span className="text-gray-500 dark:text-gray-400">
                  Map placeholder
                </span>
              </div>
            </motion.div>
          </div>

          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="backdrop-blur-md bg-white/70 dark:bg-white/5 p-8 rounded-2xl shadow-lg"
          >
            {isSubmitted ? (
              <div className="text-center py-8">
                <FiCheckCircle className="text-green-500 text-5xl mx-auto mb-4" />
                <h3 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">
                  Message Sent!
                </h3>
                <p className="text-gray-600 dark:text-gray-300">
                  Thank you for contacting us. We'll get back to you soon.
                </p>
                <button
                  onClick={() => setIsSubmitted(false)}
                  className="mt-6 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                >
                  Send Another Message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label
                      htmlFor="name"
                      className="block text-sm font-semibold text-gray-700 dark:text-gray-200 mb-1"
                    >
                      Name
                    </label>
                    <input
                      id="name"
                      name="name"
                      type="text"
                      placeholder="your name"
                      value={formData.name}
                      onChange={handleChange}
                      className={`mt-1 w-full px-4 py-3 rounded-lg border ${
                        errors.name
                          ? "border-red-500"
                          : "border-gray-300 dark:border-gray-700"
                      } dark:bg-gray-800/50 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none transition`}
                    />
                    {errors.name && (
                      <p className="mt-1 text-red-500 text-sm">{errors.name}</p>
                    )}
                  </div>

                  <div>
                    <label
                      htmlFor="email"
                      className="block text-sm font-semibold text-gray-700 dark:text-gray-200 mb-1"
                    >
                      Email
                    </label>
                    <input
                      id="email"
                      name="email"
                      type="email"
                      placeholder="you@email.com"
                      value={formData.email}
                      onChange={handleChange}
                      className={`mt-1 w-full px-4 py-3 rounded-lg border ${
                        errors.email
                          ? "border-red-500"
                          : "border-gray-300 dark:border-gray-700"
                      } dark:bg-gray-800/50 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none transition`}
                    />
                    {errors.email && (
                      <p className="mt-1 text-red-500 text-sm">
                        {errors.email}
                      </p>
                    )}
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="subject"
                    className="block text-sm font-semibold text-gray-700 dark:text-gray-200 mb-1"
                  >
                    Subject
                  </label>
                  <input
                    id="subject"
                    name="subject"
                    type="text"
                    placeholder="Your subject here"
                    value={formData.subject}
                    onChange={handleChange}
                    className={`mt-1 w-full px-4 py-3 rounded-lg border ${
                      errors.subject
                        ? "border-red-500"
                        : "border-gray-300 dark:border-gray-700"
                    } dark:bg-gray-800/50 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none transition`}
                  />
                  {errors.subject && (
                    <p className="mt-1 text-red-500 text-sm">
                      {errors.subject}
                    </p>
                  )}
                </div>

                <div>
                  <label
                    htmlFor="message"
                    className="block text-sm font-semibold text-gray-700 dark:text-gray-200 mb-1"
                  >
                    Message
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    placeholder="Write your message..."
                    value={formData.message}
                    onChange={handleChange}
                    rows={5}
                    className={`mt-1 w-full px-4 py-3 rounded-lg border ${
                      errors.message
                        ? "border-red-500"
                        : "border-gray-300 dark:border-gray-700"
                    } dark:bg-gray-800/50 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none transition resize-none`}
                  />
                  {errors.message && (
                    <p className="mt-1 text-red-500 text-sm">
                      {errors.message}
                    </p>
                  )}
                </div>

                {/* reCAPTCHA simulation */}
                <div className="flex items-start">
                  <div className="flex items-center h-5">
                    <input
                      id="recaptcha"
                      name="recaptcha"
                      type="checkbox"
                      checked={recaptcha}
                      onChange={() => setRecaptcha(!recaptcha)}
                      className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                    />
                  </div>
                  <label
                    htmlFor="recaptcha"
                    className="ml-3 text-sm font-medium text-gray-700 dark:text-gray-300"
                  >
                    I'm not a robot
                  </label>
                </div>
                {errors.recaptcha && (
                  <p className="text-red-500 text-sm">{errors.recaptcha}</p>
                )}

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={`w-full bg-gradient-to-r from-blue-600 to-blue-500 text-white font-semibold py-3 rounded-lg shadow-lg transition flex items-center justify-center ${
                    isSubmitting
                      ? "opacity-70 cursor-not-allowed"
                      : "hover:opacity-90"
                  }`}
                >
                  {isSubmitting ? (
                    <>
                      <svg
                        className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                      Sending...
                    </>
                  ) : (
                    <>
                      <FiSend className="mr-2" />
                      Send Message
                    </>
                  )}
                </button>
              </form>
            )}
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
