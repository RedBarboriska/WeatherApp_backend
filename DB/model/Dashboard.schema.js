const mongoose = require('mongoose');

const dashboardsSchema = new mongoose.Schema({
    cities: [{
        cityName: String,
        cityRegion: String,
        cityCountry: String,

        latitude: String,
        longitude: String,
       // pinned: Boolean
    }],
    userID: mongoose.SchemaTypes.ObjectId
});

module.exports = mongoose.model('Dashboards', dashboardsSchema)