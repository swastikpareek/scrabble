(function($){
	$(document).ready(function(){
		$('.button').mouseup(function() {
			$(this).removeClass('focus');
		});
		$('.button').mousedown(function() {
			$(this).addClass('focus');
		});
		$('.clock > div').addClass('animate');
	});
})(jQuery);