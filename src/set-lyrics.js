function setLyrics(lyricTrackArr) {

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


    return lyricTrackObj


}

module.exports.setLyrics = setLyrics


