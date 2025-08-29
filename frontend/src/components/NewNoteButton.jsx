import React from "react";
import { HiOutlinePencilAlt } from "react-icons/hi"; // Kalem ikonu
import useTheme from "../context/useTheme";

const NewNoteButton = ({ onClick }) => {
    const { theme } = useTheme();

    return (
        <button
            type="button"
            onClick={onClick}
            className={`fixed bottom-6 right-6 flex items-center gap-2 px-4 py-3 rounded-full shadow-lg z-50
                ${theme === "light" ? "bg-[#ff008d] text-white hover:bg-[#cc0070]" : "bg-[#ff008d] text-white hover:bg-[#cc0070]"}
                transition-colors duration-300
            `}
        >
            <HiOutlinePencilAlt className="text-lg" />
            New Note
        </button>
    );
};

export default NewNoteButton;