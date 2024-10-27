
import { readdirSync} from 'node:fs';
import path from 'node:path';
import { pandocRender } from "../../render/render-util.mjs"


export { renderSubDir }


function renderSubDir(docsDir, docsDirContents) {

    // returns all subdir of current dir
    // important, recursive dirs are used here
    let subDirObj = docsDirContents.filter(docsDir => docsDir.isDirectory())



    // this adds the top level docsDir into the subdirObj
    // this is used for any files that may be in the main folder as well
    subDirObj.push(docsDir)

    // console.log("subDirObj:", subDirObj)




    for (const subDir of subDirObj) {

        // walking through sub dir

        let options = {
            withFileTypes: true,
            // recursive: true,
        }

        // gets the files of a subDir
        let bookObj = readdirSync(subDir.fullPath, options)

        // finds all the inputFileTypes in the sub dir
        bookObj = bookObj.filter(content => content.isFile() && docsDir.inputType.includes(path.extname(content.name)))
        let bookObjIsEmpty = bookObj.length === 0
        if (bookObjIsEmpty) { continue }
        // console.log("bookObj:", bookObj)

        // adds a fullPath for each markdown file, which is needed for pandoc
        bookObj.forEach(file => file.fullPath = path.join(file.parentPath, file.name))

        // returns an array of file paths 
        // of all markdown files in the current sub dir
        let bookArr = bookObj.map(file => file.fullPath)
        // console.log("bookArr:", bookArr)

        // this section is for naming the book for the sub dir
        // finds starting index of the bookPath within the subdir's fullPath name
        // splits array into name of path, this is for capturing the sub dir's name
        // the child dir names following will be joined 
        // to produce the entire file name for the output book

        // // "parentfolder/src"
        // let pathRegex = new RegExp(docsDir.bookPath)
        // // "/home/parentfolder/src/somefolder"  "parentfolder/src"
        // let indexOfPathStart = subDir.fullPath.search(pathRegex)
        let bookName = subDir.fullPath
            // // "parentfolder/src/somefolder "
            // .slice(indexOfPathStart)
            // [parentfolder,src,somefolder] 
            .split(path.sep)
            // "parentfolder-src-somefolder"
            .join("-")



        // console.log("bookName:", bookName)

        // setup key specific options here
        let inputFileNames = bookArr
        let outputFileName = `${docsDir.outputFolder}/${bookName}.${docsDir.outputType}`

        pandocRender(inputFileNames, docsDir, outputFileName)

    }


    // throw new Error("dfsg")

}