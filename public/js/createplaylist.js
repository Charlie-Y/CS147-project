'use strict';


// Call this function when the page loads (the "ready" event)
$(document).ready(function() {
	console.log("hello");
	initializePage();
})


function CreaetePlaylist(button){
	button.click(function() {
		console.log("hello");
		var title = $("#title").text();
		var description = $("#description").text();
		console.log(title);
		console.log(description);
		var empty = /^\s*$/.test(title);
		console.log(empty);
		$("#warning").html(empty);
	}
}

/*
 * Function that is called when the document is ready.
 */
function initializePage() {
	new CreatePlaylist($(".create"));
}

