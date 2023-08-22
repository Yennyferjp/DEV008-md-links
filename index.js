const {
    isPathValid,
    getMDFilesInDirectory,
    readMDFile,
    findLinksInMDText,
    validateLinks,
    isDirectory,
} = require("./functions.js");

//ruta de archivo, lee su contenido y busca enlaces en él. 
const getLinksFromMarkdownFile = (filePath) => {
    const mdText = readMDFile(filePath);
    return findLinksInMDText(mdText, filePath);
};

const getLinksFromDirectoryRecursive = (dirPath) => {

    const allLinks = [];
    const paths = getMDFilesInDirectory(dirPath);

    for (const path of paths) {

        if (path.endsWith('.md')) {
            const links = getLinksFromMarkdownFile(path);
            allLinks.push(...links);
        } else if (isDirectory(path)) {
            const subLinks = getLinksFromDirectoryRecursive(path);
            allLinks.push(...subLinks);
        }
    }
    return allLinks;
};

const mdLinks = (path, options) => {
    return new Promise((resolve, reject) => {
        try {
            const pathCheck = isPathValid(path);

            if (pathCheck.isDir) {
                const allLinks = getLinksFromDirectoryRecursive(pathCheck.path);
                resolve(allLinks);
            } else if (pathCheck.isMarkdown) {
                const links = getLinksFromMarkdownFile(pathCheck.path);

                if (options.validate) {
                    const results = validateLinks(links);
                    resolve(Promise.all(results));
                } else {
                    resolve(links.map(link => ({
                        href: link.href,
                        text: link.text,
                        file: link.file,
                        line: link.line,
                        status: 0,
                        ok: true,
                    })));
                }
            } else {
                reject(new Error('La ruta no es válida ni un directorio ni un archivo .md.'));
            }
        } catch (error) {
            reject(error);
        }
    });
};

module.exports = {
    mdLinks,
};


// const getLinksFromDirectoryRecursive = (dirPath, allLinks) => {

//     allLinks = allLinks === undefined ? [] : allLinks;
//     const paths = getMDFilesInDirectory(dirPath);

//     for (const path of paths) {

//         if (path.endsWith('.md')) {
//             const links = getLinksFromMarkdownFile(path);
//             allLinks.push(...links);
//         } else if (isDirectory(path)) {
//             getLinksFromDirectoryRecursive(path, allLinks);
//         }
//     }
//     return allLinks;
// };
