import { ArrowLeft } from "lucide-react";
import React from "react";
import { FaBell, FaEnvelope } from "react-icons/fa6";
import { Link } from "react-router-dom";
import { useAuth } from "../../../context/UseAuth";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "../../../components/ui/dropdown-menu";

const AdminNavbar: React.FC = () => {
  const { user } = useAuth();

  return (
    <nav className="fixed top-0 w-full shadow-md bg-white z-50 flex items-center justify-between px-8 py-4">
      <div className="flex items-center gap-x-5">
        <Link
          to="/"
          className="p-1 rounded-full bg-primary text-white mt-0.5 hover:opacity-80 transition-all"
        >
          <ArrowLeft size={20} />
        </Link>
        <Link to="/admin/dashboard">
          <h2 className="text-2xl md:text-3xl font-bold primary-text lilita_one_font">
            foodora admin
          </h2>
        </Link>
      </div>
      <div className="flex items-center gap-x-[18px]">
        <DropdownMenu>
          <DropdownMenuTrigger>
            <FaBell size={21} className="text-neutral-600" />
          </DropdownMenuTrigger>
          <DropdownMenuContent></DropdownMenuContent>
        </DropdownMenu>

        <FaEnvelope size={21} className="text-neutral-600" />
        <div className="h-8 w-px bg-neutral-200" />
        <div className="flex flex-col items-center">
          <p className="text-base font-semibold text-gray-900">{user?.name}</p>
          <p className="text-xs font-medium text-neutral-600">{user?.email}</p>
        </div>
      </div>
    </nav>
  );
};

export default AdminNavbar;
