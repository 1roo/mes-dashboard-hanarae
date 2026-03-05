import React from "react";
import { createBrowserRouter, Navigate } from "react-router-dom";

import LoginPage from "../../auth/components/LoginPage";
import PrivateLayout from "../../layout/PrivateLayout";
import ProtectedRoute from "../../auth/guards/ProtectedRoute";
import AdminRoute from "../../auth/guards/AdminRoute";
import TablePractice from "../../pages/table/TablePractice";
import Lazy from "./Lazy";

const PopPage = React.lazy(() => import("../../features/pop/PopPage"));
const PerformancePage = React.lazy(
  () => import("../../features/performance/components/PerformancePage"),
);
const WorkOrdersPage = React.lazy(
  () => import("../../features/workOrders/components/WorkOrdersPage"),
);
const DashBoardPage = React.lazy(
  () => import("../../features/dashboard/components/DashBoardPage"),
);
const UserManagementPage = React.lazy(
  () => import("../../features/users/components/UserManagementPage"),
);

export const router = createBrowserRouter([
  { path: "/", element: <Navigate to="/login" replace /> },
  { path: "/login", element: <LoginPage /> },

  {
    element: <ProtectedRoute />,
    children: [
      {
        element: <PrivateLayout />,
        children: [
          {
            path: "dashboard",
            element: (
              <Lazy>
                <DashBoardPage />
              </Lazy>
            ),
          },
          {
            path: "pop",
            element: (
              <Lazy>
                <PopPage />
              </Lazy>
            ),
          },
          {
            path: "performance",
            element: (
              <Lazy>
                <PerformancePage />
              </Lazy>
            ),
          },
          {
            path: "workOrders",
            element: (
              <Lazy>
                <WorkOrdersPage />
              </Lazy>
            ),
          },
          {
            path: "table",
            element: (
              <Lazy>
                <TablePractice />
              </Lazy>
            ),
          },

          {
            element: <AdminRoute />,
            children: [
              {
                path: "users",
                element: (
                  <Lazy>
                    <UserManagementPage />
                  </Lazy>
                ),
              },
            ],
          },

          { path: "*", element: <Navigate to="/dashboard" replace /> },
        ],
      },
    ],
  },

  { path: "*", element: <Navigate to="/login" replace /> },
]);
