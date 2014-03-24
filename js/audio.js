var sounds = ['bass-clarinet', 'bassoon', 'clarinet', 'double-bass', 'drums', 'flute', 'guitar', 'harp', 'pad', 'piano', 'snare', 'synth'];
var loadedSounds = [];
var currentStage = 0
var playOrder = [['pad', 'drums'], ['piano', 'synth'], ['guitar'], ['harp'], ['bassoon', 'clarinet', 'bass-clarinet'], ['snare'], ['flute']];

function getFiles(){
  var soundFiles = [];
  for(var i = 0; i < sounds.length; i++){
    soundFiles.push('../audio/' + sounds[i] + '.mp3')
  }
  return soundFiles;
}

function Track(name, buffer) {
  this.track = name;
  this.audio = audioContext.createBufferSource();
  this.gainNode = audioContext.createGain();
  this.gainNode.gain.value = 0.
  this.audio.connect(this.gainNode);
  this.audio.loop = true;
  this.audio.buffer = buffer;
  this.gainNode.connect(audioContext.destination);
}

var audioContext;
var bufferLoader;

window.addEventListener('load', init, false);

function init() {
  window.AudioContext = window.AudioContext||window.webkitAudioContext;
  audioContext = new AudioContext();

  bufferLoader = new BufferLoader(
    audioContext,
    getFiles(),
    finishedLoading
  );

  bufferLoader.load();
}

function finishedLoading(bufferList){
  for(var i=0;i<bufferList.length;i++){
    loadedSounds.push(new Track(bufferList[i].name, bufferList[i]));
  }
  loadedSounds.forEach(function(sound){
    sound.audio.start(0);
  });
  makeMusic();
}

function makeMusic(){
  loadedSounds.forEach(function(sound){
    if($.inArray(sound.track, playOrder[currentStage]) != -1){
      sound.gainNode.gain.value = 1;
    }
  })
}
