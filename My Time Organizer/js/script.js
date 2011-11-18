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

function moveAnimate(element, newParent, old){
	if (old==element[0]) return false;
	$(".menu").css("display","none");
	w = element.width()+14;
	h = element.height()+14;
        var oldOffset = element.offset();
        //element.appendTo(newParent);
        var oldElement = element.clone().insertBefore(element);
	oldElement.css('visibility','hidden');
	oldElement.animate( {'height': 0, 'paddingTop': 0, 'paddingBottom':0, 'marginTop':0,'marginBottom':0}, 500, function() { oldElement.remove(); });
	if (old) 
		element.insertBefore($(old)); 
	else
		element.appendTo(newParent);
	var newOffset = element.offset();

        var temp = element.clone().appendTo('body');
        temp    .css('position', 'absolute')
                .css('left', oldOffset.left)
                .css('top', oldOffset.top)
                .css('zIndex', 1000).css('width',w).css('height',h);
	if (old) {
		o=$(old);
		o.animate({marginTop:h+32}, 200);
	}
        element.hide();
        temp.animate( {'top': newOffset.top-20, 'left':newOffset.left}, 500, function(){
           element.show();
	   if (o) { o.css("margin-top", 20); }
           temp.remove();
	   $(".menu").css("display", "block");
        });
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
		$(".day_content").css("height",$("nav").height()-38);
	}

	window.onresize = resizeDays;

	function fillNote(note) {
		
		$("#helper").css("display","none");
		
		//$(note).addClass('note');

		note.ondragover = function() {
			old = $('[data-draggedOver=true]')[0];
			if ((old!=note) && (old)) { $(old).rotate('0deg'); old.setAttribute('data-draggedOver', 'false'); }
			$(note).rotate('2deg');
			note.setAttribute('data-draggedOver', 'true');
		}
		
		$(note).css('backgroundColor', note.getAttribute('data-bgcolor'));

		var note_content = document.createElement('div');
		$(note_content).addClass('note_content');
		if (note.getAttribute('data-content')==='')
			note_content.innerHTML = 'Kliknij ikonę ołówka, aby edytować tę notatkę, lub krzyżyk, aby ją usunąć.';
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
			note_content = this.parentNode.parentNode.childNodes[0];
			if (note_content.isContentEditable) {
				note_content.parentNode.setAttribute('data-content', note_content.innerHTML);
				note_content.contentEditable = false;
				saveNotes();
			} else {
				note_content.innerHTML = note_content.parentNode.getAttribute('data-content');
				note_content.contentEditable = true;
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
			note_content = this.parentNode.parentNode.childNodes[0];
			//console.log(e);
			note_content.innerHTML = e.results[0].utterance[0].toUpperCase() + e.results[0].utterance.slice(1);
			//icon.value = "";
			note_content.parentNode.setAttribute('data-content', note_content.innerHTML);
			note_content.focus();
			saveNotes();
		}
			/*if (note_content.isContentEditable) {
				note_content.parentNode.setAttribute('data-content', note_content.innerHTML);
				note_content.contentEditable = false;
				saveNotes();
			} else {
				note_content.innerHTML = note_content.parentNode.getAttribute('data-content');
				note_content.contentEditable = true;
				note_content.focus();
			}
			note_content.parentNode.setAttribute('data-editedNow', note_content.isContentEditable);
		}*/
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
			function removeNote() { this.parentNode.removeChild(this); saveNotes(); }
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
		$(note).scale(0).rotate('-70deg').css('margin-bottom','-100%').animate({rotate: 0, scale: 1, marginBottom: 0}, 500);
	}
	
	function right_slide() {
	//alert("Prawa szczałka!");
	 $("nav").css("box-shadow", "none");

		if ($("[data-editedNow=true]")[0]) return false;
		if ($("#inner_table_center").css("transform") !== "translate(100%, 0px)") {
			$("#inner_table_center").css("transform", "translate(-100%, 0px)");
			$("#inner_table_right").css("transform", "translate(-100%, 0px)");
			
			$("body").removeClass("dark");
			//
		}
		if ($("#inner_table_left").css("transform") !== "translate(-100%, 0px)") {    
			$("#inner_table_left").css("transform", "translate(0px, 0px)");
			$("body").addClass("dark");
		}
		if ($("#inner_table_center").css("transform") === "translate(100%, 0px)") {
			$("#inner_table_center").css("transform", "");
			$("body").removeClass("dark");
		}
	}
		
	function left_slide() {
			 $("nav").css("box-shadow", "none");
		//alert("Lewa szczałka!");
		if ($("[data-editedNow=true]")[0]) return false;
		if ($("#inner_table_center").css("transform") !== "translate(-100%, 0px)") {
			$("#inner_table_center").css("transform", "translate(100%, 0px)");
			$("#inner_table_left").css("transform", "translate(100%, 0px)");
			$("body").removeClass("dark");
			
		}
		// z tym aktualnie jest problem (i nie mam pojęcia czemu). Dokładniej to w ogóle nie wyświetla się tablica prawa.
		if($("#inner_table_right").css("transform") !== "translate(100%, 0px)") {
			$("#inner_table_right").css("transform", "translate(0px, 0px)");
			$("body").addClass("dark");	
		}
		//
		if ($("#inner_table_center").css("transform") === "translate(-100%, 0px)") {
			$("#inner_table_center").css("transform", "");
			$("body").removeClass("dark");
			
		}
	}
		
	function keydown(e) {
		if(event.which == 39) right_slide(); // prawa szczałka
		else if (event.which == 37) left_slide(); // lewa szczałka
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
	//alert(day);
	var d = now.add("days", (-1)*mdn);        // current day
	var week_last = moment().add("days", -(7+mdn));   // last week
	var week_next = moment().add("days", 7-mdn);     // next week
		
	
	
	
	/*
	
	for(i = 0; i < 7; i++) {
		arr1[i] = 'day'+(i+1); // wypieprzyć bo 3 razy się id powtarza
		arr2[i] = document.getElementById(arr1[i]);
		arr2[i].ondrop = function(event) {
			$(this).css("background-color", "transparent"); $(this.childNodes).css("opacity", "1");
			old = $('[data-draggedOver=true]')[0];
			if (old) { $(old).animate({rotate:'0deg'},100); old.setAttribute('data-draggedOver', 'false'); }
		        var type = event.dataTransfer.getData("Url");
			var text = event.dataTransfer.getData("Text");
			//alert("type: "+type+", text:"+text);
			if ((!text) || (text===type)) text="";
			var note = document.createElement('div');
			if ((type==="note://") || (text)) {
				note.setAttribute('data-content', text);
				note.setAttribute('data-bgcolor', '#f0f000');
				note.setAttribute('data-date', arr1[i]); //FIXME!
			
				fillNote(note);
				//notify('Notatka dodana!');
			} else if (type=="event://") {
				note.setAttribute('data-content', text);
				note.setAttribute('data-bgcolor', '#e00000');
				note.setAttribute('data-date', arr1[i]); //FIXME!
			
				fillNote(note);
			} else if (type=="task://") {
				note.setAttribute('data-content', text);
				note.setAttribute('data-bgcolor', '#00e000');
				note.setAttribute('data-date', arr1[i]); //FIXME!
			
				fillNote(note);
			}
			else if (type=="drag://") {
				moveAnimate($("#draggedElement"), this, old);
				saveNotes();
				return false;
			}
			if (old) 
				this.insertBefore(note,old); 
			else
				this.appendChild(note);
			saveNotes();

		}
		arr2[i].ondragover = function () { $(this).css("background-color", "white"); $(this.childNodes).css("opacity", "0.75"); 
					return false; }
		arr2[i].ondragleave = function () { $(this).css("background-color", "transparent"); $(this.childNodes).css("opacity", "1"); 
								old = $('[data-draggedOver=true]')[0];
					if (old) { $(old).rotate('0deg');; old.setAttribute('data-draggedOver', 'false'); }
		}
	}
	
	*/
	
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
				moveAnimate($("#draggedElement"), this, old);
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
	
	
	var arr1_1 = new Array(), arr2_1= new Array(),
		arr1_2 = new Array(), arr2_2 = new Array(),
		arr1_3 = new Array(), arr2_3 = new Array();
	
	for(i = 0; i < lang[mylang]["days"].length; i++) {

		
		function doNav(cur, parent, d, date) {
			var nav = document.createElement('nav');
			parent.appendChild(nav);
			var header = document.createElement('div');
			header.setAttribute('class','header');
			nav.setAttribute('data-date', date);
			
			//header.innerHTML = "<h3>"+d.format("D")+"."+d.format("M")+"<br/>"+lang[mylang]["days"][i]+"</h3>";
			header.innerHTML = "<h3>"+lang[mylang]["days"][i]+"</h3>";

			
			if (cur) header.setAttribute('id','current_day');
		  
		        header.setAttribute('data-date',d.format("D")+"."+d.format("M"));
		  
			nav.appendChild(header);
		  
			var content = document.createElement('div');
			content.setAttribute('class', 'day_content');
			content.setAttribute('id', date);
			nav.appendChild(content);
			
		}
		
		var lmyd = (week_last.format("D") < 10) ? "0"+week_last.format("D") : week_last.format("D");
		var dmyd = (d.format("D") < 10) ? "0"+d.format("D") : d.format("D");
		var nmyd = (week_next.format("D") < 10) ? "0"+week_next.format("D") : week_next.format("D");
		
		var lmym = (week_last.format("M") < 10) ? "0"+week_last.format("M") : week_last.format("M");
		var dmym = (d.format("M") < 10) ? "0"+d.format("D") : d.format("M");
		var nmym = (week_next.format("M") < 10) ? "0"+week_next.format("M") : week_next.format("M");
		
		var lmyy = week_last.format("YYYY");
		var dmyy = d.format("YYYY");
		var nmyy = week_next.format("YYYY");
		
		var lmydate = "day"+lmyd+"-"+lmym+"-"+lmyy;
		var dmydate = "day"+dmyd+"-"+dmym+"-"+dmyy;
		var nmydate = "day"+nmyd+"-"+nmym+"-"+nmyy;

		doNav(false, document.getElementById('inner_table_left'), week_last, lmydate);
		doNav(i == mdn, document.getElementById('inner_table_center'), d, dmydate);
		doNav(false, document.getElementById('inner_table_right'), week_next, nmydate);
		
		//
		arr1_1[i] = lmydate; // wypieprzyć bo 3 razy się id powtarza
		arr1_2[i] = dmydate;
		arr1_3[i] = nmydate;
		//
		
		//
		arr2_1[i] = document.getElementById(arr1_1[i]);
		arr2_2[i] = document.getElementById(arr1_2[i]);
		arr2_3[i] = document.getElementById(arr1_3[i]);

		setDayHandlers(arr2_1[i]);
		setDayHandlers(arr2_2[i]);
		setDayHandlers(arr2_3[i]);
		
		//
		d.add("days", 1);
		week_last.add("days", 1);
		week_next.add("days", 1);
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
						notes[note_count] = {};
						notes[note_count]['type'] = col[j].getAttribute("class");
						notes[note_count]['date'] = col[j].getAttribute("data-date");
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
	}
	
	function loadTable(table) {
		//console.log('TABLE: '+table.getAttribute('id')+ ', length: '+table.childNodes.length);
		for ( var col = 0; col < table.childNodes.length; col++ ) {
			var column = Array();
			var note_count = 0;
			column = JSON.parse(localStorage[table.childNodes[col].getAttribute('data-date')]);
			for ( j = 0; j < column.length; j++ ) {
				var note = document.createElement('div');
				//console.log(column[j]);
				$(note).addClass(column[j]['type']);
				note.setAttribute('data-date', column[j]['date']);
				note.setAttribute('data-content', column[j]['content']);
				note.setAttribute('data-bgcolor', column[j]['bgcolor']);
				note.setAttribute('data-done', column[j]['done']);
				note.setAttribute('data-time', column[j]['time']);
				fillNote(note);
				document.getElementById(table.childNodes[col].getAttribute('data-date')).appendChild(note);
			}
		}
	}
	
	function loadNotes() {
		loadTable(document.getElementById('inner_table_left'));
		loadTable(document.getElementById('inner_table_center'));
		loadTable(document.getElementById('inner_table_right'));
	}
			
	resizeDays();
	loadNotes();
});
