import { NavLink } from "react-router-dom";
import { useSelector } from "react-redux";
import { type RootState } from "../../store/store";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "../../components/ui/avatar";
import logo from "../../../public/logo.png";

import { FaCheckCircle } from "react-icons/fa";

interface Props {
  onClose: () => void;
}

const MobileAdminSideBar = ({ onClose }: Props) => {
  const loginState = useSelector((state: RootState) => state.loginSlice);
  const user = loginState.data?.user;
  const fullName = user?.full_name || "Guest User";
  const username = user?.username || "guest";
  const profilePhoto = user?.profilePhoto ? `${user.profilePhoto}` : "";

  // const isLoggedIn = loginState.data?.isSuccess;

  const links = [
    {
      label: "Dashboard",
      to: "/dashboard/admin",
      iconClass: "bb-icon-home",
      filledIconClass: "bb-icon-home bb-icon-f",
    },
    {
      label: "Courses",
      to: "/dashboard/courses",
      iconClass: "bb-icon-books",
      filledIconClass: "bb-icon-books bb-icon-f",
    },
    {
      label: "Chapters",
      to: "/dashboard/chapters",
      iconClass: "bb-icon-course",
      filledIconClass: "bb-icon-course bb-icon-f",
    },
    {
      label: "Lessons",
      to: "/dashboard/lessons",
      iconClass: "bb-icon-graduation-cap",
      filledIconClass: "bb-icon-graduation-cap bb-icon-f",
    },
    {
      label: "Enrollments",
      to: "/dashboard/enrollments",
      iconClass: "bb-icon-marketplace",
      filledIconClass: "bb-icon-marketplace bb-icon-f",
    },
    {
      label: "Payments",
      to: "/dashboard/payments",
      iconClass: "bb-icon-money",
      filledIconClass: "bb-icon-money bb-icon-f",
    },
    {
      label: "Students",
      to: "/dashboard/students",
      iconClass: "bb-icon-users",
      filledIconClass: "bb-icon-users bb-icon-f",
    },
    {
      label: "Notices",
      to: "/dashboard/notice",
      iconClass: "bb-icon-voicemail",
      filledIconClass: "bb-icon-voicemail bb-icon-f",
    },
  ];
  const bottomLinks = [
    {
      label: "Account",
      to: "/my-settings",
      iconClass: "bb-icon-cog",
      filledIconClass: "bb-icon-cog bb-icon-f",
    },
    {
      label: "Log out",
      to: "/logout",
      iconClass: "bb-icon-sign-out",
      filledIconClass: "bb-icon-sign-out bb-icon-f",
    },
  ];

  return (
    <aside
      className="fixed top-0 left-0 w-64 h-full overflow-auto bg-[#0f172a] z-50 shadow-lg transform transition-transform duration-300 ease-in-out translate-x-0"
      onClick={(e) => e.stopPropagation()}
    >
      {/* Header */}

      <div className="md:hidden flex justify-between  items-center p-4 border-b">
        <img src={logo} alt="Logo" className="w-[120px] cursor-pointer" />
        <li
          className="text-2xl bb-icon-times items-center flex justify-center  font-bold text-gray-600 cursor-pointer  dark:text-white"
          onClick={onClose}
        ></li>
      </div>

      {/* Profile Info */}
      <div className="p-4 border-b">
        <div className="flex items-center gap-3">
          <Avatar className="w-12 h-12 ring-2 ring-white dark:ring-[#0f172a] shadow-md">
            <AvatarImage
              src={profilePhoto}
              alt={`${fullName}'s profile picture`}
              className="object-cover"
            />
            <AvatarFallback className="bg-gray-600">
              {fullName.charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div className="flex flex-col">
            <div className="flex gap-2">
              <span className="font-semibold text-sm text-white">
                {fullName.length > 15
                  ? `${fullName.slice(0, 14)}...`
                  : fullName}
              </span>
              <FaCheckCircle className="text-blue-500 text-md" />
            </div>
            <span className="text-sm text-gray-400">@{username}</span>
          </div>
        </div>
      </div>

      {/* Navigation Links */}
      <nav className="flex flex-col p-4 gap-1">
        {links.map((link, index) => (
          <NavLink
            key={index}
            to={link.to}
            onClick={onClose}
            className={({ isActive }) =>
              `flex items-center gap-3 rounded-xl px-3 py-2 transition-all ${
                isActive
                  ? "bg-blue-600 text-white font-semibold"
                  : "text-gray-300 hover:bg-gray-800"
              }`
            }
          >
            {({ isActive }) => (
              <>
                <i
                  className={`text-2xl ${
                    isActive
                      ? link.filledIconClass
                      : `${link.iconClass} bb-icon-l`
                  }`}
                ></i>
                <span>{link.label}</span>
              </>
            )}
          </NavLink>
        ))}
      </nav>

      {/* Footer Buttons */}
      <div className="p-4 border-t mt-auto">
        {loginState.data?.isSuccess ? (
          bottomLinks.map((link, index) => (
            <NavLink
              key={index}
              to={link.to}
              onClick={onClose}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-xl px-3 py-2 transition-all ${
                  isActive
                    ? "bg-blue-600 text-white font-semibold"
                    : "text-gray-300  dark:hover:bg-gray-800"
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <i
                    className={`text-2xl ${
                      isActive
                        ? link.filledIconClass
                        : `${link.iconClass} bb-icon-l`
                    }`}
                  ></i>
                  <span>{link.label}</span>
                </>
              )}
            </NavLink>
          ))
        ) : (
          <div className="flex flex-col gap-2">
            <NavLink
              to="/login"
              onClick={onClose}
              className="text-blue-600 border shadow-sm px-4 py-2 rounded-md bg-gray-50 dark:bg-[#0F172A] dark:border-2 hover:text-blue-800 font-semibold"
            >
              Login
            </NavLink>
            <NavLink
              to="/register"
              onClick={onClose}
              className="text-blue-600 border shadow-sm px-4 py-2 rounded-md bg-gray-50 dark:bg-[#0F172A] dark:border-2 hover:text-blue-800 font-semibold"
            >
              Register
            </NavLink>
          </div>
        )}
      </div>
    </aside>
  );
};

export default MobileAdminSideBar;
