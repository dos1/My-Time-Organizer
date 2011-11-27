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
	
}

function second() {
	elem = $('#left_arrow');
	$('#tutorialHighlight').delay(1000).animate({height: parseInt(elem.css('height'))+60, width: parseInt(elem.css('width'))+35, top: elem.offset().top-5, left: elem.offset().left}, 1000);
	elem = $('#right_arrow');
	$('#tutorialHighlight').delay(500).animate({height: parseInt(elem.css('height'))+60, width: parseInt(elem.css('width'))+35, top: elem.offset().top-5, left: elem.offset().left}, 1000);

	elem = $('#info_panel');
	$('#tutorialHighlight').delay(500).animate({height: parseInt(elem.css('height'))+10, width: parseInt(elem.css('width'))+40, top: elem.offset().top-5, left: elem.offset().left-20}, 1000, expand);
}

function first() {
	elem = $('#add_panel');
	$('#tutorialHighlight').animate({height: parseInt(elem.css('height'))+60, width: parseInt(elem.css('width'))+50, top: elem.offset().top-50, left: elem.offset().left-40}, 1000, second);
}

//$(document).ready(function() {
function tutorialStart() {
	//$('#tutorialHighlight').animate({height: 500, width: 30, top: 10, left: 10}, 5000, first);
	$('#tutorialHighlight').css('display','block').css('left', $('#tutorialHighlight').offset().left).css('top', $('#tutorialHighlight').offset().top);
	first();
}
//);