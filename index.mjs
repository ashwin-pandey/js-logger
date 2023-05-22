import { log, readLog, info, warn, debug, error, fatal, access, database, system } from "./logger.mjs";

log({level: 'info', message: 'Hello World!'});
log({level: 'warn', message: 'This is a warning!'});

let issue = new Error();
issue.message = "There was an error!";
log({level: 'error', error: issue});
error(issue);
// readLog("info");