const yargs = require("yargs");
const { mdLinks, } = require('../index.js');
const path = require('path');
const colors = require('ansi-colors');

const options = yargs(process.argv.slice(2))
    .usage('md-links ./path/to/file.md -v -s')
    .command('$0', 'Default command')
    .option('v', {
        alias: 'validate',
        describe: 'Verifica si el link funciona',
        type: 'boolean',
        demandOption: false,
    })
    .option("s", {
        alias: "stats",
        describe: "Imprime las estadisticas de los links encontrados en cada archivo .md",
        type: 'boolean',
        demandOption: false
    })
    .help(true)
    .argv;

//calcula y muestra la cantidad total de enlaces únicos en el archivo Md.
const getUniqueLinksCount = (links) => {
    const uniqueLinks = new Set(links.map(link => link.href));
    return uniqueLinks.size;
};
//calcula y muestra la cantidad de enlaces rotos en el archivo Markdown
const getBrokenLinksCount = (links) => {
    return links.reduce((count, link) => {
        if (!link.ok) {
            count++;
        }
        return count;
    }, 0);
};

const route = options._[0];

if (route) {
    const mdLinksOptions = {
        validate: options.validate || false,
        stats: options.stats || false,
    };

    mdLinks(route, mdLinksOptions)
        .then(links => {
            if (mdLinksOptions.stats) {
                // Mostrar estadísticas
                console.log(`Total: ${links.length}`);
                console.log(`Unique: ${getUniqueLinksCount(links)}`);

                if (mdLinksOptions.validate) {
                    const brokenLinksCount = getBrokenLinksCount(links);
                    console.log(`Broken: ${brokenLinksCount}`);
                }

            } else if (mdLinksOptions.validate) {
                links.forEach(link => {
                    const statusInfo = link.ok ? 'ok' : 'fail';
                    console.log(colors.bgMagenta(link.file), colors.blueBright(link.href), statusInfo, colors.greenBright(link.status), link.text, `Line: ${link.line}`);
                });
            } else {
                // Mostrar enlaces
                links.forEach(link => {
                    console.log(`${link.file} ${link.href} ${link.text}, Line: ${link.line}`);
                });
            }
        })
        .catch(error => {
            console.error(colors.red(error.message));
        });
} else {
    console.error("Por favor, proporciona una ruta válida.");
}