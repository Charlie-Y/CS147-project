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
			data.videos = videos;
			res.render('addtosetlist', data);
		});
	});
}
