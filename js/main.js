// The amount of circles we want to make:
var count = 150;
var explosionCount = 50;
var score = 0;

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

// function makeSquare(width, origin){
//   var path = new Path.Rectangle({
//     point: [origin, origin],
//     size: [width, width],
//     fillColor: getRandomColor(),
//     strokeColor: getRandomColor()
//   })
// }

var explosionLayer = new Layer();

var bubbleLayer = new Layer();
for (var i = 0; i < count; i++) {
  circle = makeCircle(i / count * 20, Point.random() * view.size);
}
var text = new PointText({
  point: view.center,
  justification: 'center',
  fontSize: view.size.width / 5 + 'pt',
  fillColor: getRandomColor()
});

function onFrame(event) {
  text.content = score;
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

