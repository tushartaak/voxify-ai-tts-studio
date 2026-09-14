import '@testing-library/jest-dom';

// Polyfill HTMLMediaElement in jsdom
window.HTMLMediaElement.prototype.load = () => {};
window.HTMLMediaElement.prototype.play = () => Promise.resolve();
window.HTMLMediaElement.prototype.pause = () => {};

// Polyfill SpeechSynthesis & SpeechSynthesisUtterance in jsdom
class MockSpeechSynthesisUtterance {
  constructor(text = '') {
    this.text = text;
    this.lang = 'en-US';
    this.voice = null;
    this.rate = 1.0;
    this.pitch = 1.0;
    this.volume = 1.0;
    this.onstart = null;
    this.onend = null;
    this.onerror = null;
    this.onpause = null;
    this.onresume = null;
    this.onboundary = null;
  }
}

const mockVoices = [
  { name: 'Samantha', lang: 'en-US', default: true, localService: true },
  { name: 'Alex', lang: 'en-US', default: false, localService: true },
  { name: 'Lekha', lang: 'hi-IN', default: false, localService: true }
];

const mockSpeechSynthesis = {
  speaking: false,
  paused: false,
  pending: false,
  onvoiceschanged: null,
  getVoices: () => mockVoices,
  speak: (utterance) => {
    if (utterance?.onstart) utterance.onstart();
  },
  cancel: () => {},
  pause: () => {},
  resume: () => {}
};

window.SpeechSynthesisUtterance = MockSpeechSynthesisUtterance;
window.speechSynthesis = mockSpeechSynthesis;

