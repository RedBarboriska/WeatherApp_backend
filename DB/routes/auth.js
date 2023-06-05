var express = require('express');
//expressjwt
var router = express.Router();
const Users = require("../model/Users.schema")
const Dashboards = require("../model/Dashboard.schema")
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const secret = process.env.SECRET || 'some other secret as default';
const passport = require('passport');

const JWT_SECRET = process.env.JWT_SECRET


function authenticateToken(req, res, next) {

    const authHeader = req.headers['authorization']

    //console.log(authHeader.split(' ')[1])
    const token = authHeader && authHeader.split(' ')[1]

    if (token == null) return res.sendStatus(401)

    jwt.verify(token, JWT_SECRET, (err, user) => {
        console.log(user)

        if (err) return res.sendStatus(403)

        req.user = user

        next()
    })
}

router.post('/sign-up', async (req, res) => {
    let errors = {};

    const user = await Users.findOne({ login: req.body.login });
    if (user) {
        return res.status(400).json({ message: "Уже існує користувач з даним логіном" });
    }

    try {
        const hashedPassword = await bcrypt.hash(req.body.password, 10);
        const newUser = new Users({
            login: req.body.login,
            password: hashedPassword,
            name: req.body.name
        });
        await newUser.save();

        const userID = newUser._id; // Get the ID of the newly created user

        const dashboard = await Dashboards.create({
            cities: [],
            userID: userID
        });

        console.log(dashboard);
    } catch (e) {
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
        errors.message = "Не знайдено користувача з даним логіном";
        return res.status(400).json({errors});
    }
    const isMatch = await bcrypt.compare(password, user.password)

    console.log(` пароль ${isMatch} ${password}  ${user.password}`)
    //const isMatch = password === user.password;

    // return 400 if password does not match
    if (!isMatch) {
        errors.message = `Невірний пароль ${isMatch} ${password}  ${user.password}`;
        return res.status(400).json({errors});
    }
    //const token = jwt.sign({sub: data.username, role:data.role}, JWT_SECRET);


    const payload = {
        id: user._id,
        login: user.login
    };

    let token = await jwt.sign(payload, process.env.JWT_SECRET, /*{expiresIn: 36000}*/);

    if (!token) {
        return res.status(500)
            .json({ error: "Помилка створення токену",
                 });
    }

    return res.status(200).json({token: `Bearer ${token}` });
});

router.post('/me', authenticateToken, async function(req, res, next) {
    const login = req.user.login;
    const id = req.user.id;
    console.log(login)
    const dbUser = await Users.findById(id)
    //const dbUser = await Users.findOne({ login });
    return res.status(200).json({name:dbUser.name});
});

router.post('/mydashboard', authenticateToken, async function(req, res, next) {
    const id = req.user.id;
    const dbDashboard = await Dashboards.findOne({userID: id})//id usera
    console.log("dbDashboard")
    console.log(dbDashboard)
   // if(dbDashboard!==null){
 res.status(200).json(dbDashboard);
   // } else{
         //res.status(200).json([])};
});

router.post('/addcity', authenticateToken, async (req, res, next) => {
    try {
        const id = req.user.id;
        const dbDashboard = await Dashboards.findOne({ userID: id });

        const newCity = {
            cityName: req.body.cityName,
            cityRegion: req.body.cityRegion,
            cityCountry: req.body.cityCountry,
            latitude: req.body.latitude,
            longitude: req.body.longitude,
        };

        await Dashboards.updateOne(
            { _id: dbDashboard._id },
            { $push: { cities: newCity } }
        );

        console.log("City added successfully");
        return res.status(200).json({});
    } catch (error) {
        console.error(error);
        return res.status(400).json({ error });
    }
});

router.post('/removecity', authenticateToken, async (req, res) => {
    try {
        const id = req.user.id;
        const dbDashboard = await Dashboards.findOne({ userID: id });

        await Dashboards.updateOne(
            {
                _id: dbDashboard._id,
                'cities.cityName': req.body.cityName,
                'cities.cityRegion': req.body.cityRegion,
                'cities.cityCountry': req.body.cityCountry
            },
            { $pull: { 'cities': {
                        cityName: req.body.cityName,
                        cityRegion: req.body.cityRegion,
                        cityCountry: req.body.cityCountry
                    }}}
        );

        console.log("City removed successfully");
        return res.status(200).json({});
    } catch (error) {
        console.error(error);
        return res.status(400).json({ error });
    }
});



module.exports = router;


//require('crypto').randomBytes(64).toString('hex')