var mongoose = require('mongoose');
var Setlist = new mongoose.Schema({
	  title: String
	, description: String
	, id: Number
	, setlistvids: [Number]
});

module.exports.Setlist = Setlist;