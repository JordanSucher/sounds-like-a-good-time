import * as Tone from 'tone';

export const synth = new Tone.DuoSynth({
    vibratoAmount: 0.5,
    vibratoRate: 5,
    portamento: 0.1,
    harmonicity: 1.005,
    volume: 5,
    voice0: {
        oscillator: {
            type: "sawtooth"
        },
        filter: {
            Q: 1,
            type: "lowpass",
            rolloff: -24
        },
        envelope: {
            attack: 0.01,
            decay: 0.25,
            sustain: 0.4,
            release: 1.2
        },
        filterEnvelope: {
            attack: 0.001,
            decay: 0.05,
            sustain: 0.3,
            release: 2,
            baseFrequency: 100,
            octaves: 4
        }
    },
    voice1: {
        oscillator: {
            type: "sawtooth"
        },
        filter: {
            Q: 2,
            type: "bandpass",
            rolloff: -12
        },
        envelope: {
            attack: 0.25,
            decay: 4,
            sustain: 0.1,
            release: 0.8
        },
        filterEnvelope: {
            attack: 0.05,
            decay: 0.05,
            sustain: 0.7,
            release: 2,
            baseFrequency: 5000,
            octaves: -1.5
        }
    }
}).toDestination();

const synthNotes = ["C2", "E2", "G2", "A2",
    "C3", "D3", "E3", "G3", "A3", "B3",
    "C4", "D4", "E4", "G4", "A4", "B4", "C5"];

Tone.Transport.bpm.value = 125;


export function move({ l, y, x }) {
    // use the x and y values to set the note and vibrato
    const note = synthNotes[Math.round(l * (synthNotes.length - 1))];
    synth.setNote(note);
    synth.vibratoAmount.value = Math.min(Math.max(0, y.toFixed(2)),1) ;
    synth.harmonicity.value = Math.floor(x*10)
    // console.log("harmonicity", synth.harmonicity.value)
    // console.log("vibrato", synth.vibratoAmount.value)
    // console.log("note", note)


}

export function triggerAttack({ l, y, x }) {
    // use the x and y values to set the note and vibrato
    const note = synthNotes[Math.round(l * (synthNotes.length - 1))];
    synth.vibratoAmount.value = Math.min(Math.max(0, y.toFixed(2)),1) ;
    synth.harmonicity.value = Math.floor(x*10)
    // console.log("harmonicity", synth.harmonicity.value)
    // console.log("vibrato", synth.vibratoAmount.value)
    // console.log("note", note)
    synth.triggerAttack(note);

}

export function computeLuminance(rgb) {
    let rgbArr = rgb.split(",");
    const R = rgbArr[0] / 255;
    const G = rgbArr[1] / 255;
    const B = rgbArr[2] / 255;

    const luminance = 0.2126 * R + 0.7152 * G + 0.0722 * B;
    return luminance;
}
