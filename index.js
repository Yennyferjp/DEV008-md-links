const {
    isPathValid,
    getMDFilesInDirectory,
    readMDFile,
    findLinksInMDText,
    validateLinks,
} = require("./functions.js");

//ruta de archivo, lee su contenido y busca enlaces en él. 
const getLinksFromMarkdownFile = (filePath) => {
    const mdText = readMDFile(filePath);
    return findLinksInMDText(mdText, filePath);
};
const mdLinks = (path, options) => {
    return new Promise((resolve, reject) => {
        try {
            const pathCheck = isPathValid(path);

            if (pathCheck.isDir) {
                const allLinks = getLinksFromDirectoryRecursive(pathCheck.path, options);
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

const getLinksFromDirectoryRecursive = (dirPath, options) => {
    const mdFiles = getMDFilesInDirectory(dirPath);
    const allLinks = [];

    mdFiles.forEach((mdFilePath) => {
        const links = getLinksFromMarkdownFile(mdFilePath);
        allLinks.push(...links);
    });

    const subdirectories = getSubdirectories(dirPath);

    subdirectories.forEach((subdirectory) => {
        const subdirectoryLinks = getLinksFromDirectoryRecursive(subdirectory, options);
        allLinks.push(...subdirectoryLinks);
    });

    return allLinks;
};


module.exports = {
    mdLinks,
};
