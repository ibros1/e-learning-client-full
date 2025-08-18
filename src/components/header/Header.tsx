import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { ChangeToggle } from "../darkMode";
import logo from "../../../public/logo.png";
import { useSelector } from "react-redux";
import type { RootState } from "../../store/store";
import Profile from "../Profile/profilePopup";
import MobileSidebar from "../sidebar/mobile.sidebar";
import CartPopup from "../cart/cartPopup";

const Header = () => {
  const logInState = useSelector((state: RootState) => state.loginSlice);
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation(); // ✅ React Router location object

  const path = location.pathname.replace(/\/+$/, "");
  const isMyCoursesPage = path.startsWith("/my-courses");

  // normalize trailing slash
  return (
    <>
      {/* Header */}
      <header className="sticky w-full top-0 z-50  shadow-sm border-b flex items-center justify-between px-4 sm:px-4 py-3 bg-card dark:bg-[#091025] dark:text-white">
        {/* Left Section: Logo + Menu */}
        <div className="flex items-center gap-4">
          {/* Mobile Menu Button */}
          <button
            aria-label="Open menu"
            className="xl:hidden text-2xl p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-800"
            onClick={() => setSidebarOpen(true)}
          >
            <span className="bb-icon-bars-2 bb-icon-l" />
          </button>

          {/* Desktop logo: show if not logged in OR if on /my-courses */}
          {(isMyCoursesPage || !logInState.data?.isSuccess) && (
            <img
              src={logo}
              alt="Logo"
              className="hidden xl:block cursor-pointer w-[180px]"
              onClick={() => navigate("/")}
              draggable={false}
            />
          )}

          {/* Logo (Mobile & Tablet) */}
          <img
            src={logo}
            alt="Logo"
            className="block xl:hidden cursor-pointer w-[120px] sm:w-[150px] md:w-[180px]"
            onClick={() => navigate("/")}
            draggable={false}
          />
        </div>

        {/* Center Nav (Desktop Only) */}
        <nav className="hidden xl:flex gap-8 font-medium text-gray-600 text-xl dark:text-gray-400">
          <Link to="/" className="hover:text-blue-600 transition">
            Home
          </Link>
          <Link to="/courses" className="hover:text-blue-600 transition">
            Courses
          </Link>
          <Link to="/members" className="hover:text-blue-600 transition">
            Members
          </Link>
          <Link to="/contact" className="hover:text-blue-600 transition">
            Contact
          </Link>
        </nav>

        {/* Right Section */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 text-2xl">
            <button
              aria-label="Search"
              className="bb-icon-search bb-icon-l p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-800"
              type="button"
            />
            <CartPopup />
            <button
              aria-label="Notifications"
              className="bb-icon-bell bb-icon-l hidden md:inline-flex p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-800"
              type="button"
            />
            <button
              aria-label="Inbox"
              className="bb-icon-inbox bb-icon-l hidden md:inline-flex p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-800"
              type="button"
            />
          </div>

          {/* Dark Mode */}
          <ChangeToggle />

          {/* Auth / Profile */}
          {logInState.data?.isSuccess ? (
            <Profile />
          ) : (
            <div className="hidden md:flex gap-2">
              <Link
                to="/login"
                className="text-blue-600 border shadow-sm px-4 py-2 rounded-md bg-gray-50 dark:bg-[#0f172a] hover:text-blue-800 font-semibold transition"
              >
                Login
              </Link>
              <Link
                to="/register"
                className="text-blue-600 border shadow-sm px-4 py-2 rounded-md bg-gray-50 dark:bg-[#0f172a] hover:text-blue-800 font-semibold transition"
              >
                Register
              </Link>
            </div>
          )}
        </div>
      </header>

      {/* Sidebar Overlay */}
      <div
        className={`fixed inset-0 bg-black bg-opacity-40 z-40 transition-opacity duration-300 ${
          isSidebarOpen ? "opacity-100 visible" : "opacity-0 invisible"
        }`}
        onClick={() => setSidebarOpen(false)}
        aria-hidden={!isSidebarOpen}
      />

      {/* Mobile Sidebar */}
      <aside
        className={`fixed top-0 left-0 w-64 h-full z-50 shadow-lg bg-white dark:bg-[#091025] transform transition-transform duration-300 ease-in-out ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
        onClick={(e) => e.stopPropagation()}
        aria-hidden={!isSidebarOpen}
        role="dialog"
        aria-modal="true"
      >
        <MobileSidebar onClose={() => setSidebarOpen(false)} />
      </aside>
    </>
  );
};

export default Header;
