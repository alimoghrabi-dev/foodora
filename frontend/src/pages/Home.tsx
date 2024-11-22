import React from "react";
import { HeroImage, HomeJoinus, HomeVendor } from "../assets/images/images";
import RestaurantSearchBar from "../components/home/RestaurantSearchBar";
import { Link } from "react-router-dom";
import { buttonVariants } from "../components/ui/button";

const Home: React.FC = () => {
  return (
    <>
      <section className="h-[72.5vh] w-full overflow-hidden">
        <div className="w-full h-full flex flex-col-reverse md:flex-row gap-0 md:gap-8">
          <div className="px-6 md:pl-12 flex-auto md:flex-1 h-full flex items-start justify-center flex-col gap-y-5 pb-4">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-950 text-center sm:text-start">
              What you need, delivered in minutes
            </h2>
            <RestaurantSearchBar />
          </div>

          <img
            src={HeroImage}
            className="max-w-full md:max-w-[50%] max-h-[75%] sm:max-h-full object-cover rotate-[270deg] md:rotate-0 self-center"
          />
        </div>
      </section>

      <section className="w-full flex flex-col gap-y-8 mt-16 pb-44">
        <h3 className="text-3xl font-semibold text-gray-950 px-0 sm:px-12 text-center sm:text-start">
          Your online market
        </h3>
        <div className="w-full h-[350px] relative">
          <img
            src={HomeVendor}
            alt="h-v"
            className="w-full h-full object-cover object-center"
          />

          <div className="absolute w-fit -bottom-[35%] md:-bottom-[30%] left-4 sm:left-12 right-4 sm:right-12 md:right-0 bg-white rounded-2xl shadow-lg shadow-black/20 flex flex-col gap-y-4 p-5">
            <p className="text-base lg:text-xl font-semibold text-gray-950">
              Groceries and more, minutes from your door
            </p>
            <p className="text-xs lg:text-sm font-medium text-gray-900 md:max-w-md lg:max-w-lg xl:max-w-xl">
              Thousands of items delivered to your door: foodora market is our
              own supermarket. Order groceries, fresh fruit and vegetables,
              snacks, beverages as well as household products, and have it
              delivered within minutes. Discover our rapidly growing offer and
              order conveniently at supermarket prices!
            </p>
            <Link
              to="/market"
              className={buttonVariants({ className: "w-fit" })}
            >
              Visit foodora market
            </Link>
          </div>
        </div>
      </section>

      <section className="w-full flex flex-col gap-y-8 mt-16 pb-44">
        <h3 className="text-3xl font-semibold text-gray-950 px-0 sm:px-12 text-center sm:text-start">
          Your online bussiness
        </h3>
        <div className="w-full h-[350px] relative">
          <img
            src={HomeJoinus}
            alt="h-v"
            className="w-full h-full object-cover object-center"
          />

          <div className="absolute w-fit -bottom-[35%] md:-bottom-[30%] left-4 sm:left-12 right-4 sm:right-12 md:right-0 bg-white rounded-2xl shadow-lg shadow-black/20 flex flex-col gap-y-4 p-5">
            <p className="text-base lg:text-xl font-semibold text-gray-950">
              Join us, enhance your market with us!
            </p>
            <p className="text-xs lg:text-sm font-medium text-gray-900 md:max-w-md lg:max-w-lg xl:max-w-xl">
              Foodora is open to all. Join us and start your online market, take
              your orders online and we will deliver within minutes!
            </p>
            <Link
              to="/apply"
              className={buttonVariants({ className: "w-fit" })}
            >
              Apply
            </Link>
          </div>
        </div>
      </section>
    </>
  );
};

export default Home;
