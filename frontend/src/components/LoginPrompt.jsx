import React from "react";
import { useKindeAuth } from "@kinde-oss/kinde-auth-react";
import { HiArrowLeft } from "react-icons/hi";
import { Link } from "react-router-dom";
import useTheme from "../context/useTheme";

const LoginPrompt = () => {
    const { login } = useKindeAuth();
    const { theme } = useTheme();

    return (
        <div className={`flex flex-col items-center justify-center h-screen font-sans ${theme === "light" ? "bg-white" : "bg-[#0c0013ff]"}`}>
            <h2 className={`mb-4 text-center ${theme === "light" ? "text-gray-800" : "text-[#e8e8e8]"}`}>
                Please sign in to view your notes
            </h2>

            <button
                onClick={login}
                className="px-4 py-2 rounded-md text-[#ff008d] border border-[#ff008d] duration-300 hover:bg-[#ff008d] hover:text-white text-sm md:text-base mb-6"
            >
                Sign In
            </button>

            <Link
                to="/"
                className={`flex items-center underline duration-300 hover:text-[#555] text-sm md:text-base ${theme === "light" ? "text-gray-800" : "text-[#e8e8e8]"}`}
            >
                <HiArrowLeft className="mr-1" /> Back to Home
            </Link>
        </div>
    );
};

export default LoginPrompt;