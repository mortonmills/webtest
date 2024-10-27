
import path from 'node:path';
import { pandocRender } from "../../render/render-util.mjs"


export { renderFullDir }


function renderFullDir(docsDir, docsDirContents) {

    // returns all files in the book folder
    let docsDirFiles = docsDirContents
        .filter(content =>
            content.isFile()
            && docsDir.inputType.includes(path.extname(content.name)))

    // fullPath was determined in outer function
    let bookArr = docsDirFiles.map(file => file.fullPath)
    let bookName = docsDir.outputFileName
    // setup key specific options here
    let inputFileNames = bookArr
    let outputFileName = `${docsDir.outputFolder}/${bookName}.${docsDir.outputType}`


    pandocRender(inputFileNames, docsDir, outputFileName)

}