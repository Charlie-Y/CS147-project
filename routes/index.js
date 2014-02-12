
/*
 * GET home page.
 */

exports.view = function(req, res) {

  	var mongoose = require('mongoose');
	Video = mongoose.model('Video');
	Setlist = mongoose.model('Setlist');
	
	Video.create(
		{
			"title": "How to Dougie"	
		}, function(err) {
			if (err) return handleError(err);
		}
	);
	
	Setlist.create(
		{
			"title": "asdfasde"	
		}, function(err) {
			if (err) return handleError(err);
		}
	);

	Video.find(function(err, videos) {
		var data = {};
		data.videos = videos;
		res.render('index', data);
	});

  	//res.render('index');
};