import winston from "winston";

const customLevelOptions = {
  levels: {
    fatal: 0,
    error: 1,
    warning: 2,
    info: 3,
    http: 4,
    debug: 5
  },

  colors: {
    fatal: 'magenta',
    error: 'red',
    warning: 'yellow',
    info: 'blue',
    http: 'white',
    debug: 'white'
  }
}

const logger = winston.createLogger({

  levels: customLevelOptions.levels,
  transports: [
    new winston.transports.Console({
      level: "info", 
      format: winston.format.combine(
        winston.format.colorize({ colors: customLevelOptions.colors }),
        winston.format.simple()
      )
    }),

    new winston.transports.File({
      filename: "utils/errors.log",
      level: 'error', 
      format: winston.format.simple()
    })
  ]
});

let productionLogger = logger;
export default productionLogger;




