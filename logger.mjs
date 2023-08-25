import path from 'path'
import chalk from 'chalk'
import moment from 'moment/moment.js'
import { existsSync, mkdirSync, appendFileSync, createReadStream } from 'fs'
import readLine from 'readline'
import config from './config.mjs'
const httpContext = require('http-context');

/**
 * Main Logging Function
 * @param {object} options 
 * OBJECT { level, message }
 */
export const log = (options) => {
    // verify if the provided level exists
    const levelName = getLevelName(options.level);
    
    // check if the message parameter is present
    let message = options.message ?? 'Unidentified Error';

    // check if error parameter is available, if not, then set it as null
    const error = options.error ?? null;

    // always log to console by default
    writeToConsole(levelName, message, error);

    // if writeToFile value is set to true
    if (config.levels[levelName].writeToFile) {
        writeToFile(levelName, message);
    }
}

/**
 * Write formatted message to the console
 * @param {string} levelName 
 * @param {string} message 
 * @param {Error|null} error 
 */
const writeToConsole = (levelName, message, error = null) => {
    // get the level object from the config
    const level = config.levels[levelName];
    let chalkFunction = null;

    // check for the color
    if (level.color.includes('#')) {
        // if the color value is a hex value
        chalkFunction = chalk.hex(level.color);
    } else if (Array.isArray(level.color)) {
        // if the color value is rgb
        if (level.color.length === 3) {
            // set the rgb value
            chalkFunction = chalk.rgb(level.color[0], level.color[1], level.color[2]);
        } else {
            // throw error if the rgb is invalid
            throw new Error(
                `We have detected that the configuration for the logger level ${chalk.red(
                    `[${levelName.toUpperCase()}]`
                )} is set for RGB but only has ${chalk.red(
                    `${level.color.length}`
                )} values.\n The configuration must be an ${chalk.red(
                    'array'
                )} and contain ${chalk.red('3')} values.`
            );
        }
    } else {
        // else it is the name of the color, get the color function by name and set it in chalkFunction
        chalkFunction = chalk[level.color];
    }

    
    // check if the print format is json
    if (level.json) {
        message = error ? `${chalkFunction(`${error.message}`)}` : message;
        const data = `{ "level": "${levelName}", "timestamp": "${getFormattedCurrentDate()}", "message": "${message}" }`;
        console.log(data);
        if (error) {
            console.log(`${chalkFunction(`${error.stack}`)}`);
        }
    } else {
        message = error ? `${chalkFunction(`${error.message} \n ${error.stack}`)}` : message;
        const header = `[${levelName.toUpperCase()}][${getFormattedCurrentDate()}]`;
        console.log(`${chalkFunction(header)}: ${chalkFunction(message)}`);
    }
}

/**
 * Write a formatted message to a file
 * @param {string} levelName 
 * @param {string} message 
 */
const writeToFile = (level, message) => {
    const logsDir = './logs';

    const data = `{"level": "${level.toUpperCase()}", "timestamp": "${getFormattedCurrentDate()}", "message": "${message}"}\r\n`

    // chekc if the logs folder exists
    if (!existsSync(logsDir)) {
        // if not, then create the folder
        mkdirSync(logsDir);
    }

    const options = {
        encoding: 'utf8',
        mode: 438 // this translates ot '066' for file permissions
    };

    // append to the file (takes 3 parameters, 1. file we are writing to, 2. data that is to be appended, 3. options which include permissions)
    appendFileSync(`./logs/${level}.log`, data, options);
}

/**
 * Read data from a log file
 * @param {string} fileName 
 * @returns Promise
 */
export const readLog = async (fileName = null) => {
    const logsDir = './logs';

    return new Promise((resolve, reject) => {
        // set the path of the file
        const file = path.join(
            logsDir,
            fileName.includes('.') ? fileName : `${fileName}.log`
        );

        // line reader
        const lineReader = readLine.createInterface({
            input: createReadStream(file)
        });

        // this variable will store all the log lines read by lineReader
        const logs = [];

        // pulling the line if the file has
        lineReader.on('line', (line) => {
            logs.push(JSON.parse(line));
        });

        // notifies in console when the logs are accessed
        lineReader.on('close', () => {
            console.log(
                chalk.yellow(`${fileName.toUpperCase()} logs have been accessed.`)
            );
            console.log(logs);
            resolve(logs);
        });

        lineReader.on('error', (error) => {
            reject(error);
        })

    })
}

/**
 * Get the level name
 * @param {string} level 
 * @returns level and if it is invalid, it returns 'info' level by default
 */
const getLevelName = (level) => {
    return level && config.levels.hasOwnProperty(level) ? level : 'info';
} 

/**
 * Get formatted date
 * @returns DateTime
 */
const getFormattedCurrentDate = () => {
    return moment(new Date()).format(moment.HTML5_FMT.DATETIME_LOCAL_SECONDS);
}

// =======================================================================
// HELPER FUNCTIONS
// =======================================================================

/**
 * Helper function for printing access level logs
 * @param {string} message 
 */
export const access = (message) => {
    log({level: 'access', message: message});
}

/**
 * Helper function for printing warn level logs
 * @param {string} message 
 */
export const warn = (message) => {
    log({level: 'warn', message: message});
}

/**
 * Helper function for printing debug level logs
 * @param {string} message 
 */
export const debug = (message) => {
    log({level: 'debug', message: message});
}

/**
 * Helper function for printing info level logs
 * @param {string} message 
 */
export const info = (message) => {
    log({level: 'info', message: message});
}

/**
 * Helper function for printing event level logs
 * @param {string} message 
 */
export const event = (message) => {
    log({level: 'event', message: message});
}

/**
 * Helper function for printing system level logs
 * @param {string} message 
 */
export const system = (message) => {
    log({level: 'system', message: message});
}

/**
 * Helper function for printing database level logs
 * @param {string} message 
 */
export const database = (message) => {
    log({level: 'database', message: message});
}

/**
 * Helper function for printing error level logs
 * @param {string | Error} message 
 */
export const error = (error) => {
    if (typeof(error) === 'string') {
        log({level: 'error', error: error});
    } else {
        log({level: 'error', error: error});
    }
}

/**
 * Helper function for printing fatal level logs
 * @param {string | Error} message 
 */
export const fatal = (error) => {
    if (typeof(error) === 'string') {
        log({level: 'fatal', message: error});
    } else {
        log({level: 'fatal', error: error});
    }
}
