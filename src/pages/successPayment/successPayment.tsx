import { useNavigate } from "react-router-dom";
import { FaCheck, FaWhatsapp } from "react-icons/fa";

const SuccessPayment = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-16  dark:from-gray-900 dark:to-gray-800">
      <div className="relative bg-white dark:bg-[#0f172a] border border-gray-200 dark:border-gray-700 rounded-3xl shadow-2xl p-10 max-w-2xl w-full text-center">
        {/* Floating Success Icon */}
        <div className="absolute -top-12 left-1/2 transform -translate-x-1/2">
          <div
            className={`bg-green-500 w-24 h-24 rounded-full flex items-center justify-center shadow-xl `}
          >
            <FaCheck className="text-white text-4xl" />
          </div>
        </div>

        {/* Title */}
        <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 dark:text-white mt-16">
          Payment Successful!
        </h1>

        {/* Description */}
        <p className="text-gray-600 dark:text-gray-300 mt-4 text-base leading-relaxed">
          Your payment was received successfully. Our team is now verifying your
          transaction and will grant you access shortly.
        </p>

        {/* Still Not Paid Section */}
        <div className="bg-red-50 dark:bg-gray-700 border text-red-800 dark:text-gray-300 p-5 rounded-xl mt-8 text-left space-y-2">
          <h3 className="text-lg font-semibold">
            if you Haven't sent the payment yet?
          </h3>
          <p className="text-sm">
            If you reached this page by mistake or you haven't sent the payment
            yet, please send the correct amount to one of the following numbers:
          </p>
          <ul className="text-sm list-disc ml-6">
            <li>
              <strong>Zaad:</strong> 063-6379908
            </li>
            <li>
              <strong>E-Dahab:</strong> 065-6379908
            </li>
          </ul>
          <p className="text-sm">
            After sending, please contact us on WhatsApp to verify.
          </p>
        </div>

        {/* Help Section */}
        <div className="bg-yellow-50 dark:bg-yellow-900 border border-yellow-300 dark:border-yellow-800 text-yellow-800 dark:text-yellow-100 p-5 rounded-xl mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
          <span className="font-medium">Need help verifying?</span>
          <a
            href="https://wa.me/252636379908"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center bg-blue-600 text-white px-5 py-2 rounded-full hover:bg-blue-700 transition"
          >
            <FaWhatsapp className="mr-2" />
            Chat on WhatsApp
          </a>
        </div>

        {/* CTA Button */}
        <div className="mt-10">
          <button
            onClick={() => navigate("/my-courses")}
            className="inline-block w-full sm:w-auto px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-full shadow-lg hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 text-sm font-semibold"
          >
            Go to My Courses
          </button>
        </div>

        {/* Footer Note */}
        <div className="mt-5 text-xs text-gray-500 dark:text-gray-400">
          You’ll receive access after manual verification is complete.
        </div>
      </div>
    </div>
  );
};

export default SuccessPayment;
