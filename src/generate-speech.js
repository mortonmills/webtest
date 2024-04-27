
// this outputs an audio file(s) of text to speech into a folder
function generateSpeech(markupTrackObj, preset) {

    // this section generates audio from text to speech
    // this uses the markup generated from the lyricTrackArr
    const { spawnSync } = require("node:child_process")

    for (let trackNum = 0; trackNum < markupTrackObj.tracks.length; trackNum++) {
        const track = markupTrackObj.tracks[trackNum];

        for (let voiceNum = 0; voiceNum < track.voices.length; voiceNum++) {
            const voice = track.voices[voiceNum];

            if (preset === "espeak") {


                const { writeFileSync } = require('node:fs')

                writeFileSync(`espeaktrack${trackNum}voice${voiceNum}.txt`, voice)

                let listArgs = [
                    "-s", "60",
                    "-g", "20",
                    "-w", `track${trackNum}voice${voiceNum}.wav`,
                    "-m", `${voice}`,
                    "-v", `Barf`,

                ]


                spawnSync("espeak-ng", listArgs)


            }

            else if (preset === "festival") {

                let { writeFileSync } = require("node:fs")

                // console.log(voice)
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





}

module.exports.generateSpeech = generateSpeech