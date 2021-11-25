'use strict';

const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
const recognition = new SpeechRecognition();
let voices = [];
let speechToText = '';
recognition.lang = 'en-UK';
recognition.interimResults = false;
recognition.maxAlternatives = 1;
recognition.continuous = true;

function toggleOn() {
  recognition.start();
}

function convertedSpeechText(){
  return speechToText
}

recognition.addEventListener('speechstart', () => {
  console.log('Speech has been detected.');
});

recognition.addEventListener('result', (e) => {
  console.log('Result has been detected.');

  let last = e.results.length - 1;
  speechToText = e.results[last][0].transcript;

  console.log('outputYou =>', speechToText)
  synthVoice(speechToText)
});

recognition.addEventListener('speechend', () => {
  console.log('speechend')
  // recognition.stop();
});

recognition.addEventListener('error', (e) => {
  console.log('Error: ' + e.error)
});

window.speechSynthesis.onvoiceschanged = function () {
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
