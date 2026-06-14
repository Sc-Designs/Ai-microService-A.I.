import axios from 'axios';

const sendResultIdToUser = async (resultId, token) => {
    try {
        await axios.post(
          `${process.env.USER_API_URL}/api/result-add`,
          { resultId },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
    } catch (error) {
        console.error('Error sending result ID to user:', error);
        throw error;
    }
}
export default sendResultIdToUser;