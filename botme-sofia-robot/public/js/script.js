'use strict';

const socket = io();

const outputYou = document.querySelector('.output-you');
const outputBot = document.querySelector('.output-bot');
const button = document.getElementsByClassName('speak-button')[0]
//const outputConfidence = document.querySelector('.output-confidence');
//const outputDebug = document.querySelector('.output-debug');

const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
const recognition = new SpeechRecognition();
let voices = [];
recognition.lang = 'en-UK';
recognition.interimResults = false;
recognition.maxAlternatives = 1;

document.querySelector('button').addEventListener('click', () => {
  recognition.start();
});
document.querySelector('#logout').addEventListener('click', () => {
  document.cookie = "clientToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC;"
  window.location.reload();
});
recognition.addEventListener('speechstart', () => {
  //outputDebug.textContent = '\nSpeech has been detected.'
  console.log('Speech has been detected.');
  button.style.background = "orangered"
});

recognition.addEventListener('result', (e) => {
  //outputDebug.textContent += '\nResult has been detected.'
  console.log('Result has been detected.');

  let last = e.results.length - 1;
  let text = e.results[last][0].transcript;

  outputYou.textContent = text;
  console.log('Confidence: ' + e.results[0][0].confidence);
  //outputConfidence.textContent = 'Confidence: ' + e.results[0][0].confidence

  let clientToken = getCookie('clientToken');
  console.log('client token = ' + clientToken)
  let message = {
    "command" : text,
    "auth" : clientToken
  }
  socket.emit('chat message', JSON.stringify(message));
});

recognition.addEventListener('speechend', () => {
  //outputDebug.textContent += '\nSpeech Ended'
  recognition.stop();
  button.style.background = "linear-gradient(180deg, #39C2C9 0%, #3FC8C9 80%, #3FC8C9 100%)"
});

recognition.addEventListener('error', (e) => {
  outputBot.textContent = 'Error: ' + e.error;
});
window.speechSynthesis.onvoiceschanged = function() {
  console.log(window.speechSynthesis.getVoices());
  voices = window.speechSynthesis.getVoices();
};
function synthVoice(text) {
  const synth = window.speechSynthesis;
  const utterance = new SpeechSynthesisUtterance();
  utterance.voice = voices[2];
  utterance.text = text;
  utterance.lang = 'en-UK'
  utterance.rate = Number(1.1)
  synth.speak(utterance);
}
function getCookie(name) {
  // Add the = sign
  name = name + '=';

  // Get the decoded cookie
  let decodedCookie = decodeURIComponent(document.cookie);

  // Get all cookies, split on ; sign
  let cookies = decodedCookie.split(';');

  // Loop over the cookies
  for (let i = 0; i < cookies.length; i++) {
    // Define the single cookie, and remove whitespace
    let cookie = cookies[i].trim();

    // If this cookie has the name of what we are searching
    if (cookie.indexOf(name) == 0) {
      // Return everything after the cookies name
      return cookie.substring(name.length, cookie.length);
    }
  }
}
socket.on('bot reply', function(replyText) {
  synthVoice(replyText);

  if(replyText == '') replyText = '(No answer...)';
  outputBot.textContent = replyText;
});
