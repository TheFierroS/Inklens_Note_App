// NotesHeader.jsx
import React from "react";
import { useKindeAuth } from "@kinde-oss/kinde-auth-react";
import logo from '../assets/Inklens_icon-removebg-preview.png';
import DarkModeSwitch from './DarkModeSwitch';
import useTheme from "../context/useTheme";


const NotesHeader = () => {
    const { user, logout } = useKindeAuth();
    const { theme } = useTheme();


    const displayName = user
        ? `${user.givenName || ""} ${user.familyName || ""}`.trim()
        : "User";

    return (
        <div
            className="flex flex-col md:flex-row md:justify-between items-center h-auto md:h-20 px-3 md:px-20 py-3 md:py-0"
            style={{ borderBottom: '1px solid #2e0545' }}
        >
            {/* Sol taraf: Logo + Başlık */}
            <div className="flex items-center gap-2 md:gap-4 justify-center w-full md:w-auto mb-3 md:mb-0">
                <img
                    src={logo}
                    alt="Inklens Logo"
                    className="h-10 md:h-12 w-auto"
                />
                <h1
                    style={{ fontFamily: 'Orbitron', color: '#ff008d' }}
                    className="text-lg md:text-4xl"
                >
                    Inklens
                </h1>
            </div>

            {/* Ortada: Welcome mesajı */}
            <div className={`text-center text-md md:text-lg font-medium mb-3 md:mb-0 transition-colors duration-500 ${theme === "light" ? "text-gray-800" : "text-gray-200"}`} 
                style={{ fontFamily: 'Raleway, sans-serif' }} >
                    
                Welcome, {displayName}!
            </div>

            {/* Sağ taraf: DarkModeSwitch + Logout */}
            <div className="flex gap-2 md:gap-4 justify-center items-center w-full md:w-auto">
                <DarkModeSwitch />
                <button
                    onClick={() => logout({ logoutRedirectURL: window.location.origin || "http://localhost:5173" })}
                    className="px-4 py-2 rounded-md bg-[#ff008d] text-white duration-300 hover:bg-[#cc0070] text-sm md:text-base"
                    style={{ fontFamily: 'Raleway, sans-serif' }}
                >
                    Log out
                </button>
            </div>
        </div>
    );
};

export default NotesHeader;
