
pause.addEventListener("click", () => {
    synth.pause()
    console.log(synth.paused)
})
play.addEventListener("click", () => {
    if (synth.paused) { synth.resume() }
    else if (synth.speaking) {
        console.error("speechSynthesis.speaking");
    }
    else {
        speakSyllables()
        // speakString()
        // speak()
    }

})

stopSpeech.addEventListener("click", () => { synth.cancel() })



window.addEventListener('keydown', (e) => {
    // Pause and Play Shortcut
    // should a ctrl key alongside character so it can be used within the text editor
    // this it can be heard without unfocusing the text editor
    if ((e.ctrlKey === true || e.metaKey === true) && e.key === ' ') {
        e.preventDefault();
        speakSyllables()
        // speakString()
        // speak()
    }
})


// inputForm.onsubmit = function (event) {
//     event.preventDefault();

// speakSyllables()
// speakString()
//     speak();

//     // inputTxt.blur();
// };

pitch.onchange = function () {
    pitchValue.textContent = pitch.value;
};

rate.onchange = function () {
    rateValue.textContent = rate.value;
};

voiceSelect.onchange = function () {
    speak();
};


