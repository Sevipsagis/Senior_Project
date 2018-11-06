var mongoose = require('mongoose');
// Schema Validation
var messageSchema = mongoose.Schema({
    room: {type: String, required: true},
    elec_usage: {type: Number, required: true},
    water_usage: {type: Number, required: true},
    created_date: {type:Date, default: Date.now}
},{
    versionKey: false 
});

var Message = mongoose.model('users_data', messageSchema);
module.exports = Message;