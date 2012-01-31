function resizeDays() {
 $(".day_content").css("height",$("#border_table").height()-10);
}

window.onresize = resizeDays

$(document).ready(function() {
  resizeDays();
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
