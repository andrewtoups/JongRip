function extend(subClass, superClass){
 var inheritance = (function(){});
 inheritance.prototype = superClass.prototype;
 subClass.prototype = new inheritance();
 subClass.prototype.constructor = subClass;
 subClass.prototype.superConstructor = superClass;
 subClass.superClass = superClass.prototype;
}

function dumbLog(){
	var d = document.createElement("div");
  d.innerHTML = Array
  	.prototype
    .slice
    .call(arguments,0,arguments.length)
    .map(function(x){return x.toString()})
    .join(", ");
	document.body.appendChild(d);
}

function selectOne(anArray){
	var l = anArray.length;
  return anArray[Math.floor(l*Math.random())];
}

function getMousePos(canvas, evt) {
        var rect = canvas.getBoundingClientRect();
        return {
          x: evt.clientX - rect.left,
          y: evt.clientY - rect.top
        };
      }

function main(){
  console.log("Hello World");
	var canvas = document.querySelector("#pong");
  canvas.width = 400;
  canvas.height = 300;
  // we need the "graphics context" for the canvas to
  // draw things
  var context = canvas.getContext('2d');
  // this is the thing we will use to do all our drawing
  // you can get a 3d context and do opengl!
  var world = new World();
  // setup playfield
  world.addObject(new Rectangle(194,0,12,300));
  dumbLog("After added boundary")
  var playerOne = new PlayerPaddle(125, canvas);
  var playerTwo = new Paddle(400-20, 125);
  var ball = new Ball(200-60, 150-60, canvas, playerOne, playerTwo);
  world.addObject(ball);
  world.addObject(playerOne);
  world.addObject(playerTwo);
  dumbLog("After added paddle")

  update(context,world,ball);
}

function World(){
	this.objects = [];
}

World.prototype.addObject = function(object){
	this.objects.push(object);
}

World.prototype.update = function(){
	this.objects.forEach(function(o){
  	if(o.update === "function"){
    	o.update();
    }
  });
}

World.prototype.draw = function(context){
	this.objects.forEach(function(object){
  	if (typeof object.draw === "function"){
    	object.draw(context);
    }
  })
}

function Rectangle(x, y, width, height, color){
	color = (typeof color === "undefined" ? "white" : color);
  this.x = x;
  this.y = y;
  this.width = width;
  this.height = height;
  this.color = color;
}

Rectangle.prototype.draw = function(context){
	context.fillStyle = this.color;
  context.fillRect(this.x, this.y, this.width, this.height);
}

Rectangle.prototype.top = function(){
	return this.y;
}

Rectangle.prototype.bottom = function(){
	return this.y + this.height;
}

Rectangle.prototype.left = function(){
	return this.x;
}

Rectangle.prototype.right = function(){
	return this.x + this.width;
}

function Paddle(x, y){
	Rectangle.call(this, x, y, 12, 50);
}

extend(Paddle, Rectangle);

function PlayerPaddle(y, canvas){
  Paddle.call(this, 20, y);
  this.canvas = canvas;
  var mouseMove = this.move.bind(this);
  canvas.addEventListener("mousemove", mouseMove);
}

extend (PlayerPaddle, Paddle);

PlayerPaddle.prototype.move = function(event) {
  var mousePos = getMousePos(this.canvas, event);
  this.y = mousePos.y-this.height/2;
  if (this.y < 0){
    this.y = 0;
  }
  if (this.bottom() > this.canvas.height){
    this.y = this.canvas.height - this.height;
    console.log(this.y);
  }

}

function Ball(x, y, canvas, paddle1, paddle2){
  Rectangle.call(this, x, y, 12, 12);
  this.xDir = 1;
  this.yDir = 1;
  this.canvas = canvas;
  this.paddle1 = paddle1;
  this.paddle2 = paddle2;
  requestAnimationFrame(function(){
    this.move;
  })

}

extend(Ball, Rectangle);

Ball.prototype.move = function(){
  this.x = this.x + this.xDir;
  this.y = this.y + this.yDir;
}


function update(context, world, ball){
		// just to convince ourselves something is happening, lets draw a rectangle
    // 0,0 is the top left corner
    context.fillStyle = "black";
    context.fillRect(0, 0, 400, 300);

    world.update();
    world.draw(context);
    ball.move();
    requestAnimationFrame(function(){
    	update(context, world);
      ball.move();
    })
    //hint
	}

document.addEventListener("DOMContentLoaded", main);
