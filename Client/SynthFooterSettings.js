import React, {useEffect} from 'react'
import { Volume } from 'tone';

const SynthSettings = ({tonic, mode, instrumentState,tempo, volume, setKey, setMode, setTempo, setInstrument, index, setVolume}) => {

    return (
        <div className={`SingleSynthSetting ss${index}`}>
            <span>{">>>"}</span>
            <select value={tonic} onChange={(e) => setKey(e, index)}>
                <option value="C2">C</option>
                <option value="D2">D</option>
                <option value="E2">E</option>
                <option value="F2">F</option>
                <option value="G2">G</option>
                <option value="A2">A</option>
                <option value="B2">B</option>
            </select>
            <select value={mode} onChange={(e) => setMode(e, index)}>
                <option value="pentatonic">Pentatonic</option>
                <option value="phrygian">Phrygian</option>
                <option value="ionian">Ionian</option>
                <option value="dorian">Dorian</option>
                <option value="lydian">Lydian</option>
                <option value="mixolydian">Mixolydian</option>
                <option value="aeolian">Aeolian</option>
                <option value="locrian">Locrian</option>
            </select>
            <select value={instrumentState} onChange={(e) => setInstrument(e, index)}>
                <option value="synth">Synth</option>
                <option value="banjo">Banjo</option>
                <option value="clarinet">Clarinet</option>
                <option value="cello">Cello</option>
                <option value="contrabassoon">Contrabassoon</option>
                <option value="saxophone">Saxophone</option>
                <option value="flute">Flute</option>
            </select>
            <input type="number" value={(60/tempo)*1000} min="10" max="1000" step="1" onChange={(e) => setTempo(e, index)} />
            <span style={{fontWeight: "normal"}}>bpm</span>
            <input type="range" value={volume} min='-10' max = '20' step = '.3' onChange={(e) => setVolume(e, index)} />
            <span style={{fontWeight: "normal"}}>vol</span>
        </div>
    );
}

export default SynthSettings