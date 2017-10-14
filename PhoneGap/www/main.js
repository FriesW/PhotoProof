document.addEventListener("deviceready", onDeviceReady, false);

var pictureSource;
var destinationType;

function onDeviceReady() {
    pictureSource = navigator.camera.PictureSourceType;
    destinationType = navigator.camera.DestinationType;
}



function onPhotoLoadSuccess(imageData) {
    var dest = document.getElementById('img');
    dest.style.backgroundImage = "url(data:image/jpeg;base64," + imageData + ")";
    
    var hash = document.getElementById('hash');
    hash.innerHTML = "Image hash: " + sha256['hex'](atob(imageData));
}

function onFail(message) {
    alert('Failed because: ' + message);
}

function capturePhoto() {
    navigator.camera.getPicture(onPhotoLoadSuccess, onFail,
    {quality: 100,
     destinationType: destinationType.DATA_URL}
    );
}

function getPhoto() {
    navigator.camera.getPicture(onPhotoLoadSuccess, onFail,
        {quality: 100,
         destinationType: destinationType.DATA_URL,
         sourceType: pictureSource.PHOTOLIBRARY}
     );
}