// src/components/TrashButton.jsx
import React from "react";
import { FaTrash } from "react-icons/fa";
import useTheme from "../context/useTheme";

const TrashButton = ({ onClick, count }) => {
    const { theme } = useTheme();

    return (
        <button
            onClick={onClick}
            className={`fixed right-6 bottom-24 flex items-center justify-center w-12 h-12 rounded-full shadow-lg
                ${theme === "light" ? "bg-white text-gray-800 hover:bg-gray-100 " : "bg-[#0c0013ff] text-white hover:bg-[#1a001f] "}
                transition-colors duration-300 z-50`}
        >
            <FaTrash className="text-lg" />
            {count > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 flex items-center justify-center text-xs font-bold bg-red-600 text-white rounded-full">
                    {count}
                </span>
            )}
        </button>
    );
};

export default TrashButton;
