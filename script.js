const $ = id => document.getElementById(id)

/* LOGIN */

const EMAIL = "device@farm.local"
const PASSWORD = "StrongPassword123"

function login(){

const user = $("username").value.trim()
const pass = $("password").value

if(user !== EMAIL || pass !== PASSWORD){
alert("Invalid credentials")
return
}

$("loginLoader").classList.remove("hidden")

let t = 3

$("loginCount").innerText = t

const timer = setInterval(()=>{

$("loginCount").innerText = --t

if(t<=0){

clearInterval(timer)

sessionStorage.setItem("loggedIn","true")

location.href="dashboard.html"

}

},1000)

}

/* DASHBOARD GUARD */

if(location.pathname.includes("dashboard")){

if(sessionStorage.getItem("loggedIn")!=="true"){

location.href="index.html"

}

}

/* FIREBASE */

firebase.initializeApp({
apiKey:"AIzaSyBif0bGirDQMEohzMQC1UDR6tgpaFGy5OY",
databaseURL:"https://precision-farming-2e7f8-default-rtdb.firebaseio.com"
})

const db = firebase.database()

let mode="AUTO"
let busy=false

/* LIVE DATA */

db.ref("live").on("value",snap=>{

const d=snap.val()

if(!d) return

$("soil").innerText=d.soil1+"%"
$("soil2").innerText=d.soil2+"%"
$("temp").innerText=d.airTemp+"°C"
$("hum").innerText=d.humidity+"%"
$("gas").innerText=d.gas+"%"
$("soilTemp").innerText=d.soilTemp+"°C"

$("pump").innerText=d.waterPump
$("machineStatus").innerText=d.sprayPump

})

/* MODE */

db.ref("mode").on("value",snap=>{

mode=snap.val() || "AUTO"

$("modeText").innerText=mode

const manual = mode==="MANUAL"

$("autoBtn").classList.toggle("active",!manual)
$("manualBtn").classList.toggle("active",manual)

})

/* CONTROLS */

function setMode(m){

db.ref("mode").set(m)

}

function pumpOn(){

if(mode!=="MANUAL") return

db.ref("manual/waterPump").set("ON")

}

function pumpOff(){

if(mode!=="MANUAL") return

db.ref("manual/waterPump").set("OFF")

}

function machineOn(){

if(mode!=="MANUAL") return

db.ref("manual/sprayPump").set("ON")

}

function machineOff(){

if(mode!=="MANUAL") return

db.ref("manual/sprayPump").set("OFF")

}

/* CLOCK */

setInterval(()=>{

$("time").innerText=new Date().toLocaleTimeString()

},1000)