// pages/Logout.tsx

import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { type AppDispatch, type RootState } from "../store/store";
import { useEffect, type FormEvent } from "react";
import { resetLoginState } from "../store/slices/auth/login";

const Logout = () => {
  const navigate = useNavigate();
  const user = useSelector((state: RootState) => state.loginSlice.data?.user);
  const dispatch = useDispatch<AppDispatch>();
  const handleLogout = (e: FormEvent) => {
    e.preventDefault();
    dispatch(resetLoginState());
    navigate("/login");
  };

  useEffect(() => {
    if (!user) {
      navigate("/login");
      return;
    }
  }, [navigate, user]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900 px-4">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8 max-w-md w-full text-center">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100">
          Are you sure you want to log out?
        </h1>
        <p className="mt-3 text-gray-600 dark:text-gray-300 text-sm">
          You will need to sign in again to access your account.
        </p>

        <div className="mt-8 flex gap-4 justify-center">
          <button
            onClick={() => navigate("/")}
            className="px-6 py-2 rounded-lg border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-700 transition"
          >
            Cancel
          </button>
          <button
            onClick={handleLogout}
            className="px-6 py-2 rounded-lg bg-red-600 hover:bg-red-500 text-white font-semibold transition"
          >
            Log Out
          </button>
        </div>
      </div>
    </div>
  );
};

export default Logout;
