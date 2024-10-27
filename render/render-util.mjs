
import { spawnSync } from "node:child_process"
import { isObject } from "../structure/structure-util.mjs"


export { pandocRender }

function pandocRender(inputFileNames, docsDir, outputFileName) {

    // pandoc cmdline
    let listArgs = optionsArray(inputFileNames, docsDir, outputFileName)


    let soxMergeTrackVoices = spawnSync("pandoc", listArgs)
    if (soxMergeTrackVoices.stderr.length !== 0) {
        console.log(`soxMergeTrackVoices:`, `${soxMergeTrackVoices.stderr}`)
    }



}





function optionsArray(inputFileNames, docsDir, outputFileName) {


    // creates an fileNamesObj to pass in function for destruture
    // avoids having to use order of function arguments
    let fileNamesObj = { inputFileNames, docsDir, outputFileName }

    // this contains the command line options for node child process
    let pandocArray = []

    // there should be a default preset used, optional chaining is there if code is moved
    let renderOptions = docsDir?.preset
    if (renderOptions) {

        // preset arrays can have both strings and objects
        if (Array.isArray(renderOptions)) {
            pandocArray = renderOptions.map(option => {
                return isObject(option)
                    ? evalPresetObj(option, fileNamesObj)
                    : option
                        .split(/\s+/)
                        .filter(x => x)
            })

        }
        else if (isObject(renderOptions)) {
            pandocArray = evalPresetObj(renderOptions, fileNamesObj)
        }

    }


    // flatten all subarrays 
    // since each value needs to be separated by spaces 
    // for node child process
    pandocArray = pandocArray.flat(2)

    // docsDir.outputFileName
    // let title = path.parse(outputFileName)
    let listArgs = [
        ...inputFileNames, // input spreading array
        ...pandocArray, // options 
        // `--metadata`, `title=${title.name}`,
        // "--resource-path", `${docsDir.fullPath}`,
        "-o", outputFileName // output
    ]


    return listArgs

}



function evalPresetObj(renderOptions, fileNamesObj) {

    let pandocArray = []
    // this searches through the rendering options for that book
    for (const key in renderOptions) {
        const value = renderOptions[key];
        // if the options has a truthy value, 
        // then push the string version to the options array   
        // both arrays and strings are pushed and array will be flattened  
        if (value) {
            if (typeof value === "function") {

                // gets the method
                let method = value
                // passes the option's value for that method
                let methodResult = method(fileNamesObj)
                // split the result into an array separated by spaces
                let strArr = methodResult.split(/\s+/)
                // push the returned string to the the pandoc array  
                pandocArray.push(strArr)
            }
            else if (typeof value === "string") {

                // split the result into an array separated by spaces
                let strArr = value.split(/\s+/)
                // push the returned string to the the pandoc array  
                pandocArray.push(strArr)
            }

        }
    }

    return pandocArray


}

