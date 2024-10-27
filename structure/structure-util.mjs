
import { readdirSync, mkdirSync, existsSync } from 'node:fs';
import path from 'node:path';
import fs from 'node:fs';

export {
    docsListPrep,
    filesStructure,
    folderStructure,
    filterNoFolders,
    createOutputFolders,
    showDirFilesList,
    isObject,
    filterFileNamesExist,
    convertToFullPath,
}


let filesStructure = ["fullfiles", "subfiles", "filesfiles",]
let folderStructure = ["fullfolder", "subfolder", "filesfolder",]


function docsListPrep(docsList) {

    // checks for required keys in docsList, 
    // supplies defaults if keys are missing

    let docsList2 = []
    for (const oldDocsDir of docsList) {

        let docsDir = structuredClone(oldDocsDir)


        docsDir.inputFiles = docsDir.inputFiles ?? undefined
        docsDir.inputFolder = docsDir.inputFolder ?? undefined

        if (filesStructure.includes(docsDir.inputStructure)) {
            if (docsDir.inputFolder === undefined || docsDir.inputFiles === undefined) {
                throw new Error(`An "inputFolder" and "inputFiles" value is required.`)
            }

            // inputStructure missing, then full
            docsDir.inputStructure = docsDir.inputStructure ?? "fullfiles"


        }
        else if (folderStructure.includes(docsDir.inputStructure)) {
            if (docsDir.inputFolder === undefined) {
                throw new Error(`An "inputFolder" value is required.`)
            }

            // inputStructure missing, then full
            docsDir.inputStructure = docsDir.inputStructure ?? "fulldir"

        }


        // fullpath is needed for other functions, subDir needs for treating top level folder as subdir 
        docsDir.fullPath = docsDir.inputFolder


        // recursive should be false
        docsDir.recursive = docsDir.recursive ?? false
        // inputType missing,
        docsDir.inputType = docsDir.inputType ?? [".md"]



        // outputFolder, dist in the current folder,
        docsDir.outputFolder = docsDir.outputFolder ?? path.resolve(`./dist`)
        // outputFileName, same name as inputFolder
        docsDir.outputFileName = docsDir.outputFileName ?? `${docsDir.inputFolder.split(path.sep).join("-")}`
        // outputType, html
        docsDir.outputType = docsDir.outputType ?? "html"


        let presetDefault = [
            `--toc --split-level=2 --standalone`,
            {
                title: ({ outputFileName }) => {
                    let title = path.parse(outputFileName);
                    return `--metadata title=${title.name}`
                }
            }
        ]
        // preset, basic, 
        docsDir.preset = docsDir.preset ?? presetDefault

        docsList2.push(docsDir)

    }

    docsList = filterNoFolders(docsList2)
    createOutputFolders(docsList)

    return docsList

}



function filterNoFolders(docsList) {
    // this checks to see if the inputFolder exists
    // filter any that do not
    docsList = docsList.filter(docsDir => {
        // since using filter method, will return true, 
        // checks if path exists and is a directory
        // node documentation recommends trying to read then handling error,
        // when checking if is directory, using readdirSync here for directories
        // search for "check for" in node docs
        try { return readdirSync(docsDir.inputFolder) }
        catch { return false }
    })

    return docsList
}

function createOutputFolders(docsList) {

    // for inputFolders that do not throw errors
    // create the outputFolders for those Books in docsList
    docsList.forEach(option => {
        if (!existsSync(option.outputFolder)) {
            // will create parent folders also
            mkdirSync(option.outputFolder, { recursive: true })
        }
    })

}



function showDirFilesList(docsList) {


    for (const docsDir of docsList) {

        let options = {
            // creates dirEnt from node readDirSync
            withFileTypes: true,
            // set with the docsList options array  
            recursive: docsDir.recursive,
        }


        // this is for gathering the tocData not used in main function
        // gets all contents in current folder
        let docsDirContents = readdirSync(docsDir.inputFolder, options)
        // sets up full paths, needed for generating file and folder books 
        docsDirContents.forEach(file => file.fullPath = path.join(file.parentPath, file.name))

        // console.log(
        //     docsDirContents
        // )

        console.log(
            docsDirContents
                .filter(content => content.isFile() && docsDir.inputType.includes(path.extname(content.name)))
                .map(file => path.join(file.parentPath, file.name))
                .join("\n")
        )

    }

    throw new Error("dfsg")


}




function isObject(obj) {
    return typeof obj === "object"
        && obj !== null
        && !Array.isArray(obj)
}



function filterFileNamesExist(inputFileNames) {

    // filters out non-existent filepaths
    inputFileNames = inputFileNames.filter(filepath => {
        let filePathExists = fs.existsSync(filepath)
        if (filePathExists === false) { console.warn(`File "${filepath}" not found. No output.`) }
        return filePathExists
    })


    return inputFileNames
}




function convertToFullPath(fileStrings, docsDir) {
    return fileStrings
        .replace(/ +/g, "")
        .split(/\n+/)
        .filter(x => x)
        // create fullpath here, if inputFolder is present, join both as fullpath
        .map(filepath => path.join(docsDir.inputFolder, filepath))
}