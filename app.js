require('dotenv').config();

const express = require('express')
var createError = require('http-errors');
const {connectDB} = require("./DB/ConnectDB");
const functionsDB = require("./DB/functionsDB");
const cors = require("cors");
const app = express()
const authRouter = require('./DB/routes/auth');
const weatherRouter = require('./DB/routes/weather');
const port = 5000
var corsOptions = {
    origin: 'http://localhost:3000'
};

app.use(express.json())
app.use(cors(corsOptions));
app.use(express.urlencoded({ extended: false }));
app.use('/api/', authRouter);
app.use('/weather/', weatherRouter);

const startServer=async()=>{

    await connectDB()
    app.listen(port, () => {
        //console.log(`Example app listening on port ${port}`)
    })
}
startServer()