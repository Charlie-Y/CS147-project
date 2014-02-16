
var mongoose = require('mongoose');
// Video contains information about all breakpoint videos made
// Take a look at videoseed.json or models/video.js for schema/sample data
Video = mongoose.model('Video');
Setlist = mongoose.model('Setlist');

exports.watchVideo = function(req, res){

    var videoId = req.params.id; 
    console.log('looking for video: ' + videoId);
    if (videoId != undefined){
        var data = {};
        data.layout = 'angular_layout';
        data.cssFiles = 
            [
               {filename: 'video_show.css'},
                {filename:'font-awesome.min.css'}
            ];
        data.videoId = videoId;

        /* Query like this.
           In the callback function, the fetched video is returned. (for sample video object, look at videoseed.json)
           video has all the attributes needed (title, breakpoints, created, etc.)

           Search mongoose documentation for syntax on querying/inserts/updates (http://mongoosejs.com/docs/models.html)
           For examples, look at routes/setlist.js, routes/createsetlist.js
         */
         // Video.find({}, function(err, videos) {
         //    data.videos = videos;
         //    console.log(data)
         //    res.render('video_show',data);

         // })
        Video.find({id: videoId}, function (err, video) {
            data.video = video[0];
            console.log(data);
           // /* MongoDB operations are asynchronous! So call render.send in a callback after db operation is complete. Otherwise, the page will be rendered before data gets returned. */
            res.render('video_show',data);
        });
    } else {
        res.render('video_show',
        // res.render('charlie_sandbox',
            {
                'layout':'angular_layout',
                'cssFiles': [
                    {filename: 'video_show.css'},
                    {filename:'font-awesome.min.css'}
                ],
                'videoYTID': videoId
            });
    }
};