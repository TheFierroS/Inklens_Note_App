import React from 'react'
import { FaCode } from 'react-icons/fa'
import useTheme from '../context/useTheme'

const Footer = () => {
    const { theme } = useTheme();

    return (
        <div className={`flex items-center justify-center py-4 transition-colors duration-500 ${theme === "light" ? "text-gray-600" : "text-gray-400"}`}  style={{ borderTop: '1px solid #2e0545' }}>
            <FaCode className="mr-2" />
            <p>
                Developed by <a href="http://github.com/TheFierroS" target="_blank" rel="noopener noreferrer" className={`underline duration-200 ${theme === "light" ? "hover:text-gray-400" : "hover:text-white"}`}>TheFierroS</a>
            </p>
        </div>
    )
}

export default Footer