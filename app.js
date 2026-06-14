import "dotenv/config";
import express from 'express';
import AiRouter from './routers/ai.router.js';

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.send("👷🏽‍♂️ AI API is working ...");
});
app.use("/api", AiRouter);

const PORT = process.env.PORT || 3002;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
