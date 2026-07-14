import axios from "axios";
import { env } from "../config/Zod.cheker.js"
const sendResult = async (evaluations, name, id, token) => {
  try {
    const response = await axios.post(
      `${env.RESULT_API_URL}/api/send`,
      { evaluations, name, id },
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "x-gateway-secret": env.GATEWAY_SECRET,
        },
      }
    );

    return response.data;
  } catch (error) {
    console.error(
      "Error sending result:",
      error.response?.data || error.message
    );
    throw new Error("Failed to send result");
  }
};

export default sendResult;
