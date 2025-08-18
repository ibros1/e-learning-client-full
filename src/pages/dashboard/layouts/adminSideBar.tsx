import { NavLink, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { type RootState } from "../../../store/store";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "../../../components/ui/avatar";
import { FaCheckCircle } from "react-icons/fa";
import logo from "../../../../public/logo.png";

const Sidebar = () => {
  const user = useSelector((state: RootState) => state.WhoAmiSlice.data?.user);
  const fullName = user?.full_name || "Guest User";
  const username = user?.username || "guest";
  const profilePhoto = user?.profilePhoto ? `${user.profilePhoto}` : "";
  const navigate = useNavigate();
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
      label: "Transactions",
      to: "/dashboard/payments",
      iconClass: "bb-icon-money",
      filledIconClass: "bb-icon-money bb-icon-f",
    },
    {
      label: "Users",
      to: "/dashboard/students",
      iconClass: "bb-icon-users",
      filledIconClass: "bb-icon-users bb-icon-f",
    },
    {
      label: "Reports",
      to: "/dashboard/reports",
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
      to: "/",

      iconClass: "bb-icon-sign-out",
      filledIconClass: "bb-icon-sign-out bb-icon-f",
    },
  ];

  return (
    <aside className="w-full h-full bg-[#091025] text-white  flex flex-col justify-between">
      {/* Top - Profile Info */}

      <div className="px-2">
        {/* Left: Logo + Brand */}
        <div className="flex py-4 justify-center items-center gap-2">
          <img
            src={logo}
            alt="Logo"
            className=" w-[240px] h-[60px] cursor-pointer"
            onClick={() => navigate("/dashboard/admin")}
          />
        </div>
        <hr />

        <div className="relative  border-gray-700 p-4 shadow-sm">
          {/* Profile Avatar */}
          {/* Profile Section */}
          <div className="flex  py-3">
            <Avatar className="w-12 h-12 ring ring-[#0f172a] shadow-md">
              <AvatarImage
                src={profilePhoto}
                alt={`${fullName}'s profile picture`}
                className="object-cover"
              />
              <AvatarFallback className="text-sm font-semibol bg-gray-700">
                {fullName.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>

            <div className="flex flex-col ml-2 ">
              <div className="flex items-center gap-1 text-[14.4px] font-semibold  text-white">
                <span className="font-semibold ">
                  {fullName.length > 15
                    ? `${fullName.slice(0, 15)}...`
                    : fullName}
                </span>
                <FaCheckCircle className="text-blue-500 text-md" />
              </div>
              <p className="text-sm  text-gray-400">@{username}</p>
            </div>
          </div>
        </div>

        <hr className="text-gray-300" />

        {/* Title */}

        {/* Main Menu */}
        <nav className="flex flex-col py-4 ">
          {links.map((link, index) => (
            <NavLink
              key={index}
              to={link.to}
              className={({ isActive }) =>
                `group flex items-center gap-3 rounded-xl px-4 py-2 my-1 transition-all duration-300 ${
                  isActive
                    ? "bg-blue-600 text-white font-semibold shadow-sm"
                    : " text-gray-300  hover:bg-gray-800"
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <i
                    className={`text-2xl transition ${
                      isActive
                        ? link.filledIconClass
                        : `${link.iconClass} bb-icon-l`
                    }`}
                  ></i>
                  <span className="text-sm group-hover:translate-x-[2px] transition-all">
                    {link.label}
                  </span>
                </>
              )}
            </NavLink>
          ))}
        </nav>
      </div>
      {/* Bottom Menu */}
      <div className=" border-gray-700 bg-[#091025] w-full px-2">
        <nav className="flex flex-col py-4 ">
          <hr className="py-4" />
          {bottomLinks.map((link, index) => (
            <NavLink
              key={index}
              to={link.to}
              className={({ isActive }) =>
                `group flex items-center gap-3 rounded-xl px-4 py-2 my-1 transition-all duration-300 ${
                  isActive
                    ? "bg-blue-600 text-white font-semibold shadow-sm"
                    : " text-gray-300 hove hover:bg-gray-800"
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <i
                    className={`text-2xl transition ${
                      isActive
                        ? link.filledIconClass
                        : `${link.iconClass} bb-icon-l`
                    }`}
                  ></i>
                  <span className="text-sm group-hover:translate-x-[2px] transition-all">
                    {link.label}
                  </span>
                </>
              )}
            </NavLink>
          ))}
        </nav>
      </div>
    </aside>
  );
};

export default Sidebar;
