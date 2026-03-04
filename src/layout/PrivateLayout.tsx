import { Outlet } from "react-router-dom";
import Header from "./Header";
import SideBar from "./SideBar";

export default function PrivateLayout() {
  return (
    <div className="flex h-screen w-full overflow-hidden bg-gray-50">
      <SideBar />

      <div className="flex flex-col flex-1 min-w-0 h-full">
        <Header />

        <main className="flex-1 min-h-0 overflow-hidden">
          <div className="h-full p-6">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}
