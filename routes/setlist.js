var mongoose = require('mongoose');
Video = mongoose.model('Video');
Setlist = mongoose.model('Setlist');

exports.view = function(req, res) {

	var data = {};
	data["helpers"] = {
	    add_one: function(index) {
	  		return parseInt(index) + 1;
	  	}
	};
	data.setlistId = req.params.setlistId;
	Setlist.findOne({'id':req.params.setlistId}, function (err, setlist) {
		data.title = setlist.title;
		data.description = setlist.description;
		var vidids = setlist.setlistvids;
		data.videos = [];
		if (vidids.length == 0) {
			res.render('setlist', data);
		} else {
			for (var i=0; i < vidids.length; i++) {
				Video.findOne({'id': vidids[i]}, function (err, video) {
					data.videos.push(video);

					if (data.videos.length == vidids.length) {
						res.render('setlist', data);
					}
				});
			}
		}
	});
}

exports.remove = function(req, res) {
	var setlistId = req.params.setlistId;
	var videoId = req.params.videoId;

	Setlist.findOne({'id': setlistId}, {'setlistvids': 1}, function (err, setlist) {
		var updatedList = setlist.setlistvids;
		for (var i=0; i < updatedList.length; i++) {
			if (updatedList[i] == videoId) {
				updatedList.splice(i,1);
				break;
			}
		}
		Setlist.update({'id':setlistId}, {$set: {'setlistvids': updatedList}}, function (err, setlist) {
			if (err) console.log(err);
			console.log(updatedList.length);
			res.json({num_vids: updatedList.length});
		});
	});
}

exports.delete = function(req,res) {
	var setlistId = req.params.setlistId;
	Setlist.remove({'id': setlistId}, function (err, setlist) {
		if (err) console.log(err);
		res.send();
	});
}