class Spaceship {

  constructor(){
    this.velocity = new createVector(0, 0);
    this.location = new createVector(width/2, height/2);
    this.acceleration = new createVector(0, 0);
    this.maxVelocity = 5;
    this.bulletSys = new BulletSystem();
    this.size = 60;
  }

  run(){
    this.bulletSys.run();
    this.draw();
    this.move();
    this.edges();
    this.interaction();
  }

  draw(){
    //main body
    fill(192);
    triangle(this.location.x - this.size/2, this.location.y + this.size/2,
        this.location.x + this.size/2, this.location.y + this.size/2,
        this.location.x, this.location.y - this.size/2);
    //top decal
    fill(204,0,0);
    triangle(this.location.x - 7.5, this.location.y - 15,
        this.location.x + 7.5, this.location.y - 15,
        this.location.x, this.location.y - this.size/2);
    //left decal
    triangle(this.location.x - this.size/2, this.location.y + this.size/2,
      this.location.x - this.size/2 + 12, this.location.y + this.size/2,
      this.location.x - this.size/2 + 10.5, this.location.y + this.size/2 - 20);
    //right decal
    triangle(this.location.x + this.size/2 - 12, this.location.y + this.size/2,
      this.location.x + this.size/2, this.location.y + this.size/2,
      this.location.x + this.size/2 - 10.5, this.location.y + this.size/2 -20);
    //front decal
    rect(this.location.x-0.5, this.location.y + this.size/2 -15, 2, 15);
    //window
    fill(121,197,255);
    ellipse(this.location.x, this.location.y, 15, 15);
    //window rims
    noFill();
    stroke(204,0,0);
    ellipse(this.location.x, this.location.y, 15, 15);
  }

  move(){
      // YOUR CODE HERE (4 lines)
        this.velocity.add(this.acceleration);
        this.location.add(this.velocity);        
        this.velocity.limit(this.maxVelocity);
        this.acceleration.mult(0);

  }

  applyForce(f){
    this.acceleration.add(f);
  }

  interaction(){
      if (keyIsDown(LEFT_ARROW)||keyIsDown(65)){
        this.applyForce(createVector(-0.5, 0));
      }
      if (keyIsDown(RIGHT_ARROW)||keyIsDown(68)){
      // YOUR CODE HERE (1 line)
        this.applyForce(createVector(0.5, 0));
      }
      if (keyIsDown(UP_ARROW)||keyIsDown(87)){
      // YOUR CODE HERE (1 line)
        this.applyForce(createVector(0, -0.5));
      }
      if (keyIsDown(DOWN_ARROW)||keyIsDown(83)){
      // YOUR CODE HERE (1 line)
        this.applyForce(createVector(0,0.5));
      }
      if (keyIsDown(70)){
      // YOUR CODE HERE (1 line)
        this.applyForce(createVector(0,-0.8));
        this.drawFire();
      }
  }

  fire(){
    this.bulletSys.fire(this.location.x, this.location.y);
  }

  edges(){
    if (this.location.x<0) this.location.x=width;
    else if (this.location.x>width) this.location.x = 0;
    else if (this.location.y<0) this.location.y = height;
    else if (this.location.y>height) this.location.y = 0;
  }

  setNearEarth(){
    //YOUR CODE HERE (6 lines approx)
    var gravity = createVector(0,0.5);
    this.applyForce(gravity);

    var friction = this.velocity.copy();
    friction.mult(-1);
    friction.mult(0.33);
    this.applyForce(friction);
  }

  drawFire(){
    fill(255,128,0);
    //left
    triangle(this.location.x - 15, this.location.y + this.size/2+5,
      this.location.x - 3 , this.location.y + this.size/2+5,
      this.location.x - 9, this.location.y + this.size + this.size/4+5);
    //right
    triangle(this.location.x + 3, this.location.y + this.size/2 +5,
      this.location.x + 15, this.location.y + this.size/2+5,
      this.location.x + 9, this.location.y + this.size + this.size/4+5);
  }
}
