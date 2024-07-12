import path from 'path';
import winston from 'winston';
import { getDefaultDir } from './utils';

const { format, transports, createLogger } = winston;
const consoleLoggerLevel = process.env.WINSTON_LOGGER_LEVEL || 'info';

const consoleFormat = format.combine(
  format.colorize(),
  format.timestamp(),
  format.printf(info => {
    const message = JSON.stringify(info.message, null, '\t');
    return `${info.timestamp} - ${info.level}: [${info.label}]: ${
      message
    } ${JSON.stringify(info.metadata)}`;
  })
);

const fileFormat = format.combine(
  format.timestamp(),
  format.label({ label: 'LOG' }),
  format.metadata({ fillExcept: ['message', 'level', 'timestamp', 'label'] }),
  format.json()
);

const logger = createLogger({
  level: 'info',
  defaultMeta: { service: 'log-service' },
  format: fileFormat,
  transports: [
    new transports.File({
      filename: path.resolve(getDefaultDir(), 'logs', 'error.log'),
      level: 'error',
    }),
    new transports.File({
      filename: path.resolve(getDefaultDir(), 'logs', 'activity.log'),
      maxsize: 5242880,
      maxFiles: 5,
    }),
  ],
});

logger.add(
  new transports.Console({
    level: consoleLoggerLevel,
    format: consoleFormat,
  })
);

export default logger;
