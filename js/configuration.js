
function removeData() {
	localStorage.clear();
	window.location.reload();
}

function importData(input) {
	if (confirm(chrome.i18n.getMessage("confImportAreYouSure"))) {
		localStorage.clear();
		end();
	}
	this.parentNode.innerHTML = this.parentNode.innerHTML;
	$('#importfile').change(importData);
}

function exportData() {

	var data = {};
	data.version = __VERSION__;
	data.api = 1;
	data.dev = !__RELEASE__;
	data.date = new Date();
	data.content = localStorage;
	content = JSON.stringify(data);
	data = JSON.parse(content);
	for (var day in data.content) {
		console.log(day);
		if (day.indexOf('day') == 0) {
			data.content[day] = JSON.parse(data.content[day]);
		}
	}
	content = JSON.stringify(data, null, 2);
	//uriContent = "data:application/octet-stream," + encodeURIComponent(content);
	//window.location.href = uriContent;
	//location.href = window.webkitURL.createObjectURL(blob);
	window.requestFileSystem  = window.requestFileSystem || window.webkitRequestFileSystem;
	window.requestFileSystem(window.TEMPORARY, 5*1024*1024 /*5MB*/, function(fs) {
		function saveExport() {
		fs.root.getFile('MyTimeOrganizer-export.mto', {create: true}, function(fileEntry) {
			fileEntry.createWriter(function(fileWriter) {
				var bb = new WebKitBlobBuilder();
				bb.append(content);
				var blob = bb.getBlob('application/json'); 
				fileWriter.write(blob);
			}, function(e) {console.log(e); });
			location.href = fileEntry.toURL();
			end();
		}, function(e) { console.log(e); });
		}
		
		fs.root.getFile('MyTimeOrganizer-export.mto', {create: false}, function(fileEntry) {
			fileEntry.remove(function() { console.log('removed'); saveExport(); }, function(e) { console.log(e); saveExport(); });
		}, function(e) { console.log(e); saveExport(); });
		
		
	}, function(e) { console.log(e); });
	
}

function setColor() {
	localStorage['color']=$(this).attr('data-color');
	loadUIColor();
}

function confEmptyAreYouSureScreen() {

	_gaq.push(['_trackPageview', '/config/importExport/clear']);

	var okno = document.createElement('div');
	okno.id = 'tutorial';
	okno = $('#tutorial');
	okno.hide();
	okno.addClass('helper');
	okno.empty();
	okno.css("z-index", 100000).css('width',400).css('padding-top',0);
		
	var wrap = document.createElement('div');
		
	$(wrap).html(chrome.i18n.getMessage("confClearAreYouSure"));
	$(wrap).find('p').css('text-align','center').css('padding-top',20);

	var next = document.createElement('div');
	$(next).addClass('next_button');
	next.innerHTML = chrome.i18n.getMessage("confDelete");
	next.onclick = removeData;
	$(next).css('width','100%').appendTo(wrap);

	$(wrap).appendTo(okno);

	next = document.createElement('div');
	$(next).addClass('next_button');
	next.innerHTML = chrome.i18n.getMessage("cancel");
	next.onclick = confImportExportScreen;
	$(next).css('width','100%').appendTo(okno);
	
	okno.appendTo("body");
	okno.fadeIn(500);
	
	$('#tutorialHighlight').css('display','block').css('left', $('#tutorialHighlight').offset().left).css('top', $('#tutorialHighlight').offset().top);
	//first();
}

function confColorThemeScreen() {

	_gaq.push(['_trackPageview', '/config/colorTheme']);

	var okno = document.createElement('div');
	okno.id = 'tutorial';
	okno = $('#tutorial');
	okno.hide();
	okno.addClass('helper');
	okno.empty();
	okno.css("z-index", 100000).css('width',400).css('padding-top',0);
		
	var wrap = document.createElement('div');
		
	$(wrap).html(chrome.i18n.getMessage("colorTheme"));
	$(wrap).find('p').css('text-align','center').css('padding-top',20);

	var next = document.createElement('div');
	$(next).addClass('selectColorVersion');
	$(next).css('background-color', '#457ad5');
	next.setAttribute('data-color', 'blue');
	next.onclick = setColor;
	next.ondblclick = end;
	$(next).appendTo($(wrap).find('p')[1]);

	next = document.createElement('div');
	$(next).addClass('selectColorVersion');
	$(next).css('background-color', '#fba8d3');
	next.setAttribute('data-color', 'pink');
	next.onclick = setColor;
	next.ondblclick = end;
	$(next).appendTo($(wrap).find('p')[1]);

	next = document.createElement('div');
	$(next).addClass('selectColorVersion');
	$(next).css('background-color', '#1a1a1a');
	next.setAttribute('data-color', 'black');
	next.onclick = setColor;
	next.ondblclick = end;
	$(next).appendTo($(wrap).find('p')[1]);
	
	next = document.createElement('div');
	$(next).addClass('selectColorVersion');
	$(next).css('background-color', '#a88314');
	next.setAttribute('data-color', 'brown');
	next.onclick = setColor;
	next.ondblclick = end;
	$(next).appendTo($(wrap).find('p')[1]);

	next = document.createElement('div');
	$(next).addClass('selectColorVersion');
	$(next).css('background-color', '#a0e62f');
	next.setAttribute('data-color', 'lime');
	next.onclick = setColor;
	next.ondblclick = end;
	$(next).appendTo($(wrap).find('p')[1]);	
	
	next = document.createElement('div');
	$(next).addClass('selectColorVersion');
	$(next).css('background-color', '#ff8b2a');
	next.setAttribute('data-color', 'orange');
	next.onclick = setColor;
	next.ondblclick = end;
	$(next).appendTo($(wrap).find('p')[1]);	

	$(wrap).appendTo(okno);

	next = document.createElement('div');
	$(next).addClass('next_button');
	next.innerHTML = chrome.i18n.getMessage("cancel");
	next.onclick = confScreen;
	$(next).css('width','100%').appendTo(okno);
	
	okno.appendTo("body");
	okno.fadeIn(500);
	
	$('#tutorialHighlight').css('display','block').css('left', $('#tutorialHighlight').offset().left).css('top', $('#tutorialHighlight').offset().top);
	//first();
}

function confImportExportScreen() {

	_gaq.push(['_trackPageview', '/config/importExport']);

	var okno = document.createElement('div');
	okno.id = 'tutorial';
	okno = $('#tutorial');
	okno.hide();
	okno.addClass('helper');
	okno.empty();
	okno.css("z-index", 100000).css('width',250).css('padding-top',0);
				
	var next = document.createElement('div');
	$(next).addClass('next_button');
	next.innerHTML = chrome.i18n.getMessage("confImport");
	//next.onclick = confImportExportScreen;
	$(next).css('width','100%').css('position','relative').appendTo(okno);
	
	$input = $('<input type="file" id="importfile" style="opacity:0; cursor:pointer; position: absolute; width: 100%; height: 100%; left: 0; top: 0;"/>').appendTo($('<div>').appendTo(next)).change(importData);

	next = document.createElement('div');
	$(next).addClass('next_button');
	next.innerHTML = chrome.i18n.getMessage("confExport");
	next.onclick = exportData;
	$(next).css('width','100%').appendTo(okno);

	next = document.createElement('div');
	$(next).addClass('next_button');
	next.innerHTML = chrome.i18n.getMessage("confClearDB");
	next.onclick = confEmptyAreYouSureScreen;
	$(next).css('width','100%').appendTo(okno);

	next = document.createElement('div');
	$(next).addClass('next_button');
	next.innerHTML = chrome.i18n.getMessage("cancel");
	next.onclick = confScreen;
	$(next).css('width','100%').appendTo(okno);
	
	okno.appendTo("body");
	okno.fadeIn(500);
	
	$('#tutorialHighlight').css('display','block').css('left', $('#tutorialHighlight').offset().left).css('top', $('#tutorialHighlight').offset().top);
	//first();
}

function confScreen() {

	_gaq.push(['_trackPageview', '/config']);
	
	$('#helper').css("visibility", "hidden");

	$('#tutorial').remove();
	
	var okno = document.createElement('div');
	okno.id = 'tutorial';
	okno = $(okno);
	okno.hide();
	okno.addClass('helper');
	okno.empty();
	okno.css("z-index", 100000).css('width',250).css('padding-top',0);
		
	var next = document.createElement('div');
	$(next).addClass('next_button');
	next.innerHTML = chrome.i18n.getMessage("confColor");
	next.onclick = confColorThemeScreen;
	$(next).css('width','100%').appendTo(okno);

	next = document.createElement('div');
	$(next).addClass('next_button');
	next.innerHTML = chrome.i18n.getMessage("confImportExport");
	next.onclick = confImportExportScreen;
	$(next).css('width','100%').appendTo(okno);
	
	next = document.createElement('div');
	$(next).addClass('next_button');
	next.innerHTML = chrome.i18n.getMessage("cancel");
	next.onclick = end;
	$(next).css('width','100%').appendTo(okno);
	
	okno.appendTo("body");
	okno.fadeIn(500);
	
	$('#tutorialHighlight').css('display','block').css('left', $('#tutorialHighlight').offset().left).css('top', $('#tutorialHighlight').offset().top);
	//first();
}
