import React, { useEffect, useState } from "react";
import RegistrationRestaurantForm from "../components/auth/RegistrationRestaurantForm";
import { useQuery } from "@tanstack/react-query";
import { useLocation, useNavigate } from "react-router-dom";
import { registerationRestaurantStatus } from "../lib/actions";
import { Loader2 } from "lucide-react";
import NotFound from "./NotFound";

const RestaurantRegistration: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const queryParams = new URLSearchParams(location.search);
  const token = queryParams.get("token");

  const { data, isPending, refetch } = useQuery({
    queryKey: ["registration-status"],
    queryFn: async () => {
      return await registerationRestaurantStatus(token);
    },
  });

  const [isTheirAnAccount, setIsTheirAnAccount] = useState<boolean>(
    data?.isExisting
  );

  useEffect(() => {
    setIsTheirAnAccount(data?.isExisting);
  }, [data?.isExisting, data?.token, isPending, location, navigate, token]);

  if (isPending) {
    return (
      <div className="w-full h-screen flex items-center justify-center">
        <Loader2 size={72} className="primary-text opacity-85 animate-spin" />
      </div>
    );
  }

  if (!isPending) {
    if (!token || data?.token !== token) {
      return <NotFound />;
    }
  }

  return (
    <section className="w-full min-h-screen flex flex-col items-center justify-start gap-y-10 px-4 py-12">
      <div className="flex flex-col gap-y-4 items-center justify-center">
        <h1 className="primary-text font-bold text-3xl sm:text-4xl">
          Restaurant Registration
        </h1>
        <div className="h-px w-44 bg-black/10" />
      </div>
      <RegistrationRestaurantForm
        email={data?.restaurantEmail}
        token={token}
        isTheirAnAccount={isTheirAnAccount}
        refetch={refetch}
      />
    </section>
  );
};

export default RestaurantRegistration;
