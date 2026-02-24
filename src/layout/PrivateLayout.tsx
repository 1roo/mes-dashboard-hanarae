import { Outlet } from "react-router-dom";
import Header from "./Header";
import SideBar from "./SideBar";

export default function PrivateLayout() {
  return (
    <div className="flex-1 flex flex-col">
      <Header />
      <div className="flex h-auto bg-gray-50">
        <SideBar />

        <main className="flex-1 p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
