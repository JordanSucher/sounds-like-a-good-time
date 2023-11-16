
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

    let [volume, setVolume] = useState(circle1.volume);
    let [volume2, setVolume2] = useState(circle2.volume);

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
            // set volume from url
            if (searchParams.get('volume')) {
                setVolume(searchParams.get('volume'))
                circle1.setVolume(searchParams.get('volume'))
            }
            if (searchParams.get('volume2')) {
                setVolume2(searchParams.get('volume2'))
                circle2.setVolume(searchParams.get('volume2'))
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
            // e.target.value now in BPM, so
            let ms = 60000 / e.target.value 
            circle1.setSpeed(ms)
            setTempo(ms)
            setSearchParams({...Object.fromEntries(searchParams.entries()), speed: ms})
        } else if (index == 2) {
            let ms = 60000 / e.target.value 
            circle2.setSpeed(ms)
            setTempo2(ms)
            setSearchParams({...Object.fromEntries(searchParams.entries()), speed2: ms})
        }
    }

    const handleVolumeChange = (e, index) => {
        if (index == 1) {
            circle1.setVolume(e.target.value)
            setVolume(e.target.value)
            setSearchParams({...Object.fromEntries(searchParams.entries()), volume: e.target.value})
        } else if (index == 2) {
            circle2.setVolume(e.target.value)
            setVolume2(e.target.value)
            setSearchParams({...Object.fromEntries(searchParams.entries()), volume2: e.target.value})
        }
    }

    return (
        <div className="RideFooter" style={{display: "none"}}>
            <label>
                <span>Circles</span> 
                <select value={numCircles} onChange={(e) => {
                    setNumCircles(e.target.value)
                    setSearchParams({...Object.fromEntries(searchParams.entries()), circles: e.target.value})
                }}>
                    <option value="1">1</option>
                    <option value="2">2</option>
                </select>
            </label>
            <label>
                <span>Zoom</span> 
                <input type="range" min="100" max="1000" onChange={(e) => {
                    document.querySelector("video").style.minHeight=e.target.value+"%"
                    document.querySelector("video").style.minWidth=e.target.value+"%"
                    }}>
                </input>
            </label>
        <SynthSettings
            tonic={key}
            mode={mode}
            tempo={tempo}
            instrumentState={instrument}
            volume={volume}
            setKey={handleKeyChange}
            setMode={handleModeChange}
            setTempo={handleTempoChange}
            setInstrument={handleInstrumentChange}    
            setVolume={handleVolumeChange}
            index={1}
        />
        {numCircles == 2 &&
        <SynthSettings
            tonic={key2}
            mode={mode2}
            tempo={tempo2}
            instrumentState={instrument2}
            volume={volume2}
            setKey={handleKeyChange}
            setMode={handleModeChange}
            setTempo={handleTempoChange}
            setInstrument={handleInstrumentChange}
            setVolume={handleVolumeChange}
            index={2}
        />
        }

        </div>
    );
}

export default SynthFooter;