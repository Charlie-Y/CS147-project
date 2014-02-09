'use strict';

console.log('sandbox.js');


// Call this function when the page loads (the "ready" event)
$(document).ready(function() {
    initializePage();
})



var player; // GLOBAL MUAHHAHAHA


/*
 * Function that is called when the document is ready.
 */
function initializePage() {
    // add any functionality and listeners you want here
    if($('#player').length > 0){
        // var video; 
        player = new BreakPointPlayer('player');
        // video = new BreakPointVideo('player-iframe');
        // BreakPointVideo.setMainInstance(video);
    }
}






