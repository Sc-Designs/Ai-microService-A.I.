import axios from "axios";


export const fetchTestQuestions = async (testId) => {
  try {
    const response = await axios.get(`${process.env.TEST_SERVICE_BASE_URL}/test/${testId}`);
    return response.data; 
  } catch (error) {
    console.error("Failed to fetch test questions", error);
    throw error;
  }
};
