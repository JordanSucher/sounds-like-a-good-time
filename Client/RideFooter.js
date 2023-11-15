
import React, {useEffect, useState} from 'react';
import {setScale, setInstrument} from './synthHelper.js';
import { useSearchParams } from 'react-router-dom';

const RideFooter = ({setSpeed, speed}) => {
    let [key, setKey] = useState("C2");
    let [mode, setMode] = useState("pentatonic");
    let [instrumentState, setInstrumentState] = useState("synth");
    let [tempo, setTempo] = useState(speed);

    const [searchParams, setSearchParams] = useSearchParams();

    useEffect(() => {
        if (searchParams.get('speed')) {
            setSpeed(searchParams.get('speed'))
            setTempo(searchParams.get('speed'))
        }
        if (searchParams.get('key')) {
            setKey(searchParams.get('key'))
            setScale(searchParams.get('key'), mode)
        }
        if (searchParams.get('mode')) {
            setMode(searchParams.get('mode'))
            setScale(key, searchParams.get('mode'))
        }
        if (searchParams.get('instrument')) {
            setInstrument(searchParams.get('instrument'))
            setInstrumentState(searchParams.get('instrument'))
        }
        
    },[searchParams])

    const handleKeyChange = (e) => {
        setKey(e.target.value);
        setScale(e.target.value, mode);
        setSearchParams({key: e.target.value, mode: mode, instrument: instrumentState, speed: tempo})
    }

    const handleModeChange = (e) => {
        setMode(e.target.value);
        setScale(key, e.target.value);
        setSearchParams({key: key, mode: e.target.value, instrument: instrumentState, speed: tempo})
    }

    return (
        <div className="RideFooter" style={{display: "none"}}>
            Settings
            <select value={key} onChange={(e) => handleKeyChange(e)}>
                <option value="C2">C</option>
                <option value="D2">D</option>
                <option value="E2">E</option>
                <option value="F2">F</option>
                <option value="G2">G</option>
                <option value="A2">A</option>
                <option value="B2">B</option>
            </select>
            <select value={mode} onChange={(e) => handleModeChange(e)}>
                <option value="pentatonic">Pentatonic</option>
                <option value="phrygian">Phrygian</option>
                <option value="ionian">Ionian</option>
                <option value="dorian">Dorian</option>
                <option value="lydian">Lydian</option>
                <option value="mixolydian">Mixolydian</option>
                <option value="aeolian">Aeolian</option>
                <option value="locrian">Locrian</option>
            </select>
            <select value={instrumentState} onChange={(e) => {
                setInstrument(e.target.value)
                setInstrumentState(e.target.value)
                setSearchParams({
                    key: key,
                    mode: mode,
                    instrument: e.target.value,
                    speed: tempo})
            }
            }>
                <option value="synth">Synth</option>
                <option value="banjo">Banjo</option>
                <option value="clarinet">Clarinet</option>
                <option value="cello">Cello</option>
                <option value="contrabassoon">Contrabassoon</option>
                <option value="saxophone">Saxophone</option>
                <option value="flute">Flute</option>
            </select>
            <input type="range" value={speed} min="100" max="1000" step="1" onChange={(e) => {
                setSpeed(1100 - e.target.value)
                setTempo(1100 - e.target.value)
                setSearchParams({
                    key: key,
                    mode: mode,
                    instrument: instrumentState,
                    speed: e.target.value})
            }
            }/>
        </div>
    );
}

export default RideFooter;