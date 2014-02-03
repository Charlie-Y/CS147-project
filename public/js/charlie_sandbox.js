'use strict';

console.log('sandbox.js');

// todos and milestones 
/*
    this is going to be fun

    there has to be some kind of backend to this
    i think that will determine the load of the page

    this code has to deal with the actual frontend code itself

    it will assume all the data is there, and then attach and remove accordingly...


*/


// Call this function when the page loads (the "ready" event)
$(document).ready(function() {
    initializePage();
})



// var video; // GLOBAL MUAHHAHAHA


/*
 * Function that is called when the document is ready.
 */
function initializePage() {
    // add any functionality and listeners you want here
    var video; 
    video = new BreakPointVideo('player-iframe');
    BreakPointVideo.setMainInstance(video);
    video.renderOnPage();
}






