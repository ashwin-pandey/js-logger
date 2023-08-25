let config = {
    writeToFile: false,
    json: true
}

export const logConfig = function({ writeToFile, json }) {
    config.writeToFile = writeToFile;
    config.json = json
}

export default {
    levels: {
        access: {
            color: 'gray',
            writeToFile: config.writeToFile,
            json: config.json
        },
        system: {
            color: 'blue',
            writeToFile: config.writeToFile,
            json: config.json
        },
        database: {
            color: 'cyanBright',
            writeToFile: config.writeToFile,
            json: config.json
        },
        event: {
            color: 'magenta',
            writeToFile: config.writeToFile,
            json: config.json
        },
        warn: {
            color: 'yellow',
            writeToFile: config.writeToFile,
            json: config.json
        },
        debug: {
            color: 'cyan',
            writeToFile: config.writeToFile,
            json: config.json
        },
        info: {
            color: 'green',
            writeToFile: config.writeToFile,
            json: config.json
        },
        error: {
            color: 'red',
            writeToFile: config.writeToFile,
            json: config.json
        },
        fatal: {
            color: 'redBright',
            writeToFile: config.writeToFile,
            json: config.json
        }
    }
}
