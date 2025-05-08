import { createBrowserRouter } from "react-router-dom";
import { lazy, Suspense } from "react";
import App from "../App";
import PageLoader from "../components/PageLoader";
import { AuthLayout } from "../components";

const Home = lazy(() => import("../pages/Home"));
const Signup = lazy(() => import("../components/Signup"));
const Login = lazy(() => import("../components/Login"));
const ForgetPassword = lazy(() => import("../components/ForgetPassword"));
const EmployeeDashboard = lazy(() => import("../pages/EmployeeDashboard"));
const AdminDashboard = lazy(() => import("../pages/AdminDashboard"));
const LeadComponent = lazy(() => import("../pages/LeadComponent"));

// Suspense Wrapper with proper PageLoader
const withSuspense = (Component) => (
  <Suspense fallback={<PageLoader />}>
    {Component}
  </Suspense>
);

export const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    // errorElement: withSuspense(<NotFoundPage />),
    children: [
      {
        path: "/",
        element: withSuspense(<Home />)
      },
      {
        path: "/signup",
        element: withSuspense(
          <AuthLayout authentication={false}>
            <Signup />
          </AuthLayout>
        )
      },
      {
        path: "/login",
        element: withSuspense(
          <AuthLayout authentication={false}>
            <Login />
          </AuthLayout>
        )
      },
      {
        path: "/forgot-password",
        element: withSuspense(
          <AuthLayout authentication={false}>
            <ForgetPassword />
          </AuthLayout>
        )
      },
      {
        path: "/e-dashboard",
        element: withSuspense(
          <AuthLayout authentication={true}>
            <EmployeeDashboard />
          </AuthLayout>
        )
      },
      {
        path: "/admin-dashboard",
        element: withSuspense(
          <AuthLayout authentication={true}>
            <AdminDashboard />
          </AuthLayout>
        )
      },
      {
        path: "/leads",
        element: withSuspense(
          <AuthLayout authentication={true}>
            <LeadComponent />
          </AuthLayout>
        )
      }
    ]
  }
]);