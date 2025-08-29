import React from 'react'
import logo from '../assets/Inklens_icon-removebg-preview.png'
import DarkModeSwitch from './DarkModeSwitch'
import {useKindeAuth} from "@kinde-oss/kinde-auth-react";


const Header = () => {

    const { login, register } = useKindeAuth();


    return (
        <div
            className="flex flex-col md:flex-row md:justify-between items-center h-auto md:h-20 px-3 md:px-20 py-3 md:py-0"
            style={{ borderBottom: '1px solid #2e0545' }}
        >
            {/* Logo + Başlık */}
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

            {/* Butonlar */}
            <div className="flex gap-2 md:gap-4 justify-center items-center w-full md:w-auto">
                <DarkModeSwitch />
                <button onClick={() => login({ prompt: "login" })}
                    className="px-4 py-2 rounded-md text-[#ff008d] border border-[#ff008d] duration-300 hover:bg-[#ff008d] hover:text-white text-sm md:text-base"
                    style={{ fontFamily: 'Raleway, sans-serif' }}
                >
                    Sign In
                </button>
                <button onClick={register}
                    className="px-4 py-2 rounded-md bg-[#ff008d] text-white duration-300 hover:bg-[#cc0070] text-sm md:text-base"
                    style={{ fontFamily: 'Raleway, sans-serif' }}
                >
                    Sign Up
                </button>
            </div>
        </div>
    )
}

export default Header
