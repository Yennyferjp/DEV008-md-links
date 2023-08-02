const {
    isPathValid,
    getMDFilesInDirectory,
    isDirectory,
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

        // Mocking de fs.statSync para simular que validAbsolutePath es un directorio
        jest.spyOn(fs, 'statSync').mockReturnValue({
            isDirectory: () => true,
        });

        // Mocking de fs.readdirSync para simular los archivos dentro del directorio
        jest.spyOn(fs, 'readdirSync').mockReturnValue(files);

        // Llamamos a la función que queremos probar
        const result = getMDFilesInDirectory(validDirectory);

        // Utilizamos path.join() para construir las rutas de archivo esperadas
        const expectedFiles = [
            path.join(validDirectory, 'archivo2.md'),
            path.join(validDirectory, 'archivo3.md'),
        ];

        // Verificamos que el resultado sea un array que contenga solo los archivos .md
        expect(result).toEqual(expectedFiles);

        // Restauramos las funciones originales de fs para evitar efectos secundarios en otras pruebas
        fs.statSync.mockRestore();
        fs.readdirSync.mockRestore();
    });
});


describe('isDirectory function', () => {
    it('debe devolver verdadero para un directorio válido', () => {
        // Simulamos el comportamiento de fs.statSync utilizando jest.fn()
        const absolutePath = '/ruta/valida/directorio';

        // Mocking de fs.statSync para simular que absolutePath es un directorio
        jest.spyOn(fs, 'statSync').mockReturnValue({
            isDirectory: () => true,
        });

        // Llamamos a la función que queremos probar
        const result = isDirectory(absolutePath);

        // Verificamos que la función devuelva true
        expect(result).toBe(true);

        // Restauramos la función original de fs para evitar efectos secundarios en otras pruebas
        fs.statSync.mockRestore();
    });

    it('debe devolver falso para un archivo válido', () => {
        // Simulamos el comportamiento de fs.statSync utilizando jest.fn()
        const absolutePath = '/ruta/valida/archivo.txt';

        // Mocking de fs.statSync para simular que absolutePath es un archivo
        jest.spyOn(fs, 'statSync').mockReturnValue({
            isDirectory: () => false,
        });

        // Llamamos a la función que queremos probar
        const result = isDirectory(absolutePath);

        // Verificamos que la función devuelva false
        expect(result).toBe(false);

        // Restauramos la función original de fs para evitar efectos secundarios en otras pruebas
        fs.statSync.mockRestore();
    });
});

