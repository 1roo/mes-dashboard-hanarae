import { Outlet } from "react-router-dom";
import Header from "./Header";
import SideBar from "./SideBar";

export default function PrivateLayout() {
  return (
    <div className="flex-1 flex flex-col ">
      <Header />
      <div className="flex overflow-hidden flex-1 ">
        <SideBar />

        <main className="flex-1 p-6 bg-gray-50 overflow-hidden ">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
