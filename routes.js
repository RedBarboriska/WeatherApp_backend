const routes = require('express').Router()
const { login, verifyToken, updatePassword, logout } = require('./controllers')
//routes
routes.post('/login',login)
routes.post('/update', verifyToken, updatePassword)
routes.get('/logout', logout)
module.exports = routes