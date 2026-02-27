import React, { Suspense } from "react";
import { createBrowserRouter } from "react-router-dom";
import LoginPage from "../pages/login/LoginPage";
import PrivateLayout from "../layout/PrivateLayout";
import ProtectedRoute from "../auth/ProtectedRoute";
import AdminRoute from "../auth/AdminRoute";
import Spinner from "../shared/ui/Spinner";

const PerformancePage = React.lazy(
  () => import("../pages/performance/PerformancePage"),
);
const WorkOrdersPage = React.lazy(
  () => import("../pages/workOrders/WorkOrdersPage"),
);
const DashBoardPage = React.lazy(
  () => import("../pages/dashboard/DashBoardPage"),
);
const UserManagementPage = React.lazy(
  () => import("../pages/users/UserManagementPage"),
);

export const router = createBrowserRouter([
  { path: "/", element: <LoginPage /> },

  {
    element: <ProtectedRoute />,
    children: [
      {
        element: <PrivateLayout />,
        children: [
          {
            path: "/performance",
            element: (
              <Suspense fallback={<Spinner />}>
                <PerformancePage />
              </Suspense>
            ),
          },
          {
            path: "/workOrders",
            element: (
              <Suspense fallback={<Spinner />}>
                <WorkOrdersPage />
              </Suspense>
            ),
          },
          {
            path: "/dashboard",
            element: (
              <Suspense fallback={<Spinner />}>
                <DashBoardPage />
              </Suspense>
            ),
          },
          {
            element: <AdminRoute />,
            children: [
              {
                path: "/users",
                element: (
                  <Suspense fallback={<Spinner />}>
                    <UserManagementPage />
                  </Suspense>
                ),
              },
            ],
          },
        ],
      },
    ],
  },
]);
