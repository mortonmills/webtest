
// this section split the audio into separate audio files of syllables
// using silence as a delimiter


function generateSyllables() {



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






}

module.exports.generateSyllables = generateSyllables