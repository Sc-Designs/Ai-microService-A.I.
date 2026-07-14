import axios from 'axios';
import { env } from "../config/Zod.cheker.js"

const sendResultIdToUser = async (resultId, token) => {
    try {
        await axios.post(
          `${env.USER_API_URL}/api/result-add`,
          { resultId },
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "x-gateway-secret": env.GATEWAY_SECRET,
            },
          }
        );
    } catch (error) {
        console.error('Error sending result ID to user:', error);
        throw error;
    }
}
export default sendResultIdToUser;