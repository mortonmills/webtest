
import os from "node:os"
import path from "node:path"


export { genTest }

let genTest = {
    inputFolder: `${path.resolve(`./docs`)}`,
    // inputFiles: `${path.resolve("/home/mortonmills/def/docs/website/FAQ.md")}`,
    // inputFiles: [`types/pitch/pitch-modes-overview.md`,`types/pitch/pitch-settings-overview.md`],
    inputFiles: [`index.md`],
    // inputFiles: [`home.md`],
    inputStructure: "filesfiles",
    inputType: [".md"],
    recursive: true,

    // outputFolder: `${path.resolve("/home/mortonmills/def/packages/ssg/dist")}`,
    outputFolder: `./`,
    // outputFileName: "index",
    outputType: "html",
    // --resource-path=${path.resolve("/home/mortonmills/def/assets/images")}
    preset: [
        [
            // `--toc`,
            // `--standalone`,
            // `--resource-path=${path.resolve(`./`)}`,
            // `--embed-resources`,
            // `--split-level=2`,
            // `--include-before-body=${siteLinks.mainHeader}`,
            // `--include-before-body=${siteLinks.navBar}`,

            // `--include-before-body=${siteLinks.beginMainContent}`,
            // `--include-before-body=${siteLinks.userDocsSideBar}`,

            // `--include-before-body=${siteLinks.beginSectionContent}`,


            // `--include-after-body=${siteLinks.endSectionContent}`,

            // `--include-after-body=${siteLinks.endMainContent}`,
            // `--include-after-body=${siteLinks.mainFooter}`,
            // `--filter=${path.resolve("filters/code-example-filter.js")}`,
            // `--filter=${path.resolve("filters/home-page-filter.js")}`,
            // `--css=${path.resolve("styles/home-page.css")}`,
        ],

    ],
}

