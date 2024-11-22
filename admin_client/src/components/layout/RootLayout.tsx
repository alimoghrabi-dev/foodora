import React, { useEffect, useState } from "react";
import { Link, Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/useAuth";
import Navbar from "./Navbar";
import { socket } from "../../lib/socket";
import { useSound } from "use-sound";
import { useToast } from "../ui/use-toast";
import { NewOrderSound } from "../../assets/audios/audios";
import { Bell } from "lucide-react";

const RootLayout: React.FC = () => {
  const { token, admin } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  const [newOrderPopUp, setNewOrderPopUp] = useState<boolean>(false);

  const [play, { stop }] = useSound(NewOrderSound, {
    volume: 0.075,
    loop: true,
  });

  useEffect(() => {
    if (!token) {
      navigate("/login");
    }
  }, [navigate, token]);

  useEffect(() => {
    socket.on("connect", () => {
      console.log("Connected to WebSocket server");
    });

    socket.on("new-order", (data) => {
      if (data?.restaurantId === admin?._id) {
        play();
        setNewOrderPopUp(true);

        toast({
          title: "New Order",
          description: `You have a new Order from ${data?.username}`,
          onClick: () => navigate("/orders"),
          variant: "default",
        });
      }
    });

    socket.on("disconnect", () => {
      console.log("Disconnected from Socket.IO server");
    });
  }, [admin?._id, navigate, play, toast, token]);

  return (
    <>
      <Navbar />

      <main className="mt-32 pb-8">
        {newOrderPopUp && (
          <Link
            to="/orders"
            onClick={() => {
              stop();
              setNewOrderPopUp(false);
            }}
            className="w-full active-bg flex items-center justify-center bg-primary py-4 gap-x-5 shadow-md hover:opacity-75 transition-all"
          >
            <Bell size={23} className="active-color" />
            <span className="flex items-center gap-x-2">
              <p className="active-color font-semibold text-base">
                You have a new order,
              </p>
              <p className="text-red-500 font-medium text-sm">
                Tab to continue.
              </p>
            </span>
          </Link>
        )}
        <Outlet />
      </main>
    </>
  );
};

export default RootLayout;
