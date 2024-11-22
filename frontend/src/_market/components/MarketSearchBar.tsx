import { Search } from "lucide-react";
import React, { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import { formUrlQuery, removeKeysFromQuery } from "../../lib/utils";
import FetchSearchResults from "./FetchSearchResults";

const MarketSearchBar: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [isSearchOpen, setIsSearchOpen] = useState<boolean>(false);
  const searchBarRef = useRef<HTMLDivElement>(null);

  const [searchParams] = useSearchParams();

  const query = searchParams.get("search-query");

  const [search, setSearch] = useState(query || "");

  useEffect(() => {
    const delayDebounceFN = setTimeout(() => {
      if (search) {
        const newUrl = formUrlQuery({
          params: searchParams.toString(),
          key: "search-query",
          value: search,
        });

        navigate(newUrl);
      } else {
        if (location.pathname.includes("/market") && query) {
          const newUrl = removeKeysFromQuery({
            params: searchParams.toString(),
            keys: ["search-query"],
          });

          navigate(newUrl);
        }
      }
    }, 500);

    return () => clearTimeout(delayDebounceFN);
  }, [location, navigate, query, search, searchParams]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        searchBarRef.current &&
        !searchBarRef.current.contains(event.target as Node)
      ) {
        setIsSearchOpen(false);
        setSearch("");
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [navigate]);

  useEffect(() => {
    setIsSearchOpen(false);
    setSearch("");
  }, [location.pathname]);

  return (
    <div
      ref={searchBarRef}
      className="w-full relative rounded-md shadow bg-white px-16 py-2"
    >
      <div className="absolute left-0 inset-y-0 px-4 flex items-center justify-center bg-white rounded-l-md">
        <Search size={25} className="primary-text" />
      </div>

      <input
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        onFocus={() => setIsSearchOpen(true)}
        placeholder="Search for restaurants and items"
        className="w-full text-gray-950 py-2 outline-none"
      />

      {isSearchOpen && search && <FetchSearchResults search={search} />}
    </div>
  );
};

export default MarketSearchBar;
