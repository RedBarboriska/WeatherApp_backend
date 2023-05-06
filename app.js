const express = require('express')
const {connectDB} = require("./DB/ConnectDB");
const functionsDB = require("./DB/functionsDB");
const cors = require("cors");
const app = express()
const port = 5000
var corsOptions = {
    origin: 'http://localhost:3000'
};
app.use(express.json())
app.use(cors(corsOptions));
app.get('/api', (req, res) => {
    functionsDB.test().then(data=>{
        res.json(data)
       // console.log(data)
    })
        .catch(err => {
            res.json(err)
        })
    });
app.post('/login', (req, res) => {
    functionsDB.login(req.body.login, req.body.password).then(data=>{
        res.json(data)
         console.log(data)
    })
        .catch(err => {
            res.json(err)
        });
});


app.post('/sign-up', (req, res) => {
    functionsDB.createNewUser(req.body.login, req.body.password,req.body.name).then(data=>{
        res.json(data)
        console.log(data)
    })
        .catch(err => {
            res.json(err)
        });
});



const startServer=async()=>{
    await connectDB()
    app.listen(port, () => {
        console.log(`Example app listening on port ${port}`)
    })
}
startServer()