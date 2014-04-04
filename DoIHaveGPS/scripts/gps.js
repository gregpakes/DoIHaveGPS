function hasClass(ele, cls) {
    return ele.className.match(new RegExp('(\\s|^)' + cls + '(\\s|$)'));
}

function removeClass(ele, cls) {
    if (hasClass(ele, cls)) {
        var reg = new RegExp('(\\s|^)' + cls + '(\\s|$)');
        ele.className = ele.className.replace(reg, ' ');
    }
}

function addClass(ele, cls) {
    if (!hasClass(ele, cls)) {
        ele.className = ele.className + ' ' + cls;
    }
}

function hideProgress() {
    var el = document.getElementsByClassName('loadingProgress')[0];
    el.style.display = 'none';
}

function hideMap() {
    var el = document.getElementById('map-canvas');
    el.style.display = 'none';
}

function showResults(coords) {
    var resultContainerEl = document.getElementById('result-container');
    removeClass(resultContainerEl, 'hidden');

    var accuracyEl = document.getElementById('results-accuracy');
    var coordsEl = document.getElementById('results-coords');

    setAccuracy(accuracyEl, coords.accuracy);
    setCoords(coordsEl, coords);
}

function setCoords(el, coords) {

    var latitudeEl = document.createElement('div');
    var longituteEl = document.createElement('div');

    latitudeEl.innerText = 'Latitude: ' + coords.latitude.toFixed(2);
    longituteEl.innerText = 'Longitude: ' + coords.longitude.toFixed(2);
    el.appendChild(latitudeEl);
    el.appendChild(longituteEl);
}

function setAccuracy(el, accuracy) {

    var accuracyEl = document.createElement('div');
    accuracyEl.innerText = 'Accuracy: ' + accuracy + ' meters';
    el.appendChild(accuracyEl);

    var verdictEl = document.createElement('div');

    if (accuracy < 100) {
        removeClass(el, 'alert-warning');
        addClass(el, 'alert-success');
        verdictEl.innerText = 'It is likely you have a GPS chip';
    } else {
        removeClass(el, 'alert-success');
        addClass(el, 'alert-warning');
        verdictEl.innerText = 'You do not have GPS';
    }

    el.appendChild(verdictEl);
}

function showError(msg) {
    hideProgress();
    hideMap();

    var el = document.getElementById('error');
    el.style.display = 'block';
    var eltext = document.getElementById('error-text');
    eltext.innerText = msg;
}

function displayPosition(position) {

    hideProgress();

    var latlng = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
    var mapOptions = {
        center: latlng,
        zoom: 15
    };
    var map = new google.maps.Map(document.getElementById("map-canvas"),
        mapOptions);

    var marker = new google.maps.Marker({
        position: latlng,
        map: map,
        title: "You are here! (at least within a " + position.coords.accuracy + " meter radius)"
    });

    showResults(position.coords);
}

function displayError(error) {
    var errors = {
        1: 'Permission denied.  You must allow your browser permission to use your location.',
        2: 'Position unavailable',
        3: 'Request timeout'
    }; 
    showError(errors[error.code]);
}

function initialize() {

    if (navigator.geolocation) {
        var timeoutVal = 30000; // 30 secs
        navigator.geolocation.getCurrentPosition(
          displayPosition,
          displayError,
          { enableHighAccuracy: true, timeout: timeoutVal, maximumAge: 0 }
        );
    }
    else {
        showError("Geolocation is not supported by your browser");
    }

}
google.maps.event.addDomListener(window, 'load', initialize);