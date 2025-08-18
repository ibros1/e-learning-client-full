import Header from "../components/header/Header";
import { Outlet, useLocation } from "react-router";
import Footer from "../components/footer/footer";
import Sidebar from "../components/sidebar/sidebar";
import { useDispatch, useSelector } from "react-redux";
import { type AppDispatch, type RootState } from "../store/store";
import { useEffect } from "react";
import { WhoAmiFn } from "../store/slices/auth/user/getMe";

const MainPage = () => {
  const location = useLocation();
  const isLoginPage = location.pathname === "/login";
  const isLoginState = useSelector((state: RootState) => state.loginSlice);
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    if (isLoginState.data?.isSuccess) {
      dispatch(WhoAmiFn());
    }
  }, [dispatch, isLoginState]);
  const isContinueCoursePage = location.pathname.startsWith(
    "/my-courses/continue/"
  );

  if (isLoginPage) {
    return (
      <div>
        <Header />
        <Outlet />
      </div>
    );
  }

  return (
    <div className="bg-white text-black dark:bg-[#091025] dark:text-white transition-colors duration-300">
      {/* Header offset */}
      {isLoginState.data?.isSuccess ? (
        <div className={`ml-0 ${isContinueCoursePage ? "" : "xl:ml-72"}`}>
          <Header />
        </div>
      ) : (
        <div className="ml-0 ">
          <Header />
        </div>
      )}

      {/* Layout */}
      <div className="flex w-full h-full">
        {/* Sidebar - Haddii aysan ahayn continue course page iyo user logged in, muuji */}
        {isLoginState.data?.isSuccess && !isContinueCoursePage && (
          <div className="hidden xl:flex fixed top-0 left-0 w-72 h-screen overflow-y-auto scrollbar-hide bg-white dark:bg-[#0F172A]">
            <Sidebar />
          </div>
        )}

        {/* Main content area */}
        <div
          className={`flex-1 min-h-screen flex flex-col ${
            isLoginState.data?.isSuccess && !isContinueCoursePage
              ? "xl:ml-72"
              : ""
          }`}
        >
          <main className="flex-1 overflow-y-auto dark:bg-[#091025]">
            <Outlet />
          </main>
          <Footer />
        </div>
      </div>
    </div>
  );
};

export default MainPage;
