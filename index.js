import express from "express";
import 'dotenv/config';
import { errorHandler } from "./middlewares/error_handler.js";
import productRouter from "./routes/products.routes.js";
import userRouter from "./routes/user.routes.js";
import cors from "cors"
import { connectDatabase } from "./config/db_config.js";

const app = express();
app.use(cors());
app.use(express.json());

// Har request se pehle DB connected hone ka intezar karo
app.use(async (req, res, next) => {
  try {
    await connectDatabase();
    next();
  } catch (error) {
    res.status(500).json({ message: `Database connection failed: ${error.message}` });
  }
});

// MIDDLEWARE CALLING
app.use(userRouter);
app.use(productRouter);

app.use(errorHandler);

// Local development ke liye listen, Vercel ke liye export default
if (process.env.NODE_ENV !== 'production') {
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => {
    console.log(`Server is running at port ${PORT}`);
  });
}

export default app;