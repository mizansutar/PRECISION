let mode = "AUTO";

function login() {
  window.location = "dashboard.html";
}

function logout() {
  window.location = "index.html";
}

function setMode(m) {
  mode = m;
  modeText.innerText = m;

  autoBtn.classList.remove("active");
  manualBtn.classList.remove("active");

  if (m === "AUTO") {
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
}

function pumpOn() {
  if (mode === "MANUAL") {
    pump.innerText = "ON";
    alertText.innerText = "Pump started manually";
  }
}

function pumpOff() {
  if (mode === "MANUAL") {
    pump.innerText = "OFF";
    alertText.innerText = "Pump stopped manually";
  }
}

function machineOn() {
  if (mode === "MANUAL") {
    machineStatus.innerText = "ON";
    alertText.innerText = "Machine turned ON";
  }
}

function machineOff() {
  if (mode === "MANUAL") {
    machineStatus.innerText = "OFF";
    alertText.innerText = "Machine turned OFF";
  }
}

setInterval(() => {
  time.innerText = new Date().toLocaleTimeString();
}, 1000);

setMode("AUTO");
