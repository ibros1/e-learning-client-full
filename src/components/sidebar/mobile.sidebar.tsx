import { NavLink } from "react-router-dom";
import { useSelector } from "react-redux";
import { type RootState } from "../../store/store";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import logo from "../../../public/logo.png";
import { FaCheckCircle } from "react-icons/fa";

interface Props {
  onClose: () => void;
}

const MobileSidebar = ({ onClose }: Props) => {
  const userState = useSelector((state: RootState) => state.loginSlice);
  const user = userState.data?.user;
  const fullName = user?.full_name || "Guest User";
  const username = user?.username || "guest";
  const profilePhoto = user?.profilePhoto ? `${user.profilePhoto}` : "";

  const isLoggedIn = userState.data?.isSuccess;

  const links = [
    {
      label: "Home",
      to: "/",
      iconClass: "bb-icon-home",
      filledIconClass: "bb-icon-home bb-icon-f",
    },
    {
      label: "All Courses",
      to: "/courses",
      iconClass: "bb-icon-books",
      filledIconClass: "bb-icon-books bb-icon-f",
    },
    {
      label: "Contact",
      to: "/contact",
      iconClass: "bb-icon-phone-call",
      filledIconClass: "bb-icon-phone-call bb-icon-f",
    },
  ];

  if (isLoggedIn) {
    links.splice(
      2,
      0,
      {
        label: "My Profile",
        to: "/my-profile",
        iconClass: "bb-icon-user",
        filledIconClass: "bb-icon-user bb-icon-f",
      },
      {
        label: "My Courses",
        to: "/my-courses",
        iconClass: "bb-icon-graduation-cap",
        filledIconClass: "bb-icon-graduation-cap bb-icon-f",
      },
      {
        label: "My Certificates",
        to: "/certificates",
        iconClass: "bb-icon-certificate",
        filledIconClass: "bb-icon-certificate bb-icon-f",
      },
      {
        label: "My Orders",
        to: "/my-orders",
        iconClass: "bb-icon-checkbox",
        filledIconClass: "bb-icon-checkbox bb-icon-f",
      },

      {
        label: "Members",
        to: "/members",
        iconClass: "bb-icon-users",
        filledIconClass: "bb-icon-users bb-icon-f",
      }
    );
  }

  if (user?.role === "ADMIN") {
    links.splice(0, 0, {
      label: "Dashboard",
      to: "/dashboard/admin",
      iconClass: "bb-icon-sidebar",
      filledIconClass: "bb-icon-sidebar bb-icon-f",
    });
  }
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
      className="fixed top-0 left-0 w-64 h-full bg-white dark:bg-[#0f172a] z-50 shadow-lg transform transition-transform duration-300 ease-in-out translate-x-0"
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
            <AvatarFallback className="bg-gray-300 dark:bg-gray-600">
              {fullName.charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div className="flex gap-2 ">
            <div className="flex flex-col">
              <span className="font-semibold text-sm text-gray-800 dark:text-white">
                {fullName.length > 15
                  ? `${fullName.slice(0, 14)}...`
                  : fullName}
              </span>
              <span className="text-sm text-gray-500 dark:text-gray-400">
                @{username}
              </span>
            </div>
            <div className="">
              <FaCheckCircle className="text-blue-500 text-md" />
            </div>
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
                  : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
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
        {userState.data?.isSuccess ? (
          bottomLinks.map((link, index) => (
            <NavLink
              key={index}
              to={link.to}
              onClick={onClose}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-xl px-3 py-2 transition-all ${
                  isActive
                    ? "bg-blue-600 text-white font-semibold"
                    : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
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

export default MobileSidebar;
