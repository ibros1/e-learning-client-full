import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import type { RootState } from "../../store/store";
import { useDispatch, useSelector } from "react-redux";
import { Button } from "../ui/button";
// import { useNavigate } from "react-router-dom";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import ProfilePopupLinks from "./profilePopupLinks";
import { resetLoginState } from "../../store/slices/auth/login";

import { useNavigate } from "react-router";

const Profile = () => {
  // const navigate = useNavigate();
  const userState = useSelector((state: RootState) => state.loginSlice);
  const dispatch = useDispatch();
  const user = userState.data?.user;
  const fullName = user?.full_name || "Guest";
  const firstName = fullName.split(" ")[0];
  const username = user?.username || "guestuser";
  const profilePhoto = user?.profilePhoto ? `${user.profilePhoto}` : "";

  const logoutHandler = () => {
    dispatch(resetLoginState());
    location.reload();
  };
  const navigate = useNavigate();

  const links = [
    ...(user?.role === "ADMIN"
      ? [
          {
            icon: "bb-icon-l bb-icon-sidebar",
            linkTitle: "Dashboard",
            to: "/dashboard/admin",
          },
        ]
      : []),
    {
      icon: "bb-icon-l bb-icon-user-check",
      linkTitle: "Profile",
      to: "/my-profile",
    },

    {
      icon: "bb-icon-l bb-icon-graduation-cap",
      linkTitle: "Courses",
      to: "/courses",
    },
    {
      icon: "bb-icon-l bb-icon-checkbox",
      linkTitle: "orders",
      to: "/my-orders",
    },
    {
      icon: "bb-icon-l bb-icon-cog",
      linkTitle: "Account",
      to: "/my-settings",
    },
  ];

  return (
    <div className="hidden md:flex lg:flex xl:flex">
      <Popover>
        <PopoverTrigger
          className="cursor-pointer bg-transparent border-none shadow-none z-50
             transition duration-300 ease-out transform"
        >
          <div className="flex items-center gap-2 px-4 py-1 rounded-md  dark:bg-[#0F172A] dark:border dark:border-gray-600 hover:shadow transition duration-300">
            <span className="hidden md:hidden xl:flex font-semibold text-gray-900 dark:text-white">
              {` ${
                fullName.length > 15 ? fullName.slice(0, 18) + "..." : fullName
              }`}
            </span>
            <span className="flex md:hidden lg:flex xl:hidden font-semibold text-gray-900 dark:text-white">
              {firstName}
            </span>
            <div className="w-10 h-10">
              <Avatar className="w-10 h-10  ring-4 ring-white dark:ring-[#0f172a] shadow-md">
                <AvatarImage
                  src={profilePhoto}
                  alt="Profile"
                  className="object-cover"
                />
                <AvatarFallback>{firstName.charAt(0)}</AvatarFallback>
              </Avatar>
            </div>
          </div>
        </PopoverTrigger>

        <PopoverContent className="w-[60vw] sm:w-[50vw] md:w-[40vw] lg:w-[18rem] p-0 bg-transparent border-none shadow-none z-50">
          <div className="bg-white dark:bg-[#0F172A] border dark:border-gray-600 rounded-xl shadow-xl space-y-2">
            {/* Header Section */}
            <div
              className="flex hover:bg-gray-100 cursor-pointer dark:hover:bg-gray-800 items-center gap-4 px-4 pb-2 pt-4 border-b dark:border-gray-600"
              onClick={() => navigate("/my-profile")}
            >
              <Avatar className="w-12 h-12">
                <AvatarImage
                  src={profilePhoto}
                  alt="Profile"
                  className="object-cover"
                />
                <AvatarFallback>
                  {`${fullName.split(" ")[0]} ${fullName.split(" ")[1] || ""}`}
                </AvatarFallback>
              </Avatar>
              <div>
                <h4 className="text-sm font-semibold text-gray-900 dark:text-white">
                  {fullName}
                </h4>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  @{username}
                </p>
              </div>
            </div>

            {/* Link Menu */}
            <div className="px-2 py-1">
              {links.map((item, i) => (
                <ProfilePopupLinks key={i} {...item} />
              ))}
            </div>

            {/* Logout */}
            <div className="pt-2 pb-3 border-t dark:border-gray-600 px-3">
              <Button
                className="w-full bg-transparent bg-red-600 text-white hover:bg-gray-200 dark:hover:bg-gray-800 dark:text-white font-bold hover:text-red-600"
                onClick={logoutHandler}
              >
                Log Out
              </Button>
            </div>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
};

export default Profile;
