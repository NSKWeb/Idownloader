import winston from 'winston'

const isProd = process.env.NODE_ENV === 'production'

export const logger = winston.createLogger({
  level: isProd ? 'info' : 'debug',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.errors({ stack: true }),
    isProd
      ? winston.format.json()
      : winston.format.combine(
          winston.format.colorize({ all: true }),
          winston.format.printf(({ level, message, timestamp, ...meta }) => {
            const rest = Object.keys(meta).length ? ` ${JSON.stringify(meta)}` : ''
            return `${timestamp} ${level}: ${message}${rest}`
          })
        )
  ),
  transports: [new winston.transports.Console()],
})
