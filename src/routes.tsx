import { createBrowserRouter } from "react-router";
import MainPage from "./pages/mainPage";
import Home from "./pages/homePage/homePage";
import Login from "./pages/auth/login";

import Settings from "./pages/dashboard/settings";

import Register from "./pages/auth/register";
import MyProfile from "./components/Profile/myProfile";
import AdminDashboard from "./admin/layouts/adminDashboard";
import MainDashboard from "./admin/layouts/main";
import NotFound from "./pages/notFound";
import AdminCourses from "./admin/pages/courses";
import Lessons from "./admin/pages/lessons";
import Chapters from "./admin/pages/chapters";
import CoursesPage from "./pages/courses/AllCourses";
import CourseDetailPage from "./pages/courses/CourseDetail";
import ContinueCourse from "./pages/courses/continueCourse";
import MyCourses from "./pages/courses/myCourses";
import CheckoutPage from "./pages/courses/checkOut";
import Enrollements from "./admin/pages/enrollements";
import SuccessPayment from "./pages/successPayment/successPayment";
import MyOrder from "./pages/order/MyOrder";
import MembersPage from "./pages/members/allMembers";
import GetOneMemberPage from "./pages/members/getOneMember";
import UsersAdmins from "./admin/pages/users";
import GetOneUser from "./admin/components/users/getOneUser";
import Contact from "./pages/contact";
import { Payments } from "./admin/pages/payments";
import ProtectedAdminRoute from "./admin/components/protectedAdmin/ProtectedAdminRoute";
import Logout from "./pages/logout";
import MyCertificates from "./pages/myCertificates";
import Reports from "./admin/pages/reports";
export const mainRoter = createBrowserRouter([
  {
    path: "/",
    element: <MainPage />,
    children: [
      { index: true, element: <Home /> },
      { path: "/login", element: <Login /> },
      { path: "/register", element: <Register /> },
      { path: "/courses", element: <CoursesPage /> },
      { path: "/my-courses", element: <MyCourses /> },
      { path: "/courses/:courseId", element: <CourseDetailPage /> },
      { path: "/checkout", element: <CheckoutPage /> },
      { path: "/checkout/confirm", element: <SuccessPayment /> },
      {
        path: "/logout",
        element: <Logout />,
      },
      {
        path: "/my-courses/continue/:courseId",
        element: <ContinueCourse />,
      },
      {
        path: "/my-courses/continue/:courseId/:lessonId",
        element: <ContinueCourse />,
      },
      {
        path: "/members/:userId",
        element: <GetOneMemberPage />,
      },
      { path: "/my-settings", element: <Settings /> },
      { path: "/my-profile", element: <MyProfile /> },
      { path: "/members", element: <MembersPage /> },
      { path: "/certificates", element: <MyCertificates /> },
      { path: "/diploma", element: <h2>Diploma</h2> },
      { path: "/downloads", element: <h2>Downloads</h2> },
      {
        path: "/my-orders",
        element: <MyOrder />,
      },
      {
        path: "*",
        element: <NotFound />,
      },
      {
        path: "/Contact",
        element: <Contact />,
      },
    ],
  },

  {
    path: "/dashboard",
    element: (
      <ProtectedAdminRoute>
        <AdminDashboard />
      </ProtectedAdminRoute>
    ),
    children: [
      {
        path: "/dashboard/admin",
        index: true,
        element: <MainDashboard />,
      },
      {
        path: "/dashboard/courses",
        element: <AdminCourses />,
      },
      {
        path: "/dashboard/chapters",
        element: <Chapters />,
      },
      {
        path: "/dashboard/lessons",
        element: <Lessons />,
      },
      {
        path: "/dashboard/enrollments",
        element: <Enrollements />,
      },
      {
        path: "/dashboard/payments",
        element: <Payments />,
      },
      {
        path: "/dashboard/students",
        element: <UsersAdmins />,
      },
      {
        path: "/dashboard/students/:userId",
        element: <GetOneUser />,
      },
      {
        path: "/dashboard/reports",
        element: <Reports />,
      },
      {
        path: "*",
        element: <NotFound />,
      },
    ],
  },
]);
