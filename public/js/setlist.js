'use strict';


// Call this function when the page loads (the "ready" event)
$(document).ready(function() {
	initializePage();
})

/*
 * Function that is called when the document is ready.
 */
function initializePage() {
	new RemoveButton($(".remove"));
}

function RemoveButton(button){
	var removeenabled = false;

	button.click(function() {
		console.log("hello");
		if (removeenabled) {
			$(".removebutton").fadeOut();
			removeenabled = false;
		} else {
			$(".removebutton").fadeIn();
			removeenabled = true;
		}
	});
}