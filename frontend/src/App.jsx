import React from 'react'
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from './pages/Home/Home'
import Notes from './pages/Notes/Notes'
import ThemeProvider from './context/ThemeProvider'
import { KindeProvider } from "@kinde-oss/kinde-auth-react";

const App = () => {
  return (
    <KindeProvider                 //
      clientId=" "            //
      domain=" "             // Your Kinde İnformations
      redirectUri=" "       //
      logoutUri=" "        //
>
      <ThemeProvider>
        <Router>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/notes" element={<Notes />} />
          </Routes>
        </Router>
      </ThemeProvider>
    </KindeProvider>
  )
}

export default App

