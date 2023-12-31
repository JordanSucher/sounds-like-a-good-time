import React, {useState} from "react";
import RideViewer from './RideViewer.js';
import LandingPage from './LandingPage.js';
import SingleRide from "./SingleRide.js";
import CustomActivity from "./CustomActivity.js";
import SynthFooter from "./SynthFooter.js";
import FromFile from "./FromFile.js";

import {
    BrowserRouter as Router,
    Routes,
    Route
} from "react-router-dom"


const RouteObj = () => {
        let [speed, setSpeed] = useState(500);
        let [key, setKey] = useState("C2");
        let [mode, setMode] = useState("pentatonic");
        let [instrument, setInstrument] = useState("synth");

        let [speed2, setSpeed2] = useState(500);
        let [key2, setKey2] = useState("C2");
        let [mode2, setMode2] = useState("pentatonic");
        let [instrument2, setInstrument2] = useState("synth");

        let [numCircles, setNumCircles] = useState(1);

        let [volume, setVolume] = useState(0);
        let [volume2, setVolume2] = useState(0);


        let circle1 = {
            speed: speed,
            setSpeed: setSpeed,
            instrument: instrument,
            setInstrument: setInstrument,
            key: key,
            setKey: setKey,
            mode: mode,
            setMode: setMode,
            volume: volume,
            setVolume: setVolume
        }

        let circle2 = {
            speed: speed2,
            setSpeed: setSpeed2,
            instrument: instrument2,
            setInstrument: setInstrument2,
            key: key2,
            setKey: setKey2,
            mode: mode2,
            setMode: setMode2,
            volume: volume2,
            setVolume: setVolume2
        }

        return (
            <Router>
                <Routes>
                    <Route path="/" element={<LandingPage />} />
                    <Route path="/ride/:id" element={<SingleRide />} />
                    <Route path="/visualize/:id" element={<RideViewer circle1={circle1} circle2={circle2} numCircles={numCircles} />} />
                    <Route path="/visualize" element={<RideViewer circle1={circle1} circle2={circle2} numCircles={numCircles} />} />
                    <Route path="/custom" element={<CustomActivity />} />
                    <Route path="/fromfile" element={<FromFile />} />
                </Routes>
                <SynthFooter circle1={circle1} circle2={circle2} numCircles={numCircles} setNumCircles={setNumCircles}/>
            </Router>
        )

}

export default RouteObj