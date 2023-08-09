const yargs = require("yargs");

const option = yargs(process.argv.slice(2))
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
