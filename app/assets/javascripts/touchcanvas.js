var gCtx = null;
var gCanvas = null;
var imageData = null;
var ii=0;
var jj=0;
var c=0;
var stype=0;
var gUM=false;
var webkit=false;
var moz=false;
var v=null;
var vidhtml = '<video id="v" autoplay></video>';

var camhtml='<object  id="iembedflash" classid="clsid:d27cdb6e-ae6d-11cf-96b8-444553540000" codebase="http://download.macromedia.com/pub/shockwave/cabs/flash/swflash.cab#version=7,0,0,0" width="500" height="375"> '+
    '<param name="movie" value="camcanvas.swf" />'+
    '<param name="quality" value="high" />'+
    '<param name="allowScriptAccess" value="always" />'+
    '<embed  allowScriptAccess="always"  id="embedflash" src="camcanvas.swf" quality="high" width="500" height="375" type="application/x-shockwave-flash" pluginspage="http://www.macromedia.com/go/getflashplayer" mayscript="true"  />'+
'</object>';

function isTrue(taken){
    return taken.replace(/^\s\s*/, '').replace(/\s\s*$/, '') === "true" ;
}

function read(jsonString) {
    var jsonObj = $.parseJSON(jsonString);
    var taken = $("." + jsonObj.serial_number + " .reserve").text();
   
    if( isTrue(taken) ){
        jsonObj.user = "";
        submitQr(jsonObj);
    } else {
        $("#nameModal").modal();

        $(".js-submit").on("click", function() {
            //CODE TO VALIDATE INPUT
           jsonObj.user = $(".js-name").val();
           submitQr(jsonObj);
        }); 
    }
}

function submitQr(jsonObj) {
    $.ajax({
        type: 'PUT',
        url: "/devices/"+jsonObj.serial_number+"/update_status_taken",    
        data: {device: jsonObj},
        dataType: "script",
        success: function(data) {
           console.log("Device added", jsonObj);
        },
        error: function(err) {
            // alert("Device does not exist");
        }
    });
}
    
function load() {
    
    if(isCanvasSupported() && window.File && window.FileReader) {
        initCanvas(500,375);
        qrcode.callback = read;
        document.getElementById("webcamContainer").style.display="inline";
        setwebcam();

    } else {
        document.getElementById("webcamContainer").style.display="inline";
        document.getElementById("webcamContainer").innerHTML='<p id="mp1">QR code scanner for HTML5 capable browsers</p><br>'+
        '<br><p id="mp2">sorry your browser is not supported</p><br><br>'+
        '<p id="mp1">try <a href="http://www.mozilla.com/firefox"><img src="firefox.png"/></a> or <a href="http://chrome.google.com"><img src="chrome_logo.gif"/></a> or <a href="http://www.opera.com"><img src="Opera-logo.png"/></a></p>';
    }
}

function isCanvasSupported() {
  var elem = document.createElement('canvas');
  return !!(elem.getContext && elem.getContext('2d'));
}

function success(stream) {
    if(webkit)
        v.src = window.webkitURL.createObjectURL(stream);
    else
    if(moz)
    {
        v.mozSrcObject = stream;
        v.play();
    }
    else
        v.src = stream;
    gUM=true;
    setTimeout(captureToCanvas, 500);
}

function error(error) {
    gUM=false;
    return;
}

function setwebcam() {
    
    if(stype==1) {
        setTimeout(captureToCanvas, 500);    
        return;
    }
    
    var n=navigator;
    
    if(n.getUserMedia) {
        document.getElementById("outdiv").innerHTML = vidhtml;
        v=document.getElementById("v");
        n.getUserMedia({video: true, audio: false}, success, error);
    }else if(n.webkitGetUserMedia) {
        document.getElementById("outdiv").innerHTML = vidhtml;
        v=document.getElementById("v");
        webkit=true;
        n.webkitGetUserMedia({video: true, audio: false}, success, error);
    } else if(n.mozGetUserMedia) {
        document.getElementById("outdiv").innerHTML = vidhtml;
        v=document.getElementById("v");
        moz=true;
        n.mozGetUserMedia({video: true, audio: false}, success, error);
    } else {
        document.getElementById("outdiv").innerHTML = camhtml;
    }

    stype=1;
    setTimeout(captureToCanvas, 500);
}


function initCanvas(ww,hh) {
    gCanvas = document.getElementById("qr-canvas");

    var w = ww;
    var h = hh;
    gCanvas.style.width = w + "px";
    gCanvas.style.height = h + "px";
    gCanvas.width = w;
    gCanvas.height = h;
    gCtx = gCanvas.getContext("2d");
    gCtx.clearRect(0, 0, w, h);
    imageData = gCtx.getImageData( 0,0,320,240);
}

function captureToCanvas() {
    if(stype!=1)
        return;
    
    if(gUM) {
        try {
            gCtx.drawImage(v,0,0);
            try {
                qrcode.decode();
                setTimeout(captureToCanvas, 500);
            }
            catch(e) {       
                console.log(e);
                setTimeout(captureToCanvas, 500);
            };
        } catch(e) {       
                console.log(e);
                setTimeout(captureToCanvas, 500);
        };
    } else {
        flash = document.getElementById("embedflash");
        try {
            flash.ccCapture();
        } catch(e) {
            console.log(e);
            setTimeout(captureToCanvas, 1000);
        }
    }
}