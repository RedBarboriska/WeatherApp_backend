var express = require('express');
//expressjwt
var router = express.Router();
const Users = require("../model/Users.schema")
const Dashboards = require("../model/Dashboard.schema")
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const secret = process.env.SECRET || 'some other secret as default';
const passport = require('passport');

router.post('/sign-up', async (req, res) => {
    let errors = {};
    const user = await Users.findOne({login: req.body.login});
    //const newUser = new Users({...req.body});

    try {
        const hashedPassword= await bcrypt.hash(req.body.password, 10)
        const newUser = new Users(
            {login: req.body.login,
        password: hashedPassword,
        name: req.body.name})
        await newUser.save();
    } catch(e) {
        errors = e;
        return res.status(400).json(e);
    }

    return res.status(200).json({ message: 'Реєстрація пройшла успішно' });
});

router.post('/sign-in', async (req, res) => {
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

    let token = await jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET, {expiresIn: 36000});

    //let token = await jwt.sign(payload, secret, {expiresIn: 36000});


    // return 500 if token is incorrect
    if (!token) {
        return res.status(500)
            .json({ error: "Error signing token",
                raw: err });
    }

    return res.json({
        success: true,
        token: `Bearer ${token}` });
});

router.get('/mydashboard', passport.authenticate('jwt', {session: false}), async function(req, res, next) {
    const login = req.user.login;
    const dbUser = await Users.findOne({ login });
    const dbDashboard = await Dashboards.findOne({userID: dbUser._id})//id usera
    res.status(200).json(dbDashboard);
});

router.get('/me', passport.authenticate('jwt', {session: false}), async function(req, res, next) {
    const login = req.user.login;
    const dbUser = await Users.findOne({ login });
    res.status(200).json(dbUser);
});

router.post('/addcity', async (req, res) => {
    let errors = {};
    const dbUser = await Users.findOne({login: req.body.login});
    const dbDashboard = await Dashboards.findOne({userID: dbUser._id})//id usera
    const newCity = {
        cityName:  req.body.cityName,
        cityRegion: req.body.cityRegion,
        cityCountry: req.body.cityCountry,

        latitude: req.body.latitude,
        longitude: req.body.longitude,
    };
    Dashboards.updateOne(
        { _id: dbDashboard._id },
        { $push: { cities: newCity } },
        (error, result) => {
            if (error) {
                console.error(error);
                return res.status(400).json({error});
            } else {
                console.log("City added successfully");
            }
        }
    );

    return res.status(200).json({});
});
router.post('/removecity', async (req, res) => {
    let errors = {};
    const dbUser = await Users.findOne({login: req.body.login});
    const dbDashboard = await Dashboards.findOne({userID: dbUser._id})//id usera
    //const latitude = req.body.latitude; // Replace with the actual city ID to remove
    //const longitude = req.body.longitude; // Replace with the actual dashboard ID
    //const cityNameToRemove =req.body.cityName;
    Dashboards.updateOne(
        { _id: dbDashboard._id },
        {
            $pull: {
                cities: {
                    $elemMatch: {
                        cityName:  req.body.cityName,
                        cityRegion: req.body.cityRegion,
                        cityCountry: req.body.cityCountry
                        //latitude: { $gte: parseFloat(latitude) - 0.2, $lte: parseFloat(latitude) + 0.2 },
                        //longitude: { $gte: parseFloat(longitude) - 0.2, $lte: parseFloat(longitude) + 0.2 },
                    }
                }
            }
        },
        (error, result) => {
            if (error) {
                console.error(error);
                return res.status(400).json({error})
            } else {
                console.log("City removed successfully");
            }
        }
    );


    return res.status(200).json({});
});


module.exports = router;


//require('crypto').randomBytes(64).toString('hex')