import appConfig from "./appConfig";

const requiredVariables = [
  "environment",
  "apiUrl",
  "appName",
  "logLevel"
];

export const validateConfig = () => {

  requiredVariables.forEach((key) => {

    if (!appConfig[key]) {
      throw new Error(`Missing configuration variable: ${key}`);
    }

  });

};