'use strict';


// Call this function when the page loads (the "ready" event)
$(document).ready(function() {
	console.log("hello");
	initializePage();
});


function CreateSetlist(button) {
	button.click(function() {
		var title = $("#title").val();
		var description = $("#description").val();
		var empty = /^\s*$/.test(title);
		if (empty) {
			$("#title").css('border', '1px solid #eb006f');
			$("#warning").fadeIn();
		} else {
			$.post("/createsetlist", { 'title': title, 'description': description }, function(data) {
				window.location.href = "/addtoplaylist/" + data.id;
			});
		}
	});
}

/*
 * Function that is called when the document is ready.
 */
function initializePage() {
	new CreateSetlist($(".create"));
}

