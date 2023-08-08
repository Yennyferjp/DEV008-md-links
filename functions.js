const path = require('path');
const fs = require('fs');

//Valida si la ruta existe y es absoluta 
function isPathValid(route) {
    const absolutePath = path.isAbsolute(route) ? route : path.resolve(route);
    const exists = fs.existsSync(absolutePath);
    if (!exists) {
        throw new Error('La ruta ingresada no existe');
    }
    const isDir = isDirectory(absolutePath);
    return { path: absolutePath, isDir };
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
function findLinksInMDText(mdFiles) {
    const linkRegex = /\[([^\]]+)\]\(([^)]+)\)/g;
    const links = [];
    let match;

    while ((match = linkRegex.exec(mdFiles))) {
        const [, text, url] = match;
        links.push({ text, url });
    }

    if (links.length === 0) {
        throw new Error('No se encontraron enlaces en el archivo.');
    }
    
    const linkCount = links.length; // Cantidad de enlaces encontrados
    return { links, linkCount };
}

// Ejemplo de uso:
const route = 'C:\\src\\ynnf\\DEV008-md-links\\folderExample';
try {
    const pathCheck = isPathValid(route);
    if (pathCheck.isDir) {
        console.log('La ruta es válida.');
        console.log('Ruta absoluta:', pathCheck.path);

        const mdFiles = getMDFilesInDirectory(pathCheck.path);
        console.log('Archivos .md encontrados:');
        mdFiles.forEach(file => {
            console.log(file);
            
            const mdText = readMDFile(file);
            const { links, linkCount } = findLinksInMDText(mdText);
            console.log('Enlaces encontrados:');
            links.forEach(link => console.log(link));
            console.log(`Total de enlaces encontrados: ${linkCount}`);
        });
    } else {
        console.log('La ruta no es un directorio.');
    }
} catch (error) {
    console.error(error.message);
}


module.exports = {
    isPathValid,
    isDirectory,
    getMDFilesInDirectory,
    readMDFile,
    findLinksInMDText,
};