const mongoose = require('mongoose');
const Users = require("./model/Users.schema")
const Dashboards = require("./model/Dashboard.schema")

const connectDB=async()=> {
    await mongoose.connect('mongodb+srv://admin:admin2023@cluster0.hct0oer.mongodb.net/myFirstDatabase?');
}



module.exports={connectDB}
// latitude: String,
//         longitude
//createNewUser("mary1", "121", "Mary")
//run()
async function run() {
    const user = await Users.create({
        login: "user1",
        password: "1111",
        name: "Elizabeth"
    })
    const dashboard = await Dashboards.create({
        cities: [{
            latitude: "50",
            longitude: "-1"
        }],
        userID: "64522f2dd7a20587e36c9336"
    })
    //console.log(user)
    //console.log(dashboard)
    const user2 = await Users.findOne({login: "user1", password: "1111"})
    console.log(user2)
    user2.name = "Camilla"
    user2.updateOne()
}


/* const user1 = new Users({
     login: "user1",
     password: "1111",
     name: "Elizabeth"
 })
 await user1.save().then(() => console.log("User1 saved"))*/


/*
mongoose.connect(
    "mongodb+srv://<credentials>@cluster0.hct0oer.mongodb.net/myFirstDatabase?",
    ()=>{console.log('Connected to MongoDB');},
    e => console.error(e)
)*/

/*let db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function callback () {
    console.log("h");
});

exports.test = function(req,res) {
    console.log(res)
};*/