// charlie's sandbox


exports.view = function(req, res){
    var videoId = req.params.videoId; 
    res.render('angular_sandbox',
    // res.render('charlie_sandbox',
        {
            'layout':'angular_layout',
            'cssFiles': [
                {filename: 'charlie_sandbox.css'},
                {filename:'font-awesome.min.css'}
            ],
            'videoId': videoId
        });

};

