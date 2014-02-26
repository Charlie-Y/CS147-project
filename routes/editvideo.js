var mongoose = require('mongoose');
Video = mongoose.model('Video');
Setlist = mongoose.model('Setlist');


exports.view = function(req, res){
	var videoId = req.params.videoId;
	Video.findOne({'_id': videoId}, function (err, video) {
		res.render('editvideo', video);
	});
}

exports.edit = function(req, res) {
	var videoId = req.params.videoId;
	title = req.body.title;
	description = req.body.description;

	Video.update({'_id':videoId}, {$set: {title: title, description: description}}, function (err, video) {
		if (err) console.log(err);
		console.log(videoId);
		res.json({"_id": videoId});
	});

}

exports.deleteconfirm = function(req, res) {
	var videoId = req.params.videoId;
	Video.findOne({'_id': videoId}, function (err, video) {
		res.render('deletevideo', video);
	});
}

exports.delete = function(req, res) {
	var videoId = req.params.videoId;
	Video.remove({'_id': videoId}, function (err, video) {
		if(err) console.log(err);
		res.send();
	});
}