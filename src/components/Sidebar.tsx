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

// --- INLINE STYLES FOR ANIMATION ---
const Style = () => (
    <style>{`
        .nav-container {
            position: relative;
            overflow: hidden;
        }
        .nav-container::before {
            content: '';
            position: absolute;
            top: var(--mouse-y, 0px);
            left: var(--mouse-x, 0px);
            width: 300px;
            height: 300px;
            background: radial-gradient(circle, rgba(20, 184, 166, 0.15) 0%, rgba(20, 184, 166, 0) 70%);
            border-radius: 50%;
            transform: translate(-50%, -50%);
            opacity: 0;
            transition: opacity 0.3s ease;
            pointer-events: none;
            z-index: 1;
        }
        .nav-container:hover::before {
            opacity: 1;
        }
        .nav-button {
           position: relative;
           z-index: 2;
        }
        .resizer {
            position: absolute; top: 0; right: 0; height: 100%; width: 5px;
            cursor: col-resize; background-color: transparent; z-index: 10;
            transition: background-color 0.2s ease;
        }
        .resizer:hover {
             background-color: rgba(20, 184, 166, 0.2);
        }
    `}</style>
);


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
      path: "/assignments",
      label: "Assignments",
      icon: <ClipboardList className="h-5 w-5" />,
    },
  ];

  const handleMouseMove = (e: React.MouseEvent<HTMLElement>) => {
    const nav = e.currentTarget;
    const rect = nav.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    nav.style.setProperty('--mouse-x', `${x}px`);
    nav.style.setProperty('--mouse-y', `${y}px`);
  };

  return (
    <>
      <Style />
      <motion.div
        ref={sidebarRef}
        animate={{ width }}
        transition={{ type: "spring", stiffness: 400, damping: 40 }}
        className="h-screen bg-slate-50 shadow-md flex flex-col relative"
      >
        <div
          className="p-4 cursor-pointer hover:bg-slate-100 transition-colors rounded-lg m-2"
          onClick={() => navigate("/")}
        >
          <div className="flex items-center gap-3 overflow-hidden">
            <div className="p-2 rounded-lg" style={{ background: 'linear-gradient(135deg, #14b8a6 0%, #0d9488 100%)' }}>
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
        
        <nav 
          className="nav-container flex-1 px-4 py-2 space-y-2 overflow-hidden"
          onMouseMove={handleMouseMove}
        >
          {navItems.map((item) => (
            <TooltipProvider key={item.path} delayDuration={100}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    className={`nav-button w-full flex items-center gap-3 ${
                      isCollapsed ? "justify-center" : "justify-start"
                    } ${location.pathname.startsWith(item.path) ? "sidebar-selected" : ""}`}
                    style={
                      location.pathname.startsWith(item.path)
                        ? {
                            background: 'linear-gradient(90deg, #14b8a6 0%, #0d9488 100%)',
                            color: '#fff',
                            fontWeight: 600,
                          }
                        : undefined
                    }
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
          {!isCollapsed && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="text-center"
            >
              <p className="text-sm font-semibold" style={{ color: '#0b0b0bff' }}>TalentFlow v1.0.0</p>
              <p className="text-xs" style={{ color: '#050505ff' }}>&copy; 2025 HR Solutions</p>
            </motion.div>
          )}
        </div>
        
        <div
          className="resizer"
          style={{ background: 'transparent' }}
          onMouseDown={startResizing}
        />
      </motion.div>
    </>
  );
}

