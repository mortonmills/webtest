
// this section takes syllables audio files and pads silence to them
// this fills out the remaining space in the midi timeline
// when complete the audio file will align with the midi file
// and can be used for singing

function generateTimeline(lyricTrackObj, tempo) {


    // this will be multiplied by the beat value to produce a seconds value of beat
    // negative values when using higher tempos
    // will likely need to make audio at low tempos and then speed up to match higher tempos
    const { spawnSync } = require("node:child_process")
    const { writeFileSync } = require('node:fs')


    let mergedTrackVoices = []


    for (let trackNum = 0; trackNum < lyricTrackObj.tracks.length; trackNum++) {

        let track = lyricTrackObj.tracks[trackNum]
        // skips tracks with no data
        if (track.length === 0) { continue }


        let sequencedVoices = []
        for (let voiceNum = 0; voiceNum < track.voices.length; voiceNum++) {


            let paddedSyllableFileNames = []
            let voice = track.voices[voiceNum]
            for (let eventNum = 0; eventNum < voice.events.length; eventNum++) {

                let event = voice.events[eventNum]

                let { lyric,
                    pitch,
                    duration,
                    velocity,
                    absDeltaTime,
                    endTrackAbsDelta
                } = event



                // THIS SECTION MUTATES THE EVENTS VALUES
                // ADDS PADDING TIME VALUES


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












                // THIS SETS UP THE VALUES FOR MARKUP


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


                // will convert syllable only if it exists
                // since multiple voices can be used on one track
                let str;
                if (event) {

                    if (preset === "festival") {

                        // makes sure flats, "b", are not capitalized
                        pitch = pitch[0].toUpperCase() + pitch.slice(1)
                        str = `<PITCH NOTE="${pitch}"><DURATION BEATS="${duration}">${lyric}</DURATION></PITCH>
                            <REST BEATS="${1}"></REST>`
                    }
                    else if (preset === "espeak") {

                        // duration = 100 / duration
                        duration = 50
                        // pitch = espeakPitch[pitch]
                        pitch = 50

                        // duration may go where rate is
                        // add 100% for duration if problems
                        str = `<prosody pitch="${pitch}" rate="${duration}%">${lyric}</prosody>`
                    }


                }


                let { head, tail } =
                    preset === "festival"
                        ? ttsMarkup.festival
                        : ttsMarkup.espeak

                let markupVoice = head + str + tail







                let syllableFileName = `track${trackNum}voice${voiceNum}syllable${eventNum}.wav`
                // THIS SECTION CONVERTS THE MARKUP TO AUDIO
                if (preset === "espeak") {

                    let listArgs = [
                        "-z", // removes final sentence pause at end
                        "-s", "60", // changes word speed, wpm
                        // "-g", "20",
                        "-w", syllableFileName, // this is the file name flgag for output
                        "-m", `${markupVoice}`, // this flag indicates that text is to be markup
                        "-v", `Barf`, // this is the voice name

                    ]


                    spawnSync("espeak-ng", listArgs)


                }

                else if (preset === "festival") {

                    // console.log(voice)
                    // may be possible not to need to write file,
                    // can use string as argument with scheme expression
                    // check text2wave docs
                    let markupFileName = `track${trackNum}voice${voiceNum}.xml`
                    writeFileSync(markupFileName, `${markupVoice}`)


                    let listArgs = [
                        "-mode",
                        "singing",
                        markupFileName,
                        "-o",
                        syllableFileName,
                    ]

                    spawnSync("text2wave", listArgs)

                    // throw new Error("Finished!")

                }






                // THIS SECTION PROCESSES THE SYLLABLE
                // REMOVES EXCESS SILENCE TO PRODUCE ONLY SOUND


                let silenceArgs = [
                    "reverse", // reverses audio
                    "silence", // removes silence
                    // begin period
                    "1", // times until initiating silence removal process
                    "0.1", // time of silence definition
                    "0%", // volume silence definition 
                ]


                let syllableNameClean = syllableFileName + "clean"
                let listArgs = [
                    syllableFileName, // input
                    syllableNameClean, // output, will be multiple wav files 
                    ...silenceArgs,
                ]

                // reverses audio and clean the front of silence
                spawnSync("sox", listArgs)




                listArgs = [
                    syllableNameClean, // input
                    syllableFileName, // output, will be multiple wav files 
                    ...silenceArgs,
                ]
                // rereverses audio and clean the front of silence
                // syllable is restored with removed silence
                spawnSync("sox", listArgs)









                // is possible to use loop to increase duration of syllable to match length in MIDI file
                // however this may sound unnatural, current limit is to ensure that its length does intefere with the need syllable
                // so the duration will be adjusted according to that
                // put simply, the loop is only for reducing the syllable's length, not increasing
                
                let beatInSeconds = 60 / tempo // tempo

                // THIS SECTION DETERMINES THE LENGTH OF PADDING NEEDED FOR THE SYLLABLE

                // duration will give total time needed
                // total duration should include all of the preceding (following) silences and sustains
                // subtract that value with the 
                // length of the syllable 

                let soxiArgs = [
                    "-D",
                    syllableFileName
                ]

                let syllableTimeInSeconds = spawnSync("soxi", soxiArgs).stdout.toString()
                syllableTimeInSeconds = Number(syllableTimeInSeconds)



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
                if (endPad < 0) { endPad = 0 }
                console.log(endPad)
                // what if negative number
















                // THIS SECTION PADS SILENCE TO THE SYLLABLE TO MATCH EVENT'S TIME IN THE MIDI FILE


                let paddedSyllableFileName = `track${trackNum}voice${voiceNum}syllable${syllableNum}padded.wav`

                listArgs = [
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























            let sequencedVoice = `atrack${trackNum}voice${voiceNum}sequenced.wav`


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

























    return mergedTrackVoices


}

module.exports.generateTimeline = generateTimeline