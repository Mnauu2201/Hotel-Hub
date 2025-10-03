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


function App() {
  const router = createBrowserRouter([
    {
      path: "/",
      element: <Layout />,
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
          path: "/room-detail",
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
          path: "/contact",
          element: <ContactPage />,
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
