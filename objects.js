class Ball{
    constructor(x, y, xVel, yVel, radius, physMat, color = "red", gravity = true, drag = true){
        this.x = x;
        this.y = y;
        this.xVel = xVel;
        this.yVel = yVel;
        this.radius = radius;
        this.color = color;
        this.gravity = gravity;
        this.drag = drag;
        this.colliding = false;
        this.physMat = physMat;
    }
    draw(){
        drawCircle(this.x, this.y, this.radius, this.color);
    }
    step(deltaTime, planets = null){
        if (planets != null){
            for (let i = 0; i < planets.length; i++){
                let xDist = planets[i].x - this.x;
                let yDist = planets[i].y - this.y;
                this.xVel = this.xVel + xDist * planets[i].gravity * this.radius / 1000 / Math.pow(Math.sqrt(xDist * xDist + yDist * yDist), 2) * 100;
                this.yVel = this.yVel + yDist * planets[i].gravity * this.radius / 1000 / Math.pow(Math.sqrt(xDist * xDist + yDist * yDist), 2) * 100;
            }
        }

        if (this.gravity && !this.colliding){
            this.yVel += this.physMat.gravity * this.radius / 10;
        }
        if (this.drag){
            this.xVel -= this.xVel * this.physMat.drag * this.radius / 100;
            this.yVel -= this.yVel * this.physMat.drag * this.radius / 100;
        }
        if (this.y + this.radius > canvas.height){
            this.y = canvas.height - this.radius;
            this.yVel *= -this.physMat.restitution;
        }
        if (this.y - this.radius < 0){
            this.y = this.radius;
            this.yVel *= -this.physMat.restitution;
        }
        if (this.x + this.radius > canvas.width){
            this.x = canvas.width - this.radius;
            this.xVel *= -this.physMat.restitution;
        }
        if (this.x - this.radius < 0){
            this.x = this.radius;
            this.xVel *= -this.physMat.restitution;
        }
        this.x += this.xVel * deltaTime / 1000;
        this.y += this.yVel * deltaTime / 1000;
    }
}

class Planet{
    constructor(x, y, radius, color = "blue", gravity = 100){
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.color = color;
        this.gravity = gravity;
    }
    draw(){
        drawCircle(this.x, this.y, this.radius, this.color);
    }
}

class VectorDisplay{
    constructor(x, y, xDir, yDir, color = "red"){
        this.x = x;
        this.y = y;
        this.xDir = xDir;
        this.yDir = yDir;
        // this.width = width;
        this.color = color;
    }
    draw(){
        // console.log(this.x, this.y, this.xDir, this.yDir, this.color);
        // ctx.strokeStyle = this.color;
        // ctx.beginPath();
        // ctx.moveTo(this.x, this.y);
        // ctx.lineTo(this.x + this.xDir * this.width, this.y + this.yDir * this.width);
        // ctx.stroke();
        // ctx.closePath();
        ctx.strokeStyle = this.color;
        ctx.lineWidth = 1;
        ctx.beginPath();
        canvas_arrow(ctx, this.x, this.y, this.x + this.xDir, this.y + this.yDir);
        ctx.stroke();
        ctx.closePath();
    }
}

class PhysicsMaterial{
    constructor(restitution = 0.5, gravity = GRAVITY, drag = DRAG){
        this.restitution = restitution;
        this.gravity = gravity;
        this.drag = drag;
    }
}

class Text {
    constructor(x, y, text) {
        this.x = x;
        this.y = y;
        this.text = text;
    }
    draw(ctx) {
        ctx.fillStyle = 'black';
        ctx.font = "20px arial";
        ctx.fillText(this.text, this.x, this.y);
    }
}

class TextBlock {
    text = [];
    constructor(x, y, gap) {
        this.x = x;
        this.y = y;
        this.gap = gap;
    }
    draw(ctx) {
        //draw every text element at the correct position
        for (let i = 0; i < this.text.length; i++) {
            this.text[i].draw(ctx);
        }
    }
    setText(index, str) {
        while (this.text.length < index+1){
            this.text.push(new Text(this.x, this.y + this.text.length * this.gap, "Hello World!"));
        }
        this.text[index].text = str;
    }
    //WiP
    mouseAction(index, func, event, passIndex = false){
        // console.log(this.y + this.gap * index);
        // console.log(this.y, this.gap, index)
        
        //run the function only if the mouse is over the text
        // if (mouseX > this.x && mouseX < this.x + this.text[index].text.length * 10 && mouseY > this.y + this.text[index].gap * index && mouseY < this.y + this.text[index].gap * (index + 1)){

        // if(mouseY > this.y + this.gap * (index-1)){
        if(mouseY > this.y + this.gap * (index-1) && mouseY < this.y + this.gap * index){
            if (passIndex){
                func(event, index);
            }
            else{
                func(event);
            }
        }
    }
}

const funcType = {
    "mouseMove": "mouseMove",
    "mouseWheel": "mouseWheel",
    "mouseClick": "mouseClick",
    "mouseDown": "mouseDown",
    "mouseUp": "mouseUp",
    "keyDown": "keyDown",
    "keyUp": "keyUp",
    "keyPress": "keyPress"
}

function canvas_arrow(context, fromx, fromy, tox, toy) {
    var headlen = 10; // length of head in pixels
    var dx = tox - fromx;
    var dy = toy - fromy;
    var angle = Math.atan2(dy, dx);
    context.moveTo(fromx, fromy);
    context.lineTo(tox, toy);
    context.lineTo(tox - headlen * Math.cos(angle - Math.PI / 6), toy - headlen * Math.sin(angle - Math.PI / 6));
    context.moveTo(tox, toy);
    context.lineTo(tox - headlen * Math.cos(angle + Math.PI / 6), toy - headlen * Math.sin(angle + Math.PI / 6));
  }

function drawCircle(x, y, radius, color = "red"){
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, 2*Math.PI);
    ctx.fillStyle = color;
    ctx.fill();
    ctx.closePath();
}
