const {
    isPathValid,
    getMDFilesInDirectory,
    isDirectory,
    readMDFile,
    findLinksInMDText
} = require('../functions');

const fs = require('fs');
const path = require('path');

describe('isPathValid function', () => {
    it('debe devolver un objeto con una ruta válida y la propiedad isDir para una ruta absoluta válida', () => {
        const validAbsolutePath = 'C:\\src\\ynnf\\DEV008-md-links\\folderExample';
        const result = isPathValid(validAbsolutePath);
        expect(result).toHaveProperty('path', validAbsolutePath);
        expect(result).toHaveProperty('isDir', true);
    });
    it('debe devolver un objeto con una ruta válida y la propiedad isDir para una ruta relativa válida', () => {
        const validRelativePath = './folderExample';
        const result = isPathValid(validRelativePath);
        expect(result).toHaveProperty('path', expect.any(String));
        expect(result).toHaveProperty('isDir', true);
    });

    it('debería arrojar un error cuando la ruta no existe', () => {
        const invalidPath = 'nonexistent/path';
        expect(() => isPathValid(invalidPath)).toThrowError('La ruta ingresada no existe');
    });
});

describe('getMDFilesInDirectory function', () => {
    it('debe devolver un array de archivos .md cuando se le proporciona un directorio válido', () => {
        const validDirectory = 'C:\\src\\ynnf\\DEV008-md-links\\folderExample';
        const files = ['archivo1.txt', 'archivo2.md', 'archivo3.md', 'archivo4.js'];

        jest.spyOn(fs, 'statSync').mockReturnValue({
            isDirectory: () => true,
        });

        jest.spyOn(fs, 'readdirSync').mockReturnValue(files);

        const result = getMDFilesInDirectory(validDirectory);

        const expectedFiles = [
            path.join(validDirectory, 'archivo2.md'),
            path.join(validDirectory, 'archivo3.md'),
        ];

        expect(result).toEqual(expectedFiles);

        fs.statSync.mockRestore();
        fs.readdirSync.mockRestore();
    });
});


describe('isDirectory function', () => {
    it('debe devolver verdadero para un directorio válido', () => {
        const absolutePath = '/ruta/valida/directorio';
        jest.spyOn(fs, 'statSync').mockReturnValue({
            isDirectory: () => true,
        });
        const result = isDirectory(absolutePath);

        expect(result).toBe(true);

        fs.statSync.mockRestore();
    });

    it('debe devolver falso para un archivo válido', () => {
        const absolutePath = '/ruta/valida/archivo.txt';
        jest.spyOn(fs, 'statSync').mockReturnValue({
            isDirectory: () => false,
        });

        const result = isDirectory(absolutePath);

        expect(result).toBe(false);
        fs.statSync.mockRestore();
    });
});



describe('readMDFile function', () => {

    it('deberia leer el contenido de un archivo .md válido', () => {
        const mockFilePath = 'C:\src\ynnf\DEV008-md-links\folderExample\file-1.md';
        const mockFileContent = 'Mocked content of the .md file';

        jest.spyOn(fs, 'readFileSync').mockReturnValue(
            mockFileContent
        );
        const result = readMDFile(mockFilePath);
        expect(result).toEqual(mockFileContent);
    });

    it('debería arrojar un error para un archivo no válido', () => {
        const mockFilePath = 'C:\src\ynnf\DEV008-md-links\folderExample\invalid.md';
        const mockError = new Error('Archivo no encontrado');

        fs.readFileSync.mockImplementation(() => {
            throw mockError;
        });
        expect(() => readMDFile(mockFilePath)).toThrowError(
            `Error al leer el archivo ${mockFilePath}: ${mockError.message}`
        );
    });
});

describe('findLinksInMDText function', () => {

    it('deberia encontrar los links en el archivo md', () => {
        jest.resetAllMocks();

        const mockFilePath = 'C:\\src\\ynnf\\DEV008-md-links\\folderExample\\file-1.md';
        console.log(mockFilePath);
        const mdText = fs.readFileSync(mockFilePath, 'utf8');
        const links = findLinksInMDText(mdText);
        expect(links.linkCount).toBe(3);
    });

});
