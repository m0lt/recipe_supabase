import { Outlet } from "react-router";
import Header from "../components/header/Header";

export default function Layout() {
  return (
    <div>
      <Header />
      <Outlet />
    </div>
  );
}
