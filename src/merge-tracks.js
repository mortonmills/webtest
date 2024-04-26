

function mergeTracks(){

// skips singular voice in array
// will cause break in sox if not, since singular files cannot be merged
if (mergedTrackVoices.length > 1) {
    console.log("mergedTrackVoices:", mergedTrackVoices)


    // WILL NEED TO USE -M FLAG TO MERGE

    let renderedSinging = `rendered-singing.wav`
    // merges all padded voices file into one voice file
    // vocal harmonies
    // events in parallel

    let listArgs = [
        "-M", // flag to merge audio files
        ...mergedTrackVoices, // input
        renderedSinging, // output
    ]

    spawnSync("sox", listArgs)
}

else {
    console.log("mergedTrackVoices2:", mergedTrackVoices)

    // puts the singular voice file name in the rendered singing file name string
    renderedSinging = mergedTrackVoices[0]
}









let renderedMidi = `rendered-midi.wav`
let midiInput = `/home/mortonmills/tester.midi`
let soundfontPath = "/home/mortonmills/music-assets/soundfonts/FluidR3_GM.sf2"

//adjusts sample rate for espeak and festival output to match the midi file
let sampleRate = preset === "festival" ? "16000" : "22050"
listArgs = [
    soundfontPath, // path to soundfont being used
    "-r", `${sampleRate}`,
    "-F", // convert to audio flag
    renderedMidi, // rendered audio file name
    midiInput // midi file name

]
console.log(listArgs)
spawnSync("fluidsynth", listArgs)



let completeTrack = `complete-singing.wav`

console.log("renderedMidi:", renderedMidi)
console.log("renderedSinging:", renderedSinging)


listArgs = [
    "-M", // flag to merge audio files
    renderedSinging, // input
    renderedMidi, // input
    completeTrack, // output
]

spawnSync("sox", listArgs)







}


module.exports.mergeTracks = mergeTracks