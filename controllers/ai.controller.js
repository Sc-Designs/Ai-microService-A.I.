import  sendResult  from "../services/resultSend.service.js";
import { evaluateAnswers } from "../services/evaluateAnswer.service.js";
import sendResultIdToUser from "../services/sendingResultToUser.service.js";

const getAnswerFromAI = async (req, res) => {
  try {
    const { id, answers } = req.body;
    if (!id || !answers || !Array.isArray(answers)) {
      return res.status(400).json({ message: "Invalid input data." });
    }
    const {evaluations, name} = await evaluateAnswers(id, answers);
    const {resultId} = await sendResult(evaluations, name, id, req.token);
    const response = await sendResultIdToUser(resultId, req.token);
    return res.status(200).json({
      message: "Result is Published Now",
    });  
  } catch (error) {
    console.error("Error in getAnswerFromAI:", error);
    res.status(500).json({ message: "Internal server error." });
  }
}
export { getAnswerFromAI };