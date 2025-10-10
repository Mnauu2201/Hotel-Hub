import {
  createBrowserRouter,
  RouterProvider,
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
      ]
    },
  ]);
  return (
    <>
      <RouterProvider router={router} />
    </>
  );
}

export default App
