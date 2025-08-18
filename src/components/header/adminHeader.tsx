import { useState } from "react";
import { useNavigate } from "react-router-dom";
import logo from "../../../public/logo.png";
import { useSelector } from "react-redux";
import type { RootState } from "../../store/store";
import { ChangeToggle } from "../darkMode";

import Profile from "../Profile/AdminProfilePopup";
import MobileAdminSideBar from "../../pages/dashboard/layouts/mobileAdminSideBar";

const AdminHeader = () => {
  const logInState = useSelector((state: RootState) => state.loginSlice);
  const [isSidebarAdminOpen, setSidebarAdminOpen] = useState(false);
  const navigate = useNavigate();

  return !logInState.data.isSuccess ? (
    <div className="text-red-600 text-center p-4"> {logInState.error} </div>
  ) : (
    <div>
      <header className="w-full  px-2 xl:px-4 py-4 flex items-center justify-between bg-white dark:bg-[#091025] dark:text-white z-50">
        {/* Left - Logo & Sidebar Toggle */}
        <div className="flex items-center gap-4">
          <button
            className="text-2xl xl:hidden bb-icon-bars-2 bb-icon-l hover:bg-gray-100 dark:hover:bg-gray-800 p-2 rounded"
            onClick={() => setSidebarAdminOpen(true)}
          ></button>
          <div className=" w-full flex justify-center mx-auto items-center">
            <img
              src={logo}
              alt="Admin Logo"
              className="w-[150px] md:w-[200px] cursor-pointer"
              onClick={() => navigate("/dashboard/admin")}
            />
          </div>
        </div>

        {/* Center - Admin-only Navigation */}
        <nav className="hidden xl:flex gap-6 font-medium text-gray-700 text-base dark:text-gray-300">
          <button
            onClick={() => navigate("/dashboard/students")}
            className="hover:text-blue-600 transition"
          >
            Manage Users
          </button>
          <button
            onClick={() => navigate("/dashboard/courses")}
            className="hover:text-blue-600 transition"
          >
            Manage Courses
          </button>
        </nav>

        {/* Right - Tools & Profile */}
        <div className="flex  items-center  md:gap-2">
          <ChangeToggle />
          <Profile />
        </div>
      </header>

      {/* Overlay for mobile sidebar */}
      <div
        className={`fixed inset-0 bg-black bg-opacity-40 z-40 transition-opacity duration-300 ${
          isSidebarAdminOpen ? "opacity-100 visible" : "opacity-0 invisible"
        }`}
        onClick={() => setSidebarAdminOpen(false)}
      ></div>

      {/* Sidebar */}
      <div
        className={`fixed top-0 left-0 w-64 h-full z-50 shadow-lg  dark:bg-[#0d1117] transform transition-transform duration-300 ease-in-out ${
          isSidebarAdminOpen ? "translate-x-0" : "-translate-x-full"
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        <MobileAdminSideBar onClose={() => setSidebarAdminOpen(false)} />
      </div>
    </div>
  );
};

export default AdminHeader;
