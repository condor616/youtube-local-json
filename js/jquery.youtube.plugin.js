(function($){

var _jsonData;
var numberOfVideo;
var thumbsUrl = [];
var duration = [];
var playButtonLocation = "../youtube2//images/youtube-play-button.png";

//Methods
var methods = {

	//Initializiation
	init: function(settings){
		
		_defaultSettings = {
			feed: "js/video.json"
		}
		
		//overwrite the default values with the variables
		if (settings) $.extend(_defaultSettings, settings);	
		
		//load the JSON file and create the _json object
		methods.loadData(_defaultSettings.feed);
	},
	
	//Loading data
	loadData: function(feed){	
			$.ajax({
				type: 'GET',
				url: feed,
				crossDomain: true,
				cache: false,
				dataType: 'json',
				success: function(data){
					_jsonData = data;
					numberOfVideo = _jsonData.Video.length;
					
					//here I want to call the rendering function
					methods.loadVideoLibrary();
					methods.addEventListeners();
				},
				error: function(xhr, ajaxOptions, thrownError){	
					alert(xhr.status);
					alert(thrownError);
				
				}
			});
	},
	
	convertSeconds: function(seconds){
		var m = Math.floor(seconds/60);
		var s = Math.ceil(seconds%60);
		var result = m  + ":" + (s  < 10 ? "0" + s : s);

		return  result;
	},
	
	addEventListeners: function(){
		$('.preview-container.bottom .video .thumb').each(
			function(index, element) {
            	
				$(this).click(
						function(){
								$('div.video-container').find('iframe').attr("src","http://www.youtube.com/embed/"+_jsonData.Video[index].id+"?autoplay=1");				
						}
				);
				
				$(this).hover(
					function(){
						background = $(this).css('background-image'); //get the actual property
						$(this).css('background-image', 'url('+playButtonLocation+'), '+background+'');
						$(this).css('background-repeat', 'no-repeat, no-repeat');
						$(this).css('background-size', '40px auto, 90px 60px');
						$(this).css('background-position', 'center');	
					},
					
					function(){
						$(this).css('background-image', background);	
						$(this).css('background-repeat', 'no-repeat');	
						$(this).css('background-size','90px 60px');
					}
				);
				//console.log(index,element);			
        	}
		);
		
		
	},
	
	loadVideoLibrary: function(){
		
		$('div.video-container').append("<iframe width=\"560\" height=\"315\" frameborder=\"0\" allofullscreen></iframe>");
		$('div.video-container').find('iframe').attr("src","http://www.youtube.com/embed/"+_jsonData.Video[0].id);
		
		for (var i=0; i<numberOfVideo; i++){
			var video = $('div.preview-container');
			var videoId = _jsonData.Video[i].id;
			
			video.append("<div class=\"video\" id=\" " + videoId + "\"><div class=\"thumb\"></div><div class=\"details\"><span class=\"duration\"></span><span class=\"title\"></span></div></div>");
			
			thumbsUrl[i] = "http://img.youtube.com/vi/" + videoId + "/default.jpg";
			
			//Display image in the righ sidebar
			video.find('div.video:eq('+i+') .thumb').css('background-image', 'url('+thumbsUrl[i]+')');

			//Mouse Over
			/*
			video.find('div.video:eq('+i+') .thumb').css('background-image', 'url('+playButtonLocation+'), url('+thumbsUrl[i]+')');
			video.find('div.video:eq('+i+') .thumb').css('background-repeat','no-repeat no-repeat');
			video.find('div.video:eq('+i+') .thumb').css('background-size','40px auto, 90px auto');
			video.find('div.video:eq('+i+') .thumb').css('background-position','center');
			*/


			if (i==numberOfVideo-1){
				$('div.video:eq('+i+')').addClass('last-item');
			}
			
			$('div.preview-container div.video:eq('+i+')').find('div.details span.duration').html(methods.convertSeconds(_jsonData.Video[i].duration));
			$('div.preview-container div.video:eq('+i+')').find('div.details span.title').html(_jsonData.Video[i].title);
			
		}
		
	}
	
}; 
//end Methods

$.fn.jQueryYoutubePlugin = function(method){
		if (methods[method]){
			return methods[method].apply(this, Array.prototype.slice.call(arguments,1));
		}
		if (typeof method == "object" || ! method){
			return methods.init.apply(this,arguments);
		}else{
			$.error(' Method ' + method + ' doesn\'t exist on Jquery.jsonreader');
		}
}




})(jQuery);