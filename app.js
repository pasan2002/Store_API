require("dotenv").config()

require("express-async-errors")


const express = require("express")
const app = express()
const notFound = require("./middleware/not-found")
const errorHandler = require("./middleware/error-handler")
const connectDB = require("./db/connect")
const router = require("./routes/products")

//middleware


//routes
app.get("/", (req,res)=>{
    res.send("<h1>Store API</h1><a href='/api/v1/products'>products route</a>")
})
app.use("/api/v1/products",router)


app.use(notFound)
app.use(errorHandler)

const port = process.env.PORT || 3000

const start = async ()=>{
    try{
        await connectDB(process.env.MONGO_URI)
        app.listen(port, console.log(`Server is listening on port ${port}...`))
    }catch(error){
        console.log(error);
    }
}

start()