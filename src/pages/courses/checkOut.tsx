import { useEffect, useState } from "react";
import {
  FaCheckCircle,
  FaMoneyBillWave,
  FaTruck,
  FaWallet,
} from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { type AppDispatch, type RootState } from "../../store/store";

import { useFormik } from "formik";
import * as yup from "yup";
import {
  createEnrollmentFn,
  resetCreateEnrollState,
} from "../../store/slices/enrollments/createEnrollment";
import toast from "react-hot-toast";
import { listEnrollementsFn } from "../../store/slices/enrollments/listEnrollements";
import { useNavigate } from "react-router-dom";
import {
  createPaymentFn,
  resetCreatePaymentState,
} from "../../store/slices/payments/createPayment";
import { clearCart } from "../../store/slices/cart/cart";
import CheckoutPageSkeleton from "../../components/ui/chceckoutSkeleton";

const paymentMethods = [
  {
    label: "ZAAD Service",
    value: "zaad",
    number: "636379908",
    icon: <FaWallet className="text-xl" />,
  },
  {
    label: "E-Dahab",
    value: "e-dahab",
    number: "656379908",
    icon: <FaMoneyBillWave className="text-xl" />,
  },
  {
    label: "Cash on Delivery",
    value: "cash",
    number: "--",
    icon: <FaTruck className="text-xl" />,
  },
];

// Helper: map label to backend enum
const mapPaymentMethodLabelToEnum = (label: string) => {
  switch (label.toLowerCase()) {
    case "zaad service":
      return "ZAAD";
    case "e-dahab":
      return "E_DAHAB";
    case "cash on delivery":
      return "CASH";
    default:
      return "UNKNOWN";
  }
};

export default function CheckoutPage() {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  const logInState = useSelector((state: RootState) => state.WhoAmiSlice);
  const cartState = useSelector((state: RootState) => state.cart);
  const createPaymentState = useSelector(
    (state: RootState) => state.createPaymentSlice
  );
  const createEnrollmentState = useSelector(
    (state: RootState) => state.createEnrollementSlice
  );

  const user = logInState.data?.user;
  const course = cartState.items[0]; // assume single course

  const [paymentMethod, setPaymentMethod] = useState(paymentMethods[0]);
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);

  // Formik setup
  const formik = useFormik({
    initialValues: { phoneNumber: "" },
    validationSchema: yup.object({
      phoneNumber: yup
        .string()
        .min(7, "Phone number must have at least 7 digits")
        .required("Please enter your phone number"),
    }),
    onSubmit: () => {
      if (!user || !course) return;

      setLoading(true);

      // First, create payment
      dispatch(
        createPaymentFn({
          userId: user.id,
          courseId: course.id,
          phoneNumber: formik.values.phoneNumber.toString(),
          amount: course.price * course.quantity,
          currency: "USD",
          status: "PENDING",
          payment_method: mapPaymentMethodLabelToEnum(paymentMethod.label),
          isEnrolled: false,
        })
      );
    },
  });

  // When payment is successfully created, create enrollment
  useEffect(() => {
    if (createPaymentState.error) {
      toast.error(createPaymentState.error);
      setLoading(false);
      dispatch(resetCreatePaymentState());
      return;
    }

    if (
      createPaymentState.data?.isSuccess &&
      createPaymentState.data.payment &&
      user &&
      course
    ) {
      const paymentId = createPaymentState.data.payment.id;

      dispatch(
        createEnrollmentFn({
          userId: user.id,
          courseId: course.id,
          paymentId, // link payment with enrollment
          isEnrolled: false,
          status: "IN_PROGRESS",
        })
      );

      dispatch(resetCreatePaymentState());
    }
  }, [createPaymentState, dispatch, user, course]);

  // When enrollment is successfully created, finalize UI updates
  useEffect(() => {
    if (createEnrollmentState.error) {
      toast.error(createEnrollmentState.error);
      setLoading(false);
      dispatch(resetCreateEnrollState());
      return;
    }

    if (createEnrollmentState.data?.isSuccess) {
      toast.success("Enrollment and Payment processed successfully!");
      dispatch(listEnrollementsFn());
      dispatch(resetCreateEnrollState());
      formik.resetForm();
      setLoading(false);
      navigate("/checkout/confirm");
      localStorage.removeItem("cartItems");
      dispatch(clearCart());
    }
  }, [createEnrollmentState, dispatch, formik, navigate]);

  if (logInState.loading) {
    return <CheckoutPageSkeleton />;
  }

  if (!user)
    return (
      <p className="text-red-600 text-center mt-10">
        Please log in to proceed.
      </p>
    );

  if (!course)
    return (
      <div className="text-center py-10 text-gray-500 dark:text-gray-300">
        No items in your cart.
      </div>
    );

  const totalPrice = course.price * course.quantity;

  return (
    <div className="min-h-screen dark:bg-[#091025] bg-white py-10 px-6 md:px-20">
      <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-10">
        {/* Left: Course Info */}
        <div className="bg-white dark:bg-gray-900 shadow-xl rounded-2xl p-6 h-fit space-y-6">
          <div
            key={course.id}
            className="border rounded-xl p-4 bg-gray-50 dark:bg-gray-800 flex gap-4 items-start"
          >
            <img
              src={`${course.course_img}`}
              alt={course.title}
              className="w-24 h-20 object-cover rounded-xl"
            />
            <div>
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                {course.title}
              </h2>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                {course.description || "Online course"}
              </p>
              <p className="text-sm text-gray-700 dark:text-gray-300 mt-1">
                Price: ${course.price.toFixed(2)} | Quantity: {course.quantity}
              </p>
            </div>
          </div>
        </div>

        {/* Right: Payment Form */}
        <div className="bg-white dark:bg-gray-900 shadow-xl rounded-2xl p-6">
          <h3 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">
            Complete Your Enrollment
          </h3>

          <div className="mb-4">
            <label className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
              Choose Your Plan
            </label>
            <div className="flex items-center justify-between border rounded-xl p-3 bg-gray-50 dark:bg-gray-800 text-gray-800 dark:text-white font-medium">
              <span>Total (1 course)</span>
              <span className="text-blue-600 font-semibold">
                ${totalPrice.toFixed(2)}
              </span>
            </div>
          </div>

          <div className="mb-6">
            <label className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
              Choose Payment Method
            </label>
            <div className="space-y-3">
              {paymentMethods.map((method) => (
                <button
                  key={method.value}
                  type="button"
                  onClick={() => setPaymentMethod(method)}
                  className={`w-full flex items-center justify-between px-4 py-3 rounded-xl border transition duration-200 text-left hover:bg-gray-100 dark:hover:bg-gray-800 ${
                    paymentMethod.value === method.value
                      ? "border-blue-500 ring-2 ring-blue-400"
                      : "border-gray-300 dark:border-gray-700"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    {method.icon}
                    <span className="text-sm font-medium text-gray-800 dark:text-white">
                      {method.label}
                    </span>
                  </div>
                  {paymentMethod.value === method.value && (
                    <FaCheckCircle className="text-blue-500" />
                  )}
                </button>
              ))}
            </div>
          </div>

          <form onSubmit={formik.handleSubmit}>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Phone Number
              </label>
              <input
                type="tel"
                name="phoneNumber"
                placeholder="Enter your phone number"
                className="w-full mt-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-white"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.phoneNumber}
              />
              {formik.touched.phoneNumber && formik.errors.phoneNumber && (
                <p className="text-red-600 font-bold">
                  {formik.errors.phoneNumber}
                </p>
              )}
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Discount Code (Optional)
              </label>
              <input
                type="text"
                value={code}
                onChange={(e) => setCode(e.target.value.trim().split(" ")[0])}
                placeholder="Enter discount code"
                className="w-full mt-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 dark:bg-gray-800 dark:text-white"
              />
            </div>

            <div className="mb-4 bg-yellow-100 dark:bg-yellow-800 text-yellow-900 dark:text-yellow-100 rounded-lg px-4 py-3 text-sm">
              Please send <strong>${totalPrice.toFixed(2)}</strong> to{" "}
              <strong>{paymentMethod.number}</strong> via{" "}
              <strong>{paymentMethod.label}</strong>.
            </div>

            {loading && (
              <p className="text-center text-blue-600 font-semibold mb-4 animate-pulse">
                Processing enrollment and payment...
              </p>
            )}

            <button
              type="submit"
              disabled={loading}
              className={`w-full ${
                loading ? "bg-gray-400" : "bg-blue-600 hover:bg-blue-700"
              } text-white py-3 rounded-xl transition`}
            >
              {loading ? "Processing..." : `Pay $${totalPrice.toFixed(2)}`}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
