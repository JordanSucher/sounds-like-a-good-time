
import React, {useEffect, useState} from 'react';
import {setScale, setInstrument} from './synthHelper.js';

const RideFooter = ({setSpeed, speed}) => {
    let [key, setKey] = useState("C2");
    let [mode, setMode] = useState("pentatonic");

    const handleKeyChange = (e) => {
        setKey(e.target.value);
        setScale(e.target.value, mode);
    }

    const handleModeChange = (e) => {
        setMode(e.target.value);
        setScale(key, e.target.value);
    }

    return (
        <div className="RideFooter">
            Settings
            <select onChange={(e) => handleKeyChange(e)}>
                <option value="C2">C</option>
                <option value="D2">D</option>
                <option value="E2">E</option>
                <option value="F2">F</option>
                <option value="G2">G</option>
                <option value="A2">A</option>
                <option value="B2">B</option>
            </select>
            <select onChange={(e) => handleModeChange(e)}>
                <option value="pentatonic">Pentatonic</option>
                <option value="phrygian">Phrygian</option>
                <option value="ionian">Ionian</option>
                <option value="dorian">Dorian</option>
                <option value="lydian">Lydian</option>
                <option value="mixolydian">Mixolydian</option>
                <option value="aeolian">Aeolian</option>
                <option value="locrian">Locrian</option>
            </select>
            <select onChange={(e) => setInstrument(e.target.value)}>
                <option value="synth">Synth</option>
                <option value="banjo">Banjo</option>
                <option value="clarinet">Clarinet</option>
                <option value="cello">Cello</option>
            </select>
            <input type="range" value={speed} min="200" max="1000" step="1" onChange={(e) => setSpeed(e.target.value)}/>
        </div>
    );
}

export default RideFooter;