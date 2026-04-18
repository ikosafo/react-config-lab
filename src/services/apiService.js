import axios from "axios";
import config from "../config";
import { logger } from "../utils/logger";

export const fetchUsers = async () => {

  logger.log("info", "Fetching users from API");

  try {
    const client = axios.create({
      baseURL: config.apiUrl
    });

    const response = await client.get("/users");

    return response.data;

  } catch (error) {

    logger.log("error", "API request failed");

    return [];

  }
};
