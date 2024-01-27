const express = require("express");
const mainRouter = require("./routes/index")
const cors = require("cors")

const app = express()

app.use(cors());
app.use(express.json())

app.use("/api/v1",mainRouter)

app.listen(8080,(req,res)=>{
    console.log("server is running on port 8080")
})
