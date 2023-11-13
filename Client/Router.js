import React from "react";
import RideViewer from './RideViewer.js';
import LandingPage from './LandingPage.js';
import SingleRide from "./SingleRide.js";
import CustomActivity from "./CustomActivity.js";

import {
    BrowserRouter as Router,
    Routes,
    Route
} from "react-router-dom"


const RouteObj = () => {
    
        return (
            <Router>
                <Routes>
                    <Route path="/" element={<LandingPage />} />
                    <Route path="/ride/:id" element={<SingleRide />} />
                    <Route path="/visualize/:id" element={<RideViewer />} />
                    <Route path="/visualize" element={<RideViewer />} />
                    <Route path="/custom" element={<CustomActivity />} />
                </Routes>
            </Router>
        )

}

export default RouteObj