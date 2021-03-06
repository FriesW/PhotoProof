var POST = "http://ice.truman.edu/~wjf4578/PhotoProof/post.php";
var CHECK = "http://ice.truman.edu/~wjf4578/PhotoProof/check.php";
var KEY;

var LIST_KEY = "PIC_HISTORY";
var activeList = []; //Each item [txid, UTC, hash, base64pic]
var updateQueue = []; //Just a bunch of txids

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

function updateItem(txid)
{
    get_txid(txid, function(depth){
        depth = parseInt(depth);
        if( !isNaN(depth) )
        {
            if( depth > 6 )
            {
                depth = "6+";
                updateQueue.splice(updateQueue.indexOf(txid), 1);
            }
            var sel = '#' + txid + ' .row1';
            $(sel).html( '' + depth + $(sel).html().substr(1) );
        }
    });
}
function updateTimer() {
    for(var i = 0; i < updateQueue.length; i++)
        updateItem(updateQueue[i]);
}


function padLeft(nr, n, str){
    return Array(n-String(nr).length+1).join(str||'0')+nr;
}
function addItem(item) {
    activeList.push(item);
    
    //Get date
    var d = new Date(0);
    d.setUTCSeconds(item[1]);
    //Calculate strings
    var top_row = '?/6 Confirms : ' + (d.getMonth() + 1) + '/' + d.getDate() + '/' + (d.getFullYear() % 100) + ' at ' + d.getHours() + ':' + padLeft(d.getMinutes(), 2);
    var txid = item[0].substr(0,42) + '...';
    var hash = item[2].substr(0,42) + '...';
    var bot_row = txid + "<br>" + hash;
    var img = 'style="background-image: url(' + item[3] + ');"';
    //Set it
    $('#history').prepend( '<li id="' + item[0] + '"><div class="row1">' + top_row + '</div><div class="thumb" ' + img + '></div><div class="row2">' + bot_row + "</div></li>");
    //Update it
    updateQueue.push(item[0]);
    updateItem(item[0]);
    
    
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
            //Begin update cycle
            setInterval(updateTimer, 60 * 1000);
        });
    });
}