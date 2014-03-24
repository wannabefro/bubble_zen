var sounds = ['bass-clarinet', 'bassoon', 'clarinet', 'double-bass', 'drums', 'flute', 'guitar', 'harp', 'pad', 'piano', 'snare', 'synth'];
var loadedSounds = [];

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
  this.audio.loop = true;
  this.audio.buffer = buffer;
  this.audio.connect(audioContext.destination);
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
    var soundPosition = sounds.indexOf(bufferList[i].name);
    sounds[soundPosition] = new Track(bufferList[i].name, bufferList[i]);
    loadedSounds.push(sounds[soundPosition]);
  }
  loadedSounds.forEach(function(sound){
    sound.audio.start(0);
  });
}
