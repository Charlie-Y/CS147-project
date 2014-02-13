'use strict';


// Call this function when the page loads (the "ready" event)
$(document).ready(function() {
	initializePage();

	$(".removebutton").each(function() {
		new Remove($(this));
	});
})

/*
 * Function that is called when the document is ready.
 */
function initializePage() {
	new RemoveButton($(".remove"));
	new Delete($("#delete"));
}

function RemoveButton(button){
	var removeenabled = false;

	button.click(function() {
		if (removeenabled) {
			$(".removebutton").fadeOut();
			removeenabled = false;
		} else {
			$(".removebutton").fadeIn();
			removeenabled = true;
		}
	});
}

function Remove(button) {
	button.click(function() {
		var id = $(this).attr("id");
		$(this).parent().next().remove();
		$(this).parent().remove();

		var i=1;
		$(".number").each(function() {
			$(this).html("ROUTINE #" + i);
			i++;
		});

		$.get(document.URL + "/remove/" + id);
	});
}

function Delete(button) {
	button.click(function() {
		$.get(document.URL + "/remove");
		window.location.href = "/playlist";
	});
}