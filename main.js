const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

const FPS = 60;
const DRAG = 0.01;
const GRAVITY = 9.8;

setInterval(update, 1000 / FPS);

var fps = 0;
var debugText = new TextBlock(10, 20, 20);
var ball = new Ball(100, 10, 0, 0, 20, new PhysicsMaterial());
var mouseX = 0;
var mouseY = 0;

// canvas.style.backgroundColor = "lightgrey";
canvas.style.border = "1px solid black";
ball.draw();

time = 0;
function update(){
    deltaTime = performance.now() - time;
    time = performance.now();
    tick(deltaTime);
    fps = 1000 / deltaTime;
}

function tick(deltaTime){
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ball.draw();
    ball.step(deltaTime);

    fpsText = new Text(canvas.width - 100, 20, `fps: ${fps.toFixed(2)}`);
    fpsText.draw(ctx);

    debugText.setText(0, `x: ${ball.x.toFixed(2)}`);
    debugText.setText(1, `y: ${ball.y.toFixed(2)}`);
    debugText.setText(2, `xVel: ${ball.xVel.toFixed(2)}`);
    debugText.setText(3, `yVel: ${ball.yVel.toFixed(2)}`);
    debugText.setText(4, `drag: ${ball.physMat.drag.toFixed(2)}`);
    debugText.setText(5, `gravity: ${ball.physMat.gravity.toFixed(2)}`);
    debugText.setText(6, `restitution: ${ball.physMat.restitution.toFixed(2)}`);

    // debugText.linkFunction(0, funcType.mouseWheel, mouseWheel);

    debugText.draw(ctx);

    // window.onmousemove = function (e) {
    //     if (!e) e = window.event;
    //     //check if left mouse button is pressed
    //     if (e.buttons == 1) {
    //         ball.xVel += mouseX * 10;
    //         ball.yVel += mouseY * 10;
    //     }
    //   }

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
    if (e.buttons == 1) {
        ball.xVel += e.movementX * 10;
        ball.yVel += e.movementY * 10;
    }
    // console.log(event.movementX, event.movementY);
}

function mouseWheel(e) {
    // console.log(mouseX, mouseY);
    debugText.mouseAction(4, debugTextMouseWheel, e, true);
    debugText.mouseAction(5, debugTextMouseWheel, e, true);
    debugText.mouseAction(6, debugTextMouseWheel, e, true);
}

function debugTextMouseWheel(e, i) {

    var modifier = 1;
    if (e.ctrlKey) {
        modifier = 0.1;
    }
    if (e.shiftKey) {
        modifier = 10;
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
    }
}

document.addEventListener("mousemove", mouseMove);
document.addEventListener("mousewheel", mouseWheel);
$(window).bind('mousewheel DOMMouseScroll', function (event) {
    if (event.ctrlKey == true) {
    event.preventDefault();
    }
});