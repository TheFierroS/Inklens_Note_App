// components/SearchBar.jsx
import React from "react";
import useTheme from "../context/useTheme";

const SearchBar = ({ searchQuery, setSearchQuery }) => {
    const { theme } = useTheme();

    return (
        <div className="w-full flex justify-center my-4">
            <input
                type="text"
                placeholder="🔎 Search by title, content or tag..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className={`w-full md:w-1/2 px-4 py-2 rounded-lg border 
                    focus:outline-none focus:ring-2 focus:ring-[#ff008d] 
                    transition-colors duration-350
                    ${theme === "light"
                        ? "bg-white text-gray-800 border-gray-300 placeholder-gray-400"
                        : "bg-[#0c0013ff] text-gray-200 border-gray-700 placeholder-gray-400"
                    }`}
            />
        </div>
    );
};

export default SearchBar;
