$(document).ready(function () {
    var request = new XMLHttpRequest();

    request.open('GET', 'https://cors-anywhere.herokuapp.com/https://api.globalwinescore.com/globalwinescores/latest/');
    
    request.setRequestHeader('Accept', 'application/json');
    request.setRequestHeader('Authorization', 'Token ec92a47659317b5e11ad3adff4185307e8e1c669');

    request.onreadystatechange = function () {
        if (this.readyState === 4) {
            //console.log('Status:', this.status);
            //console.log('Headers:', this.getAllResponseHeaders());
            console.log('Body:', this.responseText);
        }
    };
    console.log("hello World");
    request.send();
});