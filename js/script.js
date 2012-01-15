/* [?] My Time Organizer @ Google Apps Hackathon 12.11.2011 (11/12/2011)
 * [+] Authors: 
 * - Dominik Galewski (mug3tsu)
 * - Sebastian Krzyszkowiak (dos)
 * - Krzysztof Marciniak (hun7er)
 * [!] [alphabetical order]
 */

var __VERSION__ = "1.0.3";

lang = new Array();
//lang["en"] = new Array();
//lang["pl"] = new Array();

//var mylang = "pl";
		
/* English */
lang["days"] = [chrome.i18n.getMessage("mon"), chrome.i18n.getMessage("tue"), chrome.i18n.getMessage("wed"), chrome.i18n.getMessage("thu"), chrome.i18n.getMessage("fri"), chrome.i18n.getMessage("sat"), chrome.i18n.getMessage("sun")];
lang["ntypes"] = [chrome.i18n.getMessage("event"), chrome.i18n.getMessage("task"), chrome.i18n.getMessage("note")];
lang["notify_txt"] = chrome.i18n.getMessage("notify_txt");
lang["icons"] = [chrome.i18n.getMessage("icon1"), chrome.i18n.getMessage("icon2"), chrome.i18n.getMessage("icon3")];
lang["week"] = chrome.i18n.getMessage("week");
lang["items_txt"] = [chrome.i18n.getMessage("items_txt1"), chrome.i18n.getMessage("items_txt2"), chrome.i18n.getMessage("items_txt3")];
lang["helper_txt"] = chrome.i18n.getMessage("helper_txt");
lang["months"] = [chrome.i18n.getMessage("jan"), chrome.i18n.getMessage("feb"), chrome.i18n.getMessage("mar"), chrome.i18n.getMessage("apr"), chrome.i18n.getMessage("may"), chrome.i18n.getMessage("jun"), chrome.i18n.getMessage("jul"), chrome.i18n.getMessage("aug"), chrome.i18n.getMessage("sep"), chrome.i18n.getMessage("oct"), chrome.i18n.getMessage("nov"), chrome.i18n.getMessage("dec")];


/* Polish //
lang["pl"]["days"] = ["Poniedziałek", "Wtorek", "Środa", "Czwartek", "Piątek", "Sobota", "Niedziela"];
lang["pl"]["ntypes"] = ["Wydarzenie", "Zadanie", "Notatka"];
lang["pl"]["notify_txt"] = "Przypomnienie o wydarzeniu";
lang["pl"]["icons"] = ["Przełącz widok", "Konfiguracja", "Pomoc"];
lang["pl"]["week"] = "Tydzień";
lang["pl"]["items_txt"] = ["Kliknij ikonę ołówka, aby edytować tę notatkę, lub krzyżyk, aby ją usunąć.", "Kliknij ikonę ołówka, aby edytować to zadanie, lub krzyżyk, aby je usunąć.", "Kliknij ikonę ołówka, aby edytować to wydarzenie, lub krzyżyk, aby je usunąć."];
lang["pl"]["helper_txt"] = 'Nie dodano jeszcze żadnych elementów do wyświetlonego tygodnia. Aby to uczynić, przeciągnij ikonkę z górnego paska do wybranej kolumny. Kliknij "Pomoc", aby uzyskać dodatkowe informacje.';
lang["pl"]["months"] = ["Styczeń", "Luty", "Marzec", "Kwiecień", "Maj", "Czerwiec", "Lipiec", "Sierpień", "Wrzesień", "Październik", "Listopad", "Grudzień"];
*/
moment.months = lang["months"];

var weeks = {};
var deletedItems = [];
var labelCounter = 0;

var dayPreviewInterval;

var curDay = moment().format('D-M-YYYY');

function nyanNyan() {
	function nyanNyanNyan() {
		$('.header h3, #add_panel div, #info_panel span, footer').each(function () { this.setAttribute('data-nyan', this.innerHTML); } );
		$('.header h3, #add_panel div').each(function() { this.innerHTML = 'Nyan'; } );
		$('#info_panel span, #task_icon').html('Nyan-nyan');
		$('footer').html('&copy; Nyanyan Nyan-Nyan Nyan NYAN Nyan, Nyan \'Nyan\' Nyan, Nyan ny4n Nyan');
	}
	function nyanNyanNyanNyan() {
		$('.header h3, #add_panel div, #info_panel span, footer').each(function () { if (this.innerHTML.indexOf('Nyan')!=-1) this.innerHTML = this.getAttribute('data-nyan'); } );		
	}

	if ($('.nyan')[0]) return false; // nayn
	var nyan = document.createElement('div');
	nyan = $(nyan);
	nyan.addClass('nyan');
	nyan.appendTo('body');
	
	nyannyan = new Audio();
	nyannyan.src = 'images/nyan_cat.ogg';
	nyannyan.play();
	
	nyanNyanNyan();
	
	setTimeout( function () {
		$('.nyan').attr('data-nyan', 'nyan'); // nyan nyan nyan nyan
		$('body').attr('data-nyan', 'nyan');
		setTimeout(function() {
			$('.nyan').attr('data-nyan', 'nayn');
			setTimeout( function() { $('.nyan').remove(); nyanNyanNyanNyan(); $('body').attr('data-nyan', 'nayn'); }, 4000);
		}, 4000);
	});
	return true; // nyan
}

function checkCurDay() {
	if (curDay!=moment().format('D-M-YYYY'))  { 
		//console.log('NEW DAY'); 
		$('[data-currentday=true]').attr('data-currentDay','');
		$('#current_day')[0].id = '';
		$('.day.today').removeClass('today');
		d = moment();
		curDay = d.format('D-M-YYYY');
		day = ((d.format("D") < 10) ? "0"+d.format("D") : d.format("D"))+"-"+((d.format("M") < 10) ? "0"+d.format("M") : d.format("M"))+"-"+d.format("YYYY");
		header = $('nav[data-date=day'+day+']').attr('data-currentDay','true').find('.header');
		$('.day[data-date='+day+']').addClass('today');
		if (header[0]) header[0].id = 'current_day';
		
	}
}


function alignToMonday(inMonth) {
//	function align(week) {
	//console.log(weeks[week]);
	var mdn = weeks['inner_table_center'].format("d")-1; // current day of the week
	if (mdn==-1) mdn = 6;
	m = weeks['inner_table_center'].format('M');
	weeks['inner_table_center'].subtract("days", mdn);        // current day
	
	if (inMonth) {
		if (m!=weeks['inner_table_center'].format('M')) {
			weeks['inner_table_center'].add("days", 7);
		}
	}

	weeks['inner_table_left']=moment(weeks['inner_table_center'].format('D-M-YYYY'), 'D-M-YYYY').subtract("days", 7);
	weeks['inner_table_right']=moment(weeks['inner_table_center'].format('D-M-YYYY'), 'D-M-YYYY').add("days", 7);

/*	align(weeks['inner_table_left']);
	align(weeks['inner_table_center']);
	align(weeks['inner_table_right']);
*/}

	function resizeDays() {
		/*function f() {
			//console.log('mh ' + $(this).css('max-height') + ' h ' + $(this).height());
			p = ($(this).parent().height()-28-$(this).height())/2;
			$(this).css('top', p);
		}*/
		h=$('.day').height()-28; if (h>11) $('.day .previewbox .preview').css("max-height", h).css('visibility','visible'); else $('.day .previewbox .preview').css('visibility','hidden');

		if ($('body').attr('data-view')=='week')
			$(".day_content").css("height",$("#inner_table_full nav").height()-16);
		else
			$(".day_content").css("height",$("#inner_table_month nav").height()-16);

		
		//$('.day .preview').each( function() { 
		
		//});
	}


	function toggleView(a, call) {
		$('#inner_table_full, #inner_table_month').stop(false, true);
		if ($('body').attr('data-view')=='week') {
			$('body').attr('data-view','month');
			_gaq.push(['_trackPageview', '/month']);
			showHideHelper();
			fillMonthTable(document.getElementById('inner_table_month'));
			$('#inner_table_full').fadeOut(500, function() { $('#inner_table_month').fadeIn(500); resizeDays(); });
		}
		else {
			$('body').attr('data-view','week');
			_gaq.push(['_trackPageview', '/']);
			$('#inner_table_month').fadeOut(500, function() { $('#inner_table_full').fadeIn(500);
			removeTable($('#inner_table_left'), true);
			removeTable($('#inner_table_center'), true);
			removeTable($('#inner_table_right'), true);
			fillWeekTable(document.getElementById('inner_table_left'));
			fillWeekTable(document.getElementById('inner_table_center'));
			fillWeekTable(document.getElementById('inner_table_right'));
			loadTable(document.getElementById('inner_table_left'));
			loadTable(document.getElementById('inner_table_center'));
			loadTable(document.getElementById('inner_table_right'));
			if ((a) && (call)) call(a);
			showHideHelper(); resizeDays(); 
			$('#inner_table_month').empty(); });
		}
		updateWeek();
	}

	function updateWeek() {
		if ($('body').attr('data-view')=='week')
			$("#info_panel span").html(lang["week"]+" "+weeks['inner_table_center'].format("w")+", "+weeks['inner_table_center'].format("YYYY"));
		else
			$("#info_panel span").html(weeks['inner_table_center'].format("MMMM")+", "+weeks['inner_table_center'].format("YYYY"));
	}

	function incID() {
		if (localStorage['id']) {
			localStorage['id']=parseInt(localStorage['id'])+1;
		} else {
			localStorage['id']=1;
		}
		return localStorage['id'];
	}

	function slideToMonth(d) {
		//day.add("days", 1);
		if (weeks['inner_table_center'].format('M-YYYY')==d.format('M-YYYY')) return true;
		
		day = moment('1-'+d.format('M-YYYY'), 'D-M-YYYY');
		diff = day.diff(weeks['inner_table_center'], 'months');
		//console.log(diff);
		weeks['inner_table_left'].add("months", diff);
		weeks['inner_table_center'].add("months", diff);
		weeks['inner_table_right'].add("months", diff);
		alignToMonday(true);
		$('#inner_table_month').stop(false, true);
		$('#inner_table_month').fadeOut(250, function() { $('#inner_table_month').empty(); fillMonthTable(document.getElementById('inner_table_month')); $('#inner_table_month').fadeIn(250); setTimeout(0,resizeDays); });
		updateWeek();
	}

	function slideTo(d) {
		if ($('body').attr('data-view')=='month') return slideToMonth(d);
		day = moment(d.format('D-M-YYYY'), 'D-M-YYYY');
		day.add("days", 1);
		diff = day.diff(weeks['inner_table_center'], 'days');
		diff = Math.floor(diff/7);
		//console.log(diff);
		if (Math.abs(diff)<=2) {
			if (diff>0) {
				for (var i=0; i<diff; i++) {
					right_slide();
				}
			} else {
				for (var i=0; i>diff; i--) {
					left_slide();
				}			
			}
		}
		else {
			if (diff>0) {
				weeks['inner_table_left'].add("weeks", diff-3);
				weeks['inner_table_center'].add("weeks", diff-3);
				weeks['inner_table_right'].add("weeks", diff-3);
				alignToMonday();
				right_slide(); right_slide(); right_slide(); 
			} else {
				weeks['inner_table_left'].add("weeks", diff+3);
				weeks['inner_table_center'].add("weeks", diff+3);
				weeks['inner_table_right'].add("weeks", diff+3);
				alignToMonday();
				left_slide(); left_slide(); left_slide();
			}
		}
	}

	function saveTable(table) {
		//console.log('TABLE: '+table.getAttribute('id')+ ', length: '+table.childNodes.length);
			for ( var column = 0; column < table.childNodes.length; column++ ) {
				//console.log('START: ' +table.childNodes[column]);
				//console.log(' --- ' + table.childNodes[column].getAttribute('data-date'));
				col = document.getElementById(table.childNodes[column].getAttribute('data-date')).childNodes;
				
				//var column = document.getElementById('day'+(i+1)).childNodes;
				var note_count = 0;
				var notes = new Array();
				for ( j = 0; j < col.length; j++ ) {
					//console.log('storing note: '+col[j].getAttribute("data-content"));
					//console.log(col[j].getAttribute('class').split(" "));
					function oc(a) {
						var o = {};
						for(var i=0;i<a.length;i++) {
							o[a[i]]='';
						}
						return o;
					}
					//type=oc(col[j].getAttribute('class').split(" "));
					//if ( "note" in type ) {
						if (col[j].getAttribute('data-beingDeleted')) continue;
						notes[note_count] = {};
						if (!parseInt(col[j].getAttribute("data-id"))) {
							col[j].setAttribute("data-id", incID());
						}
						notes[note_count]['id'] = col[j].getAttribute("data-id");
						notes[note_count]['type'] = col[j].getAttribute("class");
						notes[note_count]['date'] = col[j].getAttribute("data-date");
						notes[note_count]['content'] = col[j].getAttribute("data-content");
						notes[note_count]['bgcolor'] = col[j].getAttribute("data-bgcolor");
						notes[note_count]['time'] = col[j].getAttribute("data-time");
						notes[note_count]['done'] = col[j].getAttribute("data-done");
						notes[note_count]['time-end'] = col[j].getAttribute("data-time-end");
						notes[note_count]['repeat'] = col[j].getAttribute("data-repeat");
						notes[note_count]['notify'] = col[j].getAttribute("data-notify");
						note_count += 1;
					//}
				}
				localStorage[table.childNodes[column].getAttribute('data-date')]=JSON.stringify(notes);
				//console.log(table.childNodes[column].getAttribute('data-date')+': '+JSON.stringify(notes));
				//alert(localStorage['day'+(i+1)]);
			}				
	}
			
	function saveNotes() {
		saveTable(document.getElementById('inner_table_left'));
		saveTable(document.getElementById('inner_table_center'));
		saveTable(document.getElementById('inner_table_right'));
		fixFirstNote();
	}
	
	/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	//
	//  To tak żeby nie dało się przeoczyć ;-)
	//  Dodałem do opcji notek (z myślą o eventach) pola 'time-end', 'repeat' i 'notify'
	//  Teraz jest to głównie kwestia ładnego podpięcia funkcji wszystkich 
	//
	/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	
	
	function loadTable(table) {
		//console.log('TABLE: '+table.getAttribute('id')+ ', length: '+table.childNodes.length);
		for ( var col = 0; col < table.childNodes.length; col++ ) {
			var column = Array();
			var note_count = 0;
			var data = localStorage[table.childNodes[col].getAttribute('data-date')];
			if (!data) continue;
			column = JSON.parse(data);
			for ( j = 0; j < column.length; j++ ) {
				var note = document.createElement('div');
				//console.log(column[j]);
				$(note).addClass(column[j]['type']);
				note.setAttribute('data-id', column[j]['id']);
				note.setAttribute('data-date', column[j]['date']);				
				note.setAttribute('data-content', column[j]['content']);
				note.setAttribute('data-bgcolor', column[j]['bgcolor']);
				note.setAttribute('data-done', column[j]['done']);
				note.setAttribute('data-time', column[j]['time']);
				note.setAttribute('data-time-end', column[j]['time-end']);
				note.setAttribute('data-repeat', column[j]['repeat']);
				note.setAttribute('data-notify', column[j]['notify']);
				fillNote(note, false);
				document.getElementById(table.childNodes[col].getAttribute('data-date')).appendChild(note);
			}
		}
		fixFirstNote();
		updateWeek();
	}
	
	function loadNotes() {
		loadTable(document.getElementById('inner_table_left'));
		loadTable(document.getElementById('inner_table_center'));
		loadTable(document.getElementById('inner_table_right'));
	}

	function undeleteNote() {
		note = deletedItems.pop();
		if (note) {
			date = note.attr('data-date');
			slideTo(moment(date.substr(3), "DD-MM-YYYY"));
			
			note.appendTo($('#'+date));
			note.removeAttr('data-beingDeleted');
			note.removeAttr('style');
			note.empty();
			fillNote(note[0]);
			shad = note.css('box-shadow');
			note.css('box-shadow', '#2020f0 0px 0px 10px 0px');
			setTimeout(function(note) { note.animate({boxShadow: shad}, 2000); }, 3000, note);
			saveNotes();
			showHideHelper();
		}
	}

	function deleteNote(note) {
	// takes jQuery object
		$("#"+note.attr('data-colorpickerId')).remove();
		note.detach();
		deletedItems.push(note);
	}

	
	function editMyEvent() {
		$('[data-editedNow=true]').attr('data-time', $('#event_time_start').attr('value'));
		$('[data-editedNow=true]').attr('data-time-end', $('#event_time_end').attr('value'));
		$('[data-editedNow=true]').attr('data-content', $('#event_desc_txt').val());
		$('[data-editedNow=true]').find('.note_content').text($('#event_desc_txt').val());
		$('[data-editedNow=true]').attr('data-notify', $("#notify").val());
		$('[data-editedNow=true]')
		// data-time-end
		//data-content
		//data-notify
		//console.log($('[data-isEditedNow=true]'));
		$('[data-editedNow=true]').attr('data-editedNow', 'false');
		saveNotes();
		$("#event_edit_panel").fadeOut(500);
		if (!document.getElementById('tutorial')) 
			$('#tutorialHighlight').css('display','none');
		//console.log("Event val: "+myobject.attr('data-date'));
		/*var myarr = new Array();
		myarr = JSON.parse(localStorage[myobject.attr('data-date')]);
		for (var i = 0; i < myarr.length; i++) {
			
		}*/
		
		
		
		//alert("Test");
	}
	
	function fillNote(note, anim) {
		
		if (!$(note).attr('class')) return false; // HACK, FIXME
		
		anim = typeof(anim) != 'undefined' ? anim : true;
				
		note.ondragover = function() {
			old = $('[data-draggedOver=true]')[0];
			if ((old!=note) && (old)) { $(old).rotate('0deg'); old.setAttribute('data-draggedOver', 'false'); }
			$(note).rotate('2deg');
			note.setAttribute('data-draggedOver', 'true');
		}
		
		$(note).css('backgroundColor', note.getAttribute('data-bgcolor'));

		var note_content = document.createElement('div');
		$(note_content).addClass('note_content');
		if (note.getAttribute('data-content')==='') {
			if (note.getAttribute('class')==='note')
				note_content.innerHTML = lang["items_txt"][0];
			else if (note.getAttribute('class')==='task')
				note_content.innerHTML = lang["items_txt"][1];
			else if (note.getAttribute('class')==='event')
				note_content.innerHTML = lang["items_txt"][2];
		}
		else note_content.innerHTML = note.getAttribute('data-content');
		note_content.contentEditable = false;
		note.appendChild(note_content);

		if ($(note).attr('class')==='task') {
			check = document.createElement('input');
			check.type = 'checkbox';
			check.id = 'checkbox'+labelCounter;
			note.appendChild(check);
			text = document.createElement('label');
			text.setAttribute('for', 'checkbox'+labelCounter);
			text.innerHTML = 'wykonane';
			note.appendChild(text);
			check.checked = (note.getAttribute('data-done')=='true');
			check.onchange = function() { this.parentNode.setAttribute('data-done',this.checked); saveNotes(); };
			labelCounter++;
		}

		
		var note_icons = document.createElement('div');
		$(note_icons).addClass('menu');

		var icon = document.createElement('img');
		icon.setAttribute('src', 'icons/write.png');
		icon.setAttribute('title', chrome.i18n.getMessage("editTxt"));
		icon.draggable = false;
		icon.onfocus = icon.blur;
		function editNote() {
			if ($(this).attr('class')=="note_content") t = $(this.parentNode).find("img")[0]; else t = this;
			note_content = $(t.parentNode.parentNode).find(".note_content")[0];
			if (note_content.isContentEditable) {
				note_content.parentNode.setAttribute('data-content', note_content.innerHTML);
				note_content.contentEditable = false;
				if ($(t.parentNode.parentNode).attr('class')=='event') {
					//console.log($(this.parentNode.parentNode).attr('class'));
					$(t.parentNode.parentNode).find(".note_time")[0].contentEditable = false;
					note_content.parentNode.setAttribute('data-time', $(t.parentNode.parentNode).find(".note_time")[0].innerHTML);
				}
				if ((note_content.innerHTML.toLowerCase()==='nyan') || (note_content.innerHTML.toLowerCase()==='nyan nyan')) nyanNyan();
				saveNotes();
			} else {
				note_content.innerHTML = note_content.parentNode.getAttribute('data-content');
				note_content.contentEditable = true;
				if ($(t.parentNode.parentNode).attr('class')=='event') {
					$(t.parentNode.parentNode).find(".note_time")[0].innerHTML = note_content.parentNode.getAttribute('data-time');
					$(t.parentNode.parentNode).find(".note_time")[0].contentEditable = true;
				}
				note_content.focus();
			}
			note_content.parentNode.setAttribute('data-editedNow', note_content.isContentEditable);
		}

//////////////////////////////////////// event edit handler /////////////////////////////////////////////////////////
		
		function editEventHandler() {
			$("#event_desc_txt").val($(note).attr('data-content'));
			$("#event_time_start").attr('value', $(note).attr('data-time'));
			if (!$(note).attr('data-time-end')) $("#event_time_end").attr('value', $(note).attr('data-time'));
			else $("#event_time_end").attr('value', $(note).attr('data-time-end'));
			$("#event_edit_panel").attr('data-date', $(note).parent().attr('id'));
			$('#notify').val($(note).attr('data-notify'));
			$(note).attr('data-editedNow', true);
			
			$("#event_edit_panel").fadeIn(250);
			$('#tutorialHighlight').css('display','block');
		}		
		
		if ($(note).attr('class')!=='event') {
			icon.onclick = editNote;
			note_content.onblur = editNote;
		} else {
			icon.onclick = editEventHandler;
		}

		note_icons.appendChild(icon);
		
		var icon = document.createElement('input');
		icon.setAttribute('type', 'text');
		icon.setAttribute('class', 'lolxd');
		icon.setAttribute('title', chrome.i18n.getMessage("voiceInput"));
		icon.setAttribute('x-webkit-speech', 'x-webkit-speech');
		icon.draggable = false;
		icon.onfocus = icon.blur;
		icon.onwebkitspeechchange = function(e) {
			_gaq.push(['_trackEvent', 'VoiceEdit']);
			note_content = $(this.parentNode.parentNode).find(".note_content")[0];
			//console.log(e);
			if (note_content.parentNode.getAttribute('data-content')!='') note_content.parentNode.setAttribute('data-content', note_content.parentNode.getAttribute('data-content') + "<br/>");
			note_content.parentNode.setAttribute('data-content', note_content.parentNode.getAttribute('data-content') + e.results[0].utterance[0].toUpperCase() + e.results[0].utterance.slice(1));
			note_content.innerHTML = note_content.parentNode.getAttribute('data-content');
			this.value = "";
			saveNotes();
		}
		note_icons.appendChild(icon);

		var icon = document.createElement('img');
		icon.setAttribute('src', 'icons/color.png');
		icon.setAttribute('title', chrome.i18n.getMessage("colorChg"));
		icon.draggable = false;

		$(icon).ColorPicker({
			color: note.getAttribute('data-bgcolor'),
			onShow: function (colpkr) {
					this.setAttribute('id', 'COLORPICKERTROLOLOLO');
					this.parentNode.parentNode.setAttribute('data-whileInColorPicker', true);
					$(colpkr).stop(true,true).fadeIn(500);
					return false;
			},
			onHide: function (colpkr) {
				document.getElementById('COLORPICKERTROLOLOLO').parentNode.parentNode.setAttribute('data-whileInColorPicker', false);
				document.getElementById('COLORPICKERTROLOLOLO').parentNode.parentNode.style.backgroundColor=document.getElementById('COLORPICKERTROLOLOLO').parentNode.parentNode.getAttribute('data-bgcolor');
				//document.getElementById('COLORPICKERTROLOLOLO').parentNode.parentNode.style.color=colorFromBgColor(document.getElementById('COLORPICKERTROLOLOLO').parentNode.parentNode.getAttribute('data-bgcolor'));
				document.getElementById('COLORPICKERTROLOLOLO').setAttribute('id', '');
				$(colpkr).stop(true,true).fadeOut(500);
				saveNotes();
				return false;
			},
			onChange: function (hsb, hex, rgb) {
				document.getElementById('COLORPICKERTROLOLOLO').parentNode.parentNode.setAttribute('data-bgcolor', '#'+hex);
				//document.getElementById('COLORPICKERTROLOLOLO').parentNode.parentNode.style.backgroundColor = '#'+hex;
			}
		});

		$(note).attr('data-colorpickerId',$(icon).data('colorpickerId'));
		
		icon.style.marginLeft = '3px';
		note_icons.appendChild(icon);

		var icon = document.createElement('img');
		icon.setAttribute('src', 'icons/close.png');
		icon.setAttribute('title', chrome.i18n.getMessage("deleteTxt"));
		icon.draggable = false;
		icon.style.float = 'right';
		icon.onclick = function() {
			function removeNote() { deleteNote($(this)); showHideHelper();}
			$(this.parentNode.parentNode).attr('data-beingDeleted', true);
			saveNotes();
			$(this.parentNode.parentNode).animate({rotate: '-50deg', scale: 0, height: 0, paddingTop: 0, paddingBottom: 0, marginTop: 0, marginBottom: 0}, {duration:500, complete:removeNote, queue: false});
		}
		note_icons.appendChild(icon);
		
		var icon = document.createElement('img');
		icon.setAttribute('src', 'icons/move.png');
		icon.draggable = true;
		icon.setAttribute('title', chrome.i18n.getMessage("moveText"));
		icon.style.marginLeft = '3px';
		icon.ondragstart = function(e) {
			old = document.getElementById("draggedElement");
			if (old) old.setAttribute("id", "");
			old = document.getElementById("draggedElementClone");
			if (old) $(old).remove();
			this.parentNode.parentNode.setAttribute("id","draggedElement");
			if (!parseInt(this.parentNode.parentNode.getAttribute("data-id"))) {
				this.parentNode.parentNode.setAttribute("data-id",incID());
				saveNotes();
			}
			clone = $(this.parentNode.parentNode).clone();
			clone.css("display", "none");
			clone.appendTo("body");
			clone.attr("id","draggedElementClone");
			e.dataTransfer.setDragImage(this.parentNode.parentNode, $(this.parentNode.parentNode).width, $(this.parentNode.parentNode).height);
			e.dataTransfer.setData("Url","drag://");
		}
		icon.ondragend = showHideHelper;
		icon.onclick = function() {
			var helper = document.createElement('div');
			helper.setAttribute("class", "helperSmall");
			helper = $(helper);
			helper.hide();
			helper.css("width", "auto").css("height", "auto").css("top", $(icon).offset().top+16).css("left", $(icon).offset().left).css("position","absolute");
			helper.html(chrome.i18n.getMessage("noteHelper"));
			helper.appendTo('body');
			helper.fadeIn(500).delay(3000).fadeOut(1000, function() { $(this).remove(); });
		}
		note_icons.appendChild(icon);

		note.appendChild(note_icons);
		if (anim)
			$(note).css('display','block').scale(0).rotate('-70deg').css('margin-bottom','-100%').animate({rotate: 0, scale: 1, marginBottom: 0}, {duration: 500, queue: false});
	}


	function setDayHandlers(element) {
		
		function arrOnDrop(event) {
			//console.log(this.getAttribute('id'));

			$(this).css("background-color", "transparent"); $(this.childNodes).css("opacity", "");
			old = $('[data-draggedOver=true]')[0];
			if (old) { $(old).animate({rotate:'0deg'},100); old.setAttribute('data-draggedOver', 'false'); }
		        var type = event.dataTransfer.getData("Url");
			var text = event.dataTransfer.getData("Text");
			//alert("type: "+type+", text:"+text);
			if ((!text) || (text===type)) text="";
			var note = document.createElement('div');
			if ((type==="note://") || (text)) {
				$(note).addClass('note');
				note.setAttribute('data-content', text);
				note.setAttribute('data-bgcolor', '#5b5b5b');
				note.setAttribute('data-date', this.getAttribute('id'));
			
				fillNote(note);
				//notify('Notatka dodana!');
			} else if (type=="event://") {
				$(note).addClass('event');
				note.setAttribute('data-content', text);
				note.setAttribute('data-bgcolor', '#78c20f');
				note.setAttribute('data-date', this.getAttribute('id'));
				note.setAttribute('data-time', '18:25');
			
				fillNote(note);
			} else if (type=="task://") {
				$(note).addClass('task');
				note.setAttribute('data-content', text);
				note.setAttribute('data-bgcolor', '#82418e');
				note.setAttribute('data-date', this.getAttribute('id'));
				note.setAttribute('data-done', 'false');
				
				fillNote(note);
			}
			else if (type=="drag://") {
				if (document.getElementById('draggedElement')) {
					$("#draggedElement").attr('data-date', this.getAttribute('id'));
					moveAnimate($("#draggedElement"), this, old, saveNotes);
					$("#draggedElementClone").remove();
				}
				else {
					if (old)
						$("#draggedElementClone").insertBefore(old);
					else
						$("#draggedElementClone").appendTo(this);
					note = $("#draggedElementClone");
					id = note.attr('data-id');
					date = note.attr('data-date');
					notes = JSON.parse(localStorage[date]);
					for (var i in notes) {
						if (notes[i]['id']==id) {
							notes.splice(i,1);
						}
					}
					localStorage[date] = JSON.stringify(notes);
					note.attr("id","");
					note.attr('data-date', this.getAttribute('id'));
					note.empty();
					fillNote(note[0]);
				}
				saveNotes();
				return false;
			} else { console.log("arrOnDrop: unknown type"); return false; }
			if (old) 
				this.insertBefore(note,old); 
			else
				this.appendChild(note);
			saveNotes();

		}
		element.ondrop = arrOnDrop;
		
		//
		function arrDragOver() { $(this).css("background-color", "white"); $(this.childNodes).css("opacity", "0.75"); 
					return false; }
		function arrDragLeave() { $(this).css("background-color", "transparent"); $(this.childNodes).css("opacity", "");
								old = $('[data-draggedOver=true]')[0];
					if (old) { $(old).rotate('0deg');; old.setAttribute('data-draggedOver', 'false'); }
		}
		//
		element.ondragover = arrDragOver;
		element.ondragleave = arrDragLeave;
		//
			
	}


function doNav(parent, d, date, i) {
	var nav = document.createElement('nav');
	parent.appendChild(nav);
	var header = document.createElement('div');
	header.setAttribute('class','header');
	nav.setAttribute('data-date', date);

	header.innerHTML = "<h3>"+lang["days"][i]+"</h3>";

	if (d.format("DD-MM-YYYY")===moment().format("DD-MM-YYYY")) { nav.setAttribute('data-currentDay','true'); header.setAttribute('id','current_day'); }
  
	if (d.format("YYYY")!=moment().format("YYYY"))
		header.setAttribute('data-date',((d.format("D") < 10) ? "0"+d.format("D") : d.format("D"))+"."+((d.format("M") < 10) ? "0"+d.format("M") : d.format("M"))+"."+d.format("YY"));
	else
		header.setAttribute('data-date',((d.format("D") < 10) ? "0"+d.format("D") : d.format("D"))+"."+((d.format("M") < 10) ? "0"+d.format("M") : d.format("M")));
	
	nav.appendChild(header);
  
	var content = document.createElement('div');
	content.setAttribute('class', 'day_content');
	content.setAttribute('id', date);
	nav.appendChild(content);
	
	return nav;
}

function nextDayPreview(instant) {
	function p() {
		day = this;
		if ($(this).hasClass('anotherMonth')) return true;
		$(this).stop(false,true);
		//console.log(localStorage['day'+$(day).attr('data-date')]);
		if (localStorage['day'+$(day).attr('data-date')]) {
			notes = JSON.parse(localStorage['day'+$(day).attr('data-date')]);
			var id = $(day).attr('data-previewID');
			//if (id==="NaN") id=0;
			//if (notes[id])
			//d = instant ? 0 : 500;
			if (notes.length>1)
			$(day).find('.previewbox').find('.preview').fadeOut(instant ? 0 : 500, function() { 
				var notes = JSON.parse(localStorage['day'+$(this).parent().parent().attr('data-date')]);
				var id = parseInt($(this).parent().parent().attr('data-previewID'));
				if (notes[id]) {
					c = notes[id]['content'];
					if (c=='') c='&lt;puste&gt;';
					//console.log(id + ' ' + c);
					$(this).html(c).fadeIn(instant ? 0 : 500);
					//p = ($(this).parent().parent().height()-28-$(this).height())/2;
					//if (p<0) p=0;
					//console.log($(this).parent().height() + ' ' + $(this).height() + ' '+p);
					//$(this).css('top', p);
					
				}
				id++;
				if (id>=notes.length) id=0;
				$(this).parent().parent().attr('data-previewID', id);

			}); else if (notes[id]) {
					c = notes[id]['content'];
					$(this).find('.previewbox').find('.preview').html(c);
			}
		}
	}

	days = $('.day').each(p);
	
	return false;
}

function countItems(day, type, arg, val) {
	if (!(localStorage[day])) return 0;
	notes = JSON.parse(localStorage[day]);
	var count = 0;
	for (note in notes) {
		if (!(arg)) {
			if (notes[note]['type']==type) {
				count++;
			}
		} else {
			if ((notes[note]['type']==type) && (notes[note][arg]!=val)) {
				count++;
			}
		}
	}
	return count;
}

function doNavMonth(parent, d, i, month) {
	var nav = document.createElement('nav');
	parent.appendChild(nav);
	var header = document.createElement('div');
	header.setAttribute('class','header');
	//nav.setAttribute('data-date', date); // FIXME: dzień tygodnia

	header.innerHTML = "<h3>"+lang["days"][i]+"</h3>";

	//if (d.format("DD-MM-YYYY")===moment().format("DD-MM-YYYY")) { nav.setAttribute('data-currentDay','true'); header.setAttribute('id','current_day'); }
  
	/*if (d.format("YYYY")!=moment().format("YYYY"))
		header.setAttribute('data-date',((d.format("D") < 10) ? "0"+d.format("D") : d.format("D"))+"."+((d.format("M") < 10) ? "0"+d.format("M") : d.format("M"))+"."+d.format("YY"));
	else
		header.setAttribute('data-date',((d.format("D") < 10) ? "0"+d.format("D") : d.format("D"))+"."+((d.format("M") < 10) ? "0"+d.format("M") : d.format("M")));*/
	
	nav.appendChild(header);
  
	var content = document.createElement('div');
	content.setAttribute('class', 'day_content');
	//content.setAttribute('id', date);
	nav.appendChild(content);
	
	for (j=0; j<6; j++) {
		var day = document.createElement('div');
		day.setAttribute('class', 'day');
		var myd = (d.format("D") < 10) ? "0"+d.format("D") : d.format("D");
		
		var mym = (d.format("M") < 10) ? "0"+d.format("M") : d.format("M");
		
		var myy = d.format("YYYY");
		
		day.innerHTML = "<div class='date'>"+myd+"."+mym+"."+myy+"</div><div class='previewbox'><div class='preview'></div></div><div class='counters'><div class='eventcount' title='Wydarzenia'>"+countItems("day"+myd+"-"+mym+"-"+myy, 'event')+"</div><div class='taskcount' title='Zadania'>"+countItems("day"+myd+"-"+mym+"-"+myy, 'task')+" ("+countItems("day"+myd+"-"+mym+"-"+myy, 'task', 'done', 'true')+")</div><div class='notecount' title='Notatki'>"+countItems("day"+myd+"-"+mym+"-"+myy, 'note')+"</div></div>";
		day.setAttribute('data-date', myd+"-"+mym+"-"+myy);
		day.setAttribute('data-previewID', '0');
		
		
		content.appendChild(day);
		if (d.format("M")!=month) {
			$(day).addClass('anotherMonth');
		}
		if (d.format("D-M-YYYY")==moment().format("D-M-YYYY")) {
			$(day).addClass('today');
		}
		day.onclick = function () { 
					weeks['inner_table_center'] = moment(this.getAttribute('data-date'),'D-M-YYYY');
					weeks['inner_table_month'] = weeks['inner_table_center'];
					alignToMonday();
					toggleView(this, function (a) { $('#day'+a.getAttribute('data-date')).css('box-shadow','inset 0px 0px 50px #1030f0').delay(2000).animate({boxShadow: 'inset 0px 0px 0px #1030f0'},3000); });
			};
		
		d.add("weeks", 1);
	}
	d.subtract("weeks", 6);
	return nav;
}

function fillWeekTable(table) {
	var week = weeks[table.getAttribute('id')];
	for(i = 0; i < lang["days"].length; i++) {
		
		var myd = (week.format("D") < 10) ? "0"+week.format("D") : week.format("D");
		
		var mym = (week.format("M") < 10) ? "0"+week.format("M") : week.format("M");
		
		var myy = week.format("YYYY");
		
		var mydate = "day"+myd+"-"+mym+"-"+myy;
		
		doNav(table, week, mydate, i);
		
		setDayHandlers(document.getElementById(mydate));
		
		week.add("days", 1);
	}
	week.subtract("days", lang["days"].length);
	
}

function fillMonthTable(table) {
	var w = weeks[table.getAttribute('id')];
	var week = moment([parseInt(w.format("YYYY")),parseInt(w.format("M"))-1,1]);
	//console.log(week.format("YYYY-M-D"));
	var month = week.format("M");
	var mdn = week.format("d")-1; // current day of the week
	if (mdn==-1) mdn = 6;
	week.subtract("days", mdn);
	
	for(i = 0; i < lang["days"].length; i++) {
		
		var mym = (week.format("M") < 10) ? "0"+week.format("M") : week.format("M");
		
		var myy = week.format("YYYY");
		
		doNavMonth(table, week, i, month);
		
		//setDayHandlers(document.getElementById(mydate));
		
		week.add("days", 1);
	}
	week.subtract("days", lang["days"].length);

	clearInterval(dayPreviewInterval);
	nextDayPreview(true);
	dayPreviewInterval = setInterval(nextDayPreview, 5000);

}

function fixFirstNote() {
	$(".note").each(function () { $(this).css("margin-top", "10px");	});
	$(".task").each(function () { $(this).css("margin-top", "10px");	});
	$(".event").each(function () { $(this).css("margin-top", "24px");	});
	$("#inner_table_full .day_content > div:first-child").each(function () { 
		if (($(this).attr('data-beingMoved')) || ($(this).attr('data-beingDeleted')))
			$(this).next().css('margin-top', '24px');
		$(this).css('margin-top', '24px');
	});
}

function moveAnimate(element, newParent, old, saveNotes){
	if (old==element[0]) return false;
	if ((element.next().length===0) && (element.parent()[0]===newParent) && (!(old))) return false;
	if ((old) && (element.next()[0]===old)) return false;
	$("body").css('overflow','hidden');
	$(".menu").css("display","none");
	w = element.width()+14;
	h = element.height()+14;
        var oldOffset = element.offset();
        //element.appendTo(newParent);
        var oldElement = element.clone().insertBefore(element);
	oldElement.css('visibility','hidden');
	oldElement.attr('data-beingMoved','true');
	oldElement.animate( {'height': 0, 'paddingTop': 0, 'paddingBottom':0, 'marginTop':0,'marginBottom':0}, 400);
	if (old) 
		element.insertBefore($(old)); 
	else
		element.appendTo(newParent);
	fixFirstNote();
	var newOffset = element.offset();

        var temp = element.clone().appendTo('body');
	if ((element.attr('class')==='task') && (newParent.parentNode.getAttribute('data-currentDay')!=='true')) fix2 = 27; else fix2 = 0; //ugly hack ;/

	temp    .css('position', 'absolute')
                .css('left', oldOffset.left)
                .css('top', oldOffset.top)
                .css('zIndex', 999999).css('width',w).css('height',h-fix2);
	if (old) {
		o=$(old);
		om = o.css('margin-top');
		o.animate({marginTop:h+32}, 200);
	}
	if (element.attr('class')!=='event') fix = 10; else fix = 22; //ugly hack ;/
        element.hide();
	if ((newOffset.left==oldOffset.left) && (newOffset.top>oldOffset.top)) {
		newOffset.top-=h;
		if (fix==22) newOffset.top-=10;
	}
        temp.animate( {'top': parseInt(newOffset.top)-fix, 'left':newOffset.left}, 500, function(){
	   oldElement.remove();
           element.show();
	   if (old) { o.css("margin-top", om); }
           temp.remove();	   
	   $(".menu").css("display", "block");
	   	$("body").css('overflow','visible');
	   saveNotes();
        });
}

	function countNotes(table) {
		var sum=0;
			for ( var column = 0; column < table.childNodes.length; column++ ) {
				//console.log('START: ' +table.childNodes[column]);
				//console.log(' --- ' + table.childNodes[column].getAttribute('data-date'));
				col = document.getElementById(table.childNodes[column].getAttribute('data-date')).childNodes;
				
				//var column = document.getElementById('day'+(i+1)).childNodes;
				var note_count = 0;
				var notes = new Array();
				sum += col.length;
					//console.log('storing note: '+col[j].getAttribute("data-content"));
			}	
		return sum;
	}

	function showHideHelper(anim) {
		anim = typeof(anim) != 'undefined' ? anim : true;
		$("#helper").stop(false, true);
		if (($('body').attr('data-view')=='month') || (countNotes(document.getElementById('inner_table_center')))) {
			if (anim) {
				$("#helper").fadeOut(500);
			} else { $("#helper").hide(); }
		} else {
			$("#helper").fadeIn(500);
		}
	}
	
	function slide() {
		if ($("body").attr('class')=='dark') $("body").removeClass("dark"); else $("body").addClass("dark");
		showHideHelper();
	}
	
	function removeTable(table, empty) {
		var notes=table.children().children(".day_content").children();
		//console.log(notes);
		for (i=0; i<notes.length; i++) {
			//console.log(notes[i]);
			$("#"+$(notes[i]).attr('data-colorpickerId')).remove();
		}
		if (empty) table.empty(); else
		table.remove();
	}

	function right_slide() {
		if ($('body').attr('data-view')=='month') {
			d = moment(weeks['inner_table_center'].format('D-M-YYYY'), 'D-M-YYYY');
			d.add("months", 1);
			return slideToMonth(d); }
		//alert("Prawa szczałka!");		
		saveTable(document.getElementById("inner_table_left"));

		removeTable($("#inner_table_left"));
		$("#inner_table_center").attr('id','inner_table_left');
		$("#inner_table_right").attr('id','inner_table_center');

		table = document.createElement('div');
		$(table).attr('id','inner_table_right');
		$(table).insertAfter("#inner_table_center");
		
		weeks['inner_table_left'].add("days", 7);
		weeks['inner_table_center'].add("days", 7);
		weeks['inner_table_right'].add("days",7);
				
		/*console.log(weeks['inner_table_left'].format("DD-MM-YYYY"));
		console.log(weeks['inner_table_center'].format("DD-MM-YYYY"));
		console.log(weeks['inner_table_right'].format("DD-MM-YYYY"));
		console.log('---------------------------');*/
		
		fillWeekTable(table);
		loadTable(table);
		slide();
	}
		
	function left_slide() {
		if ($('body').attr('data-view')=='month') {
			d = moment(weeks['inner_table_center'].format('D-M-YYYY'), 'D-M-YYYY');
			d.subtract("months", 1);
			return slideToMonth(d); }
		//alert("Lewa szczałka!");		
		saveTable(document.getElementById("inner_table_right"));
		
		removeTable($("#inner_table_right"));
		$("#inner_table_center").attr('id','inner_table_right');
		$("#inner_table_left").attr('id','inner_table_center');

		table = document.createElement('div');
		$(table).attr('id','inner_table_left');
		$(table).insertBefore("#inner_table_center");  
				
		weeks['inner_table_right'].subtract("days", 7);
		weeks['inner_table_center'].subtract("days", 7);
		weeks['inner_table_left'].subtract("days", 7);
		
		/*console.log(weeks['inner_table_left'].format("DD-MM-YYYY"));
		console.log(weeks['inner_table_center'].format("DD-MM-YYYY"));
		console.log(weeks['inner_table_right'].format("DD-MM-YYYY"));
		console.log('---------------------------');*/
		
		fillWeekTable(table);
		loadTable(table);
		slide();
	}


function notify(text) {
	// Create a simple text notification:
	var notification = webkitNotifications.createNotification(
	    'icons/icon48.png',  // icon url - can be relative
	    lang["notify_txt"],  // notification title
	    text  // notification body text
	);

	// Or create an HTML notification:
	//var notification = webkitNotifications.createHTMLNotification(
	//  'notification.html'  // html url - can be relative
	//);

	// Then show the notification.
	notification.show(); 
}

	
$(document).ready(function() {
  
	document.getElementById('event_desc_txt').setAttribute('placeholder', chrome.i18n.getMessage("event_descr"));
	document.getElementById('form_start_time').innerHTML=chrome.i18n.getMessage("start_time");
	document.getElementById('form_end_time').innerHTML=chrome.i18n.getMessage("end_time");
	document.getElementById('form_remind').innerHTML=chrome.i18n.getMessage("remind");
	document.getElementById('form_never').innerHTML=chrome.i18n.getMessage("never");
	document.getElementById('form_5min').innerHTML=chrome.i18n.getMessage("5min");
	document.getElementById('form_10min').innerHTML=chrome.i18n.getMessage("10min");
	document.getElementById('form_30min').innerHTML=chrome.i18n.getMessage("30min");
	document.getElementById('form_1hour').innerHTML=chrome.i18n.getMessage("1hour");
	document.getElementById('cancel').setAttribute('value',chrome.i18n.getMessage("cancel"));
	document.getElementById('editt').setAttribute('value',chrome.i18n.getMessage("zastosuj"));
	document.getElementById('view_btn').setAttribute('alt', chrome.i18n.getMessage("icon1"));
	document.getElementById('conf_btn').setAttribute('alt', chrome.i18n.getMessage("icon2"));
	document.getElementById('help_btn').setAttribute('alt', chrome.i18n.getMessage("icon3"));
	document.getElementById('choose_date').setAttribute('title', chrome.i18n.getMessage("choose_date"));
	document.getElementById('jump_to_today').setAttribute('title', chrome.i18n.getMessage("jump_to_today"));
	$('<div id="helper" class="helper"></div>').appendTo('body');
	$('<div id="tutorialHighlight"><div class="hack"></div></div>').appendTo('body');  
  
	$("#event_icon").text(lang["ntypes"][0]);
	$("#task_icon").text(lang["ntypes"][1]);
	$("#note_icon").text(lang["ntypes"][2]);
	
	$("#view_btn").text(lang["icons"][0]);
	$("#view_btn").attr("alt", lang["icons"][0]);
	$("#conf_btn").text(lang["icons"][1]);
	$("#conf_btn").attr("alt", lang["icons"][1]);
	$("#help_btn").text(lang["icons"][2]);
	$("#help_btn").attr("alt", lang["icons"][2]);
	
	$("#event_edit_form").submit(function() { editMyEvent(); return false; });
	$("#cancel").click(function() { $('[data-editedNow=true]').attr('data-editedNow', 'false');$('#event_edit_panel').fadeOut(500); if (!document.getElementById('tutorial')) $('#tutorialHighlight').css('display','none'); });
	
	$("#helper").text(lang["helper_txt"]);
	
	//notify("Yay!");

	function colorFromBgColor(color) {
		r=parseInt(color.substring(1,3),16);
		g=parseInt(color.substring(3,5),16);
		b=parseInt(color.substring(5,7),16);
		if (((r+b+g)/3)>85) return "#333333"; else return "#ffffff";
	}

	window.onresize = resizeDays;
			
	function keydown(e) {
		if ($("[data-editedNow=true]")[0]) return false;
		if ($("[data-nyan=nyan]")[0]) return false;
		if ($("#contactForm")[0]) return false;

		if(event.which == 39) right_slide(); // prawa szczałka
		else if (event.which == 37) left_slide(); // lewa szczałka
		else if (event.which == 40) slideTo(moment()); // dolna szczałka
		else if (event.which == 08) { // bekspejs
			var regRule = /(input)|(textarea)/i;
			var lol = (regRule.test(event.target)) ? true : false;
			if (!lol) { event.preventDefault(); undeleteNote(); }
		}
	}
		
	document.addEventListener("keydown", keydown, false);
	$("#left_arrow").click(left_slide)[0].ondragenter=left_slide;
	$("#right_arrow").click(right_slide)[0].ondragenter=right_slide;
			
	function dragInfo() {
			var helper = document.createElement('div');
			helper.setAttribute("class", "helperSmall");
			helper = $(helper);
			helper.hide();
			helper.css("width", "auto").css("height", "auto").css("top", $("#add_panel").offset().top+45).css("left", $("#add_panel").offset().left-30).css("z-index",100).css("position","absolute");
			helper.html(chrome.i18n.getMessage("crtHelper"));
			helper.appendTo('body');
			helper.fadeIn(500).delay(5000).fadeOut(1000, function() { $(this).remove(); } );
	}
	
	document.getElementById("note_icon").ondragstart = function(e) {
		e.dataTransfer.setData("Url","note://");
		$(this).css("transform","scale(0.9) translate(-7px, -3px)");
		$("#helper").fadeOut(500);
	}
	document.getElementById("event_icon").ondragstart = function(e) {
		e.dataTransfer.setData("Url","event://");
		$(this).css("transform","scale(0.9) translate(7px, -3px)");
		$("#helper").fadeOut(500);
	}
	document.getElementById("task_icon").ondragstart = function(e) {
		e.dataTransfer.setData("Url","task://");
		$(this).css("transform","scale(0.9) translate(0px, -3px)");
		$("#helper").fadeOut(500);
	}
	document.getElementById("note_icon").ondragend = function(e) {
		$(this).css("transform","none");
		showHideHelper();
	}
	document.getElementById("event_icon").ondragend = function(e) {
		$(this).css("transform","none");
		showHideHelper();
	}
	document.getElementById("task_icon").ondragend = function(e) {
		$(this).css("transform","none");
		showHideHelper();
	}
	document.getElementById("note_icon").onclick = dragInfo;
	document.getElementById("event_icon").onclick = dragInfo;
	document.getElementById("task_icon").onclick = dragInfo;
	
	/* 
		Środkowa tabela - aktualny tydzień
	*/
	
	var d = moment();        // current day
	var week_last = moment().add("days", -7);   // last week
	var week_next = moment().add("days", 7);     // next week
					
	weeks['inner_table_left'] = week_last;
	weeks['inner_table_center'] = d;
	weeks['inner_table_right'] = week_next;
	weeks['inner_table_month'] = weeks['inner_table_center'];

	alignToMonday();
	
	fillWeekTable(document.getElementById('inner_table_left'));
	fillWeekTable(document.getElementById('inner_table_center'));
	fillWeekTable(document.getElementById('inner_table_right'));

	$('#inner_table_full').show();
	$('#inner_table_month').hide();
	$('body').attr('data-view','week');
	//setTimeout(function () { 	$('#inner_table_full').fadeIn(2000); }, 5000);
			
	$("#view_btn").click(toggleView);
	$("#conf_btn").click(confScreen);
	$("#help_btn").click(helpScreen);

	$("#info_panel div .week").DatePicker({
	date: weeks['inner_table_center'].format('YYYY-MM-DD'),
	current: moment().format('YYYY-MM-DD'),
	starts: 1,
	position: 'b',
	onBeforeShow: function(){
		_gaq.push(['_trackEvent', 'DatePicker']);
		$('#info_panel div .week').DatePickerSetDate(weeks['inner_table_center'].format('YYYY-MM-DD'), true);
	},
	onChange: function(formated, dates){
		slideTo(moment(formated, "YYYY-MM-DD"));
		//$('#info_panel div').DatePickerHide();
	}
	});
	$("#info_panel div .today").click(function () { _gaq.push(['_trackEvent', 'SlideToTodayButton']); slideTo(moment()); });
	
	if (!localStorage['firstRunBubbleHidden']) {
		var helper = document.createElement('div');
		helper.id = 'helperTutorialFirstRun';
		helper.setAttribute("class", "helper");
		helper = $(helper);
		helper.css("width", "300px").css("height", "auto").css("top", $('#help_btn').offset().top+25).css("left", $('#help_btn').offset().left-250).css("transform","none").css("position","absolute");
		helper.html(chrome.i18n.getMessage("start_tutorial"));
		helper.appendTo('body');
		helper.show();
		helper[0].onmouseover = function () { $(this).fadeOut(500, function() { $(this).remove(); localStorage['firstRunBubbleHidden']=true; }); };
	}
	
	// font fix for Windows
	if (navigator.userAgent.indexOf("Windows") != -1) {
		var fileref=document.createElement("link")
		fileref.setAttribute("rel", "stylesheet")
		fileref.setAttribute("type", "text/css")
		fileref.setAttribute("href", "css/windows.css")
		$(fileref).appendTo($("head"));
	}
	// fix end
		
	setInterval(checkCurDay, 30000);
	resizeDays();
	loadNotes();
	showHideHelper(false);
	
});

function loadUIColor() {
	if (!localStorage['color']) {
		localStorage['color']='blue';
	}
	//var fileref=document.createElement("link")
	var fileref = document.getElementById('uicolorscss');
	//fileref.setAttribute("rel", "stylesheet")
	//fileref.setAttribute("type", "text/css")
	fileref.setAttribute("href", "css/colors/"+localStorage['color']+".css")
	$(fileref).appendTo($("head"));
}
loadUIColor();
