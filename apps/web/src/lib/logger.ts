// src/logger.ts


interface Logger {
  debug: (...args: unknown[]) => void;
  info: (...args: unknown[]) => void;
  warn: (...args: unknown[]) => void;
  error: (...args: unknown[]) => void;
}

const isProd = process.env.NODE_ENV === 'production';

const logger: Logger = {
  debug: (...args: unknown[]) => {
    if (!isProd) {
       
      console.debug('[DEBUG]', ...args);
    }
  },
  info: (...args: unknown[]) => {
    if (!isProd) {
       
      console.info('[INFO]', ...args);
    }
  },
  warn: (...args: unknown[]) => {
     
    console.warn('[WARN]', ...args);
    // Optionally: send to remote server here
  },
  error: (...args: unknown[]) => {
     
    console.error('[ERROR]', ...args);
    // Optionally: send to remote server or monitoring tool here
  },
};

export default logger;