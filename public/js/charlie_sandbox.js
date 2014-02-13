'use strict';

console.log('sandbox.js');


// Call this function when the page loads (the "ready" event)




var bpPlayer; // GLOBAL MUAHHAHAHA


/*
 * Function that is called when the document is ready.
 */


var app = angular.module("BreakPoint", []);


var BreakPointCtrl = function($scope) {
    $scope.breakpoints = [];

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
        return $scope.controls.xPercentFromTime(bp.startTime);
    }

    $scope.onVideoLoaded = function(){
        $scope.controls = $scope.bpPlayer.controls
        $scope.breakpoints = $scope.bpPlayer.breakpoints;

        console.log("onVideoLoaded");
        $scope.$apply();
    }

    // move these to directive?
    // probably?

    $scope.clickedSlider = function($event){
        // console.log(event);
        $scope.controls.onSliderClick($event);
    }

    $scope.clickedBreakpoint = function(bp){
        // console.log("clickedBreakpoint");
        $scope.bpPlayer.goToBreakpoint(bp);
    }

    $scope.clickedSliderBreakpoint = function(bp){
        $scope.bpPlayer.goToBreakpoint(bp);
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

}







