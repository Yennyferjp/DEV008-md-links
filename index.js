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

const getLinksFromDirectory = (dirPath) => {
  const mdFiles = getMDFilesInDirectory(dirPath);
  const allLinks = [];

  mdFiles.forEach((mdFilePath) => {
    const links = getLinksFromMarkdownFile(mdFilePath);
    allLinks.push(...links);
  });

  return allLinks;
};

const mdLinks = (path, options) => {
  return new Promise((resolve, reject) => {
    try {
      const pathCheck = isPathValid(path);

      if (pathCheck.isDir) {
        const allLinks = getLinksFromDirectory(pathCheck.path);

        if (options.validate) {
          const results = validateLinks(allLinks);
          resolve(Promise.all(results));

        } else {
          resolve(allLinks.map(link => {
            return {
              href: link.href,
              text: link.text,
              file: link.file,
              line: link.line,
              status: 0,
              ok: true,
            };
          }));
        }
      } else if (pathCheck.isMarkdown) {
        const links = getLinksFromMarkdownFile(pathCheck.path);

        if (options.validate) {
          const results = validateLinks(links);
          resolve(Promise.all(results));
        } else {
          resolve(links.map(link => {
            return {
              href: link.href,
              text: link.text,
              file: link.file,
              line: link.line,
              status: 0,
              ok: true,
            };
          }));
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
