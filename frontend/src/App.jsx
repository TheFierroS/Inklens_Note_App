import React from 'react'
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from './pages/Home/Home'
import Notes from './pages/Notes/Notes'
import ThemeProvider from './context/ThemeProvider'
import { KindeProvider } from "@kinde-oss/kinde-auth-react";

const App = () => {
  return (
    <KindeProvider
      clientId="713d7969485d4cdf8c98d3a1f8cbb235"
      domain="https://inklens.kinde.com"
      redirectUri="http://localhost:5173/notes"
      logoutUri="http://localhost:5173"
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

