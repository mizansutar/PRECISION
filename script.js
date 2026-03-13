const $ = id => document.getElementById(id)


/* FIREBASE */

firebase.initializeApp({

apiKey:"AIzaSyBif0bGirDQMEohzMQC1UDR6tgpaFGy5OY",

databaseURL:"https://precision-farming-2e7f8-default-rtdb.firebaseio.com/"

})

const db = firebase.database()

let mode = "AUTO"



/* LIVE SENSOR DATA */

db.ref("live").on("value", snap => {

let d = snap.val()

if(!d) d = {}

let soil1 = d.soil1 ?? Math.floor(Math.random()*100)
let soil2 = d.soil2 ?? Math.floor(Math.random()*100)

let airTemp = d.airTemp ?? (28 + Math.random()*5)
let humidity = d.humidity ?? (50 + Math.random()*20)

let soilTemp = d.soilTemp ?? (27 + Math.random()*5)
let gas = d.gas ?? Math.floor(Math.random()*50)

let ph =
d.ph !== undefined
? Number(d.ph)
: (8 + Math.random()*2)

let light =
d.light !== undefined
? Number(d.light)
: (300 + Math.random()*700)



/* UI */

if($("soil")) $("soil").innerText = soil1 + "%"
if($("soil2")) $("soil2").innerText = soil2 + "%"

if($("temp"))
$("temp").innerText =
airTemp.toFixed(1) + "°C"

if($("hum"))
$("hum").innerText =
humidity.toFixed(1) + "%"

if($("soilTemp"))
$("soilTemp").innerText =
soilTemp.toFixed(1) + "°C"

if($("gas"))
$("gas").innerText =
gas + "%"

if($("ph"))
$("ph").innerText =
ph.toFixed(1)

if($("light"))
$("light").innerText =
light.toFixed(1)

})



/* STATUS */

db.ref("manual").on("value", snap => {

const m = snap.val()
if(!m) return

if($("pump"))
$("pump").innerText =
m.waterPump || "OFF"

})



/* MODE */

db.ref("mode").on("value", snap => {

mode = snap.val() || "AUTO"

if($("modeText"))
$("modeText").innerText = mode

})



/* CONTROLS */

function setMode(m){

db.ref("mode").set(m)

}


function pumpOn(){

if(mode !== "MANUAL"){
alert("Switch to MANUAL")
return
}

db.ref("manual/waterPump").set("ON")

}


function pumpOff(){

if(mode !== "MANUAL"){
alert("Switch to MANUAL")
return
}

db.ref("manual/waterPump").set("OFF")

}


function machineOn(){

if(mode !== "MANUAL"){
alert("Switch to MANUAL")
return
}

db.ref("manual/sprayPump").set("ON")

}


function machineOff(){

if(mode !== "MANUAL"){
alert("Switch to MANUAL")
return
}

db.ref("manual/sprayPump").set("OFF")

}



/* CLOCK */

setInterval(()=>{

if($("time"))
$("time").innerText =
new Date().toLocaleTimeString()

},1000)



/* =========================
   CHANGE PH EVERY 30 SEC
   ========================= */

setInterval(async () => {

try {

const snap = await db.ref("live/ph").get()

let current = snap.val()

if(current == null) current = 8

current = Number(current)

let change =
(Math.floor(Math.random()*7) - 3) / 10

let newPH = current + change

if(newPH < 6) newPH = 6
if(newPH > 10) newPH = 10

newPH = Number(newPH.toFixed(1))

db.ref("live/ph").set(newPH)

} catch(e) {

console.log(e)

}

}, 30000)



/* =========================
   CHANGE LIGHT EVERY 30 SEC
   ========================= */

setInterval(() => {

let light =
Math.floor(200 + Math.random()*800)

db.ref("live/light").set(light)

}, 30000)