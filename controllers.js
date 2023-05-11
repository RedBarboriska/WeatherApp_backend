const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const saltRounds = 10 //required by bcrypt
const Users = require("./DB/model/Users.schema")
const Dashboards = require("./DB/model/Dashboard.schema")
const secret = process.env.SECRET || 'some other secret as default';
const passport = require('passport');
exports.login = async (req,res)=>{
    const errors = {};
    const login = req.body.login
    const password = req.body.password;
    const user = await Users.findOne({ login }).select("+password");

    // return if there was no user with this username found in the database
    if (!user) {
        errors.message = "No Account Found";
        return res.status(400).json(errors);
    }

    let isMatch = await bcrypt.compare(password, user.password);

    // return 400 if password does not match
    if (!isMatch) {
        errors.message = "Password is incorrect";
        return res.status(400).json(errors);
    }

    const payload = {
        id: user._id,
        login: user.login
    };

    let token = await jwt.sign(payload, secret, {expiresIn: 36000});

    // return 500 if token is incorrect
    if (!token) {
        return res.status(500)
            .json({ error: "Error signing token",
                raw: err });
    }

    return res.json({
        success: true,
        token: `Bearer ${token}` });
}















