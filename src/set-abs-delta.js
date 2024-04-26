function setAbsDelta(){

// set absDeltaTime
// events are parsed relatively
// this gives each event an absolute time
// this is needed to determine duration and aid in accurately timing the audio track
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


}


module.exports.setAbsDelta = setAbsDelta;
