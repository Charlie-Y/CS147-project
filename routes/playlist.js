var data = require('../playlistdata.json');

exports.view = function(req, res){
	data["helpers"] = {
	    title_of: function(index,array) {
	  		return array[parseInt(index)].title;
	  	}
	};	
	res.render('playlist', data);
}