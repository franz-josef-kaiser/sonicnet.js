/**
 * A simple sonic encoder/decoder for [a-z0-9] => frequency (and back).
 * A way of representing characters with frequency.
 */
var ALPHABET = '\n abcdefghijklmnopqrstuvwxyz0123456789,.!?@*';

function SonicCoder(params) {
  params = params || {};
  this.freqMin = params.freqMin || 18500;
  this.freqMax = params.freqMax || 19500;
  this.freqError = params.freqError || 50;
  this.alphabetString = params.alphabet || ALPHABET;
  this.startSeq = params.startSeq || '^$^';
  this.endSeq = params.endSeq || '$^$';
  this.specialChar = params.specialChar || '+';
  // Make sure that the alphabet has the start and end chars.
  startChar = this.startSeq[0]
  endChar = this.endSeq[this.endSeq.length - 1]
  this.alphabet = startChar + this.alphabetString + endChar;
}

/**
 * Given a character, convert to the corresponding frequency.
 */
SonicCoder.prototype.charToFreq = function(char) {
  // Get the index of the character.
  var index = this.alphabet.indexOf(char);
  if (index == -1) {
    // If this character isn't in the alphabet, error out.
    console.error(char, 'is an invalid character.');
    index = this.alphabet.length - 1;
  }
  // Convert from index to frequency.
  var freqRange = this.freqMax - this.freqMin;
  var percent = index / (this.alphabet.length - 1);
  var freqOffset = Math.round(freqRange * percent);
  return this.freqMin + freqOffset;
};

/**
 * Given a frequency, convert to the corresponding character.
 */
SonicCoder.prototype.freqToChar = function(freq) {
  // If the frequency is out of the range.
  if (!(this.freqMin < freq && freq < this.freqMax)) {
    // If it's close enough to the min, clamp it (and same for max).
    if (Math.abs(this.freqMin - freq) < this.freqError) {
      freq = this.freqMin;
    } else if (Math.abs(freq - this.freqMax) < this.freqError) {
      freq = this.freqMax;
    } else {
      // Otherwise, report error.
      console.error(freq, 'is out of range.');
      return null;
    }
  }
  // Convert frequency to index to char.
  var freqRange = this.freqMax - this.freqMin;
  var percent = (freq - this.freqMin) / freqRange;
  var index = Math.round((this.alphabet.length-1) * percent);
  return this.alphabet[index];
};
/*
 * Convert a raw message to a string ready to be sent
 */
SonicCoder.prototype.encodeMessage = function(message) {
  message = this.startSeq + message + this.endSeq;

  var i = 1, len = message.length;
  messageArr = message.split('')
  for (i; i < len; i++) {
    if (messageArr[i] == messageArr[i-1])
      messageArr[i] = this.specialChar;
  }

  return messageArr.join('')
};

module.exports = SonicCoder;
