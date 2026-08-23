import express from "express"
import cors from "cors"
import "dotenv/config"
import path from "node:path"
import { fileURLToPath } from "node:url"
import { dbConnect } from "./config/db.js";
import authRouter from "./routes/authRoutes.js";
import studentRouter from "./routes/studentRoutes.js";
import bookRouter from "./routes/bookRoutes.js";

const app = express();
const PORT = process.env.PORT || 8000;



const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const publicDir = path.join(__dirname, 'public')

// Middlewares
app.use(cors())
app.use(express.json())
app.use(express.urlencoded())
app.use(express.static(publicDir))


// Db
dbConnect()

// Routes
app.use("/api/auth", authRouter);
app.use("/api/students", studentRouter);
app.use("/api/books", bookRouter);

app.get("/", (req, res)=>{
    res.json("Hello api is working fine!")
})

app.get("*name", (req, res) =>{
    res.sendFile(path.join(publicDir, 'index.html') )
})


app.listen(PORT, ()=>{
    console.log(`Server is listening ${PORT}`);
    
})