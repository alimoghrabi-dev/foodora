import { Clock } from "lucide-react";
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Skeleton } from "../../components/ui/skeleton";

const RestaurantCard: React.FC<{
  id: string;
  imageUrl: string;
  name: string;
  rating: number;
  deliveryTime: string;
  cuisine?: string;
  description?: string;
  isOnSale?: boolean;
  salePercentage?: number | undefined;
  isClosed: boolean;
  isTimeout: boolean;
}> = ({
  id,
  imageUrl,
  name,
  rating,
  deliveryTime,
  cuisine,
  description,
  isOnSale,
  salePercentage,
  isClosed,
  isTimeout,
}) => {
  const [isImageLoaded, setIsImageLoaded] = useState<boolean>(false);

  return (
    <Link
      to={`/market/restaurant/${id}`}
      className="min-w-fit relative flex flex-col rounded-lg border border-gray-950/10 hover:bg-gray-400/10 hover:opacity-90 transition"
    >
      {isOnSale && (
        <div className="absolute z-10 top-0 left-0 rounded-tl-lg rounded-br-lg text-white font-medium text-xs bg-primary px-2.5 py-1.5">
          {salePercentage}% OFF
        </div>
      )}

      <div className="relative w-full h-56">
        {!isImageLoaded ? null : isClosed ? (
          <div className="absolute inset-0 rounded-t-lg bg-gray-950/75 flex items-center justify-center">
            <p className="font-semibold text-base text-red-500">
              Currently Closed
            </p>
          </div>
        ) : isTimeout ? (
          <div className="absolute inset-0 rounded-t-lg bg-gray-950/75 flex items-center justify-center">
            <p className="font-semibold text-base text-red-500">
              Currently Closed
            </p>
          </div>
        ) : null}

        {!isImageLoaded && (
          <Skeleton className="w-full h-full rounded-t-lg rounded-b-none" />
        )}
        <img
          src={imageUrl}
          alt={name}
          loading="lazy"
          onLoad={() => setIsImageLoaded(true)}
          className={`w-full h-full object-cover rounded-t-lg ${
            isImageLoaded ? "opacity-100" : "opacity-0"
          }`}
        />
        <div className="absolute bottom-4 left-4 bg-white/70 rounded-lg px-2 py-1.5 flex items-center gap-x-2.5">
          <Clock size={16} className="text-gray-950" />
          <p className="text-xs font-medium text-gray-950">{deliveryTime}</p>
        </div>
      </div>
      <div className="flex flex-col px-5 py-2">
        <p className="text-base font-medium text-gray-950">{name}</p>
        <p className="text-sm font-medium text-neutral-700 line-clamp-2">
          {cuisine ? cuisine : description}
        </p>
      </div>
    </Link>
  );
};

export default RestaurantCard;
