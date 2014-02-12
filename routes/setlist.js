var data = require('../playlistdata.json');

exports.view = function(req, res){
	data["currentSetList"] = req.params.setlistId;
	data["helpers"] = {
	    add_one: function(index) {
	  		return parseInt(index) + 1;
	  	}
	};
	res.render('setlist', data);
}