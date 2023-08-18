#!/usr/bin/env node
const yargs = require("yargs");
const { mdLinks, } = require('../index.js');
const path = require('path');
const chalk = require('chalk');
const boxen = require('boxen');

console.log(boxen('¡Bienvenid@ a esta librería!', {padding: 0, margin: 0, borderStyle: 'double' }));

const options = yargs(process.argv.slice(2))
    .usage(chalk.bold.green('md-links ./path/to/file.md -v -s'))
    .command('$0', chalk.blue('Default command'))
    .option('v', {
        alias: 'validate',
        describe: chalk.yellow('Verifica si el link funciona'),
        type: 'boolean',
        demandOption: false,
    })
    .option("s", {
        alias: "stats",
        describe: chalk.cyan('Imprime las estadisticas de los links encontrados en cada archivo .md'),
        type: 'boolean',
        demandOption: false
    })
    .help(true)
    .demandCommand()
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
                const totalStats = chalk.bgMagenta.white(`Total: ${links.length}`);
                const uniqueStats = chalk.bgYellowBright.black(`Unique: ${getUniqueLinksCount(links)}`);

                console.log(totalStats);
                console.log(uniqueStats);

                if (mdLinksOptions.validate) {
                    const brokenLinksCount = getBrokenLinksCount(links);
                    const brokenStats = chalk.bgRed.white(`Broken: ${brokenLinksCount}`);
                    console.log(brokenStats);
                }

            } else if (mdLinksOptions.validate) {
                links.forEach(link => {
                    const statusInfo = link.ok ? chalk.green('ok') : chalk.red('fail');
                    const formattedLink = boxen(
                        `${chalk.bold.white('File:')} ${chalk.magenta(link.file)}\n` +
                        `${chalk.bold.white('href:')} ${chalk.blueBright(link.href)}\n` +
                        `${chalk.bold.white('StatusInfo:')} ${chalk.white(statusInfo)}\n` +
                        `${chalk.bold.white('Status:')} ${chalk.cyan(link.status)}\n` +
                        `${chalk.bold.white('Text:')} ${chalk.yellow(link.text)}\n` +  
                        `${chalk.bold.white('Line:')} ${chalk.gray(link.line)}`,    
                        {title: 'Validación de Links:', titleAlignment: 'left', padding: 1, margin: 0, borderStyle: 'double' }
                    );
                    console.log(formattedLink);
                });
            } else {
                // Mostrar enlaces sin cambios
                links.forEach(link => {
                    const formattedLink = boxen(
                        `${chalk.bold.white('File:')} ${chalk.magenta(link.file)}\n` +
                        `${chalk.bold.white('href:')} ${chalk.blueBright(link.href)}\n` +
                        `${chalk.bold.white('Text:')} ${chalk.yellow(link.text)}\n` +
                        `${chalk.bold.white('Line:')} ${chalk.gray(link.line)}`,
                        {padding: 1, margin: 0, borderStyle: 'double'}
                    );
                    console.log(formattedLink);
                });
            }
        })
        .catch(error => {
            console.error(chalk.red(error.message));
        });
} else {
    const errorMessage = chalk.red("Por favor, proporciona una ruta válida.");
    console.error(boxen(errorMessage, { title: 'Error:', titleAlignment: 'left', padding: 1, margin: 0, borderStyle: 'double' })); 
    yargs.showHelp();
}