
import { isObject, filterFileNamesExist, convertToFullPath } from "../structure-util.mjs"
import { pandocRender } from "../../render/render-util.mjs"

export { renderSubFiles }


function renderSubFiles(docsDir) {

    if (isObject(docsDir.inputFiles) === false) { throw new Error(`"inputFiles" must be an object in "subfiles" "inputStructure".`) }

    let toc = docsDir.inputFiles

    for (const key in toc) {
        const value = toc[key];

        // split the toc string of filepaths into an array of filepaths 
        let inputFileNames = convertToFullPath(value, docsDir)
        
        // filters out non-existent filepaths
        inputFileNames = filterFileNamesExist(inputFileNames)

        //                    /home/books-dist/ bookname -part1 .  html
        let outputFileName = `${docsDir.outputFolder}/${docsDir.outputFileName}-${key}.${docsDir.outputType}`

        pandocRender(inputFileNames, docsDir, outputFileName)

    }

    // sdfg.filter(x => x.length > 0)


    // console.log("toc:", toc)
    // throw new Error("dfsg")


}

