import React, { useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import AdminSidebar from "./components/layout/AdminSidebar";
import AdminNavbar from "./components/layout/AdminNavbar";
import { socket } from "../lib/socket";
import { useToast } from "../components/ui/use-toast";
import { ApplySound } from "../assets/audios/audios";
import { useSound } from "use-sound";

const AdminLayout: React.FC = () => {
  const { toast } = useToast();
  const navigate = useNavigate();

  const [play] = useSound(ApplySound, {
    volume: 0.075,
  });

  useEffect(() => {
    socket.on("connect", () => {
      console.log("Connected to WebSocket server");
    });

    socket.on("new-apply", (data) => {
      play();

      toast({
        title: "New Apply",
        description: `New Apply from ${data?.restaurantName} (${data?.email})`,
        onClick: () => navigate("/admin/dashboard/applies"),
        className:
          "bg-primary text-white fixed top-0 left-[50%] z-[100] w-full translate-x-[-50%] sm:right-0 md:max-w-[420px] cursor-pointer hover:opacity-90",
      });
    });

    socket.on("disconnect", () => {
      console.log("Disconnected from Socket.IO server");
    });
  }, [navigate, play, toast]);

  return (
    <>
      <AdminNavbar />
      <AdminSidebar />
      <main className="max-w-[calc(100vw-288px)] ml-auto bg-neutral-200/40 min-h-screen p-6 pl-10 pt-24">
        <Outlet />
      </main>
    </>
  );
};

export default AdminLayout;
