var data = require('../playlistdata.json');

exports.view = function(req, res){
	res.render('createsetlist', data);
}