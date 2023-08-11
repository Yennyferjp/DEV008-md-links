
const path = require('path');
const fs = require('fs');
const fetch = require('node-fetch');
const colors = require('ansi-colors');

//Verifica si la ruta es válida y obtiene información sobre si es un directorio o archivo .md
function isPathValid(route) {
    const absolutePath = path.isAbsolute(route) ? route : path.resolve(route);
    const exists = fs.existsSync(absolutePath);

    if (!exists) {
        const errorMessage = ('La ruta ingresada no existe');
        throw new Error(errorMessage);
    }

    const isDir = fs.statSync(absolutePath).isDirectory();
    const isMarkdown = path.extname(absolutePath) === '.md';

    return { path: absolutePath, isDir, isMarkdown };
}


// Obtiene los archivos con extensión .md en la ruta de un directorio
function getMDFilesInDirectory(absolutePath) {
    if (fs.statSync(absolutePath).isDirectory()) {
        const files = fs.readdirSync(absolutePath);
        const mdFiles = files.filter(file => path.extname(file) === '.md');
        return mdFiles.map(file => path.join(absolutePath, file));
    } else {
        return [];
    }
}

// Valida si la ruta es un directorio
function isDirectory(absolutePath) {
    if (fs.statSync(absolutePath).isDirectory()) {
        return true;
    } else {
        console.log(`La ruta ${absolutePath} es un archivo, no un directorio.`);
        return false;
    }
}

// Lee el contenido de un archivo .md y devuelve el texto
function readMDFile(route) {
    try {
        const data = fs.readFileSync(route, 'utf8');
        return data;
    } catch (error) {
        throw new Error(`Error al leer el archivo ${route}: ${error.message}`);
    }
}

// Encuentra los enlaces en el texto de un archivo .md
function findLinksInMDText(fileContent, file) {
    const linkRegex = /\[([^\]]+)\]\(([^)]+)\)/g;
    const links = [];
    let match;

    while ((match = linkRegex.exec(fileContent))) {
        const [, text, href] = match;
        links.push({ text, href, file });
    }

    if (links.length === 0) {
        throw new Error('No se encontraron enlaces en el archivo.');
    }

    return links;
}

function validateLinks(links) {
    return links.map(link =>
        fetch(link.href, { method: 'HEAD' })
            .then(response => {
                return {
                    href: link.href,
                    text: link.text,
                    file: link.file,
                    status: response.status,
                    ok: true
                };
            })
            .catch(error => {
                const status = error.response ? error.response.status : 404;
                return {
                    href: link.href,
                    text: link.text,
                    file: link.file,
                    status,
                    ok: false
                };
            })
    );
}

module.exports = {
    isPathValid,
    isDirectory,
    getMDFilesInDirectory,
    readMDFile,
    findLinksInMDText,
    validateLinks,
};