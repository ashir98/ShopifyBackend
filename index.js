import express from "express";
import 'dotenv/config';
import { errorHandler } from "./middlewares/error_handler.js";
import productRouter from "./routes/products.routes.js";
import userRouter from "./routes/user.routes.js";
import cors from "cors"
import { connectDatabase } from "./config/db_config.js";
const PORT = process.env.PORT || 5000;

const app = express();
app.use(cors());
app.use(express.json());
connectDatabase();



//MIDDLEWARE CALLING
app.use( userRouter );
app.use( productRouter );


app.use(errorHandler)


app.listen(   PORT,   ()=>{  console.log(`Server is running at ${process.env.PORT}`)   }    )