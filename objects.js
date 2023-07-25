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
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, 2*Math.PI);
        ctx.fillStyle = this.color;
        ctx.fill();
    }
    step(deltaTime){
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