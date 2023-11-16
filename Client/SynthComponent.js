import React, { useEffect, useState, useRef } from 'react';
import * as Tone from 'tone';
import { banjoSettings, fluteSettings, contrabassoonSettings, clarinetSettings,
    saxophoneSettings, synthSettings, celloSettings, generateScale } from './synthHelper.js';

    const SynthComponent = ({l, y, x, circleProp}) => {
    
        const synth = useRef (null);
        const banjo = useRef (null);
        const flute = useRef (null);
        const contrabassoon = useRef (null);;
        const clarinet = useRef (null);
        const saxophone = useRef (null);
        const cello = useRef (null);

        let [keyState, setKeyState] = useState(circleProp.key)
        let [modeState, setModeState] = useState(circleProp.mode)
        let [instrument, setInstrument] = useState("")
        let [synthNotes, setSynthNotes] = useState(generateScale('C2', 'pentatonic'))
        const [instruments, setInstruments] = useState ({})
        
        useEffect(() => {
            console.log("this should only happen once")
            synth.current = new Tone.DuoSynth(synthSettings).toDestination()
            banjo.current =  new Tone.Sampler(banjoSettings).toDestination()
            flute.current = new Tone.Sampler(fluteSettings).toDestination()
            contrabassoon.current = new Tone.Sampler(contrabassoonSettings).toDestination()
            clarinet.current = new Tone.Sampler(clarinetSettings).toDestination()
            saxophone.current = new Tone.Sampler(saxophoneSettings).toDestination()
            cello.current = new Tone.Sampler(celloSettings).toDestination()

            setInstruments({
                banjo: banjo.current,
                clarinet: clarinet.current,
                cello: cello.current,
                synth: synth.current,
                contrabassoon: contrabassoon.current,
                saxophone: saxophone.current,
                flute: flute.current
            })
        }, [])    



    useEffect(() => {
        // when instrument name is set, set the instrument
        if (instruments[circleProp.instrument] && instruments[circleProp.instrument] !== instrument) {
            console.log("changing instrument to", circleProp.instrument)
            if (instrument) instrument.triggerRelease()
            setInstrument(instruments[circleProp.instrument])
            console.log('trigger attack bc of instrument change')
            if (circleProp.instrument == "synth") {
                try {
                    synth.current.triggerAttack('C2') 
                } catch (err) {
                    console.log(err)
                }
            }
        }
    }, [circleProp.instrument, instruments])

    useEffect(() => {
        // when the position or luminosity changes, change the sound

        const note = synthNotes[Math.round(l * (synthNotes.length - 1))];
        if (instrument == synth.current) {
            instrument.setNote(note);
            instrument.vibratoAmount.value = Math.min(Math.max(0, y.toFixed(2)),1) ;
            instrument.harmonicity.value = Math.floor(x*10)
        } else if (instrument) {
            try {
                instrument.triggerAttack(note) 
            } catch (err) {
                console.log(err)
            }
        }
    }, [l, y, x])

    useEffect(() => {
        if (circleProp.key) setKeyState(circleProp.key)
        if (circleProp.mode) setModeState(circleProp.mode)
    }, [circleProp.key, circleProp.mode])

    useEffect(() => {
        console.log("setting the scale", keyState, modeState)
        if (keyState && modeState) setSynthNotes(generateScale(keyState, modeState))
    }, [keyState, modeState])



    return (<></>)
}

export default SynthComponent