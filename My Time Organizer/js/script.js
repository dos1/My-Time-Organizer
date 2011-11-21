/* [?] My Time Organizer @ Google Apps Hackathon 12.11.2011 (11/12/2011)
 * [+] Authors: 
 * - Dominik Galewski (mug3tsu)
 * - Sebastian Krzyszkowiak (dos)
 * - Krzysztof Marciniak (hun7er)
 * [!] [alphabetical order]
 */

lang = new Array();
lang["en"] = new Array();
lang["pl"] = new Array();

var mylang ="pl";
		
/* English */
lang["en"]["days"] = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
lang["en"]["notify_txt"] = "Event notification";
/* Polish */
lang["pl"]["days"] = ["Poniedziałek", "Wtorek", "Środa", "Czwartek", "Piątek", "Sobota", "Niedziela"];
lang["pl"]["notify_txt"] = "Przypomnienie o wydarzeniu";

var weeks = {};

function nyanNyan() {
	function nyanNyanNyan() {
		$('.header h3, #add_panel div, #info_panel, footer').each(function () { this.setAttribute('data-nyan', this.innerHTML); } );
		$('.header h3, #add_panel div').each(function() { this.innerHTML = 'Nyan'; } );
		$('#info_panel, #task_icon').html('Nyan-nyan');
		$('footer').html('&copy; Nyanyan Nyan-Nyan Nyan NYAN Nyan, Nyan \'Nyan\' Nyan, Nyan ny4n Nyan');
	}
	function nyanNyanNyanNyan() {
		$('.header h3, #add_panel div, #info_panel, footer').each(function () { if (this.innerHTML.indexOf('Nyan')!=-1) this.innerHTML = this.getAttribute('data-nyan'); } );		
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

	function updateWeek() {
		$("#info_panel").html("Tydzień "+weeks['inner_table_center'].format("w")+", "+weeks['inner_table_center'].format("YYYY"));
	}
	
	function toToday() {
		diff = moment().diff(weeks['inner_table_center'], 'weeks');
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
						notes[note_count]['type'] = col[j].getAttribute("class");
						//notes[note_count]['date'] = col[j].getAttribute("data-date");
						notes[note_count]['content'] = col[j].getAttribute("data-content");
						notes[note_count]['bgcolor'] = col[j].getAttribute("data-bgcolor");
						notes[note_count]['time'] = col[j].getAttribute("data-time");
						notes[note_count]['done'] = col[j].getAttribute("data-done");
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
				//note.setAttribute('data-date', column[j]['date']);
				note.setAttribute('data-content', column[j]['content']);
				note.setAttribute('data-bgcolor', column[j]['bgcolor']);
				note.setAttribute('data-done', column[j]['done']);
				note.setAttribute('data-time', column[j]['time']);
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


	function fillNote(note, anim) {
		
		anim = typeof(anim) != 'undefined' ? anim : true;
		
		$("#helper").css("display","none");
		
		note.ondragover = function() {
			old = $('[data-draggedOver=true]')[0];
			if ((old!=note) && (old)) { $(old).rotate('0deg'); old.setAttribute('data-draggedOver', 'false'); }
			$(note).rotate('2deg');
			note.setAttribute('data-draggedOver', 'true');
		}
		
		$(note).css('backgroundColor', note.getAttribute('data-bgcolor'));

		if ($(note).attr('class')==='event') {
			var note_time = document.createElement('div');
			$(note_time).addClass('note_time');
			note_time.innerHTML = $(note).attr('data-time');;
			note_time.contentEditable = false;
			note.appendChild(note_time);
		}
		
		var note_content = document.createElement('div');
		$(note_content).addClass('note_content');
		if (note.getAttribute('data-content')==='') {
			if (note.getAttribute('class')==='note')
				note_content.innerHTML = 'Kliknij ikonę ołówka, aby edytować tę notatkę, lub krzyżyk, aby ją usunąć.';
			else if (note.getAttribute('class')==='task')
				note_content.innerHTML = 'Kliknij ikonę ołówka, aby edytować to zadanie, lub krzyżyk, aby je usunąć.';
			else if (note.getAttribute('class')==='event')
				note_content.innerHTML = 'Kliknij ikonę ołówka, aby edytować to wydarzenie, lub krzyżyk, aby je usunąć.';
		}
		else note_content.innerHTML = note.getAttribute('data-content');
		note_content.contentEditable = false;
		note.appendChild(note_content);

		var note_icons = document.createElement('div');
		$(note_icons).addClass('menu');

		var icon = document.createElement('img');
		icon.setAttribute('src', 'icons/write.png');
		icon.setAttribute('title', 'Edycja');
		icon.draggable = false;
		icon.onfocus = icon.blur;
		icon.onclick = function() {
			note_content = $(this.parentNode.parentNode).find(".note_content")[0];
			if (note_content.isContentEditable) {
				note_content.parentNode.setAttribute('data-content', note_content.innerHTML);
				note_content.contentEditable = false;
				if ($(this.parentNode.parentNode).attr('class')=='event') {
					console.log($(this.parentNode.parentNode).attr('class'));
					$(this.parentNode.parentNode).find(".note_time")[0].contentEditable = false;
					note_content.parentNode.setAttribute('data-time', $(this.parentNode.parentNode).find(".note_time")[0].innerHTML);
				}
				if ((note_content.innerHTML.toLowerCase()==='nyan') || (note_content.innerHTML.toLowerCase()==='nyan nyan')) nyanNyan();
				saveNotes();
			} else {
				note_content.innerHTML = note_content.parentNode.getAttribute('data-content');
				note_content.contentEditable = true;
				if ($(this.parentNode.parentNode).attr('class')=='event') {
					$(this.parentNode.parentNode).find(".note_time")[0].innerHTML = note_content.parentNode.getAttribute('data-time');
					$(this.parentNode.parentNode).find(".note_time")[0].contentEditable = true;
				}
				note_content.focus();
			}
			note_content.parentNode.setAttribute('data-editedNow', note_content.isContentEditable);
		}

		note_icons.appendChild(icon);
		
		var icon = document.createElement('input');
		icon.setAttribute('type', 'text');
		icon.setAttribute('class', 'lolxd');
		icon.setAttribute('title', 'Rozpoznawanie mowy');
		icon.setAttribute('x-webkit-speech', 'x-webkit-speech');
		icon.draggable = false;
		icon.onfocus = icon.blur;
		icon.onwebkitspeechchange = function(e) {
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
		icon.setAttribute('title', 'Zmień kolor');
		icon.draggable = false;

		$(icon).ColorPicker({
			color: note.getAttribute('data-bgcolor'),
			onShow: function (colpkr) {
					this.setAttribute('id', 'COLORPICKERTROLOLOLO');
					this.parentNode.parentNode.setAttribute('data-whileInColorPicker', true);
					$(colpkr).fadeIn(500);
					return false;
			},
			onHide: function (colpkr) {
				document.getElementById('COLORPICKERTROLOLOLO').parentNode.parentNode.setAttribute('data-whileInColorPicker', false);
				document.getElementById('COLORPICKERTROLOLOLO').parentNode.parentNode.style.backgroundColor=document.getElementById('COLORPICKERTROLOLOLO').parentNode.parentNode.getAttribute('data-bgcolor');
				//document.getElementById('COLORPICKERTROLOLOLO').parentNode.parentNode.style.color=colorFromBgColor(document.getElementById('COLORPICKERTROLOLOLO').parentNode.parentNode.getAttribute('data-bgcolor'));
				document.getElementById('COLORPICKERTROLOLOLO').setAttribute('id', '');
				$(colpkr).hide();
				saveNotes();
				return false;
			},
			onChange: function (hsb, hex, rgb) {
				document.getElementById('COLORPICKERTROLOLOLO').parentNode.parentNode.setAttribute('data-bgcolor', '#'+hex);
				//document.getElementById('COLORPICKERTROLOLOLO').parentNode.parentNode.style.backgroundColor = '#'+hex;
			}
		});

		icon.style.marginLeft = '6px';
		note_icons.appendChild(icon);

		var icon = document.createElement('img');
		icon.setAttribute('src', 'icons/close.png');
		icon.setAttribute('title', 'Usuń');
		icon.draggable = false;
		icon.style.float = 'right';
		icon.onclick = function() {
			function removeNote() { this.parentNode.removeChild(this); }
			$(this.parentNode.parentNode).attr('data-beingDeleted', true);
			saveNotes();
			$(this.parentNode.parentNode).animate({rotate: '-50deg', scale: 0, height: 0, paddingTop: 0, paddingBottom: 0, marginTop: 0, marginBottom: 0}, 500, removeNote);
		}
		note_icons.appendChild(icon);
		
		var icon = document.createElement('img');
		icon.setAttribute('src', 'icons/move.png');
		icon.draggable = true;
		icon.setAttribute('title', 'Przenieś');
		icon.style.marginLeft = '6px';
		icon.ondragstart = function(e) {
			old = document.getElementById("draggedElement");
			if (old) old.setAttribute("id", "");
			this.parentNode.parentNode.setAttribute("id","draggedElement");
			e.dataTransfer.setDragImage(this.parentNode.parentNode, $(this.parentNode.parentNode).width, $(this.parentNode.parentNode).height);
			e.dataTransfer.setData("Url","drag://");
		}
		icon.onclick = function() {
			var helper = document.createElement('div');
			helper.setAttribute("class", "helperSmall");
			helper = $(helper);
			helper.hide();
			helper.css("width", "auto").css("height", "auto").css("top", $(icon).offset().top+16).css("left", $(icon).offset().left).css("position","absolute");
			helper.html("Aby przenieść notatkę, przeciągnij ikonkę i upuść ją na wybrane miejsce.");
			helper.appendTo('body');
			helper.fadeIn(500).delay(3000).fadeOut(1000);
		}
		note_icons.appendChild(icon);

		note.appendChild(note_icons);
		if (anim)
			$(note).scale(0).rotate('-70deg').css('margin-bottom','-100%').animate({rotate: 0, scale: 1, marginBottom: 0}, 500);
	}


	function setDayHandlers(element) {
		
		function arrOnDrop(event) {
			//console.log(this.getAttribute('id'));

			$(this).css("background-color", "transparent"); $(this.childNodes).css("opacity", "1");
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
				//note.setAttribute('data-date', this.getAttribute('id'));
			
				fillNote(note);
				//notify('Notatka dodana!');
			} else if (type=="event://") {
				$(note).addClass('event');
				note.setAttribute('data-content', text);
				note.setAttribute('data-bgcolor', '#78c20f');
				//note.setAttribute('data-date', this.getAttribute('id'));
				note.setAttribute('data-time', '18:25');
			
				fillNote(note);
			} else if (type=="task://") {
				$(note).addClass('task');
				note.setAttribute('data-content', text);
				note.setAttribute('data-bgcolor', '#82418e');
				//note.setAttribute('data-date', this.getAttribute('id'));
				note.setAttribute('data-done', 'false');
				
				fillNote(note);
			}
			else if (type=="drag://") {
				moveAnimate($("#draggedElement"), this, old, saveNotes);
				saveNotes();
				return false;
			}
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
		function arrDragLeave() { $(this).css("background-color", "transparent"); $(this.childNodes).css("opacity", "1"); 
								old = $('[data-draggedOver=true]')[0];
					if (old) { $(old).rotate('0deg');; old.setAttribute('data-draggedOver', 'false'); }
		}
		//
		element.ondragover = arrDragOver;
		element.ondragleave = arrDragLeave;
		//
			
	}


function doNav(parent, d, date) {
	var nav = document.createElement('nav');
	parent.appendChild(nav);
	var header = document.createElement('div');
	header.setAttribute('class','header');
	nav.setAttribute('data-date', date);

	header.innerHTML = "<h3>"+lang[mylang]["days"][i]+"</h3>";

	if (d.format("DD-MM-YYYY")===moment().format("DD-MM-YYYY")) header.setAttribute('id','current_day');
  
	if (d.format("YYYY")!=moment().format("YYYY"))
		header.setAttribute('data-date',d.format("D")+"."+d.format("M")+"."+d.format("YY"));
	else
		header.setAttribute('data-date',d.format("D")+"."+d.format("M"));
	
	nav.appendChild(header);
  
	var content = document.createElement('div');
	content.setAttribute('class', 'day_content');
	content.setAttribute('id', date);
	nav.appendChild(content);
	
	return nav;
}

function fillWeekTable(table) {
	var week = weeks[table.getAttribute('id')];
	for(i = 0; i < lang[mylang]["days"].length; i++) {
		
		var myd = (week.format("D") < 10) ? "0"+week.format("D") : week.format("D");
		
		var mym = (week.format("M") < 10) ? "0"+week.format("M") : week.format("M");
		
		var myy = week.format("YYYY");
		
		var mydate = "day"+myd+"-"+mym+"-"+myy;

		doNav(table, week, mydate); // TODO: detect current day
		
		setDayHandlers(document.getElementById(mydate));
		
		week.add("days", 1);
	}
	week.subtract("days", lang[mylang]["days"].length);
	
}

function fixFirstNote() {
	$(".note").each(function () { $(this).css("margin-top", "10px");	});
	$(".task").each(function () { $(this).css("margin-top", "10px");	});
	$(".event").each(function () { $(this).css("margin-top", "24px");	});
	$(".day_content > div:first-child").each(function () { 
		if (($(this).attr('data-beingMoved')) || ($(this).attr('data-beingDeleted')))
			$(this).next().css('margin-top', '24px');
		$(this).css('margin-top', '24px');
	});
}

function moveAnimate(element, newParent, old, saveNotes){
	if (old==element[0]) return false;
	if ((element.next().length===0) && (element.parent()[0]===newParent) && (!(old))) return false;
	if ((old) && (element.next()[0]===old)) return false;
	$(".menu").css("display","none");
	w = element.width()+14;
	h = element.height()+14;
        var oldOffset = element.offset();
        //element.appendTo(newParent);
        var oldElement = element.clone().insertBefore(element);
	oldElement.css('visibility','hidden');
	oldElement.attr('data-beingMoved','true');
	oldElement.animate( {'height': 0, 'paddingTop': 0, 'paddingBottom':0, 'marginTop':0,'marginBottom':0}, 400, function() { oldElement.remove(); saveNotes(); });
	if (old) 
		element.insertBefore($(old)); 
	else
		element.appendTo(newParent);
	fixFirstNote();
	var newOffset = element.offset();

        var temp = element.clone().appendTo('body');
        temp    .css('position', 'absolute')
                .css('left', oldOffset.left)
                .css('top', oldOffset.top)
                .css('zIndex', 1000).css('width',w).css('height',h);
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
           element.show();
	   if (old) { o.css("margin-top", om); }
           temp.remove();	   
	   $(".menu").css("display", "block");
        });
}

	function right_slide() {
		//alert("Prawa szczałka!");
		if ($("[data-editedNow=true]")[0]) return false;
		if ($("[data-nyan=nyan]")[0]) return false;

		$("#inner_table_left").remove();
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
		
		if ($("body").attr('class')=='dark') $("body").removeClass("dark"); else $("body").addClass("dark");
	}
		
	function left_slide() {
		//alert("Lewa szczałka!");		
		if ($("[data-editedNow=true]")[0]) return false;
		if ($("[data-nyan=nyan]")[0]) return false;

		$("#inner_table_right").remove();
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
		
		if ($("body").attr('class')=='dark') $("body").removeClass("dark"); else $("body").addClass("dark");
	}


function notify(text) {
	// Create a simple text notification:
	var notification = webkitNotifications.createNotification(
	    'icons/icon48.png',  // icon url - can be relative
	    lang[mylang]["notify_txt"],  // notification title
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
	//notify("Yay!");

	function colorFromBgColor(color) {
		r=parseInt(color.substring(1,3),16);
		g=parseInt(color.substring(3,5),16);
		b=parseInt(color.substring(5,7),16);
		if (((r+b+g)/3)>85) return "#333333"; else return "#ffffff";
	}

	function resizeDays() {
		$(".day_content").css("height",$("nav").height()-16);
	}

	window.onresize = resizeDays;
			
	function keydown(e) {
		if(event.which == 39) right_slide(); // prawa szczałka
		else if (event.which == 37) left_slide(); // lewa szczałka
		else if (event.which == 40) toToday(); // dolna szczałka
	}
		
	document.addEventListener("keydown", keydown, false);
			
	function dragInfo() {
			var helper = document.createElement('div');
			helper.setAttribute("class", "helperSmall");
			helper = $(helper);
			helper.hide();
			helper.css("width", "auto").css("height", "auto").css("top", $("#add_panel").offset().top+45).css("left", $("#add_panel").offset().left-30).css("z-index",100).css("position","absolute");
			helper.html("Aby utworzyć nowy element, przeciągnij jeden z przycisków powyżej na kolumnę wybranego dnia.");
			helper.appendTo('body');
			helper.fadeIn(500).delay(5000).fadeOut(1000);
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
	}
	document.getElementById("event_icon").ondragend = function(e) {
		$(this).css("transform","none");
	}
	document.getElementById("task_icon").ondragend = function(e) {
		$(this).css("transform","none");
	}
	document.getElementById("note_icon").onclick = dragInfo;
	document.getElementById("event_icon").onclick = dragInfo;
	document.getElementById("task_icon").onclick = dragInfo;
	
	/* 
		Środkowa tabela - aktualny tydzień
	*/
	
	var now = moment();
	var mdn = now.format("d")-1; // current day of the week
	if (mdn==-1) mdn = 6;
	var d = now.add("days", (-1)*mdn);        // current day
	var week_last = moment().add("days", -(7+mdn));   // last week
	var week_next = moment().add("days", 7-mdn);     // next week
					
	weeks['inner_table_left'] = week_last;
	weeks['inner_table_center'] = d;
	weeks['inner_table_right'] = week_next;

	fillWeekTable(document.getElementById('inner_table_left'));
	fillWeekTable(document.getElementById('inner_table_center'));
	fillWeekTable(document.getElementById('inner_table_right'));
	
	resizeDays();
	loadNotes();
});
