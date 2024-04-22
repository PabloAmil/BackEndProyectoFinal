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
    fatal: 'red',
    error: 'orange',
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
      level: "debug", // mientras que este es el piso
      format: winston.format.combine(
        winston.format.colorize({colors: customLevelOptions.colors}),
        winston.format.simple()
      )
    })
  ]
});

export const devLogger = (req, res, next) => {

  // el problema de que siempre salga el mismo tipo de log esta aca

  req.logger = logger;
  req.logger.debug('prueba info'); // este es el tipo de error que le voy a tirar
  //req.logger.http('./')
  next();
};
