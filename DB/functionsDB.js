const mongoose = require('mongoose');
const Users = require("./model/Users.schema")
const Dashboards = require("./model/Dashboard.schema")


async function createNewUser(login, password, name) {
    const user = await Users.create({
        login: login,
        password: password,
        name: name
    })
    //console.log(user)
}

async function createNewDashboard(arrayOfCities, userID) {
    const dashboard = await Dashboards.create({
        cities: listOfCities,
        userID: userID
    })
    //console.log(dashboard)
}

let citiesArray = [{latitude: "56", longitude: "-12.76"}, {latitude: "-3.3456", longitude: "40"}]
let userID = "64522f2dd7a20587e36c9336"
//dashboardUpdate(userID, citiesArray)

async function dashboardUpdate(userID, citiesArray) {
    await Dashboards.findOneAndUpdate({userID: userID}, {cities: citiesArray})
   // console.log(await Dashboards.findOne({userID: userID}))
}

async function test() {
    const rom =await  Dashboards.findOne({userID: "64522f2dd7a20587e36c9336"})
    //const rom =await  Users.findOne({login:"user1", password:"1111"})
 //   console.log(rom)
    return rom
    //console.log(await Dashboards.findOne({userID: userID}))
}

async function login(login,password) {
    const rom =await  Users.findOne({login: login, password:password})
   // console.log(rom)
    return rom
}

module.exports={test, login, createNewUser}