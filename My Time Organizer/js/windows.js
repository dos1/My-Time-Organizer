if (navigator.userAgent.indexOf("Windows") != -1) {
     var fileref=document.createElement("link")
     fileref.setAttribute("rel", "stylesheet")
     fileref.setAttribute("type", "text/css")
     fileref.setAttribute("href", "css/windows.css")
     $(fileref).appendTo($("head"));
    }