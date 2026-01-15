/* ================= FIREBASE CONFIG ================= */
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  databaseURL: "https://precision-farming-2e7f8-default-rtdb.firebaseio.com",
};

firebase.initializeApp(firebaseConfig);
const db = firebase.database();

/* ================= STATE ================= */
let mode = "AUTO";

/* ================= AUTH (UI ONLY) ================= */
function login() {
  window.location = "dashboard.html";
}

function logout() {
  window.location = "index.html";
}

/* ================= MODE ================= */
function setMode(m) {
  mode = m;
  db.ref("mode").set(m);
}

/* ================= MANUAL CONTROLS ================= */
function pumpOn() {
  if (mode === "MANUAL") {
    db.ref("manual/waterPump").set("ON");
  }
}

function pumpOff() {
  if (mode === "MANUAL") {
    db.ref("manual/waterPump").set("OFF");
  }
}

function machineOn() {
  if (mode === "MANUAL") {
    db.ref("manual/sprayPump").set("ON");
  }
}

function machineOff() {
  if (mode === "MANUAL") {
    db.ref("manual/sprayPump").set("OFF");
  }
}

/* ================= LIVE DATA ================= */
db.ref("live").on("value", snap => {
  const d = snap.val();
  if (!d) return;

  soil.innerText = d.soil1 + "%";
  temp.innerText = d.airTemp + "°C";
  hum.innerText = d.humidity + "%";
  pump.innerText = d.waterPump;
  machineStatus.innerText = d.sprayPump;

  if (d.waterPump === "ON") {
    alertText.innerText = "Irrigation running";
  } else {
    alertText.innerText = "No active alerts";
  }
});

/* ================= MODE LISTENER ================= */
db.ref("mode").on("value", snap => {
  mode = snap.val() || "AUTO";
  modeText.innerText = mode;

  autoBtn.classList.remove("active");
  manualBtn.classList.remove("active");

  if (mode === "AUTO") {
    autoBtn.classList.add("active");
    startBtn.disabled = true;
    stopBtn.disabled = true;
    machineOn.disabled = true;
    machineOff.disabled = true;
  } else {
    manualBtn.classList.add("active");
    startBtn.disabled = false;
    stopBtn.disabled = false;
    machineOn.disabled = false;
    machineOff.disabled = false;
  }
});

/* ================= CLOCK ================= */
setInterval(() => {
  time.innerText = new Date().toLocaleTimeString();
}, 1000);
