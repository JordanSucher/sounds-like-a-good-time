import React, {useState} from "react";
import RideViewer from './RideViewer.js';
import LandingPage from './LandingPage.js';
import SingleRide from "./SingleRide.js";
import CustomActivity from "./CustomActivity.js";
import RideFooter from "./RideFooter.js";

import {
    BrowserRouter as Router,
    Routes,
    Route
} from "react-router-dom"


const RouteObj = () => {
        let [speed, setSpeed] = useState(500);


        return (
            <Router>
                <Routes>
                    <Route path="/" element={<LandingPage />} />
                    <Route path="/ride/:id" element={<SingleRide />} />
                    <Route path="/visualize/:id" element={<RideViewer speed={speed} />} />
                    <Route path="/visualize" element={<RideViewer speed={speed}/>} />
                    <Route path="/custom" element={<CustomActivity />} />
                </Routes>
                <RideFooter setSpeed={setSpeed} speed={speed}/>
            </Router>
        )

}

export default RouteObj