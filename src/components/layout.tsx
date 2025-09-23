import { ReactNode, useState } from "react";
import Sidebar from "./Sidebar";
import Navbar from "./Navbar";

type LayoutProps = {
  children: ReactNode;
};

export default function Layout({ children }: LayoutProps) {
  type Route = "dashboard" | "jobs" | "candidates" | "assignments";
  const [route, setRoute] = useState<Route>("dashboard");
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className="h-screen flex bg-slate-50 text-slate-900 overflow-hidden">
      {/* Sidebar */}
      <Sidebar
        route={route}
        setRoute={setRoute}
        collapsed={collapsed}
        setCollapsed={setCollapsed}
      />

      {/* Main Area */}
      <div className="flex-1 flex flex-col">
        {/* Navbar stays fixed */}
        <Navbar />

        {/* ✅ Scroll only inside page content */}
        <main className="flex-1 overflow-y-auto p-6">{children}</main>
      </div>
    </div>
  );
}
