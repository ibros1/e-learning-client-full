import { Outlet, useLocation, useNavigate } from "react-router";

import AdminHeader from "../../../components/header/adminHeader";
import ResponsiveAdminSidebar from "./adminSideBar";
// import { useEffect } from "react";
import { useSelector } from "react-redux";
import type { RootState } from "../../../store/store";
import { Button } from "../../../components/ui/button";
import Footer from "../../../components/footer/footer";
import { useEffect } from "react";

const AdminDashboard = () => {
  const logInstate = useSelector((state: RootState) => state.loginSlice);
  const userData = logInstate.data?.user;
  const navigate = useNavigate();

  const location = useLocation();

  useEffect(() => {
    if (!userData || userData.role !== "ADMIN") {
      navigate("/");
    }
    return;
  }, [navigate, userData]);

  useEffect(() => {
    if (location.pathname === "/dashboard") {
      navigate("/dashboard/admin");
    }
  }, [navigate]);
  return !userData || logInstate.data?.user.role !== "ADMIN" ? (
    <div className="flex flex-col items-center justify-center min-h-screen px-6 text-center bg-gray-100 dark:bg-gray-900">
      <h1 className="text-4xl font-bold text-red-600 mb-6">Access Denied 🚫</h1>
      <p className="text-lg text-gray-700 dark:text-gray-300 mb-6">
        You don't have permission to view this page.
      </p>
      <Button variant="destructive" size="lg" onClick={() => navigate("/")}>
        Return to Homepage
      </Button>
    </div>
  ) : (
    <div className="text-black dark:black dark:text-white transition-colors duration-300 ">
      <div className="w-full xl:pl-72 dark:black">
        <AdminHeader />
      </div>
      <div className=" hidden lg:hidden xl:flex    fixed top-0 left-0 xl:w-72 h-screen overflow-y-auto scrollbar-hide bg-white dark:bg-[#0F172A] text-gray-900 dark:text-white shadow-md p-0 border-r border-gray-200 dark:border-gray-700]">
        <ResponsiveAdminSidebar />
      </div>
      <div className="flex-1 min-h-screen xl:ml-72">
        <Outlet />
      </div>
      <div className="xl:ml-72">
        <Footer />
      </div>
    </div>
  );
};

export default AdminDashboard;
