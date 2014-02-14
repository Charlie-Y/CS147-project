
$(document).ready(function() {
	$.getScript( "https://apis.google.com/js/client.js?onload=onClientLoad", function( data, textStatus, jqxhr ) {
	  console.log( data ); // Data returned
	  console.log( textStatus ); // Success
	  console.log( jqxhr.status ); // 200
	  console.log( "Load was performed." );
	});

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
})


//Okay, so the showResponse function contains all the AJAX code and Youtube API search goes that is triggered when the
//button is clicked. So far I can display a list of videos, but the positioning is off and I haven't linked it to another
//project yet.
function showResponse(response) {
    var responseString = JSON.stringify(response, '', 2);
  	console.log(response.items[0].snippet.thumbnails.default.url);
    loadXMLDoc();
    console.log(responseString);
 	function loadXMLDoc() {
 		var xmlhttp;
 		if(window.XMLHttpRequest){
 			xmlhttp=new XMLHttpRequest();
 		}else {
 			xmlhttp = newActiveXObject("Microsoft.XMLHTTP");
 		}

   		var html = "";
    	for(i = 0; i < (response.items).length; i++) {
    		//I tried to teach myself Ajax (before today's lecture), and so I basically created a container, 
    		//div and used a thumbnail image, description, and title, to identify the project. I was a little confused
    		//about what we wanted to extract from the user click. Do we want to return the video id? Do we want
    		//to go to the Youtube url for the user to view the video? Would love your input!
    		html += '<div class="videoitem"><div class="title">'+response.items[i].snippet.title+'</div> \
    			<div class="description">'+response.items[i].snippet.description+'</div> \
    			<img class="thumbnails" src="'+response.items[i].snippet.thumbnails.default.url+'"></div><hr>';
 		}
 		$(".container").html(html);
 		xmlhttp.open("GET","create",true);
		xmlhttp.send();
 	}
}

// Called automatically when JavaScript client library is loaded.
function onClientLoad() {
    gapi.client.load('youtube', 'v3', onYouTubeApiLoad);
}

// Called automatically when YouTube API interface is loaded (see line 9).
function onYouTubeApiLoad() {
    // This API key is intended for use only in this lesson.
    // See http://goo.gl/PdPA1 to get a key for your own applications.
    gapi.client.setApiKey('AIzaSyBCvmFiLUeMX4TXRMI7Ep26vO066nVyByg');
}

function search() {
	var query = $("#query").val();

    // Use the JavaScript client library to create a search.list() API call.
    var request = gapi.client.youtube.search.list({
        q: query,
        part: 'snippet'
    });
    
    // Send the request to the API server,
    // and invoke onSearchRepsonse() with the response.
    request.execute(onSearchResponse);
}

// Called automatically with the response of the YouTube API request.
function onSearchResponse(response) {
    showResponse(response);
}