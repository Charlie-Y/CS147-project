'use strict';

console.log('sandbox.js');


// Call this function when the page loads (the "ready" event)




var bpPlayer; // GLOBAL MUAHHAHAHA


/*
 * Function that is called when the document is ready.
 */


var app = angular.module("BreakPoint", []);


var BreakPointCtrl = function($scope) {
    
    // ==== Class static constants ====//

    var NO_CURRENT = undefined;

    $scope.breakpoints = [];
    $scope.currentBreakpoint = NO_CURRENT;
    $scope.segmentDisplayBreakpoints = [];
    $scope.loopOnCurrent = false;
    $scope.onCurrentSlider = false;

    window.$scope = $scope;

    $(document).ready(function() {
        initializePage();
    })

    function initializePage() {
        // add any functionality and listeners you want here
        if($('#player').length > 0){
            bpPlayer = new BreakPointPlayer('player',
                {
                    callback: $scope.onVideoLoaded
                });
            $scope.bpPlayer = bpPlayer;

            // $scope.breakpoints = $scope.bpPlayer.breakpoints;
            // $scope.controls = bpPlayer.controls
            // console.log("setting breakpoints");
            // console.log("finished setting breakpoints");
        }
    }

    $scope.logBreakPoints = function(){
        console.log("CLICKED");
        console.log($scope.breakpoints.toString());
    }

    $scope.sliderBreakpointLeft = function(bp){
        if (bp != undefined){
            return $scope.controls.xPercentFromTime(bp.startTime, {offset: true});
        }
    }

    $scope.onVideoLoaded = function(){
        $scope.controls = $scope.bpPlayer.controls
        $scope.breakpoints = $scope.bpPlayer.breakpoints;
        $scope.video = $scope.bpPlayer.video
        // console.log("onVideoLoaded");
        var thisControls = $scope.controls;
        var thisScope = $scope;

        // $scope.currentTime = $scope.video.getTime();

        $scope.updateTimeIntervalId = window.setInterval(function(){
            thisControls.updateTime();
            thisScope.reactToTime();
        }, 300);

        $scope.$apply();
    }

    $scope.reactToTime = function(){
        // if the thing has left teh range of the currentbreakpoint
        // then pause or go back and repeat.

        if ($scope.loopOnCurrent && $scope.onCurrentSlider){
            if ($scope.hasCurrentBreakpoint()){
                if ($scope.video.getTime() > $scope.currentBreakpoint.endTime){
                    // todo - let people leave from current breakpoints
                    // if $scope.looping on breakpoint
                    // $scope.video.pauseVideo();
                    $scope.video.seekTo($scope.currentBreakpoint.startTime);
                }
            }
        }
    }

    // move these to directive?
    // probably?

    // ========= Current Breakpoint activity ===== //

    var setCurrentBreakpoint = function(bp){
        if ($scope.isCurrentBreakpoint(bp)){
            $scope.clearCurrentBreakpoint();
        } else {
            $scope.currentBreakpoint = bp;
            console.log("currentBreakpoint " + $scope.currentBreakpoint.toString());
        }
    }

    $scope.hasCurrentBreakpoint = function(){
        return $scope.currentBreakpoint != NO_CURRENT;
    }

    $scope.isCurrentBreakpoint = function(bp){
        return bp == $scope.currentBreakpoint;
    }

    $scope.clearCurrentBreakpoint = function(){
        $scope.currentBreakpoint = NO_CURRENT;
    }

    $scope.clickedBreakpoint = function(bp){
        // console.log("clickedBreakpoint");
        if (!$scope.isCurrentBreakpoint(bp)){
            $scope.bpPlayer.goToBreakpoint(bp);
        }
        setCurrentBreakpoint(bp);
    }

    $scope.clickedSliderBreakpoint = function(bp){
        // if (!$scope.isCurrentBreakpoint(bp)){
            $scope.bpPlayer.goToBreakpoint(bp);
        // }
        // setCurrentBreakpoint(bp);
        $scope.currentBreakpoint = bp;
        $scope.video.playVideo();
    }


    $scope.clickedLoopOnCurrent = function(event){
        $scope.loopOnCurrent = !$scope.loopOnCurrent;
    }

    // ====== Slider display methods ===== //

    $scope.getSegmentDisplayBreakpoints = function(){
        var result;
        var breakpoints = $scope.segmentDisplayBreakpoints;
        if ($scope.hasCurrentBreakpoint()){
            var currentBp = $scope.currentBreakpoint;
            var index = breakpoints.indexOf(currentBp);
            if (index > -1){
                result = $scope.segmentDisplayBreakpoints;
            } else {
                result = [currentBp].concat(breakpoints);
            }
        } else {
            result = $scope.segmentDisplayBreakpoints;
        }
        // console.log('foo');
        return result;
    }

    // a slider breakpoint is a breakpoint whose slider
    // will be displayed
    $scope.addSegmentDisplayBreakpoint = function(bp){
        $scope.segmentDisplayBreakpoints.push(bp)
    };

    $scope.removeSegmentDisplayBreakpoint = function(bp){
        var breakpoints = $scope.segmentDisplayBreakpoints;
        var bpIndex = breakpoints.indexOf(bp);
        if (bpIndex > -1) {
            breakpoints.splice(bpIndex, 1);
            // console.log("Breakpoint removed "+ bp.breakPointId);
        }
    };

    $scope.sliderSegmentLeft = function(bp){
        return $scope.controls.xPercentFromTime(bp.startTime);
    }

    $scope.sliderSegmentWidth = function(bp){
        return $scope.controls.xPercentFromTime(bp.duration());
    }


    // ========= Click listeners ========== //

    $scope.clickedSlider = function($event){
        // if they clickoutside the current breakpoint, then
        // reset the current breakpoint
        // console.log($event);
        if ($event.toElement.classList.contains('current-breakpoint-slider')){
            $scope.onCurrentSlider = true;
        } else {
            $scope.onCurrentSlider = false;
        }
        $scope.controls.onSliderClick($event);
    }

    $scope.clickedOnCurrentSlider = function($event){
        $scope.onCurrentSlider = true;
    }


    $scope.clickedRemoveBreakpoint = function(bp){
        // console.log("clickedRemoveBreakpoint");
        if (bp == $scope.currentBreakpoint){
            $scope.clearCurrentBreakpoint();
        }

        $scope.bpPlayer.removeBreakPoint(bp);
    }

    $scope.clickedPausePlay = function(){
        $scope.controls.togglePausePlayButton();
    }

    $scope.clickedVolume = function(){
        $scope.controls.toggleVolumeButton();
    }


    // ======== Playback speed ====== ///

    $scope.currentPlaybackRate = 1;
    $scope.playbackRateIntervalId = -1;

    $scope.playbackRateExists = function(rate){
        if ($scope.video){
            if ($scope.video.playbackRateExists(rate)){
                return true;
            }
            // if they playbackrate isn't given by the youtube api
            // then we can bootstrap this with some janky ass shit
            // for the slow down speeds. speed up not so much
            if ( rate == .25 | rate == .5){
                return true;
            }
        }
        return false;
    }

    $scope.clickedPlaybackRate = function(rate){
        console.log("clickedPlaybackRate: " + rate);
        if (rate == $scope.currentPlaybackRate){
            $scope.currentPlaybackRate = 1;
            rate = 1;
        }
        // if youtube offers the functionality
        if ($scope.video.playbackRateExists(rate)){
            $scope.video.setPlaybackRate(rate);
        } else {
            jankSetPlaybackRate(rate);
        }
        $scope.currentPlaybackRate = rate;
    }

    // uses setInterval
    var jankSetPlaybackRate = function(rate){
        clearJankPlayback();
        if ( rate == 1){
            return;
        }
        var intervalTime = 50;

        var intervalId = setInterval( function(){
            // if the video is playing...
                // for every set interval of some sort
                // if the speed is set to .25%, then the video needs to play for 
                // 25% of the time, then stop for 75% of the time. 
        }, intervalTime);
        
    }

    var clearJankPlayback = function(){
        // window.clear interval or so.
        clearInterval($scope.playbackRateIntervalId);
    }

    $scope.playbackActive = function(rate){
        return $scope.currentPlaybackRate == rate;
    }

    // ========= addBreakpoint functionality ==== //

    // $scope.modifyingBreakpoint = false;

    $scope.clickedAddBreakpoint = function(){
        // hide the menu?
        var newBp = $scope.controls.clickedAddBreakpoint();
        // $scope.addingBreakpoint = true;
        setCurrentBreakpoint(newBp);
    }

    $scope.clickedSetEndTime = function(){
        var bp = $scope.currentBreakpoint;
        if (bp != undefined){
            var endTime = $scope.video.getTime();
            var oldEndTime = bp.endTime;

            // move this checking into the breakpoint class
            if (endTime < bp.startTime){
                bp.endTime = oldEndTime;
                bp.startTime = endTime;
            } else {
                bp.endTime = endTime;
            }
            $scope.video.pauseVideo()
            $scope.onCurrentSlider = true;
        }
    }


    $scope.clickedSaveBreakpoint = function(){
        $scope.controls.clickedSaveBreakpoint();
        // $scope.addingBreakpoint = false;
    }

    // ===== Feedback functionality ==== //

    // ===== Breakpoint renaming stuff // 

    $scope.breakpointNameUpdate = function($event, bp){
        console.log(bp.toString());
        console.log($event.toString());

    }

    console.log("fin charlie_sanbox.js");


}







