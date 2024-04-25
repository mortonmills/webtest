const { readFileSync } = require('node:fs')

// get midi as Uint8Array
let midiFile = readFileSync('/home/mortonmills/tester.midi');


const MidiParser = require('./colxi-midi-parser.js');

let midiObj = MidiParser.parse(midiFile);

// set absDeltaTime
for (let i = 0; i < midiObj.track.length; i++) {

    // reset absDeltaTime per track
    let absDeltaTime = 0
    for (let j = 0; j < midiObj.track[i].event.length; j++) {
        let deltaTime = midiObj.track[i].event[j]["deltaTime"]

        if (deltaTime !== 0) {
            absDeltaTime += deltaTime
            midiObj.track[i].event[j]["absDeltaTime"] = absDeltaTime
        }
        else {
            midiObj.track[i].event[j]["absDeltaTime"] = absDeltaTime
        }


    }

}

// console.dir(midiObj, { depth: null })

// set duration for noteOn events, 
// will need to look forward for noteOff, 
// then subtract absDeltaTime
midiObj.endTracksAbsDelta = []
for (let i = 0; i < midiObj.track.length; i++) {
    let noteOn = 9
    let noteOff = 8

    for (let j = 0; j < midiObj.track[i].event.length; j++) {

        let metaType = midiObj.track[i].event[j]["metaType"]
        let type = midiObj.track[i].event[j]["type"]
        let absDeltaTime = midiObj.track[i].event[j]["absDeltaTime"]

        // this sets endoftrackAbsDeltaTime for next for the lyric array
        if (type === 255
            && metaType === 47) {
            // this should reflect the tracks array
            // if not, empty tracks would break ordering of this array
            midiObj.endTracksAbsDelta[i] = absDeltaTime
        }


        if (metaType === undefined
            && type === noteOn) {

            let pitch = midiObj.track[i].event[j]["data"][0]
            let channel = midiObj.track[i].event[j]["channel"]

            // next find the noteOff event that shares the same pitch and channel
            // and capture it's absDeltaTime
            for (let k = 0; k < midiObj.track[i].event.length; k++) {

                let metaType2 = midiObj.track[i].event[k]["metaType"]
                let type2 = midiObj.track[i].event[k]["type"]
                let pitch2 = midiObj.track[i].event[k]["data"]?.[0]
                let channel2 = midiObj.track[i].event[k]["channel"]

                // k > j ensures the noteOff comes after the noteOn event
                // must use break here or repeating pitches will overwrite the duration, thus making longer
                if (k > j
                    && metaType2 === undefined
                    && type2 === noteOff
                    && pitch2 === pitch
                    && channel2 === channel) {

                    let noteOnAbsDeltaTime = midiObj.track[i].event[j]["absDeltaTime"]
                    let noteOffAbsDeltaTime = midiObj.track[i].event[k]["absDeltaTime"]
                    midiObj.track[i].event[j]["duration"] = noteOffAbsDeltaTime - noteOnAbsDeltaTime
                    break
                }


            }

        }





    }

}


// have duration and absDeltaTime
// get lyric event and all accompanying noteOn events that share absDeltaTime
// these will be added to the voices property of the lyric event
// duration will allow tts to set rate of, length of syllable generally


let lyricTrackArr = []
for (let i = 0; i < midiObj.track.length; i++) {
    let metaTypeNum = 255
    let lyricNum = 5
    let noteOn = 9

    let track = []
    for (let j = 0; j < midiObj.track[i].event.length; j++) {

        let metaType = midiObj.track[i].event[j]["metaType"]
        let type = midiObj.track[i].event[j]["type"]

        if (type === metaTypeNum
            && metaType === lyricNum) {

            let lyricEvent = {}
            let lyric = midiObj.track[i].event[j]["data"]
            let absDeltaTime = midiObj.track[i].event[j]["absDeltaTime"]
            lyricEvent.lyric = lyric
            lyricEvent.endTrackAbsDelta = midiObj.endTracksAbsDelta[i]
            lyricEvent.voices = []

            // next find events that share the same absDeltaTime as the lyric event
            // and push those values into the voices property of the lyric event
            for (let k = 0; k < midiObj.track[i].event.length; k++) {

                let metaType2 = midiObj.track[i].event[k]["metaType"]
                let type2 = midiObj.track[i].event[k]["type"]
                let absDeltaTime2 = midiObj.track[i].event[k]["absDeltaTime"]


                // conditional for noteOn events
                // will push any matching absDeltaTime to the current lyricEvent.voices
                if (type2 === noteOn
                    && metaType2 === undefined
                    && absDeltaTime2 === absDeltaTime
                ) {

                    let pitch2 = midiObj.track[i].event[k]["data"][0]
                    let velocity2 = midiObj.track[i].event[k]["data"][1]
                    let duration2 = midiObj.track[i].event[k]["duration"]
                    let absDeltaTime2 = midiObj.track[i].event[k]["absDeltaTime"]

                    let midiEvent = {
                        pitch: pitch2,
                        velocity: velocity2,
                        duration: duration2,
                        absDeltaTime: absDeltaTime2
                    }

                    lyricEvent.voices.push(midiEvent)
                }


            }



            track.push(lyricEvent)

        }


    }

    lyricTrackArr.push(track)

}


module.exports.lyricTrackArr = lyricTrackArr; // Exported from require of module
module.exports.PPQN = midiObj.timeDivision;

// console.log(lyricTrackArr)
// console.dir(lyricTrackArr, { depth: null });


// sort pitch events in the voices property of lyric event
// currently set the highest notes first
// when converted to audio the first events will be given priority


