import React, { useEffect, useRef, useState } from "react";
import { useAuth } from "../../context/UseAuth";
import AuthDialog from "../auth/AuthDialog";
import { IoBagHandleOutline, IoEllipsisHorizontalSharp } from "react-icons/io5";
import { useToast } from "../ui/use-toast";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { FaRegUser } from "react-icons/fa";
import { ChevronDown, LayoutDashboard } from "lucide-react";
import { cn } from "../../lib/utils";
import { dropdownMenuLinks } from "../../constants/constants";
import { IoIosLogOut } from "react-icons/io";
import { useCartContext } from "../../context/CartContext";

const Navbar: React.FC = () => {
  const { token, user, logout, isPending, userOrdersLength } = useAuth();
  const { setCartIconPosition } = useCartContext();

  const { toast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();

  const cartIconRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (cartIconRef.current) {
      const rect = cartIconRef.current.getBoundingClientRect();
      setCartIconPosition({
        x: rect.left + rect.width / 2,
        y: rect.top,
      });
    }
  }, [cartIconRef, setCartIconPosition]);

  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [isLoggingOut, setIsLoggingOut] = useState<boolean>(false);

  useEffect(() => {
    setIsOpen(false);
  }, [location.pathname]);

  const handleLogout = () => {
    setIsLoggingOut(true);
    try {
      logout();

      toast({
        title: "Logged out",
        description: "You have been successfully logged out.",
        className:
          "bg-green-500 text-white text-3xl font-semibold ring-0 border-none",
      });
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoggingOut(false);
      setIsOpen(false);
      navigate("/");
    }
  };

  return (
    <nav className="fixed inset-x-0 py-4 shadow-md z-50 bg-white flex items-center justify-between px-4 md:px-24">
      <Link to="/" className="hidden md:block relative">
        {user?.isAdmin && (
          <span className="absolute -top-2 -right-12 bg-primary rounded-full py-0.5 px-2 text-white font-medium text-xs">
            Admin
          </span>
        )}
        <h1 className="text-3xl sm:text-4xl text-primary font-bold lilita_one_font">
          foodora
        </h1>
      </Link>
      <div className="w-full md:w-fit flex items-center justify-between gap-x-4">
        {token && (
          <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
            <DropdownMenuTrigger className="flex items-center gap-x-2 hover:bg-primary/10 p-2 rounded-md transition-all outline-none">
              <FaRegUser size={20} className="text-gray-950 mb-0.5" />
              <p className="text-sm sm:text-base font-medium text-gray-950 max-w-[150px] truncate">
                {isPending ? (
                  <IoEllipsisHorizontalSharp
                    size={16}
                    className="text-gray-950 animate-ping mx-6"
                  />
                ) : (
                  user?.name
                )}
              </p>
              <ChevronDown
                className={cn(
                  "size-[22px] sm:size-6 text-primary transition ease-in-out duration-200",
                  isOpen && "rotate-180"
                )}
              />
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-72 p-4 rounded-2xl border-none shadow shadow-black/20">
              <div className="w-full flex flex-col gap-y-1">
                {dropdownMenuLinks.map((link) => {
                  const isActive = location.pathname === link.href;

                  return (
                    <Link
                      key={link.href}
                      to={link.href}
                      className={cn(
                        "relative w-full px-4 py-2.5 flex items-center gap-x-3 rounded-lg transition-all",
                        isActive
                          ? "text-white bg-primary"
                          : "text-gray-950 hover:bg-primary/10"
                      )}
                    >
                      <link.icon size={21} />
                      <p className="font-semibold text-base">{link.label}</p>
                      {link.href === "/orders" && (
                        <div
                          className={cn(
                            "size-5 absolute right-2.5 top-[27.5%] flex items-center justify-center text-sm font-semibold rounded-full",
                            isActive
                              ? "bg-white text-primary"
                              : "text-white bg-primary"
                          )}
                        >
                          {userOrdersLength}
                        </div>
                      )}
                    </Link>
                  );
                })}
                {user?.isAdmin && (
                  <>
                    <div className="my-2 bg-black/10 w-full h-px" />
                    <Link
                      to="/admin/dashboard"
                      className="bg-primary w-full px-4 py-2.5 flex items-center gap-x-3 rounded-lg hover:opacity-85 transition-all"
                    >
                      <LayoutDashboard size={21} className="text-white" />
                      <p className="font-semibold text-base text-white">
                        Admin Dashboard
                      </p>
                    </Link>
                  </>
                )}
                <div className="my-2 bg-black/10 w-full h-px" />
                <button
                  onClick={handleLogout}
                  disabled={isLoggingOut}
                  className="w-full px-4 py-2.5 flex items-center gap-x-3 text-gray-950 text-base font-semibold hover:bg-primary/10 transition-all rounded-lg disabled:opacity-50"
                >
                  <IoIosLogOut size={21} />
                  Logout
                </button>
              </div>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
        <Link to="/" className="block md:hidden">
          <h1 className="text-3xl sm:text-4xl text-primary font-bold lilita_one_font">
            foodora
          </h1>
        </Link>
        <div
          ref={cartIconRef}
          onClick={() => {
            if (!token) {
              toast({
                title: "Login required!",
                description: "Please login to get access to your cart.",
                variant: "destructive",
              });
            } else {
              navigate("/cart");
            }
          }}
          className={cn(
            "p-2.5 rounded-full cursor-pointer transition-all",
            location.pathname === "/cart"
              ? "bg-primary cursor-default"
              : "bg-white hover:bg-primary/10"
          )}
        >
          <IoBagHandleOutline
            size={25}
            className={
              location.pathname === "/cart" ? "text-white" : "text-primary"
            }
          />
        </div>
        {!token && <AuthDialog />}
      </div>
    </nav>
  );
};

export default Navbar;
