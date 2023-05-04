const express = require('express')
const {connectDB} = require("./DB/ConnectDB");
const cors = require("cors");
const app = express()
const port = 5000
var corsOptions = {
    origin: 'http://localhost:3000'
};

app.use(cors(corsOptions));
app.get('/api', (req, res) => {
   // res.send('Hello World!')
    res.json({"users":["one", "two", "three"]})

    })


const startServer=async()=>{
    await connectDB()
    app.listen(port, () => {
        console.log(`Example app listening on port ${port}`)
    })
}
startServer()