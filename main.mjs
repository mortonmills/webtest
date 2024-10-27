// import { docsOptions } from "./data/docs-list.mjs"

import { docsGen } from "./index.mjs";
// import { tocData } from "./data/toc-data.mjs";
// import { presets } from "./data/pandoc-data.mjs";

import { homedir } from 'node:os';
import path from 'node:path';

let docsList = [];
// // convert keys into objects mapped to an array
// docsList = [
//     // "pandoc", 
//     // "defSrc", 
//     "urlTest"
// ].map(docsDir => docsOptions[docsDir])

// console.log(path.resolve("test-header.html"))

let zm = {
    inputFolder: `${path.resolve("./")}`,
    inputFiles: [`
        docs/api-examples.md 
        docs/markdown-examples.md 
        docs/README.md 
`],
    inputStructure: "filesfiles",
    // inputType: [".md", ".txt"],
    // recursive: true,

    outputFolder: `${path.resolve("./website/docs")}`,
    outputFileName: "tow",
    outputType: "html",

    preset:  [`
        --toc
        --split-level=2
        --standalone
        --metadata title=tow
        `,
        // --filter ${path.resolve("code-filter.js")}
        // --include-in-header=${path.resolve("test-header.html")}
        
                // {
                //     title: pandocMap["title"],
                // }
        
            ],
}

docsList.push(zm)

docsGen(docsList)