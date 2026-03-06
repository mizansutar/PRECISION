const $ = id => document.getElementById(id)

/* LOGIN */

const EMAIL = "device@farm.local"
const PASSWORD = "StrongDevicePassword123"

function login(){

const user = $("username").value.trim()
const pass = $("password").value

if(user !== EMAIL || pass !== PASSWORD){
alert("Invalid credentials")
return
}

sessionStorage.setItem("loggedIn","true")
location.href="dashboard.html"

}

/* PAGE GUARD */

if(location.href.includes("dashboard")){

if(sessionStorage.getItem("loggedIn") !== "true"){
location.href="index.html"
}

}

/* FIREBASE */

firebase.initializeApp({

apiKey:"AIzaSyBif0bGirDQMEohzMQC1UDR6tgpaFGy5OY",

databaseURL:"https://precision-farming-2e7f8-default-rtdb.firebaseio.com/"

})

const db = firebase.database()

let mode="AUTO"

/* LIVE SENSOR DATA */

db.ref("live").on("value",snap=>{

const d = snap.val()

if(!d) return

$("soil").innerText = (d.soil1 ?? 0) + "%"
$("soil2").innerText = (d.soil2 ?? 0) + "%"

$("temp").innerText = (d.airTemp ?? 0) + "°C"
$("hum").innerText = (d.humidity ?? 0) + "%"

$("soilTemp").innerText = (d.soilTemp ?? 0) + "°C"
$("gas").innerText = (d.gas ?? 0) + "%"

$("ph").innerText = (d.ph ?? 0)

})

/* DEVICE STATUS */

db.ref("manual").on("value",snap=>{

const m = snap.val()
if(!m) return

$("pump").innerText = m.waterPump || "OFF"
$("machineStatus").innerText = m.sprayPump || "OFF"

})

/* MODE */

db.ref("mode").on("value",snap=>{

mode = snap.val() || "AUTO"

$("modeText").innerText = mode

})

/* CONTROLS */

function setMode(m){
db.ref("mode").set(m)
}

function pumpOn(){

if(mode !== "MANUAL"){
alert("Switch to MANUAL mode")
return
}

db.ref("manual/waterPump").set("ON")

}

function pumpOff(){

if(mode !== "MANUAL"){
alert("Switch to MANUAL mode")
return
}

db.ref("manual/waterPump").set("OFF")

}

function machineOn(){

if(mode !== "MANUAL"){
alert("Switch to MANUAL mode")
return
}

db.ref("manual/sprayPump").set("ON")

}

function machineOff(){

if(mode !== "MANUAL"){
alert("Switch to MANUAL mode")
return
}

db.ref("manual/sprayPump").set("OFF")

}

/* CLOCK */

setInterval(()=>{

$("time").innerText = new Date().toLocaleTimeString()

},1000)