
// adding parameters

function main() {
    let tempo = 78
    // have different options for output, can have presets for SSML for polly, azure, and espeak 
    let preset = "festival" // "festival" or "espeak"


    const { readFileSync } = require('node:fs')
    // get midi as Uint8Array
    let midiFile = readFileSync('/home/mortonmills/tester.midi');

    const MidiParser = require('./colxi-midi-parser.js');
    let midiObj = MidiParser.parse(midiFile);


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
    let lyricTrackObj = setLyrics()




    const PPQN = midiObj.timeDivision;
    const { reverseToneMap, espeakPitch, singingData } = require('./singing-data.js');
    // sets up markup for festival and espeak
    let ttsMarkup = singingData(tempo)

    const generateMarkup = require('./generate-markup.js');
    const generateSpeech = require('./generate-speech.js');
    const generateSyllables = require('./generate-syllables.js');
    const generateTimeline = require('./generate-timeline.js');
    // this generates markups to input into the compatible text-to-speech program
    let markupTrackObj = generateMarkup()
    generateSpeech()
    generateSyllables()
    let mergedTrackVoices = generateTimeline(tempo)


    const mergeTracks = require('./merge-tracks.js');
    mergeTracks(mergedTrackVoices)











}