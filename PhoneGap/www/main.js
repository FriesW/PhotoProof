var POST = "http://ice.truman.edu/~wjf4578/PhotoProof/post.php";
var CHECK = "http://ice.truman.edu/~wjf4578/PhotoProof/check.php";
var KEY;

var LIST_KEY = "PIC_HISTORY";
var activeList = []; //Each item [txid, UTC, hash, base64pic]

var pictureSource;
var destinationType;

function set_status(message) {
    $('#status div').html(message);
}

function show_slider() {
    $('#status').css('background-image', 'url(stripe.png)');
}

function hide_slider() {
    $('#status').css('background-image', 'none');
}

function get_txid(txid, callback) {
    $.post(CHECK,{'key': KEY, 'txid': txid}) 
        .done( callback )
        .fail( function(xhr, status, error){alert("CHECK failed: " + status + " " + error);} );
}

function post_hash(hash, callback) {
    $.post(POST,{'key': KEY, 'data': hash})
        .done( callback )
        .fail(
            function(xhr, status, error){hide_slider(); set_status('Error!'); alert("POST failed: " + status + " " + error);}
        );
}

/*
function thumbnail(imagePath) {
    var c = document.getElementById('scratch');
    var ctx = c.getContext('2d');
    var img = new Image();
    img.onload = function() {
        var size = Math.min(this.width, this.height);
        c.width = 75;
        c.height = 75;
        ctx.drawImage(img, 0, 0, c.width, c.height);//,
            //(this.width - size) / 2, (this.height - size) / 2, size, size);
    }
    img.src = imagePath;
    var out = "" + c.toDataURL();
    c.width = 0;
    c.height = 0;
    alert(out);
    return out;
}*/

function onPhotoLoadSuccess(imagePath) {
    show_slider();
    set_status('Processing picture...');
    
    //Prepare image
    var img = new Image();
    img.onload = function(){
        //Hash
        var c = document.getElementById('scratch');
        var ctx = c.getContext('2d');
        c.width = this.width / 8;
        c.height = this.height / 8;
        ctx.drawImage(img, 0, 0, c.width, c.height);
        var hash = sha256['hex'](c.toDataURL());
        //Thumbnail
        var c = document.getElementById('scratch');
        var ctx = c.getContext('2d');
        var size = Math.min(this.width, this.height);
        c.width = 70;
        c.height = 70;
        ctx.drawImage(img, (this.width - size) / 2, (this.height - size) / 2, size, size,
            0, 0, c.width, c.height);
        var thumbnail = c.toDataURL('image/jpeg');
        
        set_status('Making transaction...');
        post_hash( hash, function(txid){
            hide_slider();
            set_status('Done!');
            addItem( [txid, ''+Math.round((new Date()).getTime() / 1000), hash, thumbnail] );
            saveHistory();
        } );
    }
    img.src = imagePath;
    
}

function onFail(message) {
    //alert('Failed because: ' + message);
}

function capturePhoto() {
    navigator.camera.getPicture(onPhotoLoadSuccess, onFail,
    {quality: 100,
     destinationType: destinationType.FILE_URI}
    );
}

function getPhoto() {
    navigator.camera.getPicture(onPhotoLoadSuccess, onFail,
        {quality: 100,
         destinationType: destinationType.FILE_URI,
         sourceType: pictureSource.PHOTOLIBRARY}
    );
}

function addItem(item) {
    activeList.push(item);
    
    //Get date
    var d = new Date(0);
    d.setUTCSeconds(item[1]);
    //Calculate strings
    var top_row = '?/6 Confirms : ' + (d.getMonth() + 1) + '/' + d.getDate() + '/' + (d.getFullYear() % 100) + ' at ' + d.getHours() + ':' + d.getMinutes();
    var txid = item[0].substr(0,42) + '...';
    var hash = item[2].substr(0,42) + '...';
    var bot_row = txid + "<br>" + hash;
    var img = 'style="background-image: url(' + item[3] + ');"';
    //Set it
    $('#history').prepend( '<li id="' + item[0] + '"><div class="row1">' + top_row + '</div><div class="thumb" ' + img + '></div><div class="row2">' + bot_row + "</div></li>");
    //Fetch it
    get_txid(item[0], function(depth){
        depth = parseInt(depth);
        depth = Math.min(depth, 6);
        $('#' + item[0] + ' .row1').html( '' + depth + top_row.substr(1) );
    });
    
    
}

function clearHistory() {
    activeList = [];
    saveHistory();
    $('#history').html(' ');
}

function saveHistory() {
    localStorage.setItem(LIST_KEY, JSON.stringify( activeList ) );
}

function loadHistory() {
    list = localStorage.getItem(LIST_KEY);
    if(list === null)
    {
        list = [];
    }
    else
    {
        list = JSON.parse(list);
    }
    for(var i = 0; i < list.length; i++)
    {
        addItem(list[i]);
    }
}



document.addEventListener("deviceready", onDeviceReady, false);

function onDeviceReady() {
    $(document).ready(function(){
        //Get rid of loader
        $('#loader').fadeOut();
        //Get media sources
        pictureSource = navigator.camera.PictureSourceType;
        destinationType = navigator.camera.DestinationType;
        //Get API key
        $.get("API_KEY.txt", function(result) {
            KEY = result;
            loadHistory();
        });
    });
}