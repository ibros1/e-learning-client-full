import logo from "../../../public/logo.png";
import { useFormik } from "formik";
import * as yup from "yup";
import { Button } from "../../components/ui/button";
import { useDispatch, useSelector } from "react-redux";
import { type AppDispatch, type RootState } from "../../store/store";
import { loginUserFn } from "../../store/slices/auth/login";
import toast from "react-hot-toast";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const navigate = useNavigate();
  const toastId = "login";
  const dipatch = useDispatch<AppDispatch>();
  const logInState = useSelector((state: RootState) => state.loginSlice);
  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    onSubmit: (values) => {
      const data = {
        email: values.email,
        password: values.password,
      };
      toast.loading("loading...", { id: toastId });
      dipatch(loginUserFn(data));
    },
    validationSchema: yup.object({
      email: yup
        .string()
        .email("Invalid email address")
        .required("Email is required"),
      password: yup
        .string()
        .min(6, "Password must be at least 6 characters")
        .required("Password is required"),
    }),
  });
  useEffect(() => {
    if (logInState.error) {
      toast.error(logInState.error, { id: toastId });
      return;
    }
    if (logInState.data.isSuccess) {
      toast.success("Successfully Logged In", { id: toastId });
      localStorage.setItem("user_data", JSON.stringify(logInState.data));
      navigate("/");
    }
  }, [logInState]);

  if (logInState.loading) return <p>Loading....</p>;

  return (
    <div className="min-h-screen bg-white dark:bg-[#091025] flex items-center justify-center px-4 transition-colors">
      <div className="w-full max-w-md bg-white dark:bg-[#091025] dark:backdrop-blur-md rounded-2xl shadow-xl p-8 border border-gray-200 dark:border-white/20 text-gray-900 dark:text-white transition-colors">
        <div className="text-center mb-6">
          <img
            src={logo}
            alt="SURMAD Logo"
            className="mx-auto h-full w-[60%] mb-2"
          />
          <h2 className="text-2xl font-semibold">Welcome Back to SURMAD</h2>
          <p className="text-sm text-gray-500 dark:text-gray-300">
            Log in to continue learning
          </p>
        </div>
        <div className="info text-red-600 font-bold">{logInState.error}</div>

        {/* Form */}
        <form className="space-y-5" onSubmit={formik.handleSubmit}>
          <div className="flex flex-col">
            <div className="grid">
              <label className="block my-1 ">Email</label>
              <input
                type="email"
                name="email"
                className="border border-gray-300 p-3 w-full rounded-md focus:outline-none dark:bg-[#091025]  focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                placeholder="Enter your Email"
                onChange={formik.handleChange}
                value={formik.values.email.toLowerCase()}
                onBlur={formik.handleBlur}
              />

              <p className="text-red-600 font-bold">
                {" "}
                {formik.touched.email && formik.errors.email}{" "}
              </p>
            </div>
          </div>
          <div>
            <label className="block my-1 ">Password</label>
            <input
              type="password"
              name="password"
              className="border border-gray-300 p-3 w-full rounded-md focus:outline-none dark:bg-[#091025]  focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
              placeholder="Enter your password"
              onChange={formik.handleChange}
              value={formik.values.password}
              onBlur={formik.handleBlur}
            />

            <p className="text-red-600 font-bold">
              {" "}
              {formik.touched.password && formik.errors.password}{" "}
            </p>
          </div>

          <div className="flex items-center justify-between text-md text-gray-500 dark:text-gray-300">
            <label className="flex items-center space-x-2">
              <input type="checkbox" className="accent-blue-500" />
              <span>Remember me</span>
            </label>
            <a
              href="#"
              className="hover:underline text-blue-600 dark:text-blue-400"
            >
              Forgot password?
            </a>
          </div>

          <Button className="bg-blue-600 w-full hover:bg-blue-500 transition duration-300 font-semibold">
            Sign In
          </Button>
        </form>

        {/* Divider */}
        <div className="my-6 border-t border-gray-200 dark:border-white/20" />

        {/* Signup Link */}
        <p className="text-center text-sm text-gray-500 dark:text-gray-300">
          Don’t have an account?{" "}
          <a
            href="/register"
            className="text-blue-600 dark:text-blue-400 hover:underline"
          >
            Sign up here
          </a>
        </p>
      </div>
    </div>
  );
};

export default Login;
