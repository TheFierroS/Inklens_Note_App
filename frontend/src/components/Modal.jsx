import React, { useEffect, useState } from "react";
import useTheme from "../context/useTheme";

const Modal = ({ isOpen, onClose, children }) => {
    const { theme } = useTheme();
    const [visible, setVisible] = useState(false);
    const [show, setShow] = useState(false);

    useEffect(() => {
        if (isOpen) {
            setVisible(true);
            // küçük gecikme ile animasyonu başlat
            setTimeout(() => setShow(true), 10);
        } else {
            setShow(false);
            const timer = setTimeout(() => setVisible(false), 200);
            return () => clearTimeout(timer);
        }
    }, [isOpen]);

    if (!visible) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none">
            {/* Blur arka plan */}
            <div
                onClick={onClose}
                className={`absolute inset-0 backdrop-blur-sm transition-opacity duration-200 pointer-events-auto ${show ? "opacity-100" : "opacity-0"
                    }`}
            ></div>

            {/* Modal kutusu */}
            <div
                className={`relative z-10 w-11/12 md:w-1/2 p-6 rounded-lg transform transition-all duration-200 pointer-events-auto
          ${theme === "light" ? "bg-white text-gray-900" : "bg-[#0c0013ff] text-gray-200"}
          ${show ? "opacity-100 scale-100" : "opacity-0 scale-95"}
        `}
            >
                <button
                    onClick={onClose}
                    className="absolute top-3 right-3 text-gray-500 duration-100 hover:text-gray-300 text-xl font-bold"
                >
                    ✕
                </button>
                {children}
            </div>
        </div>
    );
};

export default Modal;
