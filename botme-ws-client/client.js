window.onload = function () {
  document.getElementById('messageBox').value = "";
  document.getElementById('log').value = "";
};
//const ws = new WebSocket('ws://54.165.125.65:6380/comms');
const ws = new WebSocket('ws://localhost:6380/comms');

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

var input = document.getElementById("messageBox");

// Execute a function when the user releases a key on the keyboard
input.addEventListener("keyup", function(event) {
  // Number 13 is the "Enter" key on the keyboard
  if (event.keyCode === 13 || event.which === 13) {
    // Cancel the default action, if needed
    event.preventDefault();
    // Trigger the button element with a click
    sendMessage()
  }
});

function sendMessage() {
  let request = {
    "clientID": "987530c0-998d-4cfc-b86d-596b5f7cd7d7",
    "current_time": "2021-04-07 00:49:00",
    "message_format": "text",
    "message_command": "find",
    "language": "en-US",
    "message_text": "",
    "authToken": "qbw/fcQKvC6SY+AelUs5VpRYOhnRvzZsz39xVU06LYI="
  }
  request.message_text = document.getElementById('messageBox').value
  ws.send(JSON.stringify(request));
  document.getElementById('log').value += '\n' + Date() + " | Message sent to server...";
  ws.onmessage = function (e) {
    document.getElementById('log').value += '\n' + e.data;
    document.getElementById('messageBox').value = "";
  };
};

