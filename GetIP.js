const publicIp = require('public-ip');
var firebase = require('firebase');
var app = firebase.initializeApp({
	apiKey: "AIzaSyBEzdHSBDAPZbcRq7Ua6EP81vsSJo2_4VA",
	authDomain: "getip-d1124.firebaseapp.com",
	databaseURL: "https://getip-d1124.firebaseio.com",
	projectId: "getip-d1124",
	storageBucket: "getip-d1124.appspot.com",
	messagingSenderId: "389959378406"
});

var database = firebase.database();
var tempIP = undefined;
var writeData = function writeData(time, ip) {
	if (ip != tempIP) {
		tempIP = ip;
		database.ref('IPWork').set({
			time: time.toString(),
			ip: ip
		});
	}
}

var intervalCall = function intervalCall() {
	clearTimeout();
	publicIp.v4().then(ip => {
		console.log(new Date().toString() + ": " + ip);
		writeData(new Date(), ip);
	});
	setTimeout(function() {
		intervalCall();
	}, 300000);
}

firebase.auth().signInAnonymously().then(function() {
	intervalCall();
}).catch(function(error) {
	console.log(error.code + ":" + error.message);
});