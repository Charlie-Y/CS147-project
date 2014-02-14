'use strict';


// Call this function when the page loads (the "ready" event)
$(document).ready(function() {
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
			$(".warningmessage").html("Title can't be blank");
			$(".warning").fadeIn("fast", function() {
				setTimeout(function() {
					$(".warning").fadeOut("slow");
				}, 2000);
			});

		} else {
			$.post("/createsetlist", { 'title': title, 'description': description }, function(data) {
				window.location.href = "/addtosetlist/" + data.id;
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

