import axios from "axios";

const sendResult = async (evaluations, name, id, token) => {
  try {
    const response = await axios.post(
      `${process.env.RESULT_API_URL}/send`,
      { evaluations, name, id },
      {
        headers: {
          Authorization: `Bearer ${token}`,
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
