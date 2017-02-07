var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var competitionSchema = new Schema({
    name: {type: String, required: true, unique: true},
    description: {type: String, required: false},
    official: {type: Boolean, required: true, default: false},
    featured: {type: Boolean, required: true, default: false}
});

module.exports = mongoose.model("Competition", competitionSchema);