#!/usr/bin/env zx

void async function () {

    // audio file generation


    // duration will give total time needed
    // total duration should include all of the preceding (following) silences and sustains
    // subtract that value with the 
    // length of the syllable 
    // soxi -D <audio-file>
    // and fill in rest with silence
    // the first parameter is the start of track
    // and second is the end
    // pad 0 5

    await $`

    sox -V3 dododo.wav dosplit.wav silence 1 0.1 0% 1 0.2 0% : newfile : restart
    
    syllables="dosplit*.wav"

    `
    console.log($`syllables`)

    // for (const syllable of $`syllables`) {
    //     $`sox ${syllable} "do-pad.wav" pad 0 5`
    // }

    // $`  sox do-pad*.wav super.wav`


}()
