import logger from "./logger.mjs";

logger.log({level: 'info', message: 'Hello World!'});
logger.log({level: 'warn', message: 'This is a warning!'});
logger.access("This an access message!");
let issue = new Error();
issue.message = "There was an error!";
logger.log({level: 'error', error: issue});
logger.error(issue);
// readLog("info");