console.log("breakpoint_classes.js");

//----- FIRST TODO -----

/*

    Refactor piece by piece into an angular app.

    the angular app should set bind all the listeneres and setup all the html
    and that makes sense. 

*/


// TODO -refactor, controls and listeners seem all over the place right now

// TODO - error checking to make sure that nothing breaks
    // like breakpoints giving bad times
// todo make a poper control system after first agreeing on what it should look like
// and how it should respond
// Todo make the loaders and savers hit the database - first set up a database
// todo - maybe impossibly get image thumbnails. based on the dimensions of the final,
// this might not actually be necessary
// todo - show buffered times...
// todo - menubar gets in way of top breakpoint clicking
// todo - drag and preview functionality
// todo - scroll to breakpoint
// todo - active breakpoint fun
// todo - css resize fonts
// todo - style the out of this thing
// todo - hover and show times
// todo - display todos on blankness
// todo - content editable - use cases and flow
// todo - downsize menu bar into corner

// ===== Finished functionality checklist ==== //

/*

BreakPointPlayer

    fits to screen 

    draws breakpoint blocks in side nav
    seeks on breakpoint block click

    add and remove breakpoints
    sort breakpoints
    loads breakpoints from data

BreakPointControls 
    shows time
    clicking bar goes to time
    clicking slider breakpoint goes to time
    hovering breakpoints highlights the corresponding part
    volume control - with update
    play button control - with update

    add breakpoint button adds to thing

BreakPointVideo
    on first play - renders control bar
    wraps all necessary player methods

BreakPoint

    video time strings


*/


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

        CONTROLS: 0, // 0 for no default youtube controls, 1 for youtube controls
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

    // this.callback - on finished


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
                .breakpoints-ul
                    .breakpoint-li
                        .breakpoint: data-bp-id
                            .breakpoint-time
                            .breakpoint-name
    */

    // ====== Constructor ==== //

    initialize: function(playerId, options){
        var iframeId = playerId + "-iframe";
        this.video = new BreakPointVideo(iframeId);
        BreakPointVideo.setMainInstance(this.video);

        this.callback = options.callback || function(){};

        this.video.breakPointPlayer = this;
        this.setResizeListeners();
        this.breakpoints = [];
        this.breakpointsById = {};

        this.setJqueryObjects();

        // console debugging
        window.breakPointPlayer = this;
    },

    // ======== Initialization helper methods ==== //

    // call this when the video is finished loading.
    // video will call this
    videoFinishedLoading: function(){

        // setup the breakpoints to work - listeners and html
        this.loadBreakPoints();
        // this.renderBreakpointList();
        this.setBreakPointListeners();

        // do it twice! because the first time the window height and 
        // width will change for some reason. teehee
        this.fitToScreen($(window));
        this.fitToScreen($(window));

        if (BreakPointPlayer.AUTOPLAY){
            this.video.playVideo();
        }

    },

    // these should all exist on the page first
    setJqueryObjects: function(){
        this.$controls = $('.player-controls');
        this.$iframe = $('#player-iframe');
        this.$breakpointsUl = $('.breakpoints-ul');
    },

    onVideoFirstPlay: function(){
        this.controls = new BreakPointVideoControls(this);
        this.callback();

    },

    // ======== Html rendering and resizing ===== //

    fitToScreen: function(toFit) {
        var stats = BreakPointPlayer;

        var totalHeight = toFit.height(); // todo refactor the menu height. how is that going to work>
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
        this.$breakpointsUl.empty();
        // var list = $("<ul class='breakpoints-ul'><li class='breakpoint-header-li'>Breakpoints</li></ul>");
        for (var i =0; i < this.breakpoints.length; i++){
            var breakpoint = this.breakpoints[i]
            // var bpstring = breakpoint.htmlString();
            var bpstring = breakpoint.liHtmlString() ;
            // console.log(bpstring);
            $(bpstring).appendTo(this.$breakpointsUl);
        }
        // var player = $('#' + this.elementId);
        // console.log(player);
        // list.appendTo($("#player-breakpoints"));
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

        // seek to on clicking the entire thing
        // $('.player-breakpoints').on('click','.breakpoint', function(event){
        //     var id = $(this).attr('data-bp-id');
        //     // console.log("Breakpoint with id: " + id)
        //     var bp = thisPlayer.getBreakPoint(id);
        //     thisPlayer.video.gotoBreakPoint(bp);
        //     console.log("Clicked: " + bp.toString());
        //     event.preventDefault();
        //     return false;
        // });

        $('.player-breakpoints').on('click','.breakpoint-remove', function(event){
            // i feel bad for writing this selector...
            var id = $(this).closest('.breakpoint-li').find('.breakpoint').attr('data-bp-id');
            var bp = thisPlayer.getBreakPoint(id);

            thisPlayer.removeBreakPointWithUpdate(bp);
            event.preventDefault();
            return false;
        });

    },

    // relays the event change to other parts of the video player
    onPlayerStateChange: function(event){
        if(this.controls != undefined){
            this.controls.onPlayerStateChange(event);
        }
    },

    // ====== Breakpoint logic ====== //

    getBreakPoint: function(id){
        return this.breakpointsById[id];
    },

    goToBreakpointById: function(id) {
        var bp = this.getBreakPoint(id);
        this.video.gotoBreakPoint(bp);
    },

    goToBreakpoint: function(bp){
        this.video.gotoBreakPoint(bp);
    },

    // adds the breakpoint to the internal data structures
    // also hits the database and also renders the html
    addBreakPoint: function(bp) {
        this.breakpointsById[bp.breakPointId] = bp;
        this.breakpoints.push(bp);
        // todo hit the database
    },

    // adds the breakpoint and updates the list
    addBreakPointWithUpdate: function(bp){
        this.addBreakPoint(bp);
        this.sortBreakPoints();
        // this.renderBreakpointList();
        this.fitToScreen($(window));
        // this.controls.addSliderBreakpoint(bp);

        // also should update the other things. at this point events are useful..
    },

    // adds the breakpoint to the DOM

    removeBreakPoint: function(bp) {
        delete(this.breakpointsById[bp.breakPointId]);
        var bpIndex = this.breakpoints.indexOf(bp);
        // console.log("Breakpoints Lenght" + this.breakpoints.length);
        if (bpIndex > -1) {
            this.breakpoints.splice(bpIndex, 1);
            // console.log("Breakpoint removed "+ bp.breakPointId);
        }
        // console.log("Breakpoints Lenght" + this.breakpoints.length);

        // todo hit the database
    },

    // needs an animation on removal
    removeBreakPointWithUpdate: function(bp){
        // this.renderBreakpointList()
        // var $bp = $('.breakpoint[data-bp-id="' + bp.breakPointId + '"]');
        // $bp.remove();
        // this.controls.removeSliderBreakpoint(bp);
        this.removeBreakPoint(bp);
    },

    loadBreakPoints: function(){
        if (BreakPointPlayer.USE_DEV_BREAKPOINTS){
            var rawBreakpoints =  BreakPoint.devBreakpoints();
            for (var i = rawBreakpoints.length - 1; i >= 0; i--) {
                var raw = rawBreakpoints[i]
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
    // ======== Class Variables and Constants ====== //

    // ======== Class Methods ====== //

    },

    // ======== Constructor ====== //

    initialize: function(breakPointPlayer){
        this.breakPointPlayer = breakPointPlayer;
        this.renderAllControls();
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
            .control-speed-down
            .control-pauseplay
            .control-speed-up
            .control-time
                .control-current-time
                .control-max-time
            .control-sound
            .control-addBreakpoint
                .add-breakpoint-helper

    */

    // ======== Instance Methods ====== //


    updateTime:function(){
        // translate a time into a percentage
        var maxTime = this.maxTime();
        var currentTime = this.getVideo().getTime();
        // move the slider
        var percent = currentTime / maxTime * 100;
        this.$filledSlider.css('width', percent + "%");

        // update the display time
        if ( this.$maxTime.text().length == 0){
            // console.log("Settting time");
            var displayMaxTime = BreakPoint.timeInMinsSeconds(maxTime);
            this.$maxTime.text(displayMaxTime);
        }

        var displayCurrentTime = BreakPoint.timeInMinsSeconds(Math.floor(currentTime));
        this.$currentTime.text(displayCurrentTime);

    },

    // gets the maximum time for the video
    maxTime:function(){
        return this.getVideo().getVideoLength();
    },

    timeFromX: function(x) {
        var totalWidth = this.$mainSlider.width();
        var percentage = x / totalWidth;
        var time = this.maxTime() * percentage;
        return time;
    },

    seekToX: function(x){
        // get the total width
        var time = this.timeFromX(x);
        // get the percentage
        // get the time from the percentage
        this.getVideo().seekTo(time);
    },

    // gets the x coord that a time represents
    xPercentFromTime:function(time){
        var totalWidth = this.$mainSlider.width();
        // center on position
        var halfPercentage = BreakPointPlayer.SLIDER_BREAKPOINT_WIDTH / 4 / totalWidth; 
        // var halfPercentage = 0;
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

    // ========= Listener initialization ====== ///

    onSliderClick: function(event){
        var coords = this.relativeMouseCoords(event.toElement, event);
        // console.log("coords: " + coords.x + ', ' + coords.y);
        this.seekToX(coords.x);
        // prevent propagation
        event.preventDefault();
        return false;
    },


    setControlListeners: function(){
        var thisControls = this;
        
        // update to video time
        this.updateTimeIntervalId = window.setInterval(function(){
            thisControls.updateTime();
        }, 300);

        // update time on clicking the main slider
        // this.$mainSlider.on('click', function(event){
            // console.log("mainSlider clicked");
            // var coords = thisControls.relativeMouseCoords($(this).get(0), event);
            // console.log("coords: " + coords.x + ', ' + coords.y);
            // thisControls.seekToX(coords.x);
            // prevent propagation
            // event.preventDefault();
            // return false;
        // });

        // respond to the click by doing stuff
        // this.$sliderBreakpoints.on('click', '.slider-breakpoint', function(event){
            // console.log("Sliderbreakpoint clicked");
            // var id = $(this).attr('data-bp-id');
            // thisControls.breakPointPlayer.goToBreakpointById(id);
        // });

        // link the slider breakpoint to the block breakpoint
        this.$sliderBreakpoints.on('mouseenter', '.slider-breakpoint', function(event){
            // console.log("Sliderbreakpoint hover");
            var id = $(this).attr('data-bp-id');
            var $blockBreakpoint = $('.breakpoint[data-bp-id="'+ id +'"]');
            $blockBreakpoint.addClass('active');
        });

        this.$sliderBreakpoints.on('mouseleave', '.slider-breakpoint', function(event){
            // console.log("Sliderbreakpoint hover");
            var id = $(this).attr('data-bp-id');
            var $blockBreakpoint = $('.breakpoint[data-bp-id="'+ id +'"]');
            $blockBreakpoint.removeClass('active');
        });

        var $breakpointContainer = $('.player-breakpoints');

        $breakpointContainer.on('mouseenter', '.breakpoint', function(){
            // console.log("breakpoint mouseenter");
            var id = $(this).attr('data-bp-id');
            var $sliderBreakpoint = $('.slider-breakpoint[data-bp-id="'+ id +'"] i');
            $sliderBreakpoint.addClass('active');
        });

        $breakpointContainer.on('mouseleave', '.breakpoint', function(event){
            // console.log("breakpoint mouseleave");
            var id = $(this).attr('data-bp-id');
            var $sliderBreakpoint = $('.slider-breakpoint[data-bp-id="'+ id +'"] i');
            $sliderBreakpoint.removeClass('active');
        });

        // removal highlight
        $breakpointContainer.on('mouseenter', '.breakpoint-remove', function(){
            // console.log("breakpoint mouseenter");
            var id = $(this).closest('.breakpoint-li').find('.breakpoint').attr('data-bp-id');
            var $sliderBreakpoint = $('.slider-breakpoint[data-bp-id="'+ id +'"] i');
            $sliderBreakpoint.addClass('to-remove');
        });

        $breakpointContainer.on('mouseleave', '.breakpoint-remove', function(event){
            // console.log("breakpoint mouseleave");
            var id = $(this).closest('.breakpoint-li').find('.breakpoint').attr('data-bp-id');
            var $sliderBreakpoint = $('.slider-breakpoint[data-bp-id="'+ id +'"] i');
            $sliderBreakpoint.removeClass('to-remove');
        });

        // Player controls


        // Pause play controls
        // this.$controlButtons.on('click', '.control-button .control-pauseplay', function(){
        //     thisControls.togglePausePlayButton();
        // });

        // Volume controls
        // this.$controlButtons.on('click', '.control-nosound', function(){
        //     thisControls.toggleVolumeButton();
        // });

        // this.$controlButtons.on('click', '.control-button .control-sound', function(){
        //     // console.log("CLICKED");
        //     thisControls.toggleVolumeButton();
        // });

        this.setAddBreakpointListeners();

    },

    // handles the playing, pausing etc.
    togglePausePlayButton: function(){
        // console.log("togglePausePlayButton");
        var state = this.getVideo().getYTPlayerState();
        var $pausePlay = $('.control-pauseplay');
        if (state == BreakPointVideo.PAUSED) {
            this.getVideo().playVideo();
        } else if (state == BreakPointVideo.PLAYING) {
            this.getVideo().pauseVideo();
        }
        this.updatePausePlayButton();
    },

    updatePausePlayButton: function(){
        var state = this.getVideo().getYTPlayerState();
        if (state == BreakPointVideo.PAUSED) {
            $('.control-pauseplay').removeClass('fa-pause');
            $('.control-pauseplay').addClass('fa-play');
        } else if (state == BreakPointVideo.PLAYING) {
            $('.control-pauseplay').removeClass('fa-play');
            $('.control-pauseplay').addClass('fa-pause');
        }
    },

    toggleVolumeButton: function(){
        // var youtubePlayer = this.getVideo().youtubePlayer;
        var video = this.getVideo();
        var muted = video.isMuted();

        if (muted){
            video.unMute();
        } else {
            video.mute();
        }
        this.updateVolumeButton();
    },

    updateVolumeButton: function(){
        // var youtubePlayer = this.getVideo().youtubePlayer;
        var muted = this.getVideo().isMuted();
        var $volume = $('.control-sound');
        // var $ban = $('.control-nosound');
        // console.log("FOO");
        if (muted){
            $volume.addClass('fa-volume-up');
            $volume.removeClass('fa-volume-off');
            // $ban.addClass('hidden');
        } else {
            $volume.addClass('fa-volume-off');
            $volume.removeClass('fa-volume-up');
            // $ban.removeClass('hidden'); 
        }
    },


    // this is going to be hard...
    setAddBreakpointListeners: function(){
        var thisPlayer = this;
        this.$controlButtons.on('click', '.control-addBreakpoint', function(event){
            // there needs to be an ajax request with an onSuccess callback
            // console.log(".control-addBreakpoint clicked");
            // assuming that callback arrives and i have a valid Id to work with

            var totallyValidId = Math.floor(Math.random() * 38902);
            var time = Math.round(thisPlayer.getVideo().getTime());
            var bp = new BreakPoint(time, "Breakpoint: " + totallyValidId, totallyValidId);
            thisPlayer.breakPointPlayer.addBreakPointWithUpdate(bp);

            // final functionality for now
            // cliking the button sets the breakpoint at video position

            // things should be disabled?
            // pauses the video
            
            // you click around the video until you find the next place

            // clicking the button again saves the breakpoint
            event.preventDefault();
            return false;
        });
    },

    setSpeedListeners: function(){

    },

    // ========= React to player state change ====== //

    onPlayerStateChange: function(event){
        this.updatePausePlayButton();
    },


    // ========= HTML initialization ====== ///

    setJqueryObjects: function(){
        this.$mainSlider = $('.main-slider');
        this.$filledSlider = $('.filled-slider');
        this.$sliderBreakpoints = $(".slider-breakpoints");
        this.$controlButtons = $(".control-buttons");
        this.updatePausePlayButton();
        this.$currentTime = $('.control-current-time')
        this.$maxTime = $('.control-max-time')

    },

    renderControlBreakpoints: function(){
        // create the breakpoint elements
        var breakpoints = this.breakPointPlayer.breakpoints;
        for (var i =0; i < breakpoints.length; i++){
            var breakpoint = breakpoints[i];
            this.addSliderBreakpoint(breakpoint);
        }
        // put them in the sliderBreakpoints
        // set their position
    },

    renderSpeedControls: function(){

    },



    renderAllControls: function() {
        var $slider = $('#player-slider');
        var thisVideo = this.breakPointPlayer.video;
        // also this won't work because you need multiple inputs and sliders/markers
        // but maybe this is a starting point...

        // set all the inner container elements as attributes for easier access
        this.setJqueryObjects();

        // build all the html elements
        // this.renderControlBreakpoints();
        this.renderSpeedControls();

        // set all the event listeners
        this.setControlListeners();

    },

    // ========= Breakpoint and HTML handling logic ====== //

    addSliderBreakpoint: function(breakpoint){
        var $breakpoint = $(breakpoint.sliderHtmlString());
            // add to the html element
        this.$sliderBreakpoints.append($breakpoint);
        $breakpoint.css('left', this.xPercentFromTime(breakpoint.startTime) + "%");
    },

    removeSliderBreakpoint:function(bp){
        var $bp = $('.slider-breakpoint[data-bp-id="' + bp.breakPointId + '"]');
        $bp.remove();
    }

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
                'CGyEd0aKWZE', // burn
                '0NKUpo_xKyQ', //lights
                'NnIzbukJOHQ' // sweet nothing
            ]
        },
        randomDefaultVideoId: function(){
            var dV = BreakPointVideo.defaultVideoIds();
            var randomIndex = Math.floor( Math.random() * dV.length);
            return dV[randomIndex];
        },
        UNSTARTED: -1,
        ENDED: 0,
        PLAYING: 1,
        PAUSED: 2,
        BUFFERING: 3,
        CUED: 5


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
        video.breakPointPlayer.onPlayerStateChange(event);

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
                video.pauseVideo();
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
        this.breakPointPlayer.onVideoFirstPlay();

    },
    // basically wrapper functions to the youtube api
    // necessary? not really. nice to have. barely...
    stopVideo: function () {
        this.youtubePlayer.stopVideo();
    },
    playVideo: function() {
        this.youtubePlayer.playVideo();
    },
    pauseVideo: function() {
        this.youtubePlayer.pauseVideo();
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
    getYTPlayerState: function(){
        return this.youtubePlayer.getPlayerState();
    },
    isMuted: function(){
        return this.youtubePlayer.isMuted();
    },
    mute: function(){
        this.youtubePlayer.mute();
    },
    unMute: function(){
        this.youtubePlayer.unMute();
    },
    getPlaybackRate: function(){
        return this.youtubePlayer.getPlaybackRate();
    },
    availablePlaybackRates: function(){
        return this.youtubePlayer.getAvailablePlaybackRates();
    },
    // returns true if it worked
    setPlaybackRate: function(rate){
        var startRate = this.getPlaybackRate();
        this.youtubePlayer.setPlaybackRate(rate);
        var endRate = this.getPlaybackRate();
        return startRate != endRate;
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
        initFromData: function(raw){
            return  new BreakPoint(raw.time, raw.desc, raw.breakPointId);
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
        ID_COUNT: 0,
        getClientSideId: function(){
            return BreakPoint.ID_COUNT++;
        }
    },

    // ===== Contructor ====== //

    initialize: function(startTime, desc, breakPointId){
        this.startTime = startTime;
        this.desc = desc;
        // this.breakPointId = breakPointId;
        this.breakPointId = BreakPoint.getClientSideId();
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


    displayStartTime: function(){
        return BreakPoint.timeInMinsSeconds(this.startTime);
    },
    displayEndTime: function(){
        return BreakPoint.timeInMinsSeconds(this.endTime);
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

    /*
        timeDivString: function(){
            var time = this.displayStartTime();
            var div =  "<div class='breakpoint-time'>"+  time + "</div>";
            return div;
        },

        descDivString: function() {
            var div =  "<div class='breakpoint-name' contenteditable='true'>"+ this.desc + "</div>";
            return div;
        },

        htmlString: function () {
            var elemStr = "<a class='breakpoint' href='#' data-bp-id='" + this.breakPointId +"'>" + this.timeDivString() + this.descDivString() + "</a>";
            return elemStr;
            // getImage();
        },

        liHtmlString: function(){
            var elemStr = "<li class='breakpoint-li'>"  + this.htmlString() + " <i class='fa fa-times breakpoint-remove'></i> </li>";
            return elemStr;
        },

        sliderHtmlString: function(){
            var elemStr = "<span class='slider-breakpoint' data-bp-id='" + this.breakPointId + "'>";
            // elemStr += "<img class='slider-breakpoint-img' src='"+ BreakPointPlayer.SLIDER_BREAKPOINT_IMG + "' />";
            elemStr += "<i class='fa fa-tint fa-flip-vertical slider-breakpoint-icon'></i>";
            elemStr += "</span>";
            return elemStr;
        }
    */

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
