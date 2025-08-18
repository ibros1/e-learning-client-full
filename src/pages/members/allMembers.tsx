import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import type { AppDispatch, RootState } from "../../store/store";
import { listUsersFn } from "../../store/slices/auth/user/getAllUsers";

const MembersPage = () => {
  const dispatch = useDispatch<AppDispatch>();
  useEffect(() => {
    dispatch(listUsersFn());
  }, [dispatch]);

  const allUsersState = useSelector((state: RootState) => state.listUsersSlice);
  const members = allUsersState.data?.users ?? [];
  const loginState = useSelector((state: RootState) => state.loginSlice);
  const user = loginState.data?.user;
  const navigate = useNavigate();

  // State for sidebar and filters
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState("ALL");
  const [activeFilter, setActiveFilter] = useState("ALL");
  const [sortOption, setSortOption] = useState("NEWEST");

  // Filter and sort members
  const filteredMembers = members.filter((member) => {
    const matchesSearch =
      member.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      member.username.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesRole = roleFilter === "ALL" || member.role === roleFilter;
    const matchesActive =
      activeFilter === "ALL" ||
      (activeFilter === "ACTIVE" && member.is_active) ||
      (activeFilter === "INACTIVE" && !member.is_active);

    return matchesSearch && matchesRole && matchesActive;
  });

  const sortedMembers = [...filteredMembers].sort((a, b) => {
    if (sortOption === "NEWEST") {
      return (
        new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      );
    } else if (sortOption === "OLDEST") {
      return (
        new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
      );
    } else if (sortOption === "NAME_AZ") {
      return a.full_name.localeCompare(b.full_name);
    } else {
      return b.full_name.localeCompare(a.full_name);
    }
  });

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);
  const clearFilters = () => {
    setSearchTerm("");
    setRoleFilter("ALL");
    setActiveFilter("ALL");
  };

  // Haddii user aan la login-gareyn, muuji div w-full oo qoraal ku jira
  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-white dark:bg-gray-900 p-6 w-full">
        <p className="text-center text-gray-500 dark:text-gray-400 text-lg font-medium">
          You must be logged in to see members.
        </p>
      </div>
    );
  }

  if (!members.length) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-white dark:bg-gray-900 p-6">
        <p className="text-center text-gray-500 dark:text-gray-400 text-lg font-medium">
          No members found!
        </p>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Mobile sidebar toggle button */}
      <button
        onClick={toggleSidebar}
        className="fixed z-20 top-4 right-4 lg:hidden bg-blue-600 text-white p-3 rounded-full shadow-lg hover:bg-blue-700 transition-all"
        aria-label="Toggle filters"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-6 w-6"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"
          />
        </svg>
      </button>

      {/* Overlay for mobile sidebar */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-20 lg:hidden"
          onClick={toggleSidebar}
        ></div>
      )}

      {/* Main Content */}
      <div className="flex-1 px-4 py-8 sm:px-6 lg:px-12 max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-10 gap-4">
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-wide text-gray-900 dark:text-white">
            Members
          </h1>
          <div className="flex items-center gap-3">
            <button
              onClick={toggleSidebar}
              className="hidden lg:flex items-center gap-2 px-4 py-2 bg-gray-200 hover:bg-gray-300 dark:bg-gray-800 dark:hover:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-lg transition-colors"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"
                />
              </svg>
              Filters
            </button>
            <p className="text-gray-600 dark:text-gray-400 text-sm sm:text-base">
              Showing {sortedMembers.length}{" "}
              {sortedMembers.length === 1 ? "member" : "members"}
            </p>
          </div>
        </div>

        <div
          className={`grid grid-cols-1 gap-6 sm:gap-8
      sm:grid-cols-2
      md:grid-cols-3
      lg:grid-cols-3
      xl:grid-cols-3
      ${sortedMembers.length === 0 ? "justify-center" : ""}
     `}
        >
          {sortedMembers.length > 0 ? (
            sortedMembers.map((m) => (
              <div
                key={m.id}
                className="flex flex-col bg-white dark:bg-gray-800 rounded-2xl shadow-lg hover:shadow-2xl transition-shadow duration-300 overflow-hidden"
              >
                {/* Top Section - Made more responsive */}
                <div className="relative p-4 sm:p-6 pt-8 sm:pt-10 flex flex-col items-center text-center">
                  {/* Menu icon */}
                  <button
                    className="absolute right-3 top-3 sm:right-4 sm:top-4 text-gray-400 hover:text-gray-700 dark:hover:text-white rounded-full p-1 transition-colors"
                    aria-label="More options"
                  >
                    <li className="bb-icon-ellipsis-h bb-icon-l text-2xl sm:text-3xl"></li>
                  </button>

                  {/* Avatar - Made responsive */}
                  <div
                    className="relative cursor-pointer mb-3"
                    onClick={() => navigate(`/members/${m.id}`)}
                  >
                    <img
                      src={`${m.profilePhoto}`}
                      alt={m.full_name}
                      loading="lazy"
                      className="w-24 h-24 sm:w-32 sm:h-32 md:w-36 md:h-36 rounded-full object-cover ring-4 ring-white dark:ring-gray-900 shadow-md"
                    />
                    {/* Active status with pulse - Position fixed */}
                    <span
                      className={`absolute top-0 right-5 sm:right-6 w-4 h-4 sm:w-5 sm:h-5 rounded-full border-2 border-white dark:border-gray-900 ${
                        m.is_active
                          ? "bg-green-500 animate-pulse shadow-lg"
                          : "bg-gray-400"
                      }`}
                      title={m.is_active ? "Active" : "Inactive"}
                    />
                  </div>

                  {/* Role Badge - Made responsive */}
                  <span
                    className={`z-10 -mt-3 text-xs font-semibold px-3 py-1 rounded-full shadow-md uppercase tracking-wide select-none ${
                      m.role === "ADMIN"
                        ? "bg-gradient-to-r from-red-600 to-red-700 text-white shadow-red-700"
                        : "bg-blue-600 text-white dark:bg-gray-700 dark:text-white"
                    }`}
                  >
                    {m.role}
                  </span>

                  {/* Name */}
                  <h2
                    className="mt-3 text-lg sm:text-xl md:text-xl font-semibold text-gray-900 dark:text-white truncate max-w-full cursor-pointer px-2"
                    onClick={() => navigate(`/members/${m.id}`)}
                  >
                    {m.full_name}
                  </h2>

                  {/* Username */}
                  <p className="mt-1 text-sm text-gray-600 dark:text-gray-400 truncate max-w-full px-2">
                    @{m.username}
                  </p>

                  {/* Joined Date */}
                  <p className="mt-2 text-xs text-gray-400 dark:text-gray-500 font-mono">
                    Joined{" "}
                    {new Date(m.created_at).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "short",
                      day: "2-digit",
                    })}
                  </p>
                </div>

                {/* Footer Buttons */}
                {user?.id !== m.id && (
                  <div
                    className="border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 px-4 py-3 sm:px-6 sm:py-4
                flex flex-col gap-2 sm:gap-3 text-sm"
                  >
                    <button className="w-full bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-900 dark:text-white rounded-full px-4 py-1.5 sm:px-6 sm:py-2 font-semibold shadow-md transition duration-300">
                      Message
                    </button>
                  </div>
                )}

                {/* View Profile */}
                <div className="border-t border-gray-200 dark:border-gray-700 text-center px-4 py-2 sm:px-6 sm:py-3 bg-white dark:bg-gray-800">
                  <Link
                    to={`/members/${m.id}`}
                    className="text-blue-700 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-600 text-sm sm:text-base font-semibold"
                  >
                    View Profile &rarr;
                  </Link>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-full flex flex-col items-center justify-center py-12 sm:py-20">
              <div className="bg-gray-200 dark:bg-gray-700 rounded-full p-3 sm:p-4 mb-3 sm:mb-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-10 w-10 sm:h-12 sm:w-12 text-gray-500 dark:text-gray-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <h3 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white mb-2">
                No matching members
              </h3>
              <p className="text-gray-600 dark:text-gray-400 max-w-xs sm:max-w-md text-center text-sm sm:text-base">
                Try adjusting your filters or search term to find what you're
                looking for.
              </p>
              <button
                onClick={clearFilters}
                className="mt-4 sm:mt-6 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors text-sm sm:text-base"
              >
                Clear All Filters
              </button>
            </div>
          )}
        </div>
      </div>
      {/* Sidebar */}
      <div
        className={`fixed lg:sticky top-0 right-0 h-full w-80 z-30 bg-white dark:bg-gray-800 shadow-xl lg:shadow-none transform transition-transform duration-300 ease-in-out ${
          isSidebarOpen ? "translate-x-0" : "translate-x-full lg:translate-x-0"
        } lg:block overflow-y-auto`}
      >
        <div className="p-6 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
          <h2 className="text-xl font-bold text-gray-800 dark:text-white">
            Filter Members
          </h2>
          <button
            onClick={toggleSidebar}
            className="lg:hidden text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Search */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Search Members
            </label>
            <div className="relative">
              <input
                type="text"
                placeholder="Search by name or username..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <div className="absolute left-3 top-2.5 text-gray-400 dark:text-gray-500">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </div>
            </div>
          </div>

          {/* Role Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Role
            </label>
            <div className="space-y-2">
              {["ALL", "ADMIN", "STUDENT"].map((role) => (
                <div key={role} className="flex items-center">
                  <input
                    type="radio"
                    id={`role-${role}`}
                    name="roleFilter"
                    checked={roleFilter === role}
                    onChange={() => setRoleFilter(role)}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500"
                  />
                  <label
                    htmlFor={`role-${role}`}
                    className="ml-3 text-sm text-gray-700 dark:text-gray-300 capitalize"
                  >
                    {role.toLowerCase()}
                  </label>
                </div>
              ))}
            </div>
          </div>

          {/* Active Status Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Active Status
            </label>
            <div className="space-y-2">
              {["ALL", "ACTIVE", "INACTIVE"].map((status) => (
                <div key={status} className="flex items-center">
                  <input
                    type="radio"
                    id={`status-${status}`}
                    name="activeFilter"
                    checked={activeFilter === status}
                    onChange={() => setActiveFilter(status)}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500"
                  />
                  <label
                    htmlFor={`status-${status}`}
                    className="ml-3 text-sm text-gray-700 dark:text-gray-300 capitalize"
                  >
                    {status.toLowerCase()}
                  </label>
                </div>
              ))}
            </div>
          </div>

          {/* Sort Options */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Sort By
            </label>
            <select
              value={sortOption}
              onChange={(e) => setSortOption(e.target.value)}
              className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent py-2 px-3"
            >
              <option value="NEWEST">Newest First</option>
              <option value="OLDEST">Oldest First</option>
              <option value="NAME_AZ">Name (A-Z)</option>
              <option value="NAME_ZA">Name (Z-A)</option>
            </select>
          </div>

          {/* Results count and clear button */}
          <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-700">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Showing <span className="font-bold">{sortedMembers.length}</span>{" "}
              of {members.length} members
            </p>
            <button
              onClick={clearFilters}
              className="px-3 py-1.5 text-sm bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200 rounded-lg transition-colors"
            >
              Clear All
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MembersPage;
