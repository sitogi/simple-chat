import { pinoHttp as pino } from 'pino-http';

export const loggingHandler = pino({
  level: process.env.LOG_LEVEL || 'info',
  formatters: { level: (label) => ({ level: label }) },
});
