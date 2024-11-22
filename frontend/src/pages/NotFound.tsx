import React from "react";
import { NotFoundIcon } from "../assets/images/images";
import { Link } from "react-router-dom";

const NotFound: React.FC = () => {
  return (
    <div className="w-full h-[80vh] flex flex-col items-center justify-center gap-y-6 px-4">
      <img
        src={NotFoundIcon}
        alt="not-found"
        className="max-w-[300px] sm:max-w-[350px] md:max-w-[450px] object-contain object-center"
      />
      <p className="text-2xl sm:text-4xl font-semibold text-gray-950 lilita_one_font text-center">
        Oops, page not found, you seems to be lost!
      </p>
      <Link
        to="/"
        className="bg-primary px-6 py-2 rounded-full hover:opacity-85 transition-all text-[17px] font-medium lilita_one_font text-white"
      >
        Back Home
      </Link>
    </div>
  );
};

export default NotFound;
