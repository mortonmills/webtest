

async function sleep(ms) {
    await new Promise(res => setTimeout(res, ms))
}
let tempo = 78
secondsInMinute = 60
let beatTimeSeconds = secondsInMinute / tempo
let beatTimeMilliseconds = Math.floor(beatTimeSeconds * 1000)
let pulse = 4
let pulseTimeMilliseconds = beatTimeMilliseconds / pulse


let syllables = `

- - - -  - - - -  - - - -  - - - -  
- - - -  - - - -  - - - -  - - - -  

- - I, -       give, her, - all,       - my, - love,      - - - -
- - that's, -     all, I, - do,          - oo, - -          - - - -

- - and, -      if, you,  - saw,       - my, - love,     - - - -
-  - you'd, -     love, her,  -  too,       - oo, - -    - and, I, love,


-  -  her,  -    -  -  -  -     -  -   -  -    -  -  -  - 

`
syllables = syllables.replace(/-/g, "").replace(/\s+/g, " ")
    .split(" ").filter(el => el)

let key = "f#"
let tones = `
- - - -  - - - -  - - - -  - - - -  
- - - -  - - - -  - - - -  - - - -  
-  -  f#  -    a  g# -  d#    -  c#  -  e    -  -  -  -
-  -  f#  -    a  g# -  d#    -  c#  -  -    -  -  -  -
-  -  f#  -    a  g# -  d#    -  c#  -  e    -  -  -  -
-  -  e   -    c# a  -  g#    -  f#  -  -    -  c# b  c#
-  -  g#  -    -  -  -  -     -  -   -  -    -  -  -  - 

`



tones = tones.replace(/-/g, "").replace(/\s+/g, " ")
    .split(" ").filter(el => el)

let durations = `
424442 
42442
424442 
42428  
2248
    `
durations = durations.replace(/\n|\s/g, "")
    .split("").filter(el => el)
    .map(el => Number(el) * pulseTimeMilliseconds)


let textPitch = [
    0, .125, .25, .375,
    .5, .625, .75, .875,
    1, 1.125, 1.25, 1.375,
    1.475, 1.6, 1.7, 1.8,
    1.9
] // 1.375,1.5,1.625,1.75,1.875,2]

// need to list octaves for c up to e
let letters = `
c, c#, d#, d,
e, f f# g 
g# a bb b 
c c# d d# 
e`.replace(/\n|\s+/g, " ").split(" ").filter(el => el)
// creates tone object
let letterPitch = {}
textPitch.forEach((el, i) => letterPitch[letters[i]] = el)



function speakSyllables() {
    if (synth.speaking) {
        console.error("speechSynthesis.speaking");
        return;
    }




    for (let i = 0; i < syllables.length; i += 1) { //syllables.length

        let syllable = syllables[i]
        if (syllable === "-") {
            // make function async to use await here
            // await new Promise(res => setTimeout(res, 999))

            let rest = i === 0 || i % 4 === 0 ? "Bi," : "ti,"
            syllable = rest

            const utterThis = new SpeechSynthesisUtterance(syllable);
            utterThis.pitch = letterPitch[key]
            utterThis.rate = rate.value
            utterThis.voice = voices[1];
            utterThis.volume = 0
            synth.speak(utterThis);


            continue
        }
        // else if (syllable === "!") {
        //     break
        // }

        const utterThis = new SpeechSynthesisUtterance(syllable);
        utterThis.pitch = letterPitch[tones[i]]
        utterThis.voice = voices[0];

        // determining duration of syllable by altering the rate
        for (let i = 0; i < rateData.length; i++) {

            // in the case it exceeds the range as more 
            if (i === 0 && durations[i] > rateData[i].duration) {
                utterThis.rate = rateData[i].rate
                break
            }
            // typical case
            else if (durations[i] < rateData[i].duration
                && durations[i] > rateData[i + 1].duration) {
                utterThis.rate = rateData[i].rate
                break
            }
            // in the case it exceeds the range as less 
            // should rarely the end of the rateData array
            else if (i === rateData.length - 1) {
                utterThis.rate = rateData[i].rate
                break
            }

        }



        synth.speak(utterThis);

    }

}



// syllables = "do  ".repeat(textPitch.length).split(" ").filter(el => el)
// let tempo = 0.5;
// let basePercent = 0.40
// let rateData = []
// let percentSound = [.4, .45, .5, .6]
// creates random numbers between 0.5  and 1.5 with decimal place of 3, ex 1.125
//rate.value// 0.65 rate 1s of speech // 1.3 // ((Math.random() + 0.5) + "").slice(0, 4) * 1 // 82bpm
// silence is about 60% of total utter per syllable at lowest rate
// and 40% at highest
// expect around half
// sound to silence 
// 2:3, @0, 2:3, @.5, 28:34, @1, 1:1 @1.5, 3:2 @2
// 40%-40%-45%-50%-60%

// basePercent += i <= 1.5 ? 0.01 : 0.02
// let currentPercent = basePercent
// utterThis.addEventListener("end", (event) => {


//     rateData.push(
//         {
//             rate: utterThis.rate,
//             duration: Math.floor((event.elapsedTime * currentPercent) * 1000),
//             elapsedTime: event.elapsedTime * 1000,
//             basePercent: currentPercent,
//         }
//     )
// })


let rateData =
[
    {
      "rate": 0.5,
      "duration": 604,
      "elapsedTime": 1473.5982418060303,
      "basePercent": 0.41000000000000003
    },
    {
      "rate": 0.6,
      "duration": 494,
      "elapsedTime": 1177.3329973220825,
      "basePercent": 0.42000000000000004
    },
    {
      "rate": 0.7,
      "duration": 404,
      "elapsedTime": 941.5760636329651,
      "basePercent": 0.43000000000000005
    },
    {
      "rate": 0.8,
      "duration": 348,
      "elapsedTime": 791.9829487800598,
      "basePercent": 0.44000000000000006
    },
    {
      "rate": 0.9,
      "duration": 300,
      "elapsedTime": 668.465256690979,
      "basePercent": 0.45000000000000007
    },
    {
      "rate": 1,
      "duration": 276,
      "elapsedTime": 601.2682318687439,
      "basePercent": 0.4600000000000001
    },
    {
      "rate": 1.1,
      "duration": 233,
      "elapsedTime": 497.57757782936096,
      "basePercent": 0.4700000000000001
    },
    {
      "rate": 1.2,
      "duration": 173,
      "elapsedTime": 361.5664839744568,
      "basePercent": 0.4800000000000001
    },
    {
      "rate": 1.3,
      "duration": 157,
      "elapsedTime": 321.69654965400696,
      "basePercent": 0.4900000000000001
    },
    {
      "rate": 1.4,
      "duration": 129,
      "elapsedTime": 259.4422698020935,
      "basePercent": 0.5000000000000001
    },
    {
      "rate": 1.5,
      "duration": 118,
      "elapsedTime": 227.01074182987213,
      "basePercent": 0.5200000000000001
    },
    {
      "rate": 1.6,
      "duration": 86,
      "elapsedTime": 159.57008302211761,
      "basePercent": 0.5400000000000001
    },
    {
      "rate": 1.7,
      "duration": 89,
      "elapsedTime": 160.61456501483917,
      "basePercent": 0.5600000000000002
    },
    {
      "rate": 1.8,
      "duration": 52,
      "elapsedTime": 89.67370539903641,
      "basePercent": 0.5800000000000002
    },
    {
      "rate": 1.9,
      "duration": 55,
      "elapsedTime": 91.73228591680527,
      "basePercent": 0.6000000000000002
    }
  ]




// <prosody pitch="-3st">I</prosody>
// <prosody pitch="+3st">give</prosody>
// <prosody pitch="-1st">her</prosody>
// <prosody pitch="+7st">all</prosody>
// <prosody pitch="-2st">my</prosody>
// <prosody pitch="+3st">love</prosody>


// <prosody pitch="-7st" volume="silent">pause</prosody>
// <break time="2000ms"/>

// <prosody pitch="-3st">that's</prosody>
// <prosody pitch="+3st">all</prosody>
// <prosody pitch="-1st">I</prosody>
// <prosody pitch="+7st">do</prosody>
// <prosody pitch="-2st">oo</prosody>

//    1# 2  3b 3  4  4# 5  6b 6  7b  7   8
// 0  1  2  3  4  5  6  7  8  9  10  11  12

//  <speak>
// <prosody pitch="75">I</prosody>
// <prosody pitch="75">give</prosody>
// <prosody pitch="75">her</prosody>
// <prosody pitch="75">all</prosody>
// <prosody pitch="75">my</prosody>
// <prosody pitch="75">love</prosody>


// <prosody pitch="31" volume="silent">pause</prosody>
// <break time="2000ms"/>

// <prosody pitch="62">that's</prosody>
// <prosody pitch="62">all</prosody>
// <prosody pitch="62">I</prosody>
// <prosody pitch="62">do</prosody>
// <prosody pitch="62">oo</prosody>
// </speak> 

