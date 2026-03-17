import config from "../config/appConfig";

const levels = ["debug", "info", "warn", "error"];

export const logger = {

  log(level, message) {

    const configLevelIndex = levels.indexOf(config.logLevel);
    const messageLevelIndex = levels.indexOf(level);

    if (messageLevelIndex >= configLevelIndex) {
      console.log(`[${level}]`, message);
    }

  }

};