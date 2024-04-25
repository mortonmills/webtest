
function speak() {


    if (inputTxt.value !== "") {


        const utterThis = new SpeechSynthesisUtterance(inputTxt.value);

        utterThis.addEventListener("pause", (event) => {
            console.log(
                `doesn't work`,
            );
        });


        utterThis.pitch = pitch.value
        utterThis.rate = rate.value
        utterThis.voice = voices[0]
        utterThis.onend = function (event) {
            console.log("SpeechSynthesisUtterance.onend");
        };

        utterThis.onerror = function (event) {
            console.error("SpeechSynthesisUtterance.onerror");
        };

        // const selectedOption =
        //     voiceSelect.selectedOptions[0].getAttribute("data-name");

        // for (let i = 0; i < voices.length; i++) {
        //     if (voices[i].name === selectedOption) {
        //         utterThis.voice = voices[i];
        //         break;
        //     }
        // }

        synth.speak(utterThis);

    }

}
