
let string = syllables.map(el => el === "-" || el === "!" ? "di," : el)
function speakString() {
    if (synth.speaking) {
        console.error("speechSynthesis.speaking");
        return;
    }

    for (let i = 0; i < syllables.length; i++) {

        let syllable = syllables[i]
        if (syllable === "-") {
            syllable = rest
        }
        else if (syllable === "!") {
            break
        }

        const utterThis = new SpeechSynthesisUtterance(string);

        utterThis.pitch = syllables[i] === "-" ? 2 : letterPitch[tones[i]]
        utterThis.rate = 1
        utterThis.voice = voices[0];
        if (syllable === rest) {
            utterThis.volume = 0
        }

        synth.speak(utterThis);

    }



}

