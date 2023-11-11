import React from "react";
import RideViewer from './RideViewer.js';
import LandingPage from './LandingPage.js';
import Navbar from "./Navbar.js";
import {
    BrowserRouter as Router,
    Routes,
    Route
} from "react-router-dom"


const RouteObj = () => {
    
    if (process.env.NODE_ENV === 'development') {
        return (
            <Router>
                <Routes>
                    <Route path="/" element={<LandingPage />} />
                    <Route path="/ride" element={<RideViewer />} />
                </Routes>
            </Router>
        )
    }

    else {
        return (
            <Router>
                <Routes>
                    <Route path="/" element={<RideViewer />} />
                    <Route path="/landing" element={<LandingPage />} />
                </Routes>
            </Router>
        )

    }

}

export default RouteObj