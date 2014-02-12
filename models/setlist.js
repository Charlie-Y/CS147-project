var mongoose = require('mongoose');
var Setlist = new mongoose.Schema({
	  title: String
	, description: String
	, imageURL: String
	, setlistvids: [{vidid: Number}]
});

module.exports.Setlist = Setlist;