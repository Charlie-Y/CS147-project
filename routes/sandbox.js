// charlie's sandbox


exports.view = function(req, res){
    var videoId = req.params.videoId; 
    res.render('charlie_sandbox',
        {
            'layout':'main',
            'cssFiles': [{filename: 'charlie_sandbox.css'}],
            'videoId': videoId
        });

};

