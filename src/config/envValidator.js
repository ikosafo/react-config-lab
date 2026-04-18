import config from "./index";

const requiredVariables = [
  "environment",
  "apiUrl",
  "appName",
  "logLevel"
];

export const validateConfig = () => {

  requiredVariables.forEach((key) => {

    if (!config[key]) {
      throw new Error(`Missing configuration variable: ${key}`);
    }

  });

};
