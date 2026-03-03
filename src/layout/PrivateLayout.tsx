import { Outlet } from "react-router-dom";
import Header from "./Header";
import SideBar from "./SideBar";

export default function PrivateLayout() {
  return (
    <div className="h-screen flex flex-col">
      <Header />

      <div className="flex flex-1 min-h-0 overflow-hidden">
        <SideBar />

        <main className="flex-1 min-h-0 bg-gray-50 overflow-hidden">
          <div className="h-full min-h-0 p-6 overflow-hidden">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}
