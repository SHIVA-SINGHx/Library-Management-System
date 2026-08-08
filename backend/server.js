import express from "express"
import cors from "cors"
import "dotenv/config"
import { dbConnect } from "./config/db.js";
import authRouter from "./routes/authRoutes.js";
import studentRouter from "./routes/studentRoutes.js";

const app = express();
const PORT = process.env.PORT


// Middlewares

app.use(cors())
app.use(express.json())
app.use(express.urlencoded())


// Db
dbConnect()

// Routes
app.use("/api/auth", authRouter);
app.use("/api/student", studentRouter);

app.get("/", (req, res)=>{
    res.json("Hello api is working fine!")
})


app.listen(PORT, ()=>{
    console.log(`Server is listening ${PORT}`);
    
})