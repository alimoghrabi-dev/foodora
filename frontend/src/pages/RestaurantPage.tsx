import { useQuery, useQueryClient } from "@tanstack/react-query";
import React, { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { getRestaurantById } from "../lib/actions";
import { useAuth } from "../context/UseAuth";
import { ChevronLeft, Info, Loader2, LocateIcon } from "lucide-react";
import RestaurantItems from "../_market/components/RestaurantItems";
import { Skeleton } from "../components/ui/skeleton";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../components/ui/dialog";
import { formatTime } from "../lib/utils";

const daysOfTheWeek = [
  "sunday",
  "monday",
  "tuesday",
  "wednesday",
  "thursday",
  "friday",
  "saturday",
];

const RestaurantPage: React.FC = () => {
  const { token } = useAuth();

  const params = useParams();
  const queryClient = useQueryClient();
  const location = useLocation();
  const navigate = useNavigate();

  const todayName = daysOfTheWeek[new Date().getDay()];

  const [isImageLoaded, setIsImageLoaded] = useState<boolean>(false);

  const { data: restaurant, isPending } = useQuery<IRestaurant>({
    queryKey: ["restaurant-by-id", params.id],
    queryFn: async () => {
      return getRestaurantById(params.id, token);
    },
    enabled: !!params.id,
  });

  const closingTime = restaurant?.openingHours?.[todayName]?.closing;

  useEffect(() => {
    if (params.id) {
      queryClient.invalidateQueries({
        queryKey: ["restaurant-by-id", params.id],
      });
    }
  }, [params.id, queryClient, location.pathname]);

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const itemId = queryParams.get("item");

    if (itemId) {
      const itemElement = document.getElementById(itemId);
      if (itemElement) {
        itemElement.scrollIntoView({ behavior: "smooth" });
      }

      setTimeout(() => {
        queryParams.delete("item");
        navigate(
          {
            pathname: location.pathname,
            search: queryParams.toString(),
          },
          { replace: true }
        );
      }, 2500);
    }
  }, [location, navigate]);

  const openGoogleMaps = () => {
    const googleMapsUrl = `https://www.google.com/maps?q=${restaurant?.latitude},${restaurant?.longitude}`;
    window.open(googleMapsUrl, "_blank");
  };

  if (isPending) {
    return (
      <div className="w-full flex items-center justify-center pt-28">
        <Loader2 size={64} className="primary-text opacity-90 animate-spin" />
      </div>
    );
  }

  return (
    <div className="relative w-full flex flex-col gap-y-8">
      {restaurant?.isClosed ? (
        <div className="sticky top-0 w-[60%] self-center bg-primary py-2 rounded-full flex items-center justify-center text-lg font-semibold text-white">
          {restaurant?.name} is currently closed!
        </div>
      ) : restaurant?.isTimeout ? (
        <div className="sticky top-0 w-[60%] self-center bg-primary py-2 rounded-full flex items-center justify-center text-lg font-semibold text-white">
          {restaurant?.name} is currently closed!
        </div>
      ) : (
        restaurant?.isOnSale && (
          <div className="sticky top-0 w-[60%] self-center bg-primary py-2 rounded-full flex items-center justify-center animate-sale-text text-lg font-semibold">
            Enjoy our {restaurant?.salePercentage}% OFF !
          </div>
        )
      )}
      <div className="flex items-end gap-x-4">
        <button
          onClick={() => navigate(-1)}
          className="self-start p-1 rounded-full hover:opacity-85 transition duration-200 bg-neutral-400/80 active:opacity-50"
        >
          <ChevronLeft size={23} className="text-white" />
        </button>
        <div className="w-[365px] h-[225px] relative flex-shrink-0">
          {restaurant?.isClosed ? (
            <div className="absolute inset-0 rounded-lg bg-gray-950/75 backdrop-grayscale flex items-center justify-center">
              <p className="font-semibold text-base text-red-500">
                Currently Closed
              </p>
            </div>
          ) : restaurant?.isTimeout ? (
            <div className="absolute inset-0 rounded-lg bg-gray-950/75 backdrop-grayscale flex items-center justify-center">
              <p className="font-semibold text-base text-red-500">
                Currently Closed
              </p>
            </div>
          ) : null}

          {!isImageLoaded && <Skeleton className="w-full h-full rounded-lg" />}
          <img
            src={restaurant?.imageUrl}
            alt="cover-image"
            loading="lazy"
            onLoad={() => setIsImageLoaded(true)}
            className={`w-full h-full object-cover rounded-lg ${
              isImageLoaded ? "opacity-100" : "opacity-0"
            }`}
          />
        </div>
        <div className="flex flex-col">
          <div className="flex items-center gap-x-2.5">
            <p className="text-gray-950 font-bold text-2xl mb-1">
              {restaurant?.name}
            </p>
            <Dialog>
              <DialogTrigger>
                <Info
                  size={28}
                  className="text-primary cursor-pointer hover:opacity-85 transition duration-200 mb-0.5"
                />
              </DialogTrigger>
              <DialogContent className="rounded-lg">
                <DialogHeader>
                  <DialogTitle>
                    More Informations About {restaurant?.name}
                  </DialogTitle>
                </DialogHeader>
                <hr className="w-28" />
                <div className="w-full flex flex-col gap-y-4">
                  <div className="flex items-start gap-x-2">
                    <p className="text-primary font-semibold text-sm flex-shrink-0">
                      - Restaurant Address:{" "}
                    </p>
                    <p className="text-gray-900 font-medium text-sm">
                      {restaurant?.address}
                    </p>
                  </div>
                  <p
                    onClick={openGoogleMaps}
                    className="text-primary font-semibold text-sm flex gap-x-2 cursor-pointer hover:opacity-75 transition duration-200"
                  >
                    <LocateIcon size={20} />
                    Open Google Maps Location
                  </p>
                </div>
              </DialogContent>
            </Dialog>
          </div>
          <hr className="w-20 my-1" />
          <p className="text-neutral-700 font-medium text-[13px] line-clamp-3">
            {restaurant?.description}
          </p>

          {!restaurant?.isClosed && !restaurant?.isTimeout && !isPending && (
            <p className="text-primary font-semibold text-[13px] mt-2">
              closes at {formatTime(closingTime)}
            </p>
          )}
        </div>
      </div>
      <hr />
      <RestaurantItems
        id={restaurant?._id}
        token={token}
        isOnSale={restaurant?.isOnSale}
        salePercentage={restaurant?.salePercentage}
        isClosed={restaurant?.isClosed}
        isTimeout={restaurant?.isTimeout}
      />
    </div>
  );
};

export default RestaurantPage;
