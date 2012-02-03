function resizeDays() {
 $(".day_content").css("height",$("#border_table").height()-10);
 w = $("#slider").width();
 h = w * (800/1280);
 s = $("#slider ul li").length;
 $("#slider, #slider ul li, #slider li img").css('width',w).css('height', h);
 $("#slider ul li:first-child").css('display','none');
 $("#slider ul").css('width', s*w);
 s = $("#slider ul").attr('data-nr');
 $("#slider ul").css('margin-left', "-"+s*w+"px");
}

$(window).resize(resizeDays);

$(document).ready(function() {
  $('.note').each(function() { $(this).css('backgroundColor', this.getAttribute('data-bgcolor')); });
  if (typeof chrome === 'undefined') {
    chrome = {}
    chrome.app = {}
    chrome.app.isInstalled=true;
  }
  if (chrome.app.isInstalled) {
    document.getElementById('install').style.display='none';
  } else {
    $('.button').addClass('button2');
  }
        $('<div id="tutorialHighlight"><div class="hack"></div></div>').appendTo('body');

$("#slider").easySlider({
		auto: true,
		continuous: true,
		pause: 5000,
		controlsShow: false
	});
  resizeDays();
});

        // font fix for Windows
        if (navigator && navigator.userAgent && (navigator.userAgent.indexOf("Windows") != -1)) {
                var fileref=document.createElement("link")
                fileref.setAttribute("rel", "stylesheet")
                fileref.setAttribute("type", "text/css")
                fileref.setAttribute("href", "css/windows.css")
                $(fileref).appendTo($("head"));
        }
        // fix end
