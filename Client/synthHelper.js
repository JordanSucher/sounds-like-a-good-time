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

export const cello = new Tone.Sampler({
    urls: {
    "A2":"A2.mp3",
    "A3":"A3.mp3",
    "A4":"A4.mp3",
    "A5":"A5.mp3",
    "A#2":"As2.mp3",
    "A#3":"As3.mp3",
    "A#4":"As4.mp3",
    "A#5":"As5.mp3",
    "B2":"B2.mp3",
    "B3":"B3.mp3",
    "B4":"B4.mp3",
    "B5":"B5.mp3",
    "C2":"C2.mp3",
    "C3":"C3.mp3",
    "C5":"C5.mp3",
    "C6":"C6.mp3",
    "C#2":"Cs2.mp3",
    "C#3":"Cs3.mp3",
    "C#4":"Cs4.mp3",
    "C#5":"Cs5.mp3",
    "D2":"D2.mp3",
    "D3":"D3.mp3",
    "D5":"D5.mp3",
    "D#2":"Ds2.mp3",
    "D#4":"Ds4.mp3",
    "D#5":"Ds5.mp3",
    "E2":"E2.mp3",
    "E4":"E4.mp3",
    "E5":"E5.mp3",
    "F3":"F3.mp3",
    "F4":"F4.mp3",
    "F5":"F5.mp3",
    "F#3":"Fs3.mp3",
    "F#4":"Fs4.mp3",
    "F#5":"Fs5.mp3",
    "G2":"G2.mp3",
    "G3":"G3.mp3",
    "G4":"G4.mp3",
    "G5":"G5.mp3",
    "G#2":"Gs2.mp3",
    "G#3":"Gs3.mp3",
    "G#4":"Gs4.mp3",
    "G#5":"Gs5.mp3"
    },
    baseUrl: '/cello/',
    attack: 0.5,
    onload: () => {
        console.log("loaded!");
    },
    onerror: (err) => {
        console.log("error! ", err);
    }
}).toDestination();

export const clarinet = new Tone.Sampler({
    urls: {
        "A2":"A2.mp3",
        "A3":"A3.mp3",
        "A4":"A4.mp3",
        "A5":"A5.mp3",
        "A#2":"As2.mp3",
        "A#3":"As3.mp3",
        "A#4":"As4.mp3",
        "A#5":"As5.mp3",
        "B2":"B2.mp3",
        "B3":"B3.mp3",
        "B4":"B4.mp3",
        "C3":"C3.mp3",
        "C4":"C4.mp3",
        "C5":"C5.mp3",
        "C#3":"Cs3.mp3",
        "C#4":"Cs4.mp3",
        "C#5":"Cs5.mp3",
        "D2":"D2.mp3",
        "D3":"D3.mp3",
        "D4":"D4.mp3",
        "D5":"D5.mp3",
        "D#2":"Ds2.mp3",
        "D#3":"Ds3.mp3",
        "D#4":"Ds4.mp3",
        "D#5":"Ds5.mp3",
        "E2":"E2.mp3",
        "E3":"E3.mp3",
        "E4":"E4.mp3",
        "E5":"E5.mp3",
        "F2":"F2.mp3",
        "F3":"F3.mp3",
        "F4":"F4.mp3",
        "F5":"F5.mp3",
        "F#2":"Fs2.mp3",
        "F#3":"Fs3.mp3",
        "F#4":"Fs4.mp3",
        "F#5":"Fs5.mp3",
        "G2":"G2.mp3",
        "G3":"G3.mp3",
        "G4":"G4.mp3",
        "G5":"G5.mp3",
        "G#2":"Gs2.mp3",
        "G#3":"Gs3.mp3",
        "G#4":"Gs4.mp3",
        "G#5":"Gs5.mp3"
        },
    baseUrl: '/clarinet/',
    attack: 0.5,
    onload: () => {
        console.log("loaded!");
    },
    onerror: (err) => {
        console.log("error! ", err);
    }
}).toDestination();

export const banjo = new Tone.Sampler({
    urls : {
        "A3" : "A3.mp3",
        "A4" : "A4.mp3",
        "A5" : "A5.mp3",
        "A#3" : "As3.mp3",
        "A#4" : "As4.mp3",
        "A#5" : "As5.mp3",
        "B3" : "B3.mp3",
        "B4" : "B4.mp3",
        "B5" : "B5.mp3",
        "C3" : "C3.mp3",
        "C4" : "C4.mp3",
        "C5" : "C5.mp3",
        "C#3" : "Cs3.mp3",
        "C#4" : "Cs4.mp3",
        "C#5" : "Cs5.mp3",
        "C#6" : "Cs6.mp3",
        "D3" : "D3.mp3",
        "D4" : "D4.mp3",
        "D5" : "D5.mp3",
        "D6" : "D6.mp3",
        "D#3" : "Ds3.mp3",
        "D#4" : "Ds4.mp3",
        "D#5" : "Ds5.mp3",
        "D#6" : "Ds6.mp3",
        "E3" : "E3.mp3",
        "E4" : "E4.mp3",
        "E5" : "E5.mp3",
        "E6" : "E6.mp3",
        "F3" : "F3.mp3",
        "F4" : "F4.mp3",
        "F5" : "F5.mp3",
        "F#3" : "Fs3.mp3",
        "F#4" : "Fs4.mp3",
        "F#5" : "Fs5.mp3",
        "G3" : "G3.mp3",
        "G5" : "G5.mp3",
        "G#3" : "Gs3.mp3",
        "G#4" : "Gs4.mp3",
    },
    baseUrl: "/banjo/",
    attack: 0.5,
    onload: () => {
        console.log("loaded!");
    },
    onerror: (err) => {
        console.log("error! ", err);
    }
}).toDestination();

let instrument = synth

let instruments = {
    banjo: banjo,
    clarinet: clarinet,
    cello: cello,
    synth: synth
}

export const setInstrument = (newInstrument) => {
    console.log("new instrument", newInstrument)
    if (instruments[newInstrument]) {
        console.log("setting instrument", newInstrument)
        instrument = instruments[newInstrument]
        synth.triggerRelease();
    }
}



let synthNotes = ["C2", "D2", "E2", "F2", "G2", "A2",
"C3", "D3", "E3", "F3", "G3", "A3", "B3",
"C4", "D4", "E4", "F4", "G4", "A4", "B4", "C5"];

function generateScale(rootNoteWithOctave, mode, numOctaves = 3) {
    const notesSharp = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
    const modeIntervals = {
        ionian: [2, 2, 1, 2, 2, 2, 1], // Major scale
        dorian: [2, 1, 2, 2, 2, 1, 2],
        phrygian: [1, 2, 2, 2, 1, 2, 2],
        lydian: [2, 2, 2, 1, 2, 2, 1],
        mixolydian: [2, 2, 1, 2, 2, 1, 2],
        aeolian: [2, 1, 2, 2, 1, 2, 2], // Natural minor scale
        locrian: [1, 2, 2, 1, 2, 2, 2],
        pentatonic: [2, 2, 3, 2, 3] // Pentatonic scale
    };

    const [root, octave] = [rootNoteWithOctave.slice(0, -1), parseInt(rootNoteWithOctave.slice(-1))];
    let scale = [];
    let noteIndex = notesSharp.indexOf(root);
    let currentOctave = octave;
    let totalNotes = modeIntervals[mode].length * numOctaves;

    for (let i = 0; i < totalNotes; i++) {
        scale.push(notesSharp[noteIndex % 12] + currentOctave);
        noteIndex += modeIntervals[mode][i % modeIntervals[mode].length];
        if (noteIndex >= 12) {
            noteIndex -= 12;
            currentOctave++;
        }
    }

    // For pentatonic scales, we need to limit the total number of notes
    if (mode === 'pentatonic') {
        scale = scale.slice(0, 5 * numOctaves);
    }

    return scale;
}

export const setScale = (key, mode) => {
    // console.log("new notes", generateScale(key, mode))
    synthNotes = generateScale(key, mode);
}


Tone.Transport.bpm.value = 125;


export function move({ l, y, x }) {
    // use the x and y values to set the note and vibrato
    const note = synthNotes[Math.round(l * (synthNotes.length - 1))];
    if (instrument == synth) {
        instrument.setNote(note);
        instrument.vibratoAmount.value = Math.min(Math.max(0, y.toFixed(2)),1) ;
        instrument.harmonicity.value = Math.floor(x*10)
    } else {
        instrument.triggerAttack(note)
    }
}

export function triggerAttack({ l, y, x }) {
    // use the x and y values to set the note and vibrato
    const note = synthNotes[Math.round(l * (synthNotes.length - 1))];
    synth.vibratoAmount.value = Math.min(Math.max(0, y.toFixed(2)),1) ;
    synth.harmonicity.value = Math.floor(x*10)
    // console.log("harmonicity", synth.harmonicity.value)
    // console.log("vibrato", synth.vibratoAmount.value)
    // console.log("note", note)
    // synth.triggerAttack(note);
    instrument.triggerAttack(note);

}


export function computeLuminance(rgb) {
    let rgbArr = rgb.split(",");
    const R = rgbArr[0] / 255;
    const G = rgbArr[1] / 255;
    const B = rgbArr[2] / 255;

    const luminance = 0.2126 * R + 0.7152 * G + 0.0722 * B;
    return luminance;
}
