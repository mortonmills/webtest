// TEXT TO MUSIC 
// inorder to turn text to music
// 3 data types are needed
// pitch, duration, and velocity
// the api supports rate, pitch, and volume
// firefox does not support many features such as pause() and boundary
// creating pitch and volume are direct
// however, handling time in text to speech is complicated
// for compatibility will need to calibrate pitch values and rate according to each voice


// the api capable of rendering tones only by elongating letters
// ooooooooooooooooooooooooooooooooooooooooooo or rrrrrrrrrrrrrrrrrrrrrrr
// this allows for controlled timing on events,
// if audio files can be captures 
// then multiple sequences can be played simulataneously

// PITCH
// Pitch might be unreliable
// a sample of a voice saying the syllable with varying pitch values
// 1.2 1.5 1.8
// then the recorded audio is scanned under an auto tuner 
// show which values correspond to which pitch
// each voice may have there own default pitch which won't be consistent
// the solution is only voices that have there pitch values determined
// another possibility is that the pitches may change with syllables

// VOLUME
// volume is easy enough to do, just input the value
// in firefox 0 is not silent but only quieter

// TIME
// several time options for the api,

// can use ssml but this works only in chrome and edge
// ssml can be used since break tag is available and can create a timeline with silences
// edge has best support 
// limitations of ssml used will depend on browser
//     only edge supports it
//     https://stackoverflow.com/questions/59665818/detect-if-browser-supports-speech-synthesis-markup-language
//     https://github.com/WICG/speech-api/issues/37#issuecomment-416923362
//     https://github.com/mdn/browser-compat-data/issues/15663
// also voices will be different for os being used

// one is to speak the text as continuous string
// with a string, it might be possible to delay the execution,
// when a word boundary is met, but firefox does not support pause() or boundary
// javascript can be delayed with settimeout with await 
// along with pausing the api, however pause() not available in firefox
// but results were inconsistent

// the other is speaking each syllable individually
// calling as syllables allows for pitch and volume to be distinct for each call
// When syllables are spoken independently, 
// there is a gap of silence in between calls
// the current solution is to have a placeholder syllable,
// this works similarly to metronome
// it helps keep it in background by lowering volume for metronome syllable to 0
// then also giving the syllable a pitch that is the same as the key of the song

// the elasped time of each syllable can be calculated one the utterance is complete
// then this can be compared to tempo and the current rate for the utterance
// the length of each utterance can be determined for that particular voice
// and the duration of each syllable can be controlled
// however no silence is available so another way to create the correct length of silence is needed
// if the audio can captured for the api, then it can be replayed at specific points time
// enabling a working timeline for the music
// can cut audio into pieces and splice together silences
//     then generate file and add to midi player
//     can also play individual bits audio along with player


// TIMBRE
// voice quality will vary from browser and os
// customizing voice needs research
// responsive speech js has demo
// can create custom voices for voice url
// set the voice to monotone and can produce consistent pitch output
// more voice to cover pitch range
// 

// HOW TO USE TEXT AND TIME
// $ dollar 
// () and - slight pause
// , ; ! ? all are long pause
// a,d,f, is said quickly so need to separate with spaces
// capital letters make difference
// can elongate vowels cooooooooold outsiiiiiiiiiide
// ,  = 1 pulse rest
// . followed by capital = 2 pulse rest
// tricks for working with text to speech and how grammar works
//     microsoft used to make music





const synth = window.speechSynthesis;



let voices = [];
const voiceSelect = document.querySelector("select");

function populateVoiceList() {
    voices = synth.getVoices()
        .filter(voice => /Diogo/.test(voice.name)
            && (voice.lang === "en-GB" || voice.lang === "af")
        ) // voice.lang === "en-US" || voice.lang === "en-GB"


    //     .sort(function (a, b) {
    //         const aname = a.name.toUpperCase();
    //         const bname = b.name.toUpperCase();

    //         if (aname < bname) {
    //             return -1;
    //         } else if (aname == bname) {
    //             return 0;
    //         } else {
    //             return +1;
    //         }
    //     });
    // const selectedIndex =
    //     voiceSelect.selectedIndex < 0 ? 0 : voiceSelect.selectedIndex;
    // voiceSelect.innerHTML = "";

    // for (let i = 0; i < voices.length; i++) {
    //     const option = document.createElement("option");
    //     option.textContent = `${voices[i].name} (${voices[i].lang})`;

    //     if (voices[i].default) {
    //         option.textContent += " -- DEFAULT";
    //     }

    //     option.setAttribute("data-lang", voices[i].lang);
    //     option.setAttribute("data-name", voices[i].name);
    //     voiceSelect.appendChild(option);
    // }
    // voiceSelect.selectedIndex = selectedIndex;
}

populateVoiceList();

if (speechSynthesis.onvoiceschanged !== undefined) {
    speechSynthesis.onvoiceschanged = populateVoiceList;
}
