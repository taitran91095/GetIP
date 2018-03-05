const publicIp = require('public-ip');
var firebase = require('firebase');
var http = require('http'); 
var request = require('request'); 
var username = "heocon91095@gmail.com";
var password = "asdasdasd";
var hostname = "sal.ddns01.com";

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

function buildAPI(ip){
	var api = "https://"+username+":"+password+"@www.dnsdynamic.org/api/?hostname="+hostname+"&myip="+ip;
	request({
		url:api
	},function(error,response,body){
		console.log(response.statusCode);
	})
}

var intervalCall = function intervalCall() {
	clearTimeout();
	publicIp.v4().then(ip => {
		console.log(new Date().toString() + ": " + ip);
		writeData(new Date(), ip);
		buildAPI(ip);
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