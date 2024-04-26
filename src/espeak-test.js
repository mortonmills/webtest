


const { lyricTrackArr, PPQN } = require('./parse-midi-time.js');
const { reverseToneMap, espeakPitch } = require('./singing-data.js');
// console.dir(lyricTrackArr, { depth: null });


let tempo = 78
// have different options for output, can have presets for SSML for polly, azure, and espeak 
let preset = "festival" // "festival"


let ttsMarkup = {
    festival: {
        head:
            `
    <?xml version="1.0"?>
    <!DOCTYPE SINGING PUBLIC "-//SINGING//DTD SINGING mark up//EN" 
      "Singing.v0_1.dtd"
    []>
    <SINGING BPM="${tempo}">
    `,
        tail: `
    </SINGING>`

    },

    espeak: {
        head: `
    <speak>
    <voice name="Barf" required="name">
    `,

        tail: `
    </voice>
    </speak>
    `
    },


}


// track1voice2 naming system
// join ssml into string in arr
// array of arrays
// tracks[[voice1SSMLstring, ],[...],[...]]
// tracks track voices voice

// each index of a voice represent an SSML file
// these should then be merged as one file to reflect the track
// audio and track can only be a 1:1, no multiple audio for each voices in a single track 
//  i is track
//  track[j] is lyric
//  and lyric voice is separate vocal lines




// this rearranges the lyricTrackArr for looping through events linearly instead of parallel
// this need for calculating the absDuration which gives the amount of silence needed between each event
let lyricTrackObj = {
    tracks: []
}
for (let i = 0; i < lyricTrackArr.length; i++) {
    let track = lyricTrackArr[i]

    // skips tracks with no data
    if (track.length === 0) { continue }

    let voiceCountMax = 0

    // finds the maximum voice count for that track
    // silence will replace any undefined values for markupVoices event
    for (const lyricEvent of track) {
        if (lyricEvent.voices.length > voiceCountMax) {
            voiceCountMax = lyricEvent.voices.length
        }

    }

    // goes through arrays linearly instead of in parallel
    let lyricVoices = {
        voices: []
    }
    for (let voiceNum = 0; voiceNum < voiceCountMax; voiceNum++) {

        let lyricVoice = {
            events: []
        }
        for (let j = 0; j < track.length; j++) {
            const lyricEvent = track[j];
            const lyricData = lyricEvent.voices[voiceNum];
            let obj = { ...lyricData }

            obj.lyric = lyricEvent.lyric
            obj.endTrackAbsDelta = lyricEvent.endTrackAbsDelta
            lyricVoice.events.push(obj)

        }

        lyricVoices.voices.push(lyricVoice)
    }

    lyricTrackObj.tracks.push(lyricVoices)
}


// console.dir(lyricTrackObj, { depth: null });




let markupTrackObj = {
    tracks: []
}
for (let trackNum = 0; trackNum < lyricTrackObj.tracks.length; trackNum++) {
    let track = lyricTrackObj.tracks[trackNum]

    // skips tracks with no data
    if (track.length === 0) { continue }


    let markupVoices = {
        voices: []
    }
    for (let voiceNum = 0; voiceNum < track.voices.length; voiceNum++) {

        let voice = track.voices[voiceNum]
        let markupVoice = []
        for (let eventNum = 0; eventNum < voice.events.length; eventNum++) {

            let event = voice.events[eventNum]

            let { lyric,
                pitch,
                duration,
                velocity,
                absDeltaTime,
                endTrackAbsDelta
            } = event


            // add the abDuration here, 
            // how to fill in silent events for differing groups of pitches
            // when merged they will stay aligned in time
            // for beg, if absDelta is not zero, add difference
            // will need to look ahead for mid
            // for end will need to find the end of track absdeltatime


            // this is for the first event in the voice,
            // silence may need to be padded at the beginning 
            // if the voice does not start at the beginning of the track, 
            // start is absDeltaTime of 0
            if (eventNum === 0
                && absDeltaTime !== 0) {
                event.beginAbsDuration = absDeltaTime - 0
            }

            // this is for all events except the last one
            let lastEventNum = voice.events.length - 1
            if (eventNum !== lastEventNum) {
                let nextEvent = voice.events[eventNum + 1]
                // this calculates the length of time between currentEvent and nextEvent
                // will be used for padding silence to the end of lyric
                event.endAbsDuration = nextEvent.absDeltaTime - absDeltaTime
            }
            // this is for the last event, 
            // padding end of event with silence
            // this requires knowing where the track ends in absDeltaTime
            else {
                event.endAbsDuration = endTrackAbsDelta - absDeltaTime
            }

            // sets the events durational values to beat value
            // can be converted to seconds with tempo value
            event.duration = event.duration / PPQN
            event.endAbsDuration = event.endAbsDuration / PPQN
            if (event.beginAbsDuration) {
                event.beginAbsDuration = event.beginAbsDuration / PPQN
            }


            // pitch conversion, 60 to c
            // reduces 60 to 12
            let midiPitchConvert = (pitch % 12) + 12
            // changes to string 12 to "12"
            midiPitchConvert = String(midiPitchConvert)
            // looks up value of "12" to "c" 
            midiPitchConvert = reverseToneMap[midiPitchConvert]

            // octaves, 60 to 4, (c4)
            // midi has a -1 octave so 60 is c4 not c5
            // so an octave is removed 
            let octave = Math.floor(pitch / 12) - 1
            octave = String(octave)
            pitch = midiPitchConvert + octave

            // duration is divided by ppqn, duration of 20 / ppqn 40 renders an 8th note at 0.5
            duration = duration / PPQN

            let str;
            // for unused voices
            if (preset === "festival") {

                // makes sure flats, "b", are not capitalized
                pitch = pitch[0].toUpperCase() + pitch.slice(1)
                str =
                    pitch === undefined
                        ? `<PITCH NOTE="${pitch}"><DURATION BEATS="${duration}">${lyric}</DURATION></PITCH>`
                        : `<PITCH NOTE="${pitch}"><DURATION BEATS="${duration}">${lyric}</DURATION></PITCH>
                        <REST BEATS="${1}"></REST>`
            }
            else if (preset === "espeak") {

                duration = 100 / duration
                str =
                    pitch === undefined
                        // duration may go where rate is
                        ? `<prosody pitch="${espeakPitch[pitch]}" rate="${100}%">${lyric}</prosody>`
                        : `<prosody pitch="${espeakPitch[pitch]}" rate="${100}%">${lyric}</prosody>`
            }


            markupVoice.push(str)

        }



        // singing markupVoices per voice, typically one voice
        markupVoice = markupVoice.join("\n")

        let { head, tail } =
            preset === "festival"
                ? ttsMarkup.festival
                : ttsMarkup.espeak

        markupVoice = head + markupVoice + tail
        markupVoices.voices.push(markupVoice)

    }

    markupTrackObj.tracks.push(markupVoices)


}



// console.dir(lyricTrackObj, { depth: null });
// console.dir(markupTrackObj, { depth: null });






























// convert singing markupVoices to audio here
// then do processing on audio

// this section generates audio from text to speech
// this uses the markup generated from the lyricTrackArr
const { spawnSync } = require("node:child_process")

for (let trackNum = 0; trackNum < markupTrackObj.tracks.length; trackNum++) {
    const track = markupTrackObj.tracks[trackNum];

    for (let voiceNum = 0; voiceNum < track.voices.length; voiceNum++) {
        const voice = track.voices[voiceNum];

        if (preset === "espeak") {

            let listArgs = [
                // "-s", "60",
                "-g", "20",
                "-w", `track${trackNum}voice${voiceNum}.wav`,
                "-m", `${voice}`
            ]


            spawnSync("espeak-ng", listArgs)


        }

        else if (preset === "festival") {

            let { writeFileSync } = require("node:fs")

            console.log(voice)
            // may be possible not to need to write file,
            // can use string as argument with scheme expression
            // check text2wave docs
            let markupFileName = `track${trackNum}voice${voiceNum}.xml`
            writeFileSync(markupFileName, `${voice}`)


            let listArgs = [
                "-mode",
                "singing",
                markupFileName,
                "-o",
                `track${trackNum}voice${voiceNum}.wav`,
            ]



            spawnSync("text2wave", listArgs)

            // throw new Error("Finished!")

        }

    }

}

// this section split the audio into syllables
// using silence as a delimiter

for (let trackNum = 0; trackNum < lyricTrackObj.tracks.length; trackNum++) {

    let track = lyricTrackObj.tracks[trackNum]
    // skips tracks with no data
    if (track.length === 0) { continue }

    for (let voiceNum = 0; voiceNum < track.voices.length; voiceNum++) {

        let voice = track.voices[voiceNum]

        let listArgs = [
            `track${trackNum}voice${voiceNum}.wav`, // input
            `track${trackNum}voice${voiceNum}syllable.wav`, // output, will be multiple wav files 
            "silence",
            // begin period
            "1",
            "0.5", // time of silence definition
            "2%", // volume silence definition
            // end period
            "1",
            "0.001", // time of silence definition
            "2%", // volume silence definition
            // looping section
            ":",
            "newfile",
            ":",
            "restart"
        ]

        spawnSync("sox", listArgs)


    }

}





// this section takes syllables audio files and pad silence to them
// this fills out the remaining space in the midi timeline
// when complete the audio file will align with the midi file
// and can be used for singing

// this will be multiplied by the beat value to produce a seconds value of beat
// negative values when using higher tempos
// will likely need to make audio at low tempos and then speed up to match higher tempos

let mergedTrackVoices = []
let beatInSeconds = 60 / tempo // tempo
for (let trackNum = 0; trackNum < lyricTrackObj.tracks.length; trackNum++) {

    let track = lyricTrackObj.tracks[trackNum]
    // skips tracks with no data
    if (track.length === 0) { continue }


    let sequencedVoices = []
    for (let voiceNum = 0; voiceNum < track.voices.length; voiceNum++) {


        let paddedSyllableFileNames = []
        let voice = track.voices[voiceNum]
        for (let eventNum = 0; eventNum < voice.events.length; eventNum++) {


            // duration will give total time needed
            // total duration should include all of the preceding (following) silences and sustains
            // subtract that value with the 
            // length of the syllable 

            // the padstart following how sox names multiple files
            // sox names start at 1 instead of 0
            // so "file001"
            let syllableNum = `${eventNum + 1}`.padStart(3, "0")
            let syllableFileName = `track${trackNum}voice${voiceNum}syllable${syllableNum}.wav`


            let soxiArgs = [
                "-D",
                `track${trackNum}voice${voiceNum}syllable${syllableNum}.wav`
            ]

            let syllableTimeInSeconds = spawnSync("soxi", soxiArgs).stdout.toString()
            syllableTimeInSeconds = Number(syllableTimeInSeconds)

            let event = voice.events[eventNum]



            // and then prepend a silence on first lyric if greater than 0
            // amd then when track ends take absolute time for final lyric
            // --a--, test--, lyric--
            // will usually be zero unless first syllable does not start at beginning of song-
            let beginPad =
                event.beginAbsDuration
                    ? event.beginAbsDuration * beatInSeconds
                    : 0
            // the syllable's time is subtracted from the endPad 
            // since syllables time are measured from where they began
            let endPad = event.endAbsDuration * beatInSeconds
            endPad = endPad - syllableTimeInSeconds

            // in case the value is negative
            // this is temporary solution to syllables being longer than duration to next syllable
            // the timing will still be off until corrected
            if(endPad < 0){endPad = 0}
            console.log(endPad)
            // what if negative number

            let paddedSyllableFileName = `track${trackNum}voice${voiceNum}syllable${syllableNum}padded.wav`

            let listArgs = [
                syllableFileName, // input
                paddedSyllableFileName, // output, will be multiple wav files 
                "pad",
                beginPad, // add 3 secs of silence at beginning of file
                endPad, // add 3 secs of silence at end of file
            ]

            spawnSync("sox", listArgs)

            // is an array strings used for merging files
            paddedSyllableFileNames.push(paddedSyllableFileName)

        }


        let sequencedVoice = `qtrack${trackNum}voice${voiceNum}sequenced.wav`


        // puts padded syllables in sequence, linear
        let listArgs = [
            ...paddedSyllableFileNames, // input
            sequencedVoice, // output,
        ]

        spawnSync("sox", listArgs)


        sequencedVoices.push(sequencedVoice)


    }


    // skips singular voice in array
    // will cause break in sox if not, since singular files cannot be merged
    if (sequencedVoices.length > 1) {
        console.log("sequencedVoices:", sequencedVoices)
        let mergedTrackVoice = `track${trackNum}voice-final.wav`
        // merges all padded voices file into one voice file
        // events in parallel

        let listArgs = [
            "-M", // flag to merge audio files
            ...sequencedVoices, // input
            mergedTrackVoice, // output
        ]

        spawnSync("sox", listArgs)


        mergedTrackVoices.push(mergedTrackVoice)
    }
    else {
        console.log("sequencedVoices2:", sequencedVoices)
        // puts the singular voice file name in the merged track voices array
        mergedTrackVoices = sequencedVoices
    }



}




// skips singular voice in array
// will cause break in sox if not, since singular files cannot be merged
if (mergedTrackVoices.length > 1) {
    console.log("mergedTrackVoices:", mergedTrackVoices)


    // WILL NEED TO USE -M FLAG TO MERGE

    let renderedSinging = `rendered-singing.wav`
    // merges all padded voices file into one voice file
    // vocal harmonies
    // events in parallel

    let listArgs = [
        "-M", // flag to merge audio files
        ...mergedTrackVoices, // input
        renderedSinging, // output
    ]

    spawnSync("sox", listArgs)
}

else {
    console.log("mergedTrackVoices2:", mergedTrackVoices)

    // puts the singular voice file name in the rendered singing file name string
    renderedSinging = mergedTrackVoices[0]
}









let renderedMidi = `rendered-midi.wav`
let midiInput = `/home/mortonmills/tester.midi`
let soundfontPath = "/home/mortonmills/music-assets/soundfonts/FluidR3_GM.sf2"

//adjusts sample rate for espeak and festival output to match the midi file
let sampleRate = preset === "festival" ? "16000" : "22050"
listArgs = [
    soundfontPath, // path to soundfont being used
    "-r", `${sampleRate}`,
    "-F", // convert to audio flag
    renderedMidi, // rendered audio file name
    midiInput // midi file name

]
console.log(listArgs)
spawnSync("fluidsynth", listArgs)



let completeTrack = `complete-singing.wav`

console.log("renderedMidi:", renderedMidi)
console.log("renderedSinging:", renderedSinging)


listArgs = [
    "-M", // flag to merge audio files
    renderedSinging, // input
    renderedMidi, // input
    completeTrack, // output
]

spawnSync("sox", listArgs)
















