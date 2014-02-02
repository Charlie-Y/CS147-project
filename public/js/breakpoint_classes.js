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
    // this.player 
    // this.breakpoints []
    // this.breakpointsById {}
    // this.breakpointsegments


    // ===== Constructor ===== //
    initialize: function(elementId) {
        var tag = document.createElement('script');
        tag.src = "https://www.youtube.com/iframe_api";
        var firstScriptTag = document.getElementsByTagName('script')[0];
        firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
        this.elementId = elementId;
        this.done = false;
        this.initializeBreakPoints();
    },
    // "instance" methods
    toString: function() {
        return "Player for " + this.elementId;
    },

    // ===== Youtube API methods ====== //

    setPlayer: function(ytPlayer) {
        this.player = ytPlayer
    },
    onPlayerReady: function (event) {
        // console.log("onPlayerReady");
        // console.log(event.target.breakPointVideo.toString());
        // event.target.stopVideo();   
        // event.target.playVideo();   
        event.target.seekTo(13, true);
    },
    // this is really important
    onPlayerStateChange: function (event) {
    },
    stopVideo: function () {
        this.player.stopVideo();
    },
    playVideo: function() {
        this.player.playVideo();
    },
    seekTo: function(time) {
        this.player.seekTo(time, true);
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



    // ========= Html related methods ====== //

    // TODO -refactor
    // 
    renderList: function(){
        var list = $("<ul class='breakpoints-ul'><li class='breakpoint-header-li'>Breakpoints</li></ul>");
        for (var i =0; i < this.breakpoints.length; i++){
            var breakpoint = this.breakpoints[i]
            var bpstring = "<li>" + breakpoint.htmlString() + "</li>";
            // console.log(bpstring);
            $(bpstring).appendTo(list);
        }
        var player = $('#' + this.elementId);
        // console.log(player);
        list.appendTo($("#breakpoint-container"));
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
    getImage: function(){






        console.log("TODO get image thumbnails working");
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
        height: '390',
        width: '640',
        videoId: 'moSFlvxnbgk',
        events: {
            'onReady': video.onPlayerReady,
            'onPlayerStateChange': video.onPlayerStateChange
        }
        });
    player.breakPointVideo = video;
    video.setPlayer(player);
}
