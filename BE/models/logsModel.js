var mongoose = require('mongoose');
// Schema Validation
var logsSchema = mongoose.Schema({
    room: { type: String, required: true },
    logs: { type: Array, required: true }
},
    {
        versionKey: false
    });

var Logs = mongoose.model('logs', logsSchema);
module.exports = Logs;