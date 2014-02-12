'use strict';


// Call this function when the page loads (the "ready" event)
$(document).ready(function() {
	initializePage();
	$(".folded").each(function() {
		new FoldedList($(this));
	});
})


function FoldedList(button){
	var open = false;

	button.click(function() {
		if(!open) {
			$(this).next().slideDown('slow');
			open = true;
		} else {
			$(this).next().slideUp('slow');
			open = false;
		}
	});

	button.next().find(".foldbutton").click(function() {
		$(this).parent().slideUp();
		open = false;
	})
}

/*
 * Function that is called when the document is ready.
 */
function initializePage() {
	var searched = false;
	$("#query").click(function() {
		if (!searched) {
			$("#query").css("font-style","normal");
			$("#query").css("color","black");
			$("#query").css("font-size", "13pt");
			$("#query").val("");
			searched = true;
		}
	});
}

