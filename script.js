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

$("soil").innerText = d.soil1 + "%"
$("soil2").innerText = d.soil2 + "%"

$("temp").innerText = d.airTemp + "°C"
$("hum").innerText = d.humidity + "%"

$("soilTemp").innerText = d.soilTemp + "°C"
$("gas").innerText = d.gas + "%"

$("ph").innerText = d.ph

})

/* MANUAL STATUS */

db.ref("manual").on("value",snap=>{

const m = snap.val()

if(!m) return

$("pump").innerText = m.waterPump
$("machineStatus").innerText = m.sprayPump

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

if(mode !== "MANUAL") return

db.ref("manual/waterPump").set("ON")

}

function pumpOff(){

if(mode !== "MANUAL") return

db.ref("manual/waterPump").set("OFF")

}

function machineOn(){

if(mode !== "MANUAL") return

db.ref("manual/sprayPump").set("ON")

}

function machineOff(){

if(mode !== "MANUAL") return

db.ref("manual/sprayPump").set("OFF")

}

/* CLOCK */

setInterval(()=>{

const now = new Date()

$("time").innerText = now.toLocaleTimeString()

},1000)