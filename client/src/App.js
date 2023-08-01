
import {
  createBrowserRouter,
  RouterProvider,
  Outlet,
} from "react-router-dom";
import Home from "./pages/Home";
import Register from "./pages/Register";
import Login from "./pages/Login";
import Single from "./pages/Single";
import Write from "./pages/Write";
import Navbar from "./Components/Navbar"
import AdminNavbar from "./Components/Adminbar"
import Footer from "./Components/Footer"
import Admin from "./pages/Admin"

const Layout = () => {
  return (
    <>
      <Navbar />
      <Outlet />
      <Footer />
    </>
  )
}

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      
      {
        path: "/",
        element: <Home />
      },      
      {
        path: "/post/:id",
        element: <Single />
      },
      {
        path: "/Write",
        element: <Write />
      }
    ]

  },
  {
    path: "/admin",
    element: [ <AdminNavbar />,<Admin />]
  },

  {
    path: "/register",
    element: <Register />
  },

  {
    path: "/login",
    element: <Login />
  }
]);


function App() {
  return (
    <div>
      <RouterProvider router={router} />
    </div>
  );
}

export default App;
