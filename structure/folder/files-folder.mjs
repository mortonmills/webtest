
import path from 'node:path';
import { pandocRender } from "../../render/render-util.mjs"

export { renderFilesDir }


function renderFilesDir(docsDir, docsDirContents) {

    let docsDirFiles = docsDirContents
        .filter(content =>
            content.isFile()
            && docsDir.inputType.includes(path.extname(content.name)))


    // console.log("docsDirFiles:", docsDirFiles)

    docsDirFiles.forEach(bookFile => {

        // this section is for naming the book for the sub dir
        // splits array into name of path, this is for capturing the sub dir's name
        // the child dir names following will be joined 
        // to produce the entire file name for the output book
        // let pathRegex = new RegExp(docsDir.bookPath)
        // let indexOfPathStart = bookFile.parentPath.search(pathRegex)
        // let bookName = bookFile.parentPath
        //     // .slice(indexOfPathStart)
        //     .split(path.sep)
        //     .join("-")

        // let bookFileName = path.parse(bookFile.name).name

        // let outputFileName = `${docsDir.outputFolder}/${bookName}-${bookFileName}.${docsDir.outputType}`

        // console.log("bookFileName:", bookFileName)


        // names can be very long like this, need to fix
        let bookName = bookFile.fullPath
            // .slice(indexOfPathStart)
            .split(path.sep)
            .join("-")

        // setup key specific options here
        // since "files" option is a single value, 
        // needs to be set as an array to work with function 
        let inputFileNames = [bookFile.fullPath]
        let outputFileName = `${docsDir.outputFolder}/${bookName}.${docsDir.outputType}`

        pandocRender(inputFileNames, docsDir, outputFileName)


    })





}
