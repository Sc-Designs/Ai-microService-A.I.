import "dotenv/config";
import express from 'express';
import AiRouter from './routers/ai.router.js';

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/", AiRouter);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
