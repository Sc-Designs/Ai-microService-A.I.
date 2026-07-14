import axios from "axios";
import { env } from "../config/Zod.cheker.js"

export const fetchTestQuestions = async (testId) => {
  try {
    const response = await axios.get(`${env.TEST_SERVICE_BASE_URL}/api/test/${testId}`, {
      headers: {
        "x-gateway-secret": env.GATEWAY_SECRET,
      }});
    return response.data; 
  } catch (error) {
    console.error("Failed to fetch test questions", error);
    throw error;
  }
};
