
function setColor() {
		localStorage['color']=$(this).attr('data-color');
		loadUIColor();
		end();
}

function confScreen() {

	_gaq.push(['_trackPageview', '/config']);
	
	$('#helper').css("visibility", "hidden");
	
	okno = document.createElement('div');
	okno.id = 'tutorial';
	okno = $(okno);
	okno.hide();
	okno.addClass('helper');
	okno.empty();
	okno.css("z-index", 100000).css('width',400).css('padding-top',0);
		
	wrap = document.createElement('div');
		
	$(wrap).html(chrome.i18n.getMessage("colorTheme"));
	$(wrap).find('p').css('text-align','center').css('padding-top',20);

	next = document.createElement('div');
	$(next).addClass('selectColorVersion');
	$(next).css('background-color', '#457ad5');
	next.setAttribute('data-color', 'blue');
	next.onclick = setColor;
	$(next).appendTo($(wrap).find('p')[1]);

	next = document.createElement('div');
	$(next).addClass('selectColorVersion');
	$(next).css('background-color', '#fba8d3');
	next.setAttribute('data-color', 'pink');
	next.onclick = setColor;
	$(next).appendTo($(wrap).find('p')[1]);

	next = document.createElement('div');
	$(next).addClass('selectColorVersion');
	$(next).css('background-color', '#1a1a1a');
	next.setAttribute('data-color', 'black');
	next.onclick = setColor;
	$(next).appendTo($(wrap).find('p')[1]);
	
	next = document.createElement('div');
	$(next).addClass('selectColorVersion');
	$(next).css('background-color', '#a88314');
	next.setAttribute('data-color', 'brown');
	next.onclick = setColor;
	$(next).appendTo($(wrap).find('p')[1]);

	next = document.createElement('div');
	$(next).addClass('selectColorVersion');
	$(next).css('background-color', '#a0e62f');
	next.setAttribute('data-color', 'lime');
	next.onclick = setColor;
	$(next).appendTo($(wrap).find('p')[1]);	
	
	next = document.createElement('div');
	$(next).addClass('selectColorVersion');
	$(next).css('background-color', '#ff8b2a');
	next.setAttribute('data-color', 'orange');
	next.onclick = setColor;
	$(next).appendTo($(wrap).find('p')[1]);	
	
	next = document.createElement('div');
	$(next).addClass('next_button');
	next.innerHTML = chrome.i18n.getMessage("cancel");
	next.onclick = end;
	$(next).css('width','100%').appendTo(wrap);

	$(wrap).appendTo(okno);
	
	okno.appendTo("body");
	okno.fadeIn(500);
	
	$('#tutorialHighlight').css('display','block').css('left', $('#tutorialHighlight').offset().left).css('top', $('#tutorialHighlight').offset().top);
	//first();
}
