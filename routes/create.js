var model = require('../models/video');
var mongoose = require('mongoose');
Video = mongoose.model('Video');

exports.view = function(req, res){
    res.render('create');
};

exports.add = function(req, res) {
	 //console.log("at first");
     var video = req.body.id.videoId;
     //console.log(video);
     var title = req.body.snippet.title;
     //console.log(title);
     var desc = req.body.snippet.description;
     var thumbnail = req.body.snippet.thumbnails.high.url;
     //console.log(desc);
     console.log(req.body);
     Video.create ({description: desc, title: title, youtubeid: video, imageURL: thumbnail}, function (err, Video) {
     	if(err) console.log(err);
     	console.log(Video);
     	res.json(Video._id);
     });
};