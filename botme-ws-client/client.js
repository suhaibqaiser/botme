window.onload = function () {
  document.getElementById('messageBox').value = "";
  document.getElementById('log').value = "";
};
const ws = new WebSocket('ws://ec2-107-21-10-51.compute-1.amazonaws.com:6380/comms');
//const ws = new WebSocket('ws://localhost:6380/comms');

setConnectionStatus();
setInterval(function () { setConnectionStatus(); }, 1000);

ws.onopen = function () {
  console.log('WebSocket client connected to server');
};

ws.onclose = function () {
  
  console.error("WebSocket is closed");
}

ws.onerror = function (err) {
  console.error("WebSocket error observed:", err);
}

function setConnectionStatus() {
  document.getElementById('status').innerHTML = checkConnection();
}
function checkConnection() {
  switch (ws.readyState) {
    case 0:
      state = "CONNECTING";
      break;
    case 1:
      state = "CONNECTED";
      break;
    case 2:
      state = "CLOSING";
      break;
    case 3:
      state = "CLOSED";
      break;
  }
  return state;
}

function sendMessage() {
  ws.send(document.getElementById('messageBox').value);
  document.getElementById('log').value += '\n' + Date() + " | Message sent to server...";
  ws.onmessage = function (e) {
    document.getElementById('log').value += '\n' + e.data;
    document.getElementById('messageBox').value = "";
  };
};

