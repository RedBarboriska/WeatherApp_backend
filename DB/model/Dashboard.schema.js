const mongoose = require('mongoose');

const dashboardsSchema = new mongoose.Schema({
    cities: [{
        latitude: String,
        longitude: String
    }],
    userID: mongoose.SchemaTypes.ObjectId
});

module.exports = mongoose.model('Dashboards', dashboardsSchema)