const levels = ["debug", "info", "warn", "error"];

export const createLogger = config => ({
  log(level, message) {
    const configLevelIndex = levels.indexOf(config.logLevel);
    const messageLevelIndex = levels.indexOf(level);
    const effectiveConfigIndex = configLevelIndex === -1 ? levels.indexOf("info") : configLevelIndex;

    if (messageLevelIndex >= effectiveConfigIndex) {
      console.log(`[${level}]`, message);
    }
  }
});
