import React from "react";
import { FoodoraCard } from "../assets/images/images";
import { BadgeDollarSign, Crown } from "lucide-react";
import { subscriptionOffers } from "../constants/constants";
import { formatPrice } from "../lib/utils";
import { Button } from "../components/ui/button";

const Subscription: React.FC = () => {
  return (
    <section className="w-full relative bg-primary/15 flex flex-col gap-y-20 pt-36 sm:pt-28 pb-8 overflow-x-hidden">
      <div className="w-full h-[75vh] bg-[#410a5e] absolute -top-2 inset-x-0 z-10" />
      <div className="absolute right-0 -top-2 h-[75vh] w-1/2 bg-gradient-to-l from-black/50 to-transparent pointer-events-none z-10" />
      <span className="p-16 rounded-full bg-neutral-200/20 absolute -right-24 -top-24 z-30">
        <Crown size={205} className="text-[#341446] fill-[#341446]" />
      </span>

      <div className="w-full flex flex-col items-center justify-center gap-y-8 z-40">
        <div className="flex flex-col lg:flex-row items-center gap-12 px-4">
          <div className="flex flex-col gap-y-2">
            <p className="text-3xl font-bold text-gray-100 text-center lg:text-start">
              Order like a PRO
            </p>
            <p className="text-sm sm:text-base font-semibold text-gray-200 text-center lg:text-start">
              Take a look at all the benefits your subscription brings you.
            </p>
          </div>
          <img
            src={FoodoraCard}
            alt="card"
            className="max-w-sm sm:max-w-md rounded-xl object-contain shadow-md"
          />
        </div>
      </div>
      <div className="z-40 w-full px-4 flex flex-wrap items-center justify-center gap-4 mt-4 lg:mt-0">
        {subscriptionOffers.map((sub) => (
          <div
            key={sub.name}
            className="w-[400px] relative bg-white rounded-lg shadow-lg shadow-black/15 flex flex-col items-start gap-y-3 px-6 py-5"
          >
            {sub.name !== "Monthly" && (
              <div className="absolute right-0 top-4 rounded-l-sm bg-primary/75 text-xs font-medium text-white py-1 px-2">
                OFFER -{sub.offer}
              </div>
            )}

            <p className="text-gray-950 font-bold text-lg">{sub.name}</p>
            <div className="flex flex-col gap-y-0.5">
              <span className="primary-text font-bold text-2xl flex items-center">
                {formatPrice(
                  sub.name === "Monthly"
                    ? sub.price
                    : sub.name === "Half-yearly"
                    ? sub.price / 6
                    : sub.price / 12
                )}
                <p className="text-lg font-semibold">/month</p>
              </span>
              <p className="text-sm font-semibold">
                {formatPrice(sub.price)} billed{" "}
                {sub.name === "Monthly"
                  ? "monthly"
                  : sub.name === "Half-yearly"
                  ? "biannually"
                  : "annually"}
              </p>
            </div>
            <Button className="w-full">Select</Button>
          </div>
        ))}
      </div>
      <div className="w-full flex justify-center md:justify-start items-center md:items-start gap-x-4 px-0 md:px-24">
        <BadgeDollarSign className="size-12 md:size-16 primary-text" />
        <div className="flex flex-col gap-y-1.5">
          <p className="text-base md:text-xl font-bold primary-text">
            Subscribe now and enjoy your benefits
          </p>
          <p className="text-base md:text-xl font-semibold text-gray-950">
            Try foodora PRO for the first time
          </p>
        </div>
      </div>
    </section>
  );
};

export default Subscription;
