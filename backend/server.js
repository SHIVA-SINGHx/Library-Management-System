import express from "express"
import cors from "cors"
import "dotenv/config"
import { dbConnect } from "./config/db.js";

const app = express();
const PORT = process.env.PORT


// Middlewares

app.use(cors())
app.use(express.json())
app.use(express.urlencoded())


// Db
// dbConnect()

// Routes
app.use("/", (req, res)=>{
    res.json("ihiiii")
})


app.listen(PORT, ()=>{
    console.log(`Server is listening ${PORT}`);
    
})