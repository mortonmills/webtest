// import { docsOptions } from "./data/docs-options.mjs"

import { docsGen } from "@mortonmills/docs-gen";
// import { tocGen } from "./data/toc-gen.mjs";
// import { mergeFragments } from "./data/merge-files.mjs";
import { genTest } from "./data/options.js"

// this updates user docs side bar to dist folder
// tocGen()

let docsList = [genTest];

// docsList.push(zm,zn)
// docsList.push(genTest, /* hm */)

docsGen(docsList)
// mergeFragments()

// docsGen([newHtml])

