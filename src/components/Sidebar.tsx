// src/components/Sidebar.tsx

import React, { useState, useRef, useEffect, useCallback } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  LayoutDashboard,
  Briefcase,
  Users,
  ClipboardList,
  Home,
} from "lucide-react";

export default function Sidebar() {
  const navigate = useNavigate();
  const location = useLocation();

  const sidebarRef = useRef<HTMLDivElement>(null);
  const [isResizing, setIsResizing] = useState(false);
  const [width, setWidth] = useState(256); // Default width (16rem)

  const minWidth = 80; // 5rem
  const maxWidth = 400; // 25rem

  const startResizing = useCallback(() => {
    setIsResizing(true);
  }, []);

  const stopResizing = useCallback(() => {
    setIsResizing(false);
  }, []);

  const resize = useCallback(
    (mouseMoveEvent: MouseEvent) => {
      if (isResizing && sidebarRef.current) {
        let newWidth =
          mouseMoveEvent.clientX -
          sidebarRef.current.getBoundingClientRect().left;

        if (newWidth < minWidth) newWidth = minWidth;
        if (newWidth > maxWidth) newWidth = maxWidth;

        setWidth(newWidth);
      }
    },
    [isResizing]
  );

  useEffect(() => {
    window.addEventListener("mousemove", resize);
    window.addEventListener("mouseup", stopResizing);
    return () => {
      window.removeEventListener("mousemove", resize);
      window.removeEventListener("mouseup", stopResizing);
    };
  }, [resize, stopResizing]);

  const isCollapsed = width < 150; // Threshold for hiding text

  const navItems = [
    {
      path: "/dashboard",
      label: "Dashboard",
      icon: <LayoutDashboard className="h-5 w-5" />,
    },
    {
      path: "/jobs",
      label: "Jobs",
      icon: <Briefcase className="h-5 w-5" />,
    },
    {
      path: "/candidates",
      label: "Candidates",
      icon: <Users className="h-5 w-5" />,
    },
    {
      path: "/assessments",
      label: "Assignments",
      icon: <ClipboardList className="h-5 w-5" />,
    },
  ];

  return (
    <motion.div
      ref={sidebarRef}
      animate={{ width }}
      transition={{ type: "spring", stiffness: 400, damping: 40 }}
      className="h-screen bg-slate-50 shadow-md flex flex-col relative"
    >
      {/* ## MODIFIED: Header is now a clickable link to homepage ## */}
      <div
        className="p-4 cursor-pointer hover:bg-slate-100 transition-colors rounded-lg m-2"
        onClick={() => navigate("/")}
      >
        <div className="flex items-center gap-3 overflow-hidden">
          <div className="bg-indigo-600 p-2 rounded-lg">
            <Home className="h-6 w-6 text-white" />
          </div>
          {!isCollapsed && (
            <div>
              <h2 className="font-bold text-lg text-slate-800 whitespace-nowrap">
                TalentFlow
              </h2>
              <p className="text-xs text-slate-500 whitespace-nowrap">
                HR Management Suite
              </p>
            </div>
          )}
        </div>
      </div>
      
      <hr className="mx-4 border-slate-200" />
      
      <nav className="flex-1 px-4 py-2 space-y-2 overflow-hidden">
        {navItems.map((item) => (
          <TooltipProvider key={item.path} delayDuration={100}>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant={
                    location.pathname.startsWith(item.path)
                      ? "default"
                      : "ghost"
                  }
                  className={`w-full flex items-center gap-3 ${
                    isCollapsed ? "justify-center" : "justify-start"
                  }`}
                  onClick={() => navigate(item.path)}
                >
                  {item.icon}
                  {!isCollapsed && (
                    <span className="text-sm font-medium whitespace-nowrap">
                      {item.label}
                    </span>
                  )}
                </Button>
              </TooltipTrigger>
              {isCollapsed && (
                <TooltipContent side="right">
                  <p>{item.label}</p>
                </TooltipContent>
              )}
            </Tooltip>
          </TooltipProvider>
        ))}
      </nav>

      <div className="mt-auto p-4">
        <hr className="mb-3 border-slate-200" />
        {!isCollapsed && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-center"
          >
            <p className="text-sm font-semibold text-slate-700">TalentFlow v1.0.0</p>
            <p className="text-xs text-slate-500">&copy; 2025 HR Solutions</p>
          </motion.div>
        )}
      </div>
      
      <div
        className="absolute top-0 right-0 h-full w-1.5 cursor-col-resize bg-transparent hover:bg-indigo-200/50 transition-colors duration-200"
        onMouseDown={startResizing}
      />
    </motion.div>
  );
}