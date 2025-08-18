import type { FC } from "react";
import { NavLink } from "react-router-dom";

interface linkItemProps {
  icon: string;
  to: string;
  linkTitle: string;
}

const ProfilePopupLinks: FC<linkItemProps> = ({ icon, to, linkTitle }) => {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        `flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-all duration-300
        ${
          isActive
            ? "bg-indigo-100 text-indigo-700 dark:bg-gray-700 dark:text-white"
            : "text-gray-700 dark:text-gray-300"
        }
        hover:bg-indigo-100 dark:hover:bg-gray-800`
      }
    >
      <i className={`${icon} text-2xl`} />
      <span className=" text-md">{linkTitle}</span>
    </NavLink>
  );
};

export default ProfilePopupLinks;
