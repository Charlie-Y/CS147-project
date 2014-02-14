'use strict';


// Call this function when the page loads (the "ready" event)
$(document).ready(function() {
	initializePage();
	$(".folded").each(function() {
		new FoldedList($(this));
	});
	$("input[type=checkbox]").each(function() {
		new Highlight($(this));
	});
})


function Highlight(button) {
	button.change(function(){
	    if(this.checked){
	        $(this).next().css("color", "#eb006f");
	    } else {
	        $(this).next().css("color", "#A0A0A0");
	    }
	});
}



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

function AddToSetlist(button) {
	button.click(function() {
		var title = $("#title").val();
		var description = $("#description").val();

		var values = $("input[type=checkbox]:checked").map(function() {
    		return this.value;
		}).get();

		if (values.length == 0) {
			$(".warningmessage").html("You must select at least one video");
			$(".warning").fadeIn("fast", function() {
				setTimeout(function() {
					$(".warning").fadeOut("slow");
				}, 2000);
			});
			//warning.fadeOut("slow", function() {
			//};
		}
		/*
		$("input[type=checkbox]:checked").each(function() {
     		alert( $(this).val() );
		});
		var empty = /^\s*$/.test(title);
		if (empty) {
			$("#title").css('border', '1px solid #eb006f');
			$("#warning").fadeIn();
		} else {
			$.post("/createsetlist", { 'title': title, 'description': description }, function(data) {
				window.location.href = "/addtoplaylist/" + data.id;
			});
		}
		*/
	});
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

	new AddToSetlist($("#add"));
}

