import React, { useState } from "react";
import { useAuth } from "../../context/useAuth";
import { adminRoutes } from "../../constants/constants";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { cn } from "../../lib/utils";
import { IoMdArrowDropdown } from "react-icons/io";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { AlignJustify, Loader2, X } from "lucide-react";
import { Button } from "../ui/button";

const Navbar: React.FC = () => {
  const { admin, logout, isPending } = useAuth();

  const navigate = useNavigate();
  const location = useLocation();

  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [isMobileOpen, setIsMobileOpen] = useState<boolean>(false);
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
    <nav className="fixed top-0 w-full flex flex-col z-50">
      <div className="w-full flex items-center justify-between gap-x-4 bg-primary py-5 px-12">
        <h2 className="text-white font-semibold text-xl">Foodora Admin</h2>
        <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
          <DropdownMenuTrigger className="flex items-center gap-x-2 outline-none">
            {isPending ? (
              <Loader2 size={17} className="text-white/75 animate-spin" />
            ) : (
              <>
                <span className="text-white font-normal text-base">
                  {admin?.name}
                </span>
                <IoMdArrowDropdown
                  size={23}
                  className={cn(
                    "text-white mt-0.5 transition duration-300",
                    isOpen && "rotate-[180deg]"
                  )}
                />
              </>
            )}
          </DropdownMenuTrigger>
          <DropdownMenuContent className="shadow-sm rounded-md shadow-black/10 flex items-center justify-center py-2 px-0">
            <button
              type="button"
              onClick={handleLogout}
              disabled={isLoggingOut}
              className="text-gray-950 hover:bg-neutral-200/70 py-2 disabled:opacity-50 w-full text-sm font-semibold transition"
            >
              Logout
            </button>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <div className="w-full bg-white flex items-center justify-between border-b h-16 px-4 gap-x-8">
        <div className="w-full h-full hidden lg:flex items-center gap-x-2">
          {adminRoutes.map((route) => {
            const isActive = location.pathname === route.href;

            return (
              <Link
                to={route.href}
                key={route.label}
                className={cn(
                  "text-sm h-full font-medium px-4 transition flex items-center justify-center",
                  isActive
                    ? "border-b-2 border-primary text-primary"
                    : "text-gray-950 hover:text-gray-950/80"
                )}
              >
                {route.label}
              </Link>
            );
          })}
        </div>

        <DropdownMenu open={isMobileOpen} onOpenChange={setIsMobileOpen}>
          <DropdownMenuTrigger className="block lg:hidden outline-none relative">
            <AlignJustify
              size={26}
              className={`menu-icon text-gray-950 hover:opacity-80 transition-all ${
                isMobileOpen ? "hidden-icon" : "visible-icon"
              }`}
            />
            <X
              size={26}
              className={`menu-icon text-gray-950 hover:opacity-80 transition-all ${
                isMobileOpen ? "visible-icon" : "hidden-icon"
              }`}
            />
          </DropdownMenuTrigger>
          <DropdownMenuContent className="flex lg:hidden rounded-sm shadow-lg shadow-black/10 mt-6 ml-2">
            {adminRoutes.map((route) => {
              const isActive = location.pathname === route.href;

              return (
                <Link
                  to={route.href}
                  key={route.label}
                  className={cn(
                    "text-sm h-full font-medium px-4 transition-all flex items-center justify-center",
                    isActive
                      ? "border-b-2 border-primary text-primary"
                      : "text-gray-950 hover:text-gray-950/80"
                  )}
                >
                  {route.label}
                </Link>
              );
            })}
          </DropdownMenuContent>
        </DropdownMenu>

        <Button className="rounded-sm">Contact Support</Button>
      </div>
    </nav>
  );
};

export default Navbar;
