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

        if ($scope.hasCurrentBreakpoint()){
            if ($scope.video.getTime() > $scope.currentBreakpoint.endTime){
                // todo - let people leave from current breakpoints
                // $scope.video.pauseVideo();
                $scope.video.seekTo($scope.currentBreakpoint.startTime);
            }
        }
    }

    // move these to directive?
    // probably?

    // ========= Current Breakpoint activity ===== //

    var setCurrentBreakpoint = function(bp){
        if ($scope.isCurrentBreakpoint(bp)){
            $scope.currentBreakpoint = NO_CURRENT;
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

    $scope.clickedBreakpoint = function(bp){
        // console.log("clickedBreakpoint");
        if (!$scope.isCurrentBreakpoint(bp)){
            $scope.bpPlayer.goToBreakpoint(bp);
        }
        setCurrentBreakpoint(bp);
    }

    $scope.clickedSliderBreakpoint = function(bp){
        if (!$scope.isCurrentBreakpoint(bp)){
            $scope.bpPlayer.goToBreakpoint(bp);
        }
        setCurrentBreakpoint(bp);
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
        $scope.controls.onSliderClick($event);
    }


    $scope.clickedRemoveBreakpoint = function(bp){
        // console.log("clickedRemoveBreakpoint");
        $scope.bpPlayer.removeBreakPoint(bp);
    }

    $scope.clickedPausePlay = function(){
        $scope.controls.togglePausePlayButton();
    }

    $scope.clickedVolume = function(){
        $scope.controls.toggleVolumeButton();
    }
        $scope.clickedAddBreakpoint = function(){
        $scope.controls.clickedAddBreakpoint();
    }

    // ======== Playback speed ====== ///

    $scope.currentPlaybackRate = 1;

    $scope.playbackRateExists = function(rate){
        if ($scope.video){
            var availableRates = $scope.video.availablePlaybackRates();
            var index = availableRates.indexOf((rate));
            return index > -1
        } 
        return false;
    }

    $scope.clickedPlaybackRate = function(rate){
        console.log("clickedPlaybackRate: " + rate);
        if (rate == $scope.currentPlaybackRate){
            $scope.currentPlaybackRate = 1;
            rate = 1;
        }
        $scope.video.setPlaybackRate(rate);
        $scope.video.playVideo();
        $scope.currentPlaybackRate = rate;
    }

    $scope.playbackActive = function(rate){
        return $scope.currentPlaybackRate == rate;
    }

}







