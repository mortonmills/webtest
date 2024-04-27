
// this section takes syllables audio files and pads silence to them
// this fills out the remaining space in the midi timeline
// when complete the audio file will align with the midi file
// and can be used for singing

function generateTimeline(lyricTrackObj, tempo) {


    // this will be multiplied by the beat value to produce a seconds value of beat
    // negative values when using higher tempos
    // will likely need to make audio at low tempos and then speed up to match higher tempos
    const { spawnSync } = require("node:child_process")

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
                if (endPad < 0) { endPad = 0 }
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