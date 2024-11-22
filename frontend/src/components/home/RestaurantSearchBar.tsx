import React, { useState } from "react";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Search, X } from "lucide-react";
import { useNavigate } from "react-router-dom";

const RestaurantSearchBar: React.FC = () => {
  const navigate = useNavigate();

  const [input, setInput] = useState<string>("");

  return (
    <div className="w-full xl:w-[75%] bg-neutral-100/50 custom-shadow p-4 rounded-2xl flex items-center gap-x-4">
      <div className="relative w-full">
        <Input
          value={input}
          placeholder="Search for Restaurants"
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              navigate("/market");
            }
          }}
          className="border-gray-400/50 py-6 rounded-lg pr-9 text-base focus-visible:ring-0 focus-visible:border-primary focus-visible:ring-offset-0 outline-none transition-all"
        />
        {input && (
          <div
            className="absolute right-2 top-3.5 cursor-pointer hover:opacity-80 transition-all"
            onClick={() => setInput("")}
          >
            <X size={21} className="text-primary" />
          </div>
        )}
      </div>
      <Button
        onClick={() => navigate("/market")}
        className="rounded-lg py-6 text-base"
      >
        <Search size={20} className="mr-1.5" /> Search
      </Button>
    </div>
  );
};

export default RestaurantSearchBar;
