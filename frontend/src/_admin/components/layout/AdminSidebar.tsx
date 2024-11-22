import React, { useState } from "react";
import { adminRoutes } from "../../../constants/constants";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { cn } from "../../../lib/utils";
import { LogOut } from "lucide-react";
import { useAuth } from "../../../context/UseAuth";

const AdminSidebar: React.FC = () => {
  const { logout, appliesLength } = useAuth();

  const location = useLocation();
  const navigate = useNavigate();

  const [isLoggingOut, setIsLoggingOut] = useState<boolean>(false);

  const handleLogout = () => {
    setIsLoggingOut(true);

    try {
      logout();

      navigate("/");
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoggingOut(false);
    }
  };

  return (
    <div className="fixed left-0 h-screen w-72 z-40 bg-white custom-shadow flex flex-col justify-between">
      <div className="w-full h-full flex flex-col gap-y-2 mt-24 px-4">
        {adminRoutes.map((route) => {
          const isActive = location.pathname === route.href;

          return (
            <Link
              to={route.href}
              key={route.label}
              className={cn(
                "w-full rounded-md px-3 py-2.5 flex items-center justify-between transition-all",
                isActive
                  ? "bg-primary text-white"
                  : "bg-white hover:bg-primary/10 text-gray-950"
              )}
            >
              <div className="flex items-center gap-x-3">
                <route.icon size={21} />
                <p className="text-base font-semibold">{route.label}</p>
              </div>
              {route.href === "/admin/dashboard/applies" && (
                <div
                  className={cn(
                    "size-5 flex items-center justify-center font-semibold text-sm rounded-full transition-all",
                    isActive ? "bg-white primary-text" : "bg-primary text-white"
                  )}
                >
                  {appliesLength}
                </div>
              )}
            </Link>
          );
        })}
      </div>
      <div className="w-full flex flex-col gap-y-4 pb-6 px-4">
        <div className="w-full h-px bg-neutral-200" />
        <button
          onClick={handleLogout}
          disabled={isLoggingOut}
          className="text-gray-950 font-semibold text-base w-full flex items-center justify-center gap-x-3 py-2.5 hover:opacity-80 disabled:opacity-40 transition-all"
        >
          <LogOut size={21} />
          Logout
        </button>
      </div>
    </div>
  );
};

export default AdminSidebar;
