
const getLocationBtn = document.getElementById('getLocationBtn');
const locationOutput = document.getElementById('locationOutput');

getLocationBtn.addEventListener('click', () => {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(showPosition, showError);
    } else {
        locationOutput.innerHTML = "Geolocation is not supported by this browser.";
    }
});

function showPosition(position) {
    const latitude = position.coords.latitude;
    const longitude = position.coords.longitude;
    locationOutput.innerHTML = `Latitude: ${latitude} <br>Longitude: ${longitude}`;
}

function showError(error) {
    switch(error.code) {
        case error.PERMISSION_DENIED:
            locationOutput.innerHTML = "User denied the request for Geolocation.";
            break;
        case error.POSITION_UNAVAILABLE:
            locationOutput.innerHTML = "Location information is unavailable.";
            break;
        case error.TIMEOUT:
            locationOutput.innerHTML = "The request to get user location timed out.";
            break;
        case error.UNKNOWN_ERROR:
            locationOutput.innerHTML = "An unknown error occurred.";
            break;
    }
}

const saveToLocalStorageBtn = document.getElementById('saveToLocalStorageBtn');
const commentInput = document.getElementById('comment');
const localStorageData = document.getElementById('localStorageData');

saveToLocalStorageBtn.addEventListener('click', () => {
    const comment = commentInput.value;
    const location = locationOutput.innerHTML;
    const data = { comment, location };
    const dataJSON = JSON.stringify(data);
    
    localStorage.setItem(`data${Date.now()}`, dataJSON);
    loadLocalStorageData();
});

function loadLocalStorageData() {
    localStorageData.innerHTML = '';
    for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        const value = JSON.parse(localStorage.getItem(key));
        
        const li = document.createElement('li');
        li.textContent = `Комментарий: ${value.comment}, Местоположение: ${value.location}`;
        localStorageData.appendChild(li);
    }
}

loadLocalStorageData();

let db;
const request = indexedDB.open('geoDB', 1);

request.onupgradeneeded = function(event) {
    db = event.target.result;
    const store = db.createObjectStore('geoData', { autoIncrement: true });
};

request.onsuccess = function(event) {
    db = event.target.result;
    console.log('IndexedDB готова к использованию');
};

function saveToIndexedDB(data) {
    const transaction = db.transaction('geoData', 'readwrite');
    const store = transaction.objectStore('geoData');
    store.add(data);
}
