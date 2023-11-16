
import React, {useEffect, useState} from 'react';
import {setScale, setInstrument} from './synthHelper.js';
import { useSearchParams } from 'react-router-dom';
import * as Tone from 'tone'
import SynthSettings from './SynthFooterSettings.js';

const SynthFooter = ({circle1, circle2, numCircles, setNumCircles}) => {
    let [key, setKey] = useState(circle1.key);
    let [key2, setKey2] = useState(circle2.key);

    let [mode, setMode] = useState(circle1.mode);
    let [mode2, setMode2] = useState(circle2.mode);

    let [instrument, setInstrument] = useState(circle1.instrument);
    let [instrument2, setInstrument2] = useState(circle2.instrument);

    let [tempo, setTempo] = useState(circle1.speed);
    let [tempo2, setTempo2] = useState(circle2.speed);

    const [searchParams, setSearchParams] = useSearchParams();

    useEffect(() => {
        // set speed from url
        try{ 
            if (searchParams.get('speed')) {
                setTempo(searchParams.get('speed'))
                circle1.setSpeed(searchParams.get('speed'))
            }
            if (searchParams.get('speed2')) {
                setTempo2(searchParams.get('speed2'))
                circle2.setSpeed(searchParams.get('speed2'))
            }
            // set scale from url
            if (searchParams.get('key')) {
                setKey(searchParams.get('key'))
                circle1.setKey(searchParams.get('key'))
            }
            if (searchParams.get('key2')) {
                setKey2(searchParams.get('key2'))
                circle2.setKey(searchParams.get('key2'))
            }
            if (searchParams.get('mode')) {
                setMode(searchParams.get('mode'))
                circle1.setMode(searchParams.get('mode'))
            }
            if (searchParams.get('mode2')) {
                setMode2(searchParams.get('mode2'))
                circle2.setMode(searchParams.get('mode'))
            }
            // set instrument from url
            if (searchParams.get('instrument')) {
                setInstrument(searchParams.get('instrument'))
                circle1.setInstrument(searchParams.get('instrument'))
            }
            if (searchParams.get('instrument2')) {
                setInstrument2(searchParams.get('instrument2'))
                circle2.setInstrument(searchParams.get('instrument2'))
            }
            // set num circles from url
            if (searchParams.get('circles')) {
                setNumCircles(searchParams.get('circles'))
            }
        } catch (err) {
            console.log(err)
        }
    },[searchParams, circle1, circle2])

    const handleKeyChange = (e, index) => {
        if (index == 1) {
            setKey(e.target.value);
            circle1.setKey(e.target.value);
            setSearchParams({...Object.fromEntries(searchParams.entries()), key: e.target.value})
        } else if (index == 2) {
            setKey2(e.target.value);
            circle2.setKey(e.target.value);
            setSearchParams({...Object.fromEntries(searchParams.entries()), key2: e.target.value})
        }
    }

    const handleModeChange = (e, index) => {
        if (index == 1) {
            setMode(e.target.value);
            circle1.setMode(e.target.value);
            setSearchParams({...Object.fromEntries(searchParams.entries()), mode: e.target.value})
        } else if (index == 2) {
            setMode2(e.target.value);
            circle2.setMode(e.target.value);
            setSearchParams({...Object.fromEntries(searchParams.entries()), mode2: e.target.value})
        }
    }

    const handleInstrumentChange = (e, index) => {
        if (index == 1) {
            setInstrument(e.target.value);
            circle1.setInstrument(e.target.value);
            setSearchParams({ ...Object.fromEntries(searchParams.entries()), instrument: e.target.value})
            Tone.start()
        } else if (index == 2) {
            setInstrument2(e.target.value);
            circle2.setInstrument(e.target.value);
            setSearchParams({...Object.fromEntries(searchParams.entries()), instrument2: e.target.value})
        }
    }

    const handleTempoChange = (e, index) => {
        if (index == 1) {
            circle1.setSpeed(1100 - e.target.value)
            setTempo(1100 - e.target.value)
            setSearchParams({...Object.fromEntries(searchParams.entries()), speed: 1100 - e.target.value})
        } else if (index == 2) {
            circle2.setSpeed(1100 - e.target.value)
            setTempo2(1100 - e.target.value)
            setSearchParams({...Object.fromEntries(searchParams.entries()), speed2: 1100 - e.target.value})
        }
    }

    return (
        <div className="RideFooter" style={{display: "none"}}>
            <label>Number of Circles: 
                <select value={numCircles} onChange={(e) => {
                    setNumCircles(e.target.value)
                    setSearchParams({...Object.fromEntries(searchParams.entries()), circles: e.target.value})
                }}>
                    <option value="1">1</option>
                    <option value="2">2</option>
                </select>
            </label>
        <SynthSettings
            tonic={key}
            mode={mode}
            tempo={tempo}
            instrumentState={instrument}
            setKey={handleKeyChange}
            setMode={handleModeChange}
            setTempo={handleTempoChange}
            setInstrument={handleInstrumentChange}    
            index={1}
        />
        {numCircles == 2 &&
        <SynthSettings
            tonic={key2}
            mode={mode2}
            tempo={tempo2}
            instrumentState={instrument2}
            setKey={handleKeyChange}
            setMode={handleModeChange}
            setTempo={handleTempoChange}
            setInstrument={handleInstrumentChange}
            index={2}
        />
        }

        </div>
    );
}

export default SynthFooter;