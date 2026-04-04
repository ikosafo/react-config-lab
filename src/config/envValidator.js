const requiredVariables = [
  "environment",
  "apiUrl"
];

export const validateConfig = (config) => {
  requiredVariables.forEach((key) => {
    if (!config[key]) {
      throw new Error(`Missing configuration variable: ${key}`);
    }
  });
};
