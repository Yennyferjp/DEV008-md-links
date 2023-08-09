
const path = require('path');
const fs = require('fs');
const fetch = require('node-fetch');
const colors = require('ansi-colors');

//Valida si la ruta existe y es absoluta 
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

    const linkCount = links.length; // Cantidad de enlaces encontrados
    return { links, linkCount };
}

// Función para validar el estado de los enlaces
function getLinkStatus(route) {
    try {
        const pathCheck = isPathValid(route);
        
        if (pathCheck.isDir) {
            const mdFiles = getMDFilesInDirectory(pathCheck.path);
            const allLinks = [];

            mdFiles.forEach(mdFilePath => {
                const mdText = readMDFile(mdFilePath);
                const links = findLinksInMDText(mdText);
                allLinks.push(...links);
            });

            const validatedLinksPromises = allLinks.map(link => {
                return fetch(link.url, { method: 'HEAD' })
                    .then(response => {
                        return {link, status: response.status, ok: true };
                    })
                    .catch(error => {
                        const status = error.response ? error.response.status : 404;
                        return {link, status, ok: false };
                    });
            });

            return Promise.all(validatedLinksPromises);
        } else if (pathCheck.isMarkdown) {
            const mdText = readMDFile(pathCheck.path);
            const { links } = findLinksInMDText(mdText);
            
            const validatedLinksPromises = links.map(link => {
                return fetch(link.url, { method: 'HEAD' })
                    .then(response => {
                        return {link, status: response.status, ok: true };
                    })
                    .catch(error => {
                        const status = error.response ? error.response.status : 404;
                        return {link, status, ok: false };
                    });
            });

            return Promise.all(validatedLinksPromises);
        } else {
            console.log('La ruta no es un directorio ni un archivo .md válido.');
            return Promise.resolve([]);
        }
    } catch (error) {
        console.error(error.message);
        return Promise.resolve([]);
    }
}



// Ejemplo de uso:
// C:\\src\\ynnf\\DEV008-md-links\\folderExample\\file-1.md
// ./folderExample/file-1.md
const route = 'C:\\src\\ynnf\\DEV008-md-links\\folderExample\\';

try {
    const pathCheck = isPathValid(route);

    if (pathCheck.isDir) {
        console.log(colors.green('La ruta es un directorio.'));
        console.log('Ruta absoluta:', colors.blue(pathCheck.path));

        const mdFiles = getMDFilesInDirectory(pathCheck.path);
        console.log(colors.yellow('Archivos .md encontrados:'));
        mdFiles.forEach(file => {
            console.log(colors.blue(file));

            const mdText = readMDFile(file);
            const { links, linkCount } = findLinksInMDText(mdText);
            links.forEach(link => console.log(link));
            console.log(colors.yellow(`Total de enlaces encontrados: ${linkCount}`));
        });

        getLinkStatus(pathCheck.path)
            .then(validatedLinks => {
                console.log(colors.magenta('Enlaces validados:'));
                validatedLinks.forEach(link => console.log(link));
            })
            .catch(error => console.error(colors.red('Error:', error)));
    } else if (pathCheck.isMarkdown) {
        console.log(colors.green('La ruta es un archivo .md.'));
        console.log('Ruta absoluta:', colors.blue(pathCheck.path));

        const mdText = readMDFile(pathCheck.path);
        const { links, linkCount } = findLinksInMDText(mdText);
        console.log(colors.yellow('Enlaces encontrados:'));
        links.forEach(link => console.log(link));
        console.log(colors.yellow(`Total de enlaces encontrados: ${linkCount}`));

        getLinkStatus(pathCheck.path)
            .then(validatedLinks => {
                console.log(colors.magenta('Enlaces validados:'));
                validatedLinks.forEach(link => console.log(link));
            })
            .catch(error => console.error(colors.red('Error:', error)));
    } else {
        console.log(colors.red('La ruta no es válida ni un directorio ni un archivo .md.'));
    }
} catch (error) {
    console.error(colors.red(error.message));
}


module.exports = {
    isPathValid,
    isDirectory,
    getMDFilesInDirectory,
    readMDFile,
    findLinksInMDText,
    getLinkStatus,
};