import React from "react";
import RideViewer from './RideViewer.js';
import LandingPage from './LandingPage.js';
import {
    BrowserRouter as Router,
    Routes,
    Route
} from "react-router-dom"


const RouteObj = () => {
    
    return (
        <Router>
            <Routes>
                <Route path="/" element={<RideViewer />} />
                <Route path="/landing" element={<LandingPage />} />
            </Routes>
        </Router>
    )
}

export default RouteObj