var mongoose = require('mongoose');
Video = mongoose.model('Video');
Setlist = mongoose.model('Setlist');


exports.view = function(req, res){
	res.render('createsetlist');
}

exports.create = function(req, res) {
	console.log(req.body.title);
	console.log(req.body.description);
	req.body.id = 5;
	Setlist.create(req.body, function(err, setlist) {
		if (err) console.log(err);
		res.send(setlist);
	});
}
