import winston, { format } from 'winston';

const { combine, timestamp, label, printf } = format;
const myFormat = printf(({ level, message, label, timestamp }) => {
  return `${timestamp} [${label}] ${level}: ${message}`;
});

const logger = winston.createLogger({
  format: combine(winston.format.colorize(), label({ label: 'LOG' }), timestamp(), myFormat),
  transports: [new winston.transports.Console()],
});

export default logger;
