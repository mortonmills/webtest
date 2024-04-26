
// this function sets the duration for each event 
// and sets up the end of track abs delta time.

function setDuration() {


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



}


module.exports.setDuration = setDuration;