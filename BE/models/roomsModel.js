var mongoose = require('mongoose');
// Schema Validation
var roomsSchema = mongoose.Schema({
    room: { type: String, required: true },
    floor: { type: Number, required: true },
    personal_id: { type: String, required: true },
    nationality: { type: String, required: true },
    firstname: { type: String, required: true },
    lastname: { type: String, required: true },
    email: { type: String, required: true },
    telephone: { type: String, required: true },
    address: { type: String, required: true },
    elect_usage: { type: Number, required: true },
    water_usage: { type: Number, required: true },
    status: { type: Boolean, required: true }
},
    {
        versionKey: false
    });

var Rooms = mongoose.model('rooms', roomsSchema);
module.exports = Rooms;