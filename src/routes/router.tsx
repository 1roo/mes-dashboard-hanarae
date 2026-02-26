import React, { Suspense } from "react";
import { createBrowserRouter } from "react-router-dom";
import LoginPage from "../pages/login/LoginPage";
import PrivateLayout from "../layout/PrivateLayout";
import ProtectedRoute from "../auth/ProtectedRoute";
import AdminRoute from "../auth/AdminRoute";

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
              <Suspense fallback={<div>로딩중</div>}>
                <PerformancePage />
              </Suspense>
            ),
          },
          {
            path: "/workOrders",
            element: (
              <Suspense fallback={<div>로딩중</div>}>
                <WorkOrdersPage />
              </Suspense>
            ),
          },
          {
            path: "/dashboard",
            element: (
              <Suspense fallback={<div>로딩중</div>}>
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
                  <Suspense fallback={<div>로딩중</div>}>
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
