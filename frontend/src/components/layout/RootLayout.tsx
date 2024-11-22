import React, { useState } from "react";
import Navbar from "./Navbar";
import { Link, Outlet, useLocation } from "react-router-dom";
import { MdDeliveryDining } from "react-icons/md";
import { X } from "lucide-react";
import { buttonVariants } from "../ui/button";

const RootLayout: React.FC = () => {
  const location = useLocation();

  const [isApplyActive, setIsApplyActive] = useState<boolean>(true);

  return (
    <>
      {location.pathname === "/"
        ? isApplyActive && (
            <div className="sticky top-0 inset-x-0 bg-primary z-50 flex items-center justify-center gap-x-4 md:gap-x-8 py-5">
              <X
                onClick={() => setIsApplyActive(false)}
                size={23}
                className="text-white hover:opacity-75 transition absolute right-2 sm:right-3 top-2 sm:top-3 cursor-pointer"
              />
              <MdDeliveryDining size={36} className="text-white" />
              <p className="text-xl md:text-2xl font-bold text-white">
                Work as foodora driver ?
              </p>
              <Link
                to="/apply/driver"
                className={buttonVariants({
                  className:
                    "ring-1 ring-white bg-transparent text-white font-semibold hover:bg-white hover:text-primary",
                })}
              >
                Apply
              </Link>
            </div>
          )
        : null}
      <Navbar />
      <main className="pt-3 sm:pt-[76px]">
        <Outlet />
      </main>
    </>
  );
};

export default RootLayout;
