import React from 'react'
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from './pages/Home/Home'
import Notes from './pages/Notes/Notes'
import ThemeProvider from './context/ThemeProvider'
import { KindeProvider } from "@kinde-oss/kinde-auth-react";

const App = () => {
  return (
    <KindeProvider                                                    //
      clientId={import.meta.env.VITE_KINDE_CLIENT_ID || " "}         //
      domain={import.meta.env.VITE_KINDE_DOMAIN || " "}             // Your Kinde İnformations
      redirectUri={window.location.origin + "/notes"}              //
      logoutUri={window.location.origin}                          //
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

