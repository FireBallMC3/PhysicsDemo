const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

const FPS = 60;
const TPS = 120;
const DRAG = 0.01;
const GRAVITY = 9.8;

setInterval(update, 1000 / TPS);
setInterval(frame, 1000 / FPS);

var fps = 0;
var tps = 0;
var debugText = new TextBlock(10, 20, 20);
var fpsText = new TextBlock(10, 20, 20);
var ball = new Ball(100, 30, 0, 0, 20, new PhysicsMaterial(0.5, 0, 0));
var planet = new Planet(512/2, 512/2, 50);
var arrow = new VectorDisplay(10, 10, 1, 1);
var mouseX = 0;
var mouseY = 0;
var isPaused = false;
var drawArrow = false;
var isMouseDown = false;

// canvas.style.backgroundColor = "lightgrey";
canvas.style.border = "1px solid black";
// ball.draw();

document.addEventListener('contextmenu', event => event.preventDefault());


time = 0;
function update(){
    deltaTime = performance.now() - time;
    time = performance.now();
    tick(deltaTime);
    tps = (tps * 9 + 1000 / deltaTime) / 10;
}

function tick(deltaTime){
    if (!isPaused){
        ball.step(deltaTime, [planet]);
    }
    if(isMouseDown){
        // get distance from mouse to ball
        var distX = ball.x - mouseX;
        var distY = ball.y - mouseY;
        // console.log(distX, distY);
        ball.xVel = -distX * 10;
        ball.yVel = -distY * 10;
    }
}

frameTime = 0;
function frame(){
    deltaTime = performance.now() - frameTime;
    frameTime = performance.now();
    //get average fps over 10 frames
    fps = (fps * 9 + 1000 / deltaTime) / 10;
    // fps = 1000 / deltaTime;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    if(isPaused || drawArrow){
        arrow.x = ball.x;
        arrow.y = ball.y;
        arrow.xDir = ball.xVel / 10;
        arrow.yDir = ball.yVel / 10;
        arrow.draw();
    }
    planet.draw();
    ball.draw();

    fpsText.x = canvas.width - 100;
    fpsText.setText(0, `FPS: ${fps.toFixed(2)}`);
    fpsText.setText(1, `TPS: ${tps.toFixed(2)}`);
    fpsText.draw(ctx);

    debugText.setText(0, `x: ${ball.x.toFixed(2)}`);
    debugText.setText(1, `y: ${ball.y.toFixed(2)}`);
    debugText.setText(2, `xVel: ${ball.xVel.toFixed(2)}`);
    debugText.setText(3, `yVel: ${ball.yVel.toFixed(2)}`);
    debugText.setText(4, `drag: ${ball.physMat.drag.toFixed(2)}`);
    debugText.setText(5, `gravity: ${ball.physMat.gravity.toFixed(2)}`);
    debugText.setText(6, `restitution: ${ball.physMat.restitution.toFixed(2)}`);
    debugText.setText(7, `radius: ${ball.radius.toFixed(2)}`);

    // debugText.linkFunction(0, funcType.mouseWheel, mouseWheel);

    debugText.draw(ctx);
}

function mouseMove(e) {
    // mouseX = e.clientX;
    // mouseY = e.clientY;
    var rect = canvas.getBoundingClientRect();
    mouseX = (e.clientX - rect.left) / (rect.right - rect.left) * canvas.width,
    mouseY = (e.clientY - rect.top) / (rect.bottom - rect.top) * canvas.height
    mouseX = Math.round(mouseX);
    mouseY = Math.round(mouseY);
    // console.log(mouseX, mouseY);
    
    
    if (e.buttons == 2) {
        ball.xVel += e.movementX * 10;
        ball.yVel += e.movementY * 10;
    }
    // console.log(event.movementX, event.movementY);
}

function mouseDown(e) {
    // console.log(e);
    // console.log(e.button == 0);
    if(e.button == 0){
        isMouseDown = true;
    }
}

function mouseUp(e) {
    // console.log(e);
    // console.log(e.button == 0);
    if(e.button == 0){
        isMouseDown = false;
    }
}

function mouseWheel(e) {
    // console.log(mouseX, mouseY);
    debugText.mouseAction(4, debugTextMouseWheel, e, true);
    debugText.mouseAction(5, debugTextMouseWheel, e, true);
    debugText.mouseAction(6, debugTextMouseWheel, e, true);
    debugText.mouseAction(7, debugTextMouseWheel, e, true);
}

function debugTextMouseWheel(e, i) {

    var modifier = 1;
    // if (e.ctrlKey) {
    //     modifier = 0.1;
    // }
    if (e.shiftKey) {
        modifier = 0.1;
    }
    if (e.altKey) {
        modifier = 0.01;
    }
    switch (i) {
        case 4:
            ball.physMat.drag -= e.deltaY / 100 * modifier;
            break;
        case 5:
            ball.physMat.gravity -= e.deltaY / 100 * modifier;
            break;
        case 6:
            ball.physMat.restitution -= e.deltaY / 100 * modifier;
            break;
        case 7:
            ball.radius -= e.deltaY / 100 * modifier;
            break;
    }
}

function keyDown(e) {
    switch (e.code) {
        case "Space":
            console.log("space");
            isPaused = !isPaused;
            break;
        case "KeyH":
            // console.log("h");
            drawArrow = !drawArrow;
            break;
    }
}

document.addEventListener("mousedown", mouseDown);
document.addEventListener("mouseup", mouseUp);
document.addEventListener("mousemove", mouseMove);
document.addEventListener("mousewheel", mouseWheel);
document.addEventListener("keydown", keyDown)