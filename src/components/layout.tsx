import { ReactNode } from "react";
import Sidebar from "@/components/Sidebar"; // Corrected import path
import Navbar from "@/components/Navbar"; // Corrected import path

type LayoutProps = {
  children: ReactNode;
};

export default function Layout({ children }: LayoutProps) {
  return (
    <div className="h-screen flex bg-slate-50 text-slate-900 overflow-hidden">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Area */}
      {/* FIX: Added 'min-w-0' to prevent horizontal overflow from child elements like the Kanban board */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Navbar stays fixed */}
        <Navbar />

        {/* Scroll only inside page content */}
        <main className="flex-1 overflow-y-auto p-6">{children}</main>
      </div>
    </div>
  );
}

