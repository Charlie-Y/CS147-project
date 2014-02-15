
/**
 * Module dependencies.
 */

var express = require('express');
var http = require('http');
var path = require('path');
var handlebars = require('express3-handlebars');
var sass = require('node-sass');

var mongoose = require("mongoose");
var uristring = process.env.MONGOLAB_URI || process.env.MONGOHQ_URL || 'mongodb://localhost/test';
mongoose.connect(uristring);

mongoose.model('Video', require('./models/video').Video, "videos");
mongoose.model('Setlist', require('./models/setlist').Setlist, "setlists");
Video = mongoose.model('Video');
Setlist = mongoose.model('Setlist');

/* Remove content */
mongoose.connection.collections['videos'].drop();
mongoose.connection.collections['setlists'].drop();

/* Repopulate with seed */
var videoseed = require('./videoseed.json');
var setlistseed = require('./setlistseed.json');
Video.create(videoseed, function (err) {
    if (err) {
    	console.log(err);
    }
});
Setlist.create(setlistseed, function (err) {
    if (err) {
    	console.log(err);
    }
});

var index = require('./routes/index');
var video = require('./routes/video');
var sandbox = require('./routes/sandbox');
var playlist = require('./routes/playlist');
var help = require('./routes/help');
var create = require('./routes/create');
var setlist = require('./routes/setlist');
var createsetlist = require('./routes/createsetlist');
var addtosetlist = require('./routes/addtosetlist');


// Example route
// var user = require('./routes/user');

var app = express();

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views'));
// app.engine('handlebars', handlebars({'defaultLayout':'main'}));
app.engine('handlebars', handlebars());
app.set('view engine', 'handlebars');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.json());
app.use(express.urlencoded());
app.use(express.methodOverride());
app.use(express.cookieParser('Intro HCI secret key'));
app.use(express.session());
app.use(app.router);
app.use(
    sass.middleware({
         src: __dirname + '/public', //where the sass files are 
         dest: __dirname + '/public', //where css should go
         debug: true // obvious
    })
);

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());
app.use(express.urlencoded());

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

// Add routes here
app.get('/', index.view);
app.get('/video', video.watchVideo);
app.get('/video/:id', video.watchVideo);
app.get('/sandbox', sandbox.view);
app.get('/sandbox/:videoId', sandbox.view);

app.get('/setlist/:setlistId', setlist.view);
app.get('/setlist/:setlistId/remove/:videoId', setlist.remove);
app.get('/setlist/:setlistId/remove', setlist.delete);

app.get('/playlist', playlist.view);
app.get('/help', help.view);
app.get('/create', create.view);
app.get('/createsetlist', createsetlist.view);
app.post('/createsetlist', createsetlist.create);

app.get('/addtosetlist/:setlistId', addtosetlist.view);

// Example route
// app.get('/users', user.list);

http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
