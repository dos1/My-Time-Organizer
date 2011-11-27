/* [?] My Time Organizer @ Google Apps Hackathon 12.11.2011 (11/12/2011)
 * [+] Authors: 
 * - Dominik Galewski (mug3tsu)
 * - Sebastian Krzyszkowiak (dos)
 * - Krzysztof Marciniak (hun7er)
 * [!] [alphabetical order]
 */

function first() {
	$('#tutorialHighlight').animate({height: parseInt($('#add_panel').css('height'))+60, width: parseInt($('#add_panel').css('width'))+50, top: $('#add_panel').offset().top-50, left: $('#add_panel').offset().left-40}, 1000);
}

//$(document).ready(function() {
function tutorialStart() {
	//$('#tutorialHighlight').animate({height: 500, width: 30, top: 10, left: 10}, 5000, first);
	$('#tutorialHighlight').css('display','block').css('left', $('#tutorialHighlight').offset().left).css('top', $('#tutorialHighlight').offset().top);
	first();
}
//);