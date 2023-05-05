const mongoose = require('mongoose');

const usersSchema = new mongoose.Schema({
    login: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true
    }
});

module.exports = mongoose.model('Users', usersSchema)
/*async function main() {
    await mongoose.connect('mongodb://127.0.0.1:27017/test');
    console.log('Connected to MongoDB');
    await user1.save().then(() => console.log("User1 saved"))

    // perform your database operations here
}

main().catch(err => console.log(err));*/
/*
const {Schema} = mongoose;

const usersSchema = new Schema({
    login: String,
    password: String,
    name: String
});

const Users = mongoose.model('Users', usersSchema);
//module.exports = mongoose.model('Users', usersSchema);

const user1 = new Users({
    login: "user1",
    password: "1111",
    name: "Elizabeth"
})

*/


