jest.mock('node-fetch');
const {
    isPathValid,
    getMDFilesInDirectory,
    isDirectory,
    readMDFile,
    findLinksInMDText,
    validateLinks,
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
    it('debe devolver un array de archivos en el directorio cuando se le proporciona un directorio válido', () => {
        const validDirectory = 'C:\\src\\ynnf\\DEV008-md-links\\folderExample';
        const files = ['archivo1.txt', 'archivo2.md', 'archivo3.md', 'archivo4.js'];

        jest.spyOn(fs, 'statSync').mockImplementation((filePath) => {
            return {
                isDirectory: () => filePath === validDirectory,
            }
        });

        jest.spyOn(fs, 'readdirSync').mockReturnValue(files);

        const result = getMDFilesInDirectory(validDirectory);

        const expectedFiles = files.map(file => path.join(validDirectory, file)); 
        expect(result).toEqual(expectedFiles);

        fs.statSync.mockRestore();
        fs.readdirSync.mockRestore();
    });

    it('debería devolver un array vacío cuando la ruta no es un directorio', () => {
        const validDirectory = 'C:\\src\\ynnf\\DEV008-md-links\\folderExample\\file-1.md';

        jest.spyOn(fs, 'statSync').mockReturnValue({
            isDirectory: () => false,
        });
        const result = getMDFilesInDirectory(validDirectory);
        expect(result.length).toEqual(0);
        fs.statSync.mockRestore();
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
        const mdText = fs.readFileSync(mockFilePath, 'utf8');
        const links = findLinksInMDText(mdText, mockFilePath);

        // Verificar que se hayan encontrado enlaces
        expect(links.length).toBeGreaterThan(0);
        // Verificar que cada enlace tenga la propiedad 'line'
        links.forEach(link => {
            expect(link.line).toBeDefined();
        });
    });


    it('debería lanzar un error si no se encuentran enlaces en un archivo .md', () => {
        const fileContent = 'Este es un archivo .md sin enlaces.';
        expect(() => {
            findLinksInMDText(fileContent, 'mock-file.md');
        }).toThrowError('No se encontraron enlaces en el archivo.');
    });
});

describe('validateLinks function', () => {
    const fetch = require("node-fetch");
    // Suprimir advertencias sobre console.error durante las pruebas
    const originalConsoleError = console.error;

    beforeAll(() => {
        fetch.mockReset();
        console.error = jest.fn();
    });
    afterAll(() => {
        console.error = originalConsoleError;
    });
    it('debería validar enlaces exitosos', () => {
        fetch.mockImplementation((href, options) => {
            return Promise.resolve({ status: 200 });
        });

        const links = [
            { href: 'https://example.com', text: 'Enlace 1' },
            { href: 'https://google.com', text: 'Enlace 2' }
        ];

        const validatedLinksPromise = validateLinks(links);

        return Promise.all(validatedLinksPromise).then(validatedLinks => {
            expect(validatedLinks).toHaveLength(2);

            validatedLinks.forEach(link => {
                expect(link.href).toBeDefined();
                expect(link.status).toBe(200);
                expect(link.ok).toBe(true);
            });
        });
    });

    it('debería validar enlaces fallidos', () => {
        fetch.mockImplementation((url, options) => {
            return Promise.reject({ response: { status: 404 } });
        });

        const links = [
            { href: 'https://nonexistent-link.com', text: 'Enlace 1' },
            { href: 'https://invalid-link.com', text: 'Enlace 2' }
        ];

        const validatedLinksPromise = validateLinks(links);

        return Promise.all(validatedLinksPromise).then(validatedLinks => {
            expect(validatedLinks).toHaveLength(2);

            validatedLinks.forEach(link => {
                expect(link.href).toBeDefined();
                expect(link.status).toBe(404);
                expect(link.ok).toBe(false);
            });
        });
    });

    it('debería validar enlaces fallidos cuando el error.response es undefined', () => {

        fetch.mockImplementation((url, options) => {
            return Promise.reject({ response: undefined });
        });

        const links = [
            { href: 'https://nonexistent-link.com', text: 'Enlace 1' },
            { href: 'https://invalid-link.com', text: 'Enlace 2' }
        ];

        const validatedLinksPromise = validateLinks(links);
        return Promise.all(validatedLinksPromise).then(validatedLinks => {
            expect(validatedLinks).toHaveLength(2);
            validatedLinks.forEach(link => {
                expect(link.href).toBeDefined();
                expect(link.status).toBe(404);
                expect(link.ok).toBe(false);
            });
        });
    });
});

