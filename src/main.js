
// adding parameters

function main() {
    let tempo = 78
    // have different options for output, can have presets for SSML for polly, azure, and espeak 
    let preset = "festival" // "festival" or "espeak"


    const { readFileSync } = require('node:fs')
    const MidiParser = require('./colxi-midi-parser.js');
    // get midi as Uint8Array
    let midiFile = readFileSync('/home/mortonmills/tester.midi');
    let midiObj = MidiParser.parse(midiFile);



    const { setAbsDelta } = require('./set-abs-delta.js');
    const { setDuration } = require('./set-duration.js');
    const { setVoices } = require('./set-voices.js');
    const { setLyrics } = require('./set-lyrics.js');
    // mutates midiObj
    setAbsDelta(midiObj)
    // mutates midiObj
    setDuration(midiObj)
    // sets up array of tracks with voices
    let lyricTrackArr = setVoices(midiObj)
    // this restructures the array of lyrics events
    let lyricTrackObj = setLyrics(lyricTrackArr)



    const PPQN = midiObj.timeDivision;
    // sets up markup for festival and espeak




    // const { generateMarkup } = require('./generate-markup.js');
    // const { generateSpeech } = require('./generate-speech.js');
    // const { generateSyllables } = require('./generate-syllables.js');
    // const { generateTimeline } = require('./generate-timeline.js');
    // // this generates markups to input into the compatible text-to-speech program
    // let markupTrackObj = generateMarkup(lyricTrackObj, PPQN, preset, tempo)



    // console.dir(markupTrackObj, { depth: null });
    // // return value is audio in folder
    // generateSpeech(markupTrackObj, preset)
    // // return value is audio in folder
    // generateSyllables(lyricTrackObj)
    // // returns list of filenames to be merged in folder
    // let mergedTrackVoices = generateTimeline(lyricTrackObj, tempo)


    const { genVoices } = require('./gen-voices.js');
    // returns list of filenames to be merged in folder
    let mergedTrackVoices = genVoices(lyricTrackObj, PPQN, preset, tempo)
    



    const { mergeTracks } = require('./merge-tracks.js');
    // return value is audio file in folder
    mergeTracks(mergedTrackVoices, preset)

}

main()