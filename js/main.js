// The amount of circles we want to make:
var count = 150;
var explosionCount = 50;
var score = 0;
var points = 50;
var smooth = true;
var audioLayer;
var frame = 0;
var backgroundMultiplier = 1;
var initial = false;
var drawingPath;
var wavePath;

$(function(){
  background();
})

function background(){
  audioLayer = new Layer();
  wavePath = new Path();
  var pathHeight = view.size.height;
  wavePath.fillColor = getRandomColor();
  initializePath();
  initializeDrawing();
}

function initializeDrawing(){
  drawingPath = new Path();
  drawingPath.strokeColor = 'black';
  drawingPath.strokeWidth = 10;
  drawingPath.add(Math.random() * view.size.width, Math.random() * view.size.height)
}

function initializePath() {
  center = view.center;
  width = view.size.width + view.size.width / 10;
  height = view.size.height / 2;
  wavePath.segments = [];
  wavePath.add(view.bounds.bottomLeft);
  for (var i = 1; i < points; i++) {
    var point = new Point((width / points * i) - view.size.width / 20, center.y);
    wavePath.add(point);
  }
  wavePath.add(view.bounds.bottomRight);
}

function makeCircle(radius, center, direction, offset){
  var path = new Path.Circle({
    center: center,
    radius: radius,
    fillColor: getRandomColor(),
    strokeColor: getRandomColor()
  })
  if (direction){
    path.direction = direction;
  }
  if (offset){
    path.offset = offset;
  }
  return path;
}

var explosionLayer = new Layer();

var bubbleLayer = new Layer();
for (var i = 0; i < count; i++) {
  circle = makeCircle(i / count * 20, Point.random() * view.size);
}
// var text = new PointText({
//   point: view.center,
//   justification: 'center',
//   fontSize: view.size.width / 5 + 'pt',
//   fillColor: getRandomColor()
// });

function animateBackground(){
  var freqByteData = new Uint8Array(audioAnalyser.frequencyBinCount);
  audioAnalyser.getByteFrequencyData(freqByteData);
  for (var i = 1; i < points; i++) {
    var item = wavePath.segments[i];
    var itemPoint = item.point.y;
    magnitude = freqByteData[i];
    if(initial && (magnitude * backgroundMultiplier - 1 > itemPoint || itemPoint > magnitude * backgroundMultiplier + 1)){
      item.point.y = magnitude * backgroundMultiplier + view.size.height / 4;
    }
  }
  wavePath.smooth();
  wavePath.fillColor.hue += 0.5;
}

function draw(){
  lastPoint = drawingPath.lastSegment;
  drawingPath.add(lastPoint.x + (Math.random() * 5 - 2.5), lastPoint.y + (Math.random() * 5 - 2.5));
  drawingPath.simplify();
  drawingPath.smooth();
}


function onFrame(event) {
  if(loaded){
    animateBackground();
    if(!initial){
      initial = true;
    }
    draw();
    // text.content = score;
    for (var i = 0; i < bubbleLayer.children.length; i++) {
      var item = bubbleLayer.children[i];
      if (item.bounds.width > 15){
        item.position.x -= item.bounds.width / 30;
        if (item.bounds.right < 0){
          item.position.x = view.size.width + item.bounds.width;
        }
      } else {
        item.position.x += item.bounds.width / 30;
        if (item.bounds.left > view.size.width){
          item.position.x = -item.bounds.width;
        }
      }
      item.fillColor.hue += 1;
    }

    if (explosionLayer.children.length > 0){
      for(var i = 0; i < explosionLayer.children.length; i++){
        var item = explosionLayer.children[i];
        if (!contains(item)){
          item.remove();
        } else {
          moveItem(item);
        }
      }
    }
  } else {
    // text.content = 'loading';
  }
}


function moveItem(item){
  var offset = item.offset;
  var randomOffset = (Math.random() * 10 - 5);
  switch (item.direction){
    case 'left':
      item.position.x -= (20 + randomOffset);
      item.position.y += offset;
      break;
    case 'right':
      item.position.x += (20 + randomOffset);
      item.position.y += offset;
      break;
    case 'up':
      item.position.y += (20 + randomOffset);
      item.position.x += offset;
      break;
    case 'down':
      item.position.y -= (20 + randomOffset);
      item.position.x += offset;
      break;
  }
}

function onMouseDown(event){
  for (var i = 0; i < count; i++) {
    var item = project.activeLayer.children[i];
    if (item.contains(event.point)){
      currentStage++;
      makeMusic();
      explosions = [];
      radius = item.bounds.width;
      center = item.getInteriorPoint();
      item.remove();
      score++;
      text.fillColor = getRandomColor();
      explosionLayer.activate();
      for(var i = 0; i < explosionCount; i++){
        switch (i % 4){
          case 0:
            direction = 'up';
            break;
          case 1:
            direction = 'down';
            break;
          case 2:
            direction = 'left';
            break;
          case 3:
            direction = 'right';
            break;
        }
        makeCircle(radius / 10, center + (Math.random() * (radius/2) - (radius/4)), direction, (Math.random() * 20) - 10);
      }
      bubbleLayer.activate();
    }
  }
}

function contains(item){
  if(item.bounds.left > view.size.width ||
     item.bounds.right < 0 ||
     item.bounds.top > view.size.height ||
     item.bounds.bottom < 0){
    return false;
  } else {
    return true;
  }
}

function getRandomColor() {
  var letters = '0123456789ABCDEF'.split('');
  var color = '#';
  for (var i = 0; i < 6; i++ ) {
    color += letters[Math.round(Math.random() * 15)];
  }
  return color;
}

