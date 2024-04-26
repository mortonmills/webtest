
function generateMarkup(lyricTrackObj, PPQN, preset, tempo) {


    let { reverseToneMap, espeakPitch, ttsMarkup } = require('./singing-data.js');

    ttsMarkup = ttsMarkup(tempo)
    // have different options for output, can have presets for SSML for polly, azure, and espeak 
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
                            ? `<prosody pitch="${espeakPitch[pitch]}" rate="${100/*duration*/}%">${lyric}</prosody>`
                            : `<prosody pitch="${espeakPitch[pitch]}" rate="${100/*duration*/}%">${lyric}</prosody>`
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


    return markupTrackObj



}

// console.dir(lyricTrackObj, { depth: null });
// console.dir(markupTrackObj, { depth: null });

module.exports.generateMarkup = generateMarkup



