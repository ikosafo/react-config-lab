import axios from "axios";
import config from "../config";
import { logger } from "../utils/logger";

const client = axios.create({
  baseURL: config.apiUrl
});

export const fetchUsers = async () => {
  // Keep baseURL aligned with centrally loaded config.
  client.defaults.baseURL = config.apiUrl;

  logger.log("info", "Fetching users from API");

  try {

    const response = await client.get("/users");

    return response.data;

  } catch (error) {

    logger.log("error", "API request failed");

    return [];

  }

};