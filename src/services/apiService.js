import axios from "axios";
import { createLogger } from "../utils/logger";

export const createApiClient = config => axios.create({
  baseURL: config.apiUrl
});

export const fetchUsers = async config => {
  const client = createApiClient(config);
  const logger = createLogger(config);

  logger.log("info", "Fetching users from API");

  try {

    const response = await client.get("/users");

    return response.data;

  } catch (error) {

    logger.log("error", "API request failed");

    return [];

  }

};
