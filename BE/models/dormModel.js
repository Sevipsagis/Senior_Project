var mongoose = require('mongoose');
// Schema Validation
var dormSchema = mongoose.Schema({
    total_elect: { type: Number, required: true },
    total_water: { type: Number, required: true },
    room_price: { type: Number, required: true },
    elect_price: { type: Number, required: true },
    water_price: { type: Number, required: true },
    logs: { type: Array, required: true }
},
    {
        versionKey: false
    });

var Dorm = mongoose.model('dorms', dormSchema);
module.exports = Dorm;