(function($){
	$(document).ready(function() {
		var word = ['arrive','tomato','thought','suggets','sortable','lotus','clotting','daring','dommed','roatate','obvious','altered','betrayed','blasted'];
		var actual, characters;
		var $solution = $( "#container" );
 	  var $jumbled = $( "#footer" );
    var recycle_icon = "<div class='ui-icon ui-icon-refresh'>Recycle image</div>";
	  var i,j; // For mins and secs
	  var mins = 0 , secs=10; // Initialise the timer
 	  var needStop = false; // Flag to stop the recursive calls from external events (Message Passinf)
	  var timer_ends = false; // Flag indicates if timer has ended (Message passing)
	  var transition_active=true; // Flag to indicate whetehr transition is active or not (Message Passing)
	  var winner = false; // Flag which indicate if the user has won the game or not (Message Passing)


		function get_random(){// To render the markup
			actual=word[Math.floor((Math.random()*10)+1)%(word.length-1)];
     		characters = actual.split("");
     		Shuffle(characters);
     		render_blocks(); // rendered the droopaabel block and jumbled words
     		init_drag_drop(); //Initialise drag and drop
     		init_click(); //initialise click events on 'x' button;
     	}

		function Shuffle(o) { // Shuffle the array;
			for(var j, x, i = o.length; i; j = parseInt(Math.random() * i), x = o[--i], o[i] = o[j], o[j] = x);
		return o;
		}

    	function render_blocks(){ //Append new blocks
			$('#header #container').css('width',characters.length*44+'px');
			characters.forEach(function(entry){
				$('#footer').append('<div class="small-box draggable"><div class="content">'+entry.toUpperCase()+'</div></div>');
			});
		}

     	function init_drag_drop(){	// Initiate drag and drop;
	        $( ".small-box", $jumbled ).draggable({
			  cancel: "a.ui-icon", // clicking an icon won't initiate dragging
			  revert: "invalid", // when not dropped, the item will revert back to its initial position
			  containment: "document",
			  helper: "clone",
			  cursor: "move"
			});
	     }

	    function init_click(){ //initialise click events on 'x' button;
	      $(".small-box ").click(function(event) {
			if($(event.target).is("div.ui-icon-refresh")){
				recycleDiv($(this));
			}
			else{
				if($(this).find('.ui-icon').val() == undefined){ // to check the div cliked in jumbled box only
					deleteDiv($(this));
					checkAns();
				}
			}
		  });
	    }

	    $solution.droppable({ // jQury-ui Defining the solution box as droppable;
	      accept: "#footer > div",
	      drop: function( event, ui ) {
	        deleteDiv( ui.draggable );
	        checkAns();
	      }
	    });

	    $jumbled.droppable({ // jQury-ui Defining the jumbled group box as droppable;
	      accept: "#header > div",
	      drop: function( event, ui ) {
	        recycleDiv( ui.draggable );
	      }
	    });

	   function deleteDiv( $item ) { // Move the current word from jumbled category to solution div
	     $item.fadeOut(function() {
	      $item.append( recycle_icon ).appendTo( $solution).fadeIn();
	  	});
	   }

       function recycleDiv( $item ) { //Move the currrent word from solution category to jumbled group again
        $item.fadeOut(function() {
         $item.appendTo($jumbled).fadeIn();
         $item.find('.ui-icon').remove();
        });
       }

	    function checkAns(){ //Checks the solution if it matches with the randomly slected string( Initiate on dropping letters to solution div)
	     var i=1;
	   	 $('#container .small-box').each(function(){
	    	i++;
	   	 });
	   	 if(i == characters.length){
	   	 	$('.check').addClass('checking');
	   	 	$('.check').text('CHECKING..');
	   	 }
	   	 setTimeout(function(){
		     if(i == characters.length){
		     	var result='';
			   	$('#container .small-box').each(function(){
			   		result += $(this).find('.content').text();
			   	});
			   	if(result==actual.toUpperCase()){
			   	 	$('.check').addClass('good');
			   	 	$('#header').addClass('good');
   	 		   	 	$('.check').text('BINGO !');
   	 		   	 	$('.randomise').hide();
   	 		   	 	winner = true;
			   	}
			   	else{
   			   	 	$('.check').addClass('bad');
   			   	 	$('#header').addClass('bad');
			   	 	$('.check').text('RETRY !');
			   	 	$('.randomise').hide();
			   	}
		     }
	   	 },1000);
	    }


	    $('.check').click(function(){ //Event Handling for RESEt BUTTON
	    	$('.small-box').each(function(){
	    		$(this).remove();
	    	});
	    	transition(0,0); // To remove the animation instantly (Shuffles the newly picked random word)
	    	$('.clock > div').removeClass('animate'); /// reset the animation
	    	reinit_transition();
	    	reinit_timer();
	    	get_random();
	    	reset_header();
	    });

	    $('.randomise').click(function(){ // EVENT Handling for shuffle button (Shuffle the old word into new combination)
	    	$('.small-box').each(function(){
	    		$(this).remove();
	    	});
     		Shuffle(characters);
     		render_blocks();
     		init_drag_drop();
     		init_click();
	    });

	   function reset_header(){ //Resets the theme of the Solution (Header)
	    	$('#header').removeClass('good');
	    	$('#header').removeClass('bad');
	   	 	$('.check').removeClass('good');
	   	 	$('.check').removeClass('bad');
	   	 	$('.check').removeClass('checking');
	   	 	$('.check').text('RESET');
	   	 	$('.randomise').show();
	    }

		function timer(min, sec){ //Timer counter function (recursive function to implement timer) 
				i=parseInt(min);//parsed because add_zero makes it a string
				j=parseInt(sec);//parsed because add_zero makes it a string
  			j--;
				if(j==-1){//if seconds of the current mins ends
					i--;
					j=59;}
				// #case For exit 1) if timer goes out2) If external events stops it 3) if user wins the game
				if(i==-1){ // If the timer goes out of time
						$('.counter').text('00:00');//Cannot use variables because j gets upadted to 59
 			   	 	$('.check').addClass('bad');
 			   	 	$('#header').addClass('bad');
			   	 	$('.check').text('RETRY !');
			   	 	$('.randomise').hide();
  			   timer_ends = true;// Set the flag to indicate timer has ends
  			   evaluate_score(0); //Evaluate the score even you loose
					return false; //exits()
				}
				if(needStop){// IF stopped by external event
					return false;	
				}
				if(winner){ //IF palyer wins the game
					evaluate_score(min*60+sec+1); //evaluate the score(a Added because check ans delays the result for 1 min)
					return false;
				}
				$('.counter').text(add_zero(i)+":"+add_zero(j+1)); //print the current time
				setTimeout(function(){
					timer(i,j);				//REcusively call the timer function after 1 sec;
				},1000);
		}

		function add_zero(num){ // parse 'x' int to '0x' int
			if(num<10 && num>=0){ // if no. is between 0 to 9
				num='0'+num; 
			}
			return num;
		}

		function reinit_timer(){ // Re initialise the timer (when user hits reset)
    	if(!timer_ends){ // Reset is hitted before timer ends
	    	needStop = true; // Stops the previous recursive calls
	    }
    	else{ // if reset is got after timer ends
  		timer_ends = false; // Continue the normal execution and reset the timer_end flag
    	} 
	    setTimeout(function(){
    	$('.counter').text(mins+':'+secs); // resets the counter;
    	timer(mins,secs); // reinitieat the timer
			needStop= false; // Allow new recursive functions to play
			},1);
		}

		function transition(min,sec){ // Function for the transition effect of sand watch
			var total = min*60 + sec;
			$('.part').css('-webkit-transition-duration',total+'s');
			$('.part').css('-moz-transition-duration',total+'s');
			$('.part').css('-o-transition-duration',total+'s');
			$('.part').css('transition-duration',total+'s');
		}

		function reinit_transition(){ // Reinitialise tsand_watch animation (when user hits reset)
	    	/*transition(mins,secs);*/
	    	transition_active = false;
				setTimeout(function(){
	    		if(!transition_active){ //Activate the transition if not active (Need to have a timeout of atleast a milli seconds)
						transition(mins,secs); 
						$('.clock > div').addClass('animate');
						transition_active=true;
					}
				},1);
		}

		function evaluate_score(time_taken){ // Function to evaluate score
/*			alert(time_taken);*/
		}

		
  	get_random();// Initiate scrabble;
		timer(mins,secs); //Initiate timer
		transition(mins,secs); //Initiate sand box plugin;

  });
})(jQuery);