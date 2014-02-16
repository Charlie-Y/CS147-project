var mongoose = require('mongoose');
Video = mongoose.model('Video');
Setlist = mongoose.model('Setlist');


exports.view = function(req, res){
	var data = {};

	Setlist.findOne({'id':req.params.setlistId}, function (err, setlist) {
		data.title = setlist.title;
		data.setlistId = req.params.setlistId;
		options = {
			sort: {'title': 1}
		}
		Video.find({}, {}, options, function(err, videos) {
			var i = 0;
			while (true) {
				if (i == videos.length)	break;
				if (setlist.setlistvids.indexOf(videos[i].id) != -1) {
					videos.splice(i,1);
				} else {
					i += 1;
				}
			}
			data.videos = videos;
			res.render('addtosetlist', data);
		});
	});
}

exports.add = function(req, res){
	var setlistId = req.params.setlistId;
	var data = {};

	Setlist.findOne({'id':setlistId}, function (err, setlist) {
		var updatedList = setlist.setlistvids.concat(req.body.newvids);

		Setlist.update({'id':setlistId}, {$set: {'setlistvids': updatedList}}, function (err, setlist) {
			if (err) console.log(err);
			data["setlistId"] = setlistId;
			res.json('addtosetlist', data);
		});
	});
}

exports.search = function(req, res){
	var setlistId = req.params.setlistId;
	var data = {};

	var vids = []
	Video.textSearch(req.body.query, function (err, videos) {
		console.log(req.body.query);
		console.log(err);
		if (videos != null) {
			results = videos.results;
			for (var i=0; i < results.length; i++) {
				vids.push(results[i].obj.id);
			}

			Setlist.findOne({'id':setlistId}, function (err, setlist) {
				var currentList = setlist.setlistvids;
				var i=0;
				while (true) {
					if (i==vids.length) break;
					if (currentList.indexOf(vids[i]) > -1) {
						vids.splice(i,1);
					} else {
						i += 1;
					}
				}
				res.json(vids);
			});
		}
	});
}