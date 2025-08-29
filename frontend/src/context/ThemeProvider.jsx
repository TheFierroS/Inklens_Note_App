import React, { useState } from "react";
import ThemeContext from "./ThemeContext";

const ThemeProvider = ({ children }) => {
    const [theme, setTheme] = useState("dark");

    const toggleTheme = () => {
        setTheme((prev) => (prev === "light" ? "dark" : "light"));
    };

    return (
        <ThemeContext.Provider value={{ theme, toggleTheme }}>
            <div style={{
                backgroundColor: theme === "light" ? "#ffffff" : "#0c0013ff",
                color: theme === "light" ? "#000000" : "#ffffff",
                minHeight: "100vh",
                transition: "background-color 0.5s ease, color 0.5s ease"
            }}>
                {children}
            </div>
        </ThemeContext.Provider>
    );
};

export default ThemeProvider;
