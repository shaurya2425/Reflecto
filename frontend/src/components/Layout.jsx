import { Outlet } from "react-router-dom";
import {Navbar} from "./Navbar"; // apna Navbar import karo

export default function Layout() {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Navbar har page pe dikhega */}
      <Navbar />

      {/* Pages ka content yahan render hoga */}
      <main className="flex-1">
        <Outlet />
      </main>
    </div>
  );
}
