
const { spawnSync } = require("node:child_process")

let ls = spawnSync("ls")

let regex = /^[p]*/g
const string = `${ls.stdout}`.split("/n")
const find = string.filter(el=> regex.test(el));


console.log("this is string:", `${string}`)
console.log("finished regex:", `${find}`)

let trackNum = 1
let voiceNum = 1

        let listArgs = [
        "-s", "60",
        "-g", "20",
            "-w", `track${trackNum}voice${voiceNum}.wav`,
            `${"This is  a test"}`
        ]


spawnSync("espeak-ng", listArgs)


             listArgs = [
                `track${trackNum}voice${voiceNum}.wav`, // input
                `track${trackNum}voice${voiceNum}syllable.wav`, // output, will be multiple wav files 
                "silence",
                // begin period
                "1",
                "0.1", // time of silence definition
                "0%", // volume silence definition
                // end period
                "1",
                "0:0.1", // time of silence definition
                "0%", // volume silence definition
                // looping section
                ":",
                "newfile",
                ":",
                "restart"
            ]

            spawnSync("sox", listArgs)
            
            
            
            
            
            
