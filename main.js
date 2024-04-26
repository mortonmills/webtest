
function main() {
    let tempo = 78
    // have different options for output, can have presets for SSML for polly, azure, and espeak 
    let preset = "festival" // "festival"


    const { readFileSync } = require('node:fs')
    // get midi as Uint8Array
    let midiFile = readFileSync('/home/mortonmills/tester.midi');

    const MidiParser = require('./colxi-midi-parser.js');
    let midiObj = MidiParser.parse(midiFile);

    const PPQN = midiObj.timeDivision;


    const setAbsDelta = require('./set-abs-delta.js');
    const setDuration = require('./set-duration.js');
    const setVoices = require('./set-voices.js');
    // mutates midiObj
    setAbsDelta()
    // mutates midiObj
    setDuration()
    // sets up array of tracks with voices
    let lyricTrackArr = setVoices()
    const setLyrics = require('./set-lyrics.js');
    // this restructures the array of lyrics events
    setLyrics()
    
    
    const setMarkup = require('./generate-markup.js');
    const generateSpeech = require('./generate-speech.js');
    const generateSyllables = require('./generate-syllables.js');
    const generateTimeline = require('./generate-timeline.js');
    // this generates markups to input into the compatible text-to-speech program
    setMarkup()
    generateSpeech()
    generateSyllables()
    generateTimeline()











}