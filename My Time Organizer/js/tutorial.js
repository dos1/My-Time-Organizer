/* [?] My Time Organizer @ Google Apps Hackathon 12.11.2011 (11/12/2011)
 * [+] Authors: 
 * - Dominik Galewski (mug3tsu)
 * - Sebastian Krzyszkowiak (dos)
 * - Krzysztof Marciniak (hun7er)
 * [!] [alphabetical order]
 */

function expand() {
	elem = $('#info_panel');
	elem.attr('data-expand','true');
	$("#tutorialText").html("Aby przemieszczać się między poszczególnymi tygodniami, możesz najechać myszką na numer tygodnia wskazany powyżej albo kliknąć na przycisk ze strzałką znajdujący się na boku ekranu. Pierwsza ikonka pozwoli Ci wybrać interesującą Cię datę, druga zaś - przeniesie do dzisiaj.<br/><br/>Dodatkowo możesz skorzystać ze sterowania klawiaturą zgodnie ze schematem obok.");
	$('#tutorial').animate({top: elem.offset().top+30, left: (elem.offset().left+parseInt(elem.css('width')))-parseInt($('#tutorial').css('width'))}, 1);
	$('#tutorial').fadeIn(500);	
}

function second() {
	$('#tutorial').fadeOut(500);
	elem = $('#left_arrow');
	$('#tutorialHighlight').animate({height: parseInt(elem.css('height'))+60, width: parseInt(elem.css('width'))+35, top: elem.offset().top-5, left: elem.offset().left}, 1000);
	elem = $('#right_arrow');
	$('#tutorialHighlight').delay(500).animate({height: parseInt(elem.css('height'))+60, width: parseInt(elem.css('width'))+35, top: elem.offset().top-5, left: elem.offset().left}, 1000);

	elem = $('#info_panel');
	$('#tutorialHighlight').delay(500).animate({height: parseInt(elem.css('height'))+10, width: parseInt(elem.css('width'))+40, top: elem.offset().top-5, left: elem.offset().left-20}, 1000, expand);
}

function first() {
	$('#tutorial').css("-webkit-transform","none").css('left', $('#tutorial').offset().left-200).css('top', $('#tutorial').offset().top-50);

	wrap = document.createElement('div');
	wrap.id = 'tutorialAddon';
	$(wrap).css('float', 'left').css('width', '150px').css('height','225px').css('margin-right', '10px').css('background-color','white');
	$(wrap).insertBefore($('#tutorialText'));
	
	next = document.createElement('div');
	$(next).addClass('day_content').css('height','100%').css('width','100%').css('margin',0);
	$(next).appendTo(wrap);

	setDayHandlers(next);
	
	$("#tutorialText").html("My Time Organizer pozwala na zorganizowanie dnia przy pomocy trzech podstawowych typów elementów: wydarzeń, zadań oraz notatek. Dodawanie ich do wybranego dnia odbywa się na prostej zasadzie \"przeciągnij i upuść\".<br/><br/>Możesz wypróbować ten mechanizm na kolumnie obok. Najedź kursorem na wybrany przycisk, wciśnij lewy przycisk myszki, przesuń kursor na kolumnę po czym puść przycisk.");
	elem = $('#add_panel');
	$('#tutorial').animate({top: elem.offset().top+70, left: elem.offset().left}, 1000);
	
	$('#tutorialHighlight').animate({height: parseInt(elem.css('height'))+60, width: parseInt(elem.css('width'))+50, top: elem.offset().top-50, left: elem.offset().left-40}, 1000);

	
	$('#tutorialNext')[0].onclick = second;
}

//$(document).ready(function() {
function tutorialStart() {
	$('#helper').hide();
	//$('#tutorialHighlight').animate({height: 500, width: 30, top: 10, left: 10}, 5000, first);
	okno = document.createElement('div');
	okno.id = 'tutorial';
	okno = $(okno);
	okno.hide();
	okno.addClass('helper');
	okno.empty();
	okno.css("z-index", 100000);
	
	text = document.createElement('div');
	text.id = 'tutorialText';
	text = $(text);
	text.css('line-height', '1.2em');
	text.html("Witaj w My Time Organizer! Ten samouczek pomoże Ci zapoznać się z funkcjami i zasadami działania aplikacji.");
	text.appendTo(okno);
	
	next = document.createElement('div');
	next.id = 'tutorialNext';
	$(next).addClass('next_button');
	next.innerHTML = 'Dalej';
	next.onclick = first;
	$(next).appendTo(okno);
	
	okno.appendTo("body");
	okno.fadeIn(500);
	
	$('#tutorialHighlight').css('display','block').css('left', $('#tutorialHighlight').offset().left).css('top', $('#tutorialHighlight').offset().top);
	//first();
}
//);