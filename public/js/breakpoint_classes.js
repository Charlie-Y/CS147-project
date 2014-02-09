// TODO - refactor everything into singleton classes. maybe its too late?

// TODO -refactor, controls and listeners seem all over the place right now

// TODO - error checking to make sure that nothing breaks
    // like breakpoints giving bad times
// todo make sure the js controls the html and widths etc
// todo make a poper control system after first agreeing on what it should look like
// and how it should respond
// Todo make the loaders and savers hit the database - first set up a database
// todo - maybe impossibly get image thumbnails. based on the dimensions of the final,
// this might not actually be necessary
// todo - show buffered times...



// ****** ====== Class BreakPointPlayer ====== ****** //

// This is a delegator and overview class that encompasses and 
// communicates between all the little pieces of the breakpoint player

// This includes the breakpoint list, the controls, the video etc. 
// This class stores all the breakpoints

// I'm not sure if this class should handle all the html or not. I'll think about it
// Lets think about the particluars


// it needs html to add and subtract break points
// to hook up all the controls of the thing

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

        SIDE_NAV_WIDTH_P: 0.20,
        SIDE_NAV_WIDTH_MAX: '200',

        VIDEO_CONTROL_HEIGHT_P: 0.16,
        VIDEO_CONTROL_HEIGHT_MAX: '100',

        BREAKPOINT_HEIGHT_P: 0.10,
        BREAKPOINT_HEIGHT_MIN: '30',
        BREAKPOINT_HEIGHT_MAX: '90',

        SLIDER_BREAKPOINT_IMG: '/images/slider_breakpoint.png',
        SLIDER_BREAKPOINT_HEIGHT: '20',
        SLIDER_BREAKPOINT_WIDTH: '20',

        USE_DEV_BREAKPOINTS: true,

        CONTROLS: 1, // 0 for no default youtube controls, 1 for youtube controls
        AUTOPLAY: true

        

        // ====== Class methods ====== //

    },

    // ====== Instance Variables ==== ///

    // this.video - an instance of BreakPointVideo
    // this.controls - an instance of BreakPointVideoControls
    // this.menu - an instance of BreakPointMenu - todo?
    
    // this.breakpoints  - an array of BreakPoints
    // this.breakpointsById - a hash of BreakPoints by their database Id

    // this.iframeId


    // ===== Html structure for player ==== //

    /*
    #player ----------------------------------- this
        .player-main    
            .player-video-id
            #player-iframe .player-iframe ----- this.video
            .player-controls ------------------ this.controls
        .player-sidenav
            .player-menu            
            .player-breakpoints --------------- this.breakpoints
                .breakpoint-li
                    .breakpoint: data-bp-id
                        .breakpoint-time
                        .breakpoint-name
    */

    // ====== Constructor ==== //

    initialize: function(playerId){
        var iframeId = playerId + "-iframe";
        this.video = new BreakPointVideo(iframeId);
        BreakPointVideo.setMainInstance(this.video);

        this.video.breakPointPlayer = this;
        this.setResizeListeners();
        this.breakpoints = [];
        this.breakpointsById = {};

        // console debugging
        window.breakPointPlayer = this;
    },

    // ======== Initialization helper methods ==== //

    // call this when the video is finished loading.
    // video will call this
    videoFinishedLoading: function(){
        // this.video.renderOnPage();

        // setup the controls - listeners and html
        // this.initializeControls


        // setup the breakpoints to work - listeners and html
        this.loadBreakPoints();
        this.renderBreakpointList();
        this.setBreakPointListeners();


        // var thisPlayer = this;
        // setTimeout( function(){
        //     thisPlayer.fitToScreen($(window));
        // do it twice! because the first time the window height and 
        // width will change for some reason. teehee
        this.fitToScreen($(window));
        this.fitToScreen($(window));
        // }, 1000);

        if (BreakPointPlayer.AUTOPLAY){
            this.video.playVideo();
        }
    },


    setupVideoControls: function(){
        this.controls = new BreakPointVideoControls(this);
    },

    // ======== Html rendering and resizing ===== //

    fitToScreen: function(toFit) {
        var stats = BreakPointPlayer;



        var totalHeight = toFit.height() - 40; // todo refactor the menu height. how is that going to work>
        var totalWidth = toFit.width();
        var isLandscape = true;

        

        if (totalWidth > totalHeight){
            isLandscape = true;
            // console.log("Landscape orientation");
        } else {
            isLandscape = false;
            // console.log("portrait orientation");
        }

        // get the sidebar width;

        var sideNavWidth;
        var possibleSideNavWidth = totalWidth * stats.SIDE_NAV_WIDTH_P;
        if (possibleSideNavWidth < stats.SIDE_NAV_WIDTH_MAX) {
            sideNavWidth = possibleSideNavWidth;
        } else {
            sideNavWidth = stats.SIDE_NAV_WIDTH_MAX;
        }

        var videoControlHeight;
        var possibleControlHeight = totalHeight * stats.VIDEO_CONTROL_HEIGHT_P;
        if (possibleControlHeight < stats.VIDEO_CONTROL_HEIGHT_MAX){
            videoControlHeight = possibleControlHeight;
        } else {
            videoControlHeight = stats.VIDEO_CONTROL_HEIGHT_MAX;
        }

        var breakpointHeight; 
        var possibleBreakpointHeight = totalHeight * stats.BREAKPOINT_HEIGHT_P;
        if (possibleBreakpointHeight < stats.BREAKPOINT_HEIGHT_MIN){
            breakpointHeight = stats.BREAKPOINT_HEIGHT_MIN;
        } else if( possibleBreakpointHeight > stats.BREAKPOINT_HEIGHT_MAX){
            breakpointHeight = stats.BREAKPOINT_HEIGHT_MAX;
        } else {
            breakpointHeight = possibleBreakpointHeight;
        }


        var videoHeight = totalHeight - videoControlHeight;
        var videoWidth = totalWidth - sideNavWidth;
        
        var $videoIframe = $('#player-iframe');
        var $videoControls = $('.player-controls');
        var $sideNav = $('.player-sidenav');
        var $playerMainSection = $('.player-main');
        var $breakpointContainer = $('.player-breakpoints');
        var $breakpoint = $('.breakpoint');

        // console.log("--- Resize --- ");
        // console.log("totalHeight: "+ totalHeight);
        // console.log("totalWidth: " + totalWidth);
        // console.log("videoWidth: " + videoWidth);
        // console.log("videoHeight: " + videoHeight);
        // console.log("videoControlHeight: " + videoControlHeight);
        // console.log("sideNavWidth: " + sideNavWidth);

        $sideNav.width(sideNavWidth);
        $sideNav.height(totalHeight);

        $playerMainSection.width(videoWidth);
        $playerMainSection.height(totalHeight);

        $videoIframe.width(videoWidth);
        $videoIframe.height(videoHeight);
        
        $videoControls.width(videoWidth);
        $videoControls.height(videoControlHeight);

        $breakpointContainer.width(sideNavWidth);
        $breakpointContainer.height(totalHeight);

        $breakpoint.css('height',breakpointHeight);

    },


    renderBreakpointList: function(){
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
    },


    // ======== Event Listeners ======== //

    // make sure that the screen fits
    // only landscape
    setResizeListeners: function(){
        var thisPlayer = this;
        $(window).on('resize', function(){
           thisPlayer.fitToScreen($(window));
        });
    },

    setBreakPointListeners: function() {
        var thisPlayer = this
        $('.player-breakpoint').on('click','.breakpoint', function(){
            var id = $(this).attr('data-bp-id');
            // console.log("Breakpoint with id: " + id)
            var bp = thisPlayer.getBreakPoint(id);
            thisPlayer.video.gotoBreakPoint(bp);
            console.log("Clicked: " + bp.toString());
        });
    },

    // ====== Breakpoint logic ====== //

    getBreakPoint: function(id){
        return this.breakpointsById[id];
    },

    goToBreakpointById: function(id) {
        var bp = this.getBreakPoint(id);
        this.video.gotoBreakPoint(bp);
    },

    addBreakPoint: function(bp) {
        this.breakpointsById[bp.breakPointId] = bp;
        this.breakpoints.push(bp);
        // todo hit the database
    },

    removeBreakPoint: function(bp) {
        delete(this.breakpointsById[bp.breakPointId]);
        var bpIndex = this.breakpoints.indexOf(bp);
        if (index > -1) {
            this.breakpoints.slice(index, 1);
        }
        // todo hit the database
    },

    loadBreakPoints: function(){
        if (BreakPointPlayer.USE_DEV_BREAKPOINTS){
            rawBreakpoints =  BreakPoint.devBreakpoints();
            for (var i = rawBreakpoints.length - 1; i >= 0; i--) {
                raw = rawBreakpoints[i]
                var bp = BreakPoint.initFromData(raw);
                this.addBreakPoint(bp)
            }
            this.sortBreakPoints();
        }
    },

    sortBreakPoints: function(){
        this.breakpoints.sort( function(a,b){
            return a.startTime - b.startTime;
        });
    },

    // ======= Control logic? ===== //



});



// ****** ====== Class BreakPointVideoControls ====== ****** //


// This is in charge of everything below the video screen
// Which is basically creating the javascript object that 

var BreakPointVideoControls = new JS.Class({


    


    extend:{


    // ======== Class Variables and Constants



    // ======== Class Methods ====== //




    },

    // ======== Constructor ====== //

    initialize: function(breakPointPlayer){
        this.breakPointPlayer = breakPointPlayer;
        this.renderControls();
    },

    // ======== Instance Variables ====== //

    // this.breakPointPlayer - the BreakPointPlayer delegator
    // this.width
    // this.height
    // this.$controls - the jquery element

    // this.percentProgress

    // ======== HTML structure ======= //
    /*
    .player-controls 
        .slider-breakpoints -------- this.$sliderBreakpoints
            .slider-breakpoint
        .main-slider --------------- this.$mainSlider
            .filled-slider --------- this.$filledSlider
        .control-buttons 
            button.pause-play
            .video-time
            button.audio?
            button.quality?

    


    */

    // ======== Instance Methods ====== //


    updateTime:function(){
        // translate a time into a percentage
        var length = this.maxTime();
        var percent = this.getVideo().getTime() / this.maxTime() * 100;
        this.$filledSlider.css('width', percent + "%");
    },

    // gets the maximum time for the video
    maxTime:function(){
        return this.getVideo().getVideoLength();
    },

    seekToX: function(x){
        // get the total width
        var totalWidth = this.$mainSlider.width();
        var percentage = x / totalWidth;
        var time = this.maxTime() * percentage;
        // get the percentage
        // get the time from the percentage
        this.getVideo().seekTo(time);
    },

    // gets the x coord that a time represents
    xPercentFromTime:function(time){
        var totalWidth = this.$mainSlider.width();
        // center on position
        var halfPercentage = BreakPointPlayer.SLIDER_BREAKPOINT_WIDTH / 2 / totalWidth; 
        var percentage = (time / this.maxTime() - halfPercentage) * 100 ;
        // var x = totalWidth * percentage;
        return percentage;
    },

    getVideo: function(){
        return this.breakPointPlayer.video;
    },

    relativeMouseCoords: function(elem, event){
        var totalOffsetX = 0;
        var totalOffsetY = 0;
        var canvasX = 0;
        var canvasY = 0;
        var currentElement = elem;

        do{
            totalOffsetX += currentElement.offsetLeft - currentElement.scrollLeft;
            totalOffsetY += currentElement.offsetTop - currentElement.scrollTop;
        }
        while(currentElement = currentElement.offsetParent)

        canvasX = event.pageX - totalOffsetX;
        canvasY = event.pageY - totalOffsetY;

        return {x:canvasX, y:canvasY};

    },

    setControlListeners: function(){
        var thisControls = this;
        
        // update to video time
        this.updateTimeIntervalId = window.setInterval(function(){
            thisControls.updateTime();
        }, 300);

        // update time on clicking the main slider
        this.$mainSlider.on('click', function(event){
            // console.log("mainSlider clicked");
            var coords = thisControls.relativeMouseCoords($(this).get(0), event);
            // console.log("coords: " + coords.x + ', ' + coords.y);
            thisControls.seekToX(coords.x);
            // prevent propagation
            event.preventDefault();
            return false;
        });

        this.$sliderBreakpoints.on('click', '.slider-breakpoint', function(event){
            console.log("Sliderbreakpoint clicked");
            var id = $(this).attr('data-bp-id');
            thisControls.breakPointPlayer.goToBreakpointById(id);
        });

    },

    setJqueryObjects: function(){
        this.$mainSlider = $('.main-slider');
        this.$filledSlider = $('.filled-slider');
        this.$sliderBreakpoints = $(".slider-breakpoints");
    },

    renderControlBreakpoints:function(){
        // create the breakpoint elements
        var breakpoints = this.breakPointPlayer.breakpoints;
        for (var i =0; i < breakpoints.length; i++){
            var breakpoint = breakpoints[i];
            var $breakpoint = $(breakpoint.sliderHtmlString());

            // add to the html element
            this.$sliderBreakpoints.append($breakpoint);

            $breakpoint.css('left', this.xPercentFromTime(breakpoint.startTime) + "%");
            console.log('foo');
        }
        // put them in the sliderBreakpoints
        // set their position
    },



    renderControls: function() {
        var $slider = $('#player-slider');
        var thisVideo = this.breakPointPlayer.video;
        // also this won't work because you need multiple inputs and sliders/markers
        // but maybe this is a starting point...
        this.setJqueryObjects();

        this.renderControlBreakpoints();

        this.setControlListeners();

    },



});




// ****** ====== Class BreakPointVideo ====== ****** //

// Handles all the youtube API calls and seeking and listeners to
// the youtube events. 

var BreakPointVideo = new JS.Class({

    // ======= Class variables ==== //

    extend: { 
        // i am bad at this class vs instance variable thing..
        setMainInstance: function(mainInstance){
            BreakPointVideo.mainInstance = mainInstance;
        },
        getMainInstance: function() {
            return BreakPointVideo.mainInstance;
        },
        defaultVideoIds: function(){
            return [
                'moSFlvxnbgk', //frozen
                // 'CGyEd0aKWZE', // burn
                // '0NKUpo_xKyQ', //lights
                // 'NnIzbukJOHQ' // sweet nothing
            ]
        },
        randomDefaultVideoId: function(){
            var dV = BreakPointVideo.defaultVideoIds();
            var randomIndex = Math.floor( Math.random() * dV.length);
            return dV[randomIndex];
        }

    },

    // ======= Class methods ==== //


    /* ===== Instance Variables ====== */

    // this.elementId
    // this.ytId - the youtube id
    // this.youtubePlayer 
    // this.firstPlay 
    // this.breakPointPlayer - the overview element


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
            // this.ytId = 'moSFlvxnbgk';
            this.ytId = BreakPointVideo.randomDefaultVideoId();
        }

        this.elementId = elementId;
        this.firstPlay = false;
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
        // video.onVideoLoaded(); 
        // video.renderOnPage();
        video.breakPointPlayer.videoFinishedLoading();
        // player.seekTo(13, true);
        

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
        if ((event.data == YT.PlayerState.PLAYING ) && !video.firstPlay){
        // if (!video.firstPlay){
            if (!BreakPointPlayer.AUTOPLAY){
                video.stopVideo();
            } else {
            }

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
        // var thisPlayer = this;
        // setInterval(function(){
        //     console.log("Duration: " + thisPlayer.getVideoLength());
        // }, 200);
        
    },
    onVideoFirstPlay: function (){
        this.breakPointPlayer.setupVideoControls();
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

    gotoBreakPoint: function(breakPoint){
        var timeInSeconds = breakPoint.startTime;
        this.seekTo(timeInSeconds, true);
    },


    // ========= Html related methods ====== //

});





// ****** ====== Class BreakPoint ====== ****** //

// Encapsulates a single time segment in a video, possibly with other stuff
// Its more like a breakpoint segment

var BreakPoint = new JS.Class({
    
    // ===== Class methods ====== //
    extend: {

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
    },

    sliderHtmlString: function(){
        var elemStr = "<span class='slider-breakpoint' data-bp-id='" + this.breakPointId +"'><img class='slider-breakpoint-img' src='"+ BreakPointPlayer.SLIDER_BREAKPOINT_IMG + "' /></span>";
        return elemStr;
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
