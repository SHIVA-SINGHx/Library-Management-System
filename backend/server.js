import express from "express"
import cors from "cors"
import "dotenv/config"

const app = express();
const PORT = 8000;


// Middlewares

app.use(cors())
app.use(express.json())
app.use(express.urlencoded())



// Routes
app.use("/", (req, res)=>{
    res.json("ihiiii")
})


app.listen(PORT, ()=>{
    console.log(`Server is listening ${PORT}`);
    
})