
import { readdirSync } from 'node:fs';

import path from 'node:path';

import { docsListPrep, filesStructure, folderStructure } from "./structure/structure-util.mjs"

import { renderFullDir } from "./structure/folder/full-folder.mjs"
import { renderSubDir } from "./structure/folder/sub-folder.mjs"
import { renderFilesDir } from "./structure/folder/files-folder.mjs"

import { renderSubFiles } from "./structure/files/sub-files.mjs"
import { renderFullFiles } from "./structure/files/full-files.mjs"

export { docsGen }

// docsList will be an array of objects with options
// the toc is only used for files type inputStructure
function docsGen(docsList) {

    docsList = docsListPrep(docsList)

    // this is for gathering the tocData not used in main function
    // showDirFilesList(docsList)


    // next stage is to render according to options in docsList docsDir
    for (const docsDir of docsList) {


        // fullfiles and filesfiles share similar logic so are in same function
        if (filesStructure.includes(docsDir.inputStructure)) {
            if (docsDir.inputStructure === "fullfiles") { renderFullFiles(docsDir) }
            else if (docsDir.inputStructure === "subfiles") { renderSubFiles(docsDir) }
            else if (docsDir.inputStructure === "filesfiles") { renderFullFiles(docsDir) }
        }



        else if (folderStructure.includes(docsDir.inputStructure)) {

            let options = {
                withFileTypes: true, // creates dirEnt from node readDirSync
                recursive: docsDir.recursive, // set with the docsList options array  
            }

            // gets all contents in current dir
            let docsDirContents = readdirSync(docsDir.inputFolder, options)
            // sets up full paths, needed for generating file and dir books 
            docsDirContents.forEach(file => file.fullPath = path.join(file.parentPath, file.name))

            if (docsDir.inputStructure === "fullfolder") { renderFullDir(docsDir, docsDirContents) }
            else if (docsDir.inputStructure === "subfolder") { renderSubDir(docsDir, docsDirContents) }
            else if (docsDir.inputStructure === "filesfolder") { renderFilesDir(docsDir, docsDirContents) }
        }

    }




}