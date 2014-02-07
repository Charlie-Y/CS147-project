// TODO -refactor, controls and listeners seem all over the place right now

// TODO - error checking to make sure that nothing breaks
    // like breakpoints giving bad times
// todo make sure the js controls the html and widths etc
// todo make a poper control system after first agreeing on what it should look like
// and how it should respond
// Todo make the loaders and savers hit the database - first set up a database
// todo - maybe impossibly get image thumbnails. based on the dimensions of the final,
// this might not actually be necessary



// handles the various UI of the vidoe player
// needs to make sure that the video player is the right size depending on 
// the device. 
// this will initialize all the random things 
var BreakPointPlayer = new JS.Class({
    

    extend: {
        // ====== Class variables ====== //

        // these are being moved to the css
        // or they should be the same across
        SMARTPHONE_HEIGHT: '480', //in portrait orientation
        SMARTPHONE_WIDTH: '320', // also in portrait orientation
        SIDE_NAV_WIDTH: '130',
        VIDEO_WIDTH: '350', // landscape
        VIDEO_HEIGHT: '250', // landscape, confusing i know
        VIDEO_CONTROL_HEIGHT: '70',

        CONTROLS: 0 // 0 for no default youtube controls, 1 for youtube controls


        
        // ====== Class methods ====== //

    },

    // ====== Instance Variables ==== ///
    // does this make sense to mirror the html with the js?
    // i mean, how much do i care?
    // the goal of the refactoring is to make this easier for myself 
    // and others to work with...

    // this.video
    // this.control
    // this.menu
    // this.breakpoints

    // ====== Constructor ==== //

    initialize: function(){

    },

})

var BreakPointVideoControls = new JS.Class({

});



// handles the video loading playing controls 
// and also events based on the Youtube Player object
var BreakPointVideo = new JS.Class({

    // ======= Class variables ==== //

    extend: { 
        // i am bad at this class vs instance variable thing..
        setMainInstance: function(mainInstance){
            BreakPointVideo.mainInstance = mainInstance;
        },
        getMainInstance: function() {
            return BreakPointVideo.mainInstance;
        }

    },

    // ======= Class methods ==== //




    /* ===== Instance Variables ====== */
    // this.elementId
    // this.ytId - the youtube id
    // this.youtubePlayer 
    // this.breakpoints []
    // this.breakpointsById {}
    // this.breakpointsegments
    // this.firstPlay 


    // ===== Constructor ===== //
    initialize: function(elementId) {
        var tag = document.createElement('script');
        tag.src = "https://www.youtube.com/iframe_api";
        var firstScriptTag = document.getElementsByTagName('script')[0];
        firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
        


        $iframe = $('.player-video-id'); // TODO refactor this
        // finds the video from the url and plays it
        ytId = $iframe.attr('data-video-id');
        if (ytId.length > 0 ){
            this.ytId = ytId;
        } else {
            this.ytId = 'moSFlvxnbgk';
        }

        this.elementId = elementId;
        this.firstPlay = false;
        this.breakpoints = [];
    },
    // "instance" methods
    toString: function() {
        return "Player for " + this.elementId;
    },

    // ===== Youtube API methods ====== //

    setPlayer: function(youtubePlayer) {
        this.youtubePlayer = youtubePlayer;
    },
    onPlayerReady: function (event) {
        // console.log("onPlayerReady");
        // console.log(event.target.breakPointVideo.toString());
        // event.target.stopVideo();   
        // event.target.playVideo();  
        player = event.target
        player.breakPointVideo = BreakPointVideo.getMainInstance();
        var video = BreakPointVideo.getMainInstance();
        video.setPlayer(player);
        video.onVideoLoaded();
        video.renderOnPage();
 
        player.seekTo(13, true);
    },
    // this is really important
    onPlayerStateChange: function (event) {
        var player = event.target;
        var video = player.breakPointVideo
        // console.log("State changed: " + event.data);
        // console.log("Duration : " + player.getDuration());
        // console.log("State Cued: " + YT.PlayerState.CUED);
        if (event.data == YT.PlayerState.ENDED ){
            // console.log("video ended");
            player.playVideo();
        }
        if (event.data == YT.PlayerState.PLAYING && !video.firstPlay){
            video.onVideoFirstPlay();
            video.firstPlay = true;
            // console.log("firstPlay");
        }
        // if (event.data == YT.PlayerState.CUED){
        //     player.breakPointVideo.onVideoCued();
        //     console.log("Cued");
        // }

    },
    onVideoLoaded: function(){
        this.initializeBreakPoints();
        
        // var thisPlayer = this;
        // setInterval(function(){
        //     console.log("Duration: " + thisPlayer.getVideoLength());
        // }, 200);
        
    },
    onVideoFirstPlay: function ()
    {
        this.initializeControls();
    },
    stopVideo: function () {
        this.youtubePlayer.stopVideo();
    },
    playVideo: function() {
        this.youtubePlayer.playVideo();
    },
    seekTo: function(time) {
        this.youtubePlayer.seekTo(time, true);
    },
    getTime: function(){
        return this.youtubePlayer.getCurrentTime();
    },
    getVideoLength: function(){
        if (this.youtubePlayer){
            return this.youtubePlayer.getDuration();
        } else {
            return -1;
        }
    },


    // ======== Breakpoint code =========

    

    // This will probably be some sort of database querying thing
    // but for now it iwll just be something else
    initializeBreakPoints: function(){
        rawBreakpoints =  BreakPoint.devBreakpoints();
        devBreakpoints = []
        this.breakpointsById = {}
        for (var i = rawBreakpoints.length - 1; i >= 0; i--) {
            raw = rawBreakpoints[i]
            var bp = BreakPoint.initFromData(raw);
            devBreakpoints.push(bp)
            this.breakpointsById[bp.breakPointId] = bp;
        }

        this.breakpoints = devBreakpoints;
        this.breakpoints.sort( function(a,b){
            return a.startTime - b.startTime;
        });
    },

    getBreakPoint: function(id){
        return this.breakpointsById[id];
    },

    gotoBreakPoint: function(breakPoint){
        timeInSeconds = breakPoint.startTime;
        this.seekTo(timeInSeconds, true);
    },

    addBreakPoint: function() {

    },



    // ========= Html related methods ====== //

    renderList: function(){
        var list = $("<ul class='breakpoints-ul'></ul>");
        // var list = $("<ul class='breakpoints-ul'><li class='breakpoint-header-li'>Breakpoints</li></ul>");
        for (var i =0; i < this.breakpoints.length; i++){
            var breakpoint = this.breakpoints[i]
            var bpstring = "<li class='breakpoint-li'>" + breakpoint.htmlString() + "</li>";
            // console.log(bpstring);
            $(bpstring).appendTo(list);
        }
        var player = $('#' + this.elementId);
        // console.log(player);
        list.appendTo($("#player-breakpoints"));
        // console.log(list);
    },

    setBreakPointListeners: function(){
        $('.breakpoint').on('click', function(){
            var bpVideo = BreakPointVideo.getMainInstance();
            var id = $(this).attr('data-bp-id');
            // console.log("Breakpoint with id: " + id)
            var bp = bpVideo.getBreakPoint(id);
            bpVideo.gotoBreakPoint(bp);
            console.log("Clicked: " + bp.toString());
        });
    },

    // I will refactor this out into something else...
    initializeControls: function(){
        $slider = $('#player-slider')
        thisVideo = this;
        // also this won't work because you need multiple inputs and sliders/markers
        // but maybe this is a starting point...


        // setup the correct min and max time
        $slider.attr('min',0);

        var maxLength = this.getVideoLength();
        // console.log("maxLength: " + maxLength);
        $slider.attr('max', maxLength);

        // make it change according to the video time
        // this needs to be stopped or something when necessary
        window.setInterval(function(){
            $slider.val(thisVideo.getTime());
        }, 300)
        // make it respond to time changes
        $slider.on('change', function(){
            thisSlider = $(this);
            var val = thisSlider.val();
            $slider.val(val);

            thisVideo.seekTo(val);

        });
    },  

    // this is the best part, that draws everything to the canvas
    // make sure this happens on an event or something
    renderOnPage: function(){
        if(this.breakpoints.length > 0){
            this.renderList();
            this.setBreakPointListeners();
        }
    } 

});


// encapsulates a single time segment in a video, possibly with other stuff
// its more like a breakpoint segment
var BreakPoint = new JS.Class({
    
    // ===== Class methods ====== //
    extend: {
        // sets up the breakpoint listeners
        // maybe move this to the video?
        initializeBreakPointListeners: function() {

        },

        devBreakpoints: function() {
            breakpoints = [
                {
                    time: 12,
                    desc: "Beginning",
                    breakPointId: 1
                },
                {
                    time: 90,
                    desc: "The code didn't bother me anyways",
                    breakPointId: 2
                },
                {
                    time: 143,
                    desc: 'So badass',
                    breakPointId: 3
                },
                {
                    time: 235,
                    desc: 'Break me!',
                    breakPointId: 4
                },
                {
                    time: 44,
                    desc: 'Foobar',
                    breakPointId: 5
                },
                {
                    time: 30,
                    desc: 'More bar',
                    breakPointId: 6
                },
                {
                    time: 30,
                    desc: 'More bar',
                    breakPointId: 7
                },
                {
                    time: 30,
                    desc: 'More bar',
                    breakPointId: 8
                },
                {
                    time: 30,
                    desc: 'More bar',
                    breakPointId: 9
                },
                {
                    time: 30,
                    desc: 'More bar',
                    breakPointId: 10
                },
                {
                    time: 30,
                    desc: 'More bar',
                    breakPointId: 11
                }
            ];
            return breakpoints;
        },
        initFromData: function(data){
            return  new BreakPoint(raw.time, raw.desc, raw.breakPointId);
        }

    },

    // ===== Contructor ====== //

    initialize: function(startTime, desc, breakPointId){
        this.startTime = startTime;
        this.desc = desc;
        this.breakPointId = breakPointId;
    },



    // ====== Instance Variables ====== //
    // this.startTime - in seconds
    // this.endTime - in seconds



    // this.breakPointVideoId - the database id of the video
    // this.breakPointId - the database id
    // this.desc - i guess we can name them - the database name

    // this.breakpointVideo - the breakpoint video object
    // this.speed - the speed to watch


    // ====== Instance methods ====== //
    toString: function(){
        return "Time: " + this.startTime + ", Desc: " + this.desc + ", Id: " + this.breakPointId;
    },

    timeInMinsSeconds: function(timeInSeconds) {
        mins = Math.floor(timeInSeconds / 60)
        seconds = timeInSeconds % 60
        // return {'mins': mins, 'seconds': seconds}
        if (seconds < 10){
            seconds = "0" + seconds
        }
        return mins + " : " + seconds
    },

    displayStartTime: function(){
        return this.timeInMinsSeconds(this.startTime);
    },
    displayEndTime: function(){
        return this.timeInMinsSeconds(this.endTime);
    },

    duration: function(){
        return this.endTime - this.startTime; 
    },

    setSpeed: function(speed){

    },

    // this is going to be fun
    // somehow this needs to work
    // THIS SUCKS AND IS GOING TO BE A LOT OF WORK
    // and is also nearly impossible
    getImage: function(){
    },

    // ===== html instance methods === ///
    // using jquery, because laziness > speed of site
    // also i would like some kind of templating because this is awful and annoying

    timeDivString: function(){
        var time = this.displayStartTime();
        var div =  "<div class='breakpoint-time'>"+  time + "</div>";
        return div;
    },

    descDivString: function() {
        var div =  "<div class='breakpoint-name'>"+ this.desc + "</div>";
        return div;
    },

    htmlString: function () {
        var elemStr = "<a class='breakpoint' href='#' data-bp-id='" + this.breakPointId +"'>" + this.timeDivString() + this.descDivString() + "</a>";
        return elemStr;
        // getImage();
    }   

});



// yeah this needs to be called from the window context.
// I'll figure out scopes later..
// I really want to move this into one of the classes but i have problems...
function onYouTubeIframeAPIReady() {
    var player;
    var video = BreakPointVideo.getMainInstance();
    player = new YT.Player(video.elementId, {
        height: BreakPointPlayer.VIDEO_HEIGHT,
        width: BreakPointPlayer.VIDEO_WIDTH,
        videoId: video.ytId,
        playerVars: {controls: BreakPointPlayer.CONTROLS},
        events: {
            'onReady': video.onPlayerReady,
            'onStateChange': video.onPlayerStateChange
            // 'onPlayerStateChange': function(){ console.log("change");}
        }
        });
    // player.breakPointVideo = video;
    // video.setPlayer(player);
    // video.onVideoLoaded();
    // video.renderOnPage();
}
