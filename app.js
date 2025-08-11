import "dotenv/config";
import express from 'express';
import AiRouter from './routers/ai.router.js';

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/", AiRouter);

app.listen(3000, () => {
  console.log("👷🏽‍♂️ AI Service Running on 3000...");
});