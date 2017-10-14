var POST = "http://ice.truman.edu/~wjf4578/PhotoProof/post.php";
var KEY;

document.addEventListener("deviceready", onDeviceReady, false);

var pictureSource;
var destinationType;

function onDeviceReady() {
    pictureSource = navigator.camera.PictureSourceType;
    destinationType = navigator.camera.DestinationType;
    //Get API key
    $.get("API_KEY.txt", function(result){KEY = result;});
}


function post_hash(hash) {
    $.post(POST,{'key': KEY, 'data': hash})
        .done(
            function(data){alert(data);}
        )
        .fail(
            function(data){alert("uh, oh...");}
        );
}

function genHash(imagePath) {
    var c = document.getElementById('scratch');
    var ctx = c.getContext('2d');
    var img = new Image();
    img.onload = function(){
        c.width = this.width / 8;
        c.height = this.height / 8;
        ctx.drawImage(img, 0, 0, c.width, c.height);
    }
    img.src = imagePath;
    var out = sha256['hex'](c.toDataURL());
    c.width = 0;
    c.height = 0;
    post_hash( out );
}

function displayPhoto(imagePath) {
    var dest = document.getElementById('img');
    //dest.style.backgroundImage = "url(data:image/jpeg;base64," + imageData + ")";
    dest.style.backgroundImage = "url(" + imagePath + ")";
}

function onPhotoLoadSuccess(imagePath) {
    displayPhoto(imagePath);
    genHash(imagePath);
}

function onFail(message) {
    alert('Failed because: ' + message);
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