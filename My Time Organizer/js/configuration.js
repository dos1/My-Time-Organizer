
function confScreen() {
	
	$('#helper').css("visibility", "hidden");
	
	okno = document.createElement('div');
	okno.id = 'tutorial';
	okno = $(okno);
	okno.hide();
	okno.addClass('helper');
	okno.empty();
	okno.css("z-index", 100000).css('width',400).css('padding-top',0);
		
	wrap = document.createElement('div');
		
	next = document.createElement('div');
	$(next).addClass('next_button');
	next.innerHTML = 'Anuluj';
	next.onclick = end;
	$(next).css('width','100%').appendTo(wrap);

	$(wrap).appendTo(okno);
	
	okno.appendTo("body");
	okno.fadeIn(500);
	
	$('#tutorialHighlight').css('display','block').css('left', $('#tutorialHighlight').offset().left).css('top', $('#tutorialHighlight').offset().top);
	//first();
}