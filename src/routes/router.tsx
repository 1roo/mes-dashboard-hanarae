import React, { Suspense } from "react";
import { createBrowserRouter } from "react-router-dom";
import LoginPage from "../pages/LoginPage";
import PrivateLayout from "../layout/PrivateLayout";
import ProtectedRoute from "../auth/ProtectedRoute";

// const UserInfo = React.lazy(() => import("../pages/UserInfo"));

const DashBoardPage = React.lazy(() => import("../pages/DashBoardPage"));
const UserManagement = React.lazy(() => import("../pages/UserManagement"));

export const router = createBrowserRouter([
  { path: "/", element: <LoginPage /> },

  {
    element: <ProtectedRoute />,
    children: [
      {
        element: <PrivateLayout />,
        children: [
          // {
          //   path: "/userinfo",
          //   element: (
          //     <Suspense fallback={<div>로딩중</div>}>
          //       <UserInfo />
          //     </Suspense>
          //   ),
          // },
          {
            path: "/dashboard",
            element: (
              <Suspense fallback={<div>로딩중</div>}>
                <DashBoardPage />
              </Suspense>
            ),
          },
          {
            path: "/users",
            element: (
              <Suspense fallback={<div>로딩중</div>}>
                <UserManagement />
              </Suspense>
            ),
          },
        ],
      },
    ],
  },
]);
