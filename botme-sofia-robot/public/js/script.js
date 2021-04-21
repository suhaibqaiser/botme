'use strict';

const socket = io();

const outputYou = document.querySelector('.output-you');
const outputBot = document.querySelector('.output-bot');
const outputConfidence = document.querySelector('.output-confidence');
//const outputDebug = document.querySelector('.output-debug');

const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
const recognition = new SpeechRecognition();

recognition.lang = 'en-US';
recognition.interimResults = false;
recognition.maxAlternatives = 1;

document.querySelector('button').addEventListener('click', () => {
  recognition.start();
});

recognition.addEventListener('speechstart', () => {
  //outputDebug.textContent = '\nSpeech has been detected.'
  console.log('Speech has been detected.');
});

recognition.addEventListener('result', (e) => {
  //outputDebug.textContent += '\nResult has been detected.'
  console.log('Result has been detected.');

  let last = e.results.length - 1;
  let text = e.results[last][0].transcript;

  outputYou.textContent = text;
  console.log('Confidence: ' + e.results[0][0].confidence);
  outputConfidence.textContent = 'Confidence: ' + e.results[0][0].confidence

  socket.emit('chat message', text);
});

recognition.addEventListener('speechend', () => {
  //outputDebug.textContent += '\nSpeech Ended'
  recognition.stop();
});

recognition.addEventListener('error', (e) => {
  outputBot.textContent = 'Error: ' + e.error;
});

function synthVoice(text) {
  const synth = window.speechSynthesis;
  const utterance = new SpeechSynthesisUtterance();
  utterance.text = text;
  synth.speak(utterance);
}

socket.on('bot reply', function(replyText) {
  synthVoice(replyText);

  if(replyText == '') replyText = '(No answer...)';
  outputBot.textContent = replyText;
});
