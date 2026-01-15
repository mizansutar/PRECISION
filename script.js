/* ================= COMMON ================= */
const $ = id => document.getElementById(id);

/* ================= CLIENT-SIDE AUTH ================= */
const EMAIL = "device@farm.local";
const PASSWORD = "StrongPassword123";

/* ===== LOGIN ===== */
function login() {
  const user = $("username").value.trim();
  const pass = $("password").value;

  if (user !== EMAIL || pass !== PASSWORD) {
    alert("Invalid credentials");
    return;
  }

  $("loginLoader").classList.remove("hidden");

  let t = 3;
  $("loginCount").innerText = t;

  const timer = setInterval(() => {
    $("loginCount").innerText = --t;
    if (t <= 0) {
      clearInterval(timer);
      sessionStorage.setItem("loggedIn", "true");
      location.href = "dashboard.html";
    }
  }, 1000);
}

/* ===== LOGOUT ===== */
function logout() {
  sessionStorage.removeItem("loggedIn");
  location.href = "index.html";
}

/* ===== DASHBOARD GUARD ===== */
if (location.pathname.includes("dashboard")) {
  if (sessionStorage.getItem("loggedIn") !== "true") {
    location.href = "index.html";
  }
}

/* ===== STOP HERE IF NOT DASHBOARD ===== */
if (!location.pathname.includes("dashboard")) {
  // Prevent Firebase + dashboard logic on login page
  console.log("Login page loaded");
} else {

  /* ================= FIREBASE ================= */
  firebase.initializeApp({
    apiKey: "AIzaSyBif0bGirDQMEohzMQC1UDR6tgpaFGy5OY",
    databaseURL: "https://precision-farming-2e7f8-default-rtdb.firebaseio.com"
  });

  const db = firebase.database();

  /* ================= STATE ================= */
  let mode = "AUTO";
  let busy = false;

  /* ================= LOADER ================= */
  function showLoader(text, sec, cb) {
    if (busy) return;
    busy = true;

    $("loaderText").innerText = text;
    $("loaderCount").innerText = sec;
    $("loader").classList.remove("hidden");

    let t = sec;
    const timer = setInterval(() => {
      $("loaderCount").innerText = --t;
      if (t <= 0) {
        clearInterval(timer);
        $("loader").classList.add("hidden");
        busy = false;
        cb && cb();
      }
    }, 1000);
  }

  /* ================= LIVE DATA ================= */
  db.ref("live").on("value", snap => {
    const d = snap.val();
    if (!d) return;

    $("soil").innerText = d.soil1 + "%";
    $("soil2").innerText = d.soil2 + "%";
    $("temp").innerText = d.airTemp + "°C";
    $("hum").innerText = d.humidity + "%";
    $("gas").innerText = d.gas + "%";
    $("soilTemp").innerText =
      d.soilTemp < -100 ? "ERR" : d.soilTemp + "°C";

    $("pump").innerText = d.waterPump;
    $("machineStatus").innerText = d.sprayPump;
  });

  /* ================= MODE ================= */
  db.ref("mode").on("value", snap => {
    mode = snap.val() || "AUTO";
    $("modeText").innerText = mode;

    const manual = mode === "MANUAL";
    $("autoBtn").classList.toggle("active", !manual);
    $("manualBtn").classList.toggle("active", manual);

    ["startBtn", "stopBtn", "machineOn", "machineOff"]
      .forEach(id => $(id).disabled = !manual);
  });

  /* ================= CONTROLS ================= */
  function setMode(m) {
    showLoader(`Switching to ${m}…`, 10, () => {
      db.ref("mode").set(m);
      if (m === "AUTO") {
        db.ref("manual").set({
          waterPump: "OFF",
          sprayPump: "OFF"
        });
      }
    });
  }

  function pumpOn() {
    if (mode !== "MANUAL") return;
    showLoader("Pump ON…", 10, () =>
      db.ref("manual/waterPump").set("ON")
    );
  }

  function pumpOff() {
    if (mode !== "MANUAL") return;
    showLoader("Pump OFF…", 10, () =>
      db.ref("manual/waterPump").set("OFF")
    );
  }

  function machineOn() {
    if (mode !== "MANUAL") return;
    showLoader("Motor ON…", 10, () =>
      db.ref("manual/sprayPump").set("ON")
    );
  }

  function machineOff() {
    if (mode !== "MANUAL") return;
    showLoader("Motor OFF…", 5, () =>
      db.ref("manual/sprayPump").set("OFF")
    );
  }

  /* ================= CLOCK ================= */
  setInterval(() => {
    $("time").innerText = new Date().toLocaleTimeString();
  }, 1000);
}
   