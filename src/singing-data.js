

let espeakPitch =
{
    "c2": 0, //one octave down
    "c#2": 4, // 
    "d2": 8, // 2
    "eb2": 12, //
    "e2": 16.25, // 3
    "f2": 21, // 4
    "f#2": 25, //
    "g2": 29, // 5
    "g#2": 33.25, //
    "a2": 37.5, // 6
    "bb2": 41.75, //
    "b2": 46, // 7 
    "c3": 50, // base value
    "c#3": 54.25, //
    "d3": 58.5, // 2
    "eb3": 62.75, //
    "e3": 67, // 3 
    "f3": 71.25, // 4 
    "f#3": 75.5, // 
    "g3": 79.75, // 5
    "g#3": 84, //
    "a3": 88.25, // 6
    "bb3": 92.5, //
    "b3": 96.75, // 7
    // 100 is one octave up
}

// this tonemap is different def
// this uses "b" instead of "&" for flats
let reverseToneMap =
{
    "12": "c",
    "13": "db",
    "14": "d",
    "15": "eb",
    "16": "e",
    "17": "f",
    "18": "gb",
    "19": "g",
    "20": "ab",
    "21": "a",
    "22": "bb",
    "23": "b"
}


module.exports.espeakPitch = espeakPitch;
module.exports.reverseToneMap = reverseToneMap;