import { NavLink, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { type RootState } from "../../store/store";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { FaCheckCircle } from "react-icons/fa";
import logo from "../../../public/logo.png";

const Sidebar = () => {
  const userLogin = useSelector((state: RootState) => state.WhoAmiSlice);
  const user = userLogin.data?.user;
  const fullName = user?.full_name || "Guest User";
  const username = user?.username || "guest";
  const profilePhoto = user?.profilePhoto ? `${user.profilePhoto}` : "";
  const navigate = useNavigate();
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
    },

    {
      label: "Contact",
      to: "/Contact",
      iconClass: "bb-icon-phone-call",
      filledIconClass: "bb-icon-phone-call bb-icon-f",
    },
  ];

  if (userLogin.data?.user?.role === "ADMIN") {
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
    <aside className="w-full h-screen   flex flex-col justify-between">
      {/* Top - Profile Info */}

      <div>
        {/* Left: Logo + Brand */}
        <div className="flex py-[9.9px] justify-center items-center gap-2">
          <img
            src={logo}
            alt="Logo"
            className=" w-[180px] cursor-pointer"
            onClick={() => navigate("/")}
          />
        </div>
        <hr className="w-[100%]" />
        <div className="relative items-center mx-2  dark:border-gray-700 p-4 shadow-sm">
          {/* Profile Avatar */}
          {/* Profile Section */}
          <div className="flex  py-3">
            <Avatar className="w-12 h-12 ring-4 ring-white dark:ring-[#0f172a] shadow-md">
              <AvatarImage
                src={profilePhoto}
                alt={`${fullName}'s profile picture`}
                className="object-cover"
              />
              <AvatarFallback className="text-sm font-semibold bg-gray-200 dark:bg-gray-700">
                {fullName.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>

            <div className="flex flex-col ml-2 ">
              <div className="flex items-center gap-1 text-[14.4px] font-semibold text-gray-900 dark:text-white">
                <span className="font-semibold ">
                  {fullName.length > 15
                    ? `${fullName.slice(0, 15)}...`
                    : fullName}
                </span>
                <FaCheckCircle className="text-blue-500 text-md" />
              </div>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                @{username}
              </p>
            </div>
          </div>
        </div>

        <hr />

        {/* Title */}

        {/* Main Menu */}
        <nav className="flex flex-col py-4  px-2">
          {links.map((link, index) => (
            <NavLink
              key={index}
              to={link.to}
              className={({ isActive }) =>
                `group flex items-center gap-3 rounded-xl px-4 py-2 my-1 transition-all duration-300 ${
                  isActive
                    ? "bg-blue-600 text-white font-semibold shadow-sm"
                    : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
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
      <div className="pt-4 border-t dark:border-gray-700">
        <nav className="flex flex-col py-4 px-2 ">
          {bottomLinks.map((link, index) => (
            <NavLink
              key={index}
              to={link.to}
              className={({ isActive }) =>
                `group flex items-center gap-3 rounded-xl px-4 py-2 my-1 transition-all duration-300 ${
                  isActive
                    ? "bg-blue-600 text-white font-semibold shadow-sm"
                    : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
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
