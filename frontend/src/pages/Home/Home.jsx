import React from 'react'
import { useState } from 'react';
import { FaGithub, FaLock, FaTachometerAlt, FaCog, FaBookmark, FaSortAmountDown, FaTasks, FaChevronDown } from 'react-icons/fa'
import Header from '../../components/Header'
import Footer from '../../components/Footer'
import './style.css'
import useTheme from '../../context/useTheme';
import { useKindeAuth } from "@kinde-oss/kinde-auth-react";

const Home = () => {

    const { theme } = useTheme();
    const { register } = useKindeAuth();


    return (
        <div className="flex flex-col min-h-screen">
            <Header />

            <div
                className="flex flex-col items-center justify-center text-center px-5 md:px-20"
                style={{ minHeight: "calc(100vh - 80px)" }} // header yüksekliği çıkarılıyor
            >

                <h1
                    className="text-4xl md:text-6xl font-bold text-transparent bg-clip-text leading-relaxed"
                    style={{ backgroundImage: 'linear-gradient(to right, #2E0249, #570A57, #A91079, #F806CC)', fontFamily: 'Raleway, sans-serif' }}
                >
                    Organize Your Thoughts, Effortlessly
                </h1>

                <h2
                    className="text-2xl md:text-4xl mt-4 font-semibold text-transparent bg-clip-text leading-relaxed"
                    style={{ backgroundImage: 'linear-gradient(to right, #570A57, #A91079, #F806CC, #2E0249)', fontFamily: 'Raleway, sans-serif' }}
                >
                    With Inklens, keep all your ideas, tasks, and notes in one place.
                </h2>

                <p className={`text-xl mt-6 max-w-2xl leading-relaxed transition-colors duration-500 ${theme === "light" ? "text-gray-800" : "text-gray-200"}`} style={{ fontFamily: 'Raleway, sans-serif' }}>
                    Inklens lets you categorize, tag, and search your notes quickly.
                    A clean, intuitive interface helps you stay productive and never lose track of your ideas.
                    Create, manage, and access your notes anytime, anywhere.
                </p>


                <div className="flex gap-4 mt-8">
                    <a
                        href="https://github.com/TheFierroS/Inklens_Note_App"
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`flex items-center gap-2 px-6 py-2 border border-gray-300 rounded-md hover:bg-gray-700 hover:text-white transition-colors duration-500 ${theme === "light" ? "text-gray-800" : "text-gray-300"
                            }`}
                        style={{ fontFamily: 'Raleway, sans-serif' }}
                    >
                        <FaGithub size={20} /> GitHub
                    </a>
                    <button onClick={register}>
                        <a
                            className="px-6 py-2 rounded-md text-white flex items-center justify-center transition-all duration-500 ease-in-out"
                            style={{
                                backgroundImage: 'linear-gradient(to right, #2E0249, #570A57, #A91079, #F806CC)',
                                fontFamily: 'Raleway, sans-serif',
                                backgroundSize: '200% 100%',
                                backgroundPosition: 'left',
                                color: 'white',
                                textDecoration: 'none'
                            }}
                            onMouseEnter={e => e.currentTarget.style.backgroundPosition = 'right'}
                            onMouseLeave={e => e.currentTarget.style.backgroundPosition = 'left'}
                        >
                            Get Started
                        </a>
                    </button>

                </div>

            </div>
            <div className="flex flex-col items-center justify-center text-center px-5 md:px-20 py-20">
                <h1
                    className="text-4xl md:text-6xl font-bold text-transparent bg-clip-text leading-relaxed"
                    style={{ backgroundImage: 'linear-gradient(to right, #2E0249, #570A57, #A91079, #F806CC)', fontFamily: 'Raleway, sans-serif' }}
                >
                    Features
                </h1>
                <p className={`mt-6 max-w-3xl text-lg text-gray-300 leading-relaxed transition-colors duration-500 ${theme === "light" ? "text-gray-800" : "text-gray-300"}`} style={{ fontFamily: 'Raleway, sans-serif' }}>
                    Inklens is a modern, feature-rich application designed to streamline your note-taking experience.
                    Built with <span className="text-[#ff008d] font-semibold">React</span>,
                    <span className="text-[#ff008d] font-semibold"> Node.js</span>,
                    <span className="text-[#ff008d] font-semibold"> Express</span>, 
                    <span className="text-[#ff008d] font-semibold"> MongoDB</span>, and
                    <span className="text-[#ff008d] font-semibold"> KindeAuth </span>
                    it delivers speed, scalability, and a smooth user experience.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mt-12 px-5 md:px-20">

                    <div className="flex flex-col items-center text-center p-6 bg-gray-900 rounded-xl border border-gray-800 shadow-sm hover:shadow-md transition">
                        <FaLock size={40} className="mb-4 text-pink-500" />
                        <h3 className="text-xl font-semibold mb-2 text-gray-100" style={{ fontFamily: 'Raleway, sans-serif' }}>Secure Notes</h3>
                        <p className="text-gray-300 text-sm">
                            Inklens keeps your notes private and accessible only to you.
                        </p>
                    </div>


                    <div className="flex flex-col items-center text-center p-6 bg-gray-900 rounded-xl border border-gray-800 shadow-sm hover:shadow-md transition">
                        <FaTachometerAlt size={40} className="mb-4 text-purple-500" />
                        <h3 className="text-xl font-semibold mb-2 text-gray-100" style={{ fontFamily: 'Raleway, sans-serif' }}>Quick Overview</h3>
                        <p className="text-gray-300 text-sm">
                            Easily manage and track all your notes from a single dashboard.
                        </p>
                    </div>


                    <div className="flex flex-col items-center text-center p-6 bg-gray-900 rounded-xl border border-gray-800 shadow-sm hover:shadow-md transition">
                        <FaCog size={40} className="mb-4 text-pink-600" />
                        <h3 className="text-xl font-semibold mb-2 text-gray-100" style={{ fontFamily: 'Raleway, sans-serif' }}>Personalize</h3>
                        <p className="text-gray-300 text-sm">
                            Adjust your settings to fit your workflow and preferences.
                        </p>
                    </div>


                    <div className="flex flex-col items-center text-center p-6 bg-gray-900 rounded-xl border border-gray-800 shadow-sm hover:shadow-md transition">
                        <FaBookmark size={40} className="mb-4 text-purple-600" />
                        <h3 className="text-xl font-semibold mb-2 text-gray-100" style={{ fontFamily: 'Raleway, sans-serif' }}>Favorites</h3>
                        <p className="text-gray-300 text-sm">
                            Quickly access your most important or favorite notes.
                        </p>
                    </div>


                    <div className="flex flex-col items-center text-center p-6 bg-gray-900 rounded-xl border border-gray-800 shadow-sm hover:shadow-md transition">
                        <FaSortAmountDown size={40} className="mb-4 text-pink-500" />
                        <h3 className="text-xl font-semibold mb-2 text-gray-100" style={{ fontFamily: 'Raleway, sans-serif' }}>Smart Sort</h3>
                        <p className="text-gray-300 text-sm">
                            Organize notes by category, date, or title in seconds.
                        </p>
                    </div>


                    <div className="flex flex-col items-center text-center p-6 bg-gray-900 rounded-xl border border-gray-800 shadow-sm hover:shadow-md transition">
                        <FaTasks size={40} className="mb-4 text-purple-500" />
                        <h3 className="text-xl font-semibold mb-2 text-gray-100" style={{ fontFamily: 'Raleway, sans-serif' }}>Full Control</h3>
                        <p className="text-gray-300 text-sm">
                            Create, edit, and delete notes anytime with ease.
                        </p>
                    </div>
                </div>

            </div>
            <div className="w-full max-w-4xl mx-auto mt-20 px-5 md:px-0 mb-20">
                <div className='flex justify-center'>
                    <h1
                        className="text-4xl md:text-6xl font-bold text-transparent bg-clip-text inline-block"
                        style={{
                            backgroundImage: 'linear-gradient(to right, #2E0249, #570A57, #A91079, #F806CC)',
                            backgroundSize: '100% 100%',
                            fontFamily: 'Raleway, sans-serif'
                        }}
                    >
                        FAQ
                    </h1>
                </div>

                <p className={`text-center mt-4 max-w-2xl mx-auto text-lg transition-colors duration-500 ${theme === "light" ? "text-gray-800" : "text-gray-300"}`} style={{ fontFamily: 'Raleway, sans-serif' }}>
                    Some of the most common questions about Inklens are answered below. Feel free to reach out if you have any other questions.
                </p>

                <div className="mt-8 space-y-4">

                    <FaqItem
                        question="What is Inklens?"
                        answer="Inklens is a modern note-taking app that allows you to quickly and easily jot down your thoughts, ideas, and tasks."
                    />

                    <FaqItem
                        question="How do I create new notes & is there a limit to how many notes I can create?"
                        answer="You can create a new note by clicking on the 'New Note' button in your dashboard and typing your note. There is no limit – you can create as many notes as you like."
                    />

                    <FaqItem
                        question="Is my data secure with Inklens & can I access my notes offline?"
                        answer="Yes, Inklens takes data security very seriously. Your notes are stored securely and are only accessible by you. Currently, notes can be accessed when online."
                    />
                </div>
            </div>
            <Footer />
        </div>
    )
}

const FaqItem = ({ question, answer }) => {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div
            className="border border-gray-700 rounded-lg p-4 cursor-pointer bg-gray-900 hover:bg-gray-800 transition"
            onClick={() => setIsOpen(!isOpen)}
        >
            <div className="flex justify-between items-center">
                <h3 className="text-lg md:text-xl font-semibold text-gray-200">{question}</h3>
                <FaChevronDown
                    className={`text-gray-400 transition-transform duration-300 ${isOpen ? 'rotate-180' : 'rotate-0'}`}
                />
            </div>
            {isOpen && (
                <p className="mt-2 text-gray-300">{answer}</p>
            )}
        </div>
    );
};

export default Home
