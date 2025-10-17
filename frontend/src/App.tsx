import {
  createBrowserRouter,
  RouterProvider,
  Navigate,
} from "react-router-dom";
import Layout from "./layout";
import HomePage from "./pages/home";
import ContactPage from "./pages/contact";
import AboutPage from "./pages/about";
import RoomPage from "./pages/room";
import RoomDetail from "./pages/room/room.detail";
import ServicePage from "./pages/service";
import ServiceDetail from "./pages/service/service.detail";
import FaqPage from "./pages/faq";
import TeamPage from "./pages/team";
import TeamDetailPage from "./pages/team/team.detail";
import PricingPage from "./pages/pricing";
import BlogPage from "./pages/blog";
import BlogDetail from "./pages/blog/blog.detail";
import { UserProvider } from "./contexts/UserContext";
import { AuthProvider } from "./contexts/AuthContext";
// @ts-expect-error JS component
import LoginPage from "./pages/auth/LoginPage.jsx";
// @ts-expect-error JS component
import RegisterPage from "./pages/auth/RegisterPage.jsx";
// @ts-expect-error JS component
import ForgotPasswordPage from "./pages/auth/ForgotPasswordPage.jsx";
// @ts-expect-error JS component
import ResetPasswordPage from "./pages/auth/ResetPasswordPage.jsx";
// @ts-expect-error JS component
import BookingPage from "./pages/BookingPage.jsx";
// @ts-expect-error JS component
import BookingConfirmation from "./pages/BookingConfirmation.jsx";
// @ts-expect-error JS component
import MyBookings from "./pages/MyBookings.jsx";
// @ts-expect-error JS component
import MyBookingsDetail from "./pages/MyBookingsDetail.jsx";
// @ts-expect-error JS component
import ProfilePage from "./pages/ProfilePage.jsx";
import ProtectedRoute from "./components/ProtectedRoute";
import BookingManagement from "./pages/admin/BookingManagement";
import RoomManagement from "./pages/admin/RoomManagement";
import UserManagement from "./pages/admin/UserManagement";
import StatisticsReport from "./pages/admin/StatisticsReport";
import RoleManagement from "./pages/admin/RoleManagement";
import SystemSettings from "./pages/admin/SystemSettings";
import ActivityLog from "./pages/admin/ActivityLog";
import Notifications from "./pages/admin/Notifications";
import Profile from "./pages/admin/Profile";
import EditAccount from "./pages/admin/EditAccount";


function App() {
  const router = createBrowserRouter([
    {
      path: "/",
      element: <UserProvider><Layout /></UserProvider>,
      children: [
        {
          index: true,
          element: <HomePage />,
        },
        {
          path: "/about",
          element: <AboutPage />,
        },
        {
          path: "/room",
          element: <RoomPage />,
        },
        {
          path: "/room-detail/:id",
          element: <RoomDetail />,
        },
        {
          path: "/services",
          element: <ServicePage />,
        },
        {
          path: "/service-detail",
          element: <ServiceDetail />,
        },
        {
          path: "/faq",
          element: <FaqPage />,
        },
        {
          path: "/team",
          element: <TeamPage />,
        },
        {
          path: "/team-detail",
          element: <TeamDetailPage />,
        },
        {
          path: "/pricing",
          element: <PricingPage />,
        },
        {
          path: "/blog",
          element: <BlogPage />,
        },
        {
          path: "/blog-details",
          element: <BlogDetail />,
        },
        {
          path: "/booking",
          element: <BookingPage />,
        },
        {
          path: "/booking-confirmation",
          element: <BookingConfirmation />,
        },
        {
          path: "/my-bookings",
          element: <MyBookings />,
        },
        {
          path: "/my-bookings/:bookingId",
          element: <MyBookingsDetail />,
        },
        {
          path: "/contact",
          element: <ContactPage />,
        },
        {
          path: "/login",
          element: <LoginPage />,
        },
        {
          path: "/register",
          element: <RegisterPage />,
        },
        {
          path: "/forgot-password",
          element: <ForgotPasswordPage />,
        },
        {
          path: "/reset-password",
          element: <ResetPasswordPage />,
        },
        {
          path: "/profile",
          element: <ProfilePage />,
        },
      ]
    },
    {
      path: "/admin",
      element: <Navigate to="/admin/bookings" replace />,
    },
    {
      path: "/admin/bookings",
      element: (
        <ProtectedRoute requiredRole="ROLE_ADMIN">
          <BookingManagement />
        </ProtectedRoute>
      ),
    },
    {
      path: "/admin/rooms",
      element: (
        <ProtectedRoute requiredRole="ROLE_ADMIN">
          <RoomManagement />
        </ProtectedRoute>
      ),
    },
    {
      path: "/admin/users",
      element: (
        <ProtectedRoute requiredRole="ROLE_ADMIN">
          <UserManagement />
        </ProtectedRoute>
      ),
    },
    {
      path: "/admin/reports",
      element: (
        <ProtectedRoute requiredRole="ROLE_ADMIN">
          <StatisticsReport />
        </ProtectedRoute>
      ),
    },
    {
      path: "/admin/roles",
      element: (
        <ProtectedRoute requiredRole="ROLE_ADMIN">
          <RoleManagement />
        </ProtectedRoute>
      ),
    },
    {
      path: "/admin/settings",
      element: (
        <ProtectedRoute requiredRole="ROLE_ADMIN">
          <SystemSettings />
        </ProtectedRoute>
      ),
    },
    {
      path: "/admin/activity-log",
      element: (
        <ProtectedRoute requiredRole="ROLE_ADMIN">
          <ActivityLog />
        </ProtectedRoute>
      ),
    },
    {
      path: "/admin/notifications",
      element: (
        <ProtectedRoute requiredRole="ROLE_ADMIN">
          <Notifications />
        </ProtectedRoute>
      ),
    },
    {
      path: "/admin/profile",
      element: (
        <ProtectedRoute requiredRole="ROLE_ADMIN">
          <Profile />
        </ProtectedRoute>
      ),
    },
    {
      path: "/admin/edit-account",
      element: (
        <ProtectedRoute requiredRole="ROLE_ADMIN">
          <EditAccount />
        </ProtectedRoute>
      ),
    },
  ]);
  return (
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  );
}

export default App
