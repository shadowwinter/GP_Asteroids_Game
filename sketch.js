var spaceship;
var asteroids;
var atmosphereLoc;
var atmosphereSize;
var earthLoc;
var earthSize;
var starLocs = [];

var destroySound, bulletSound, gameOverSound, gameWinSound, pauseOnSound, pauseOffSound;
var destroyedCounter=0;
var gameIsOver=false, gameIsPaused=false;

//////////////////////////////////////////////////
function preload(){
  soundFormats('mp3','wav','ogg');
  destroySound = loadSound('assets/destroy.mp3');
  bulletSound = loadSound('assets/bullet.wav');
  gameOverSound = loadSound('assets/game_over.wav');
  gameWinSound = loadSound('assets/win.wav');
  pauseOnSound = loadSound('assets/on.ogg');
  pauseOffSound = loadSound('assets/off.ogg');
}
//////////////////////////////////////////////////
function setup() {
  createCanvas(1200,800);
  spaceship = new Spaceship();
  asteroids = new AsteroidSystem();

  textAlign(CENTER);

  //location and size of earth and its atmosphere
  atmosphereLoc = new createVector(width/2, height*2.9);
  atmosphereSize = new createVector(width*3, width*3);
  earthLoc = new createVector(width/2, height*3.1);
  earthSize = new createVector(width*3, width*3);
}

//////////////////////////////////////////////////
function draw() {
  background(0);
  sky();

  spaceship.run();
  asteroids.run();

  drawEarth();

  checkCollisions(spaceship, asteroids); // function that checks collision between various elements


  //shows counter at the top of the screen if the game is still ongoing
  if(!gameIsOver){
    fill(255);
    textSize(20);
    text("Destroyed asteroids: " + destroyedCounter, width/2,80);
    textSize(10);
    text("Press Space to shoot, and H for help", width/2,80+25);
  }

  if(destroyedCounter==10){
    gameWin();
  }

  if(gameIsPaused){
    fill(255);
    textSize(30);
    text("Destroy 10 asteroids to win!", width/2, height/2-50);
    text("Do not let any asteroids damage your spaceship or hit Earth.", width/2, height/2);
    textSize(20);
    text("Psst! Beware of Earth's gravitational pull.", width/2, height/2+40);
  }
}

//////////////////////////////////////////////////
//draws earth and atmosphere
function drawEarth(){
  noStroke();
  //draw atmosphere
  fill(0,0,255, 50);
  ellipse(atmosphereLoc.x, atmosphereLoc.y, atmosphereSize.x,  atmosphereSize.y);
  //draw earth
  fill(100,255);
  ellipse(earthLoc.x, earthLoc.y, earthSize.x, earthSize.y);
}

//////////////////////////////////////////////////
//checks collisions between all types of bodies
function checkCollisions(spaceship, asteroids){

    //spaceship-2-asteroid collisions
    //YOUR CODE HERE (2-3 lines approx)
    for(var i=0; i<asteroids.locations.length; i++){
      var asteroidsLoc = asteroids.locations[i];
      var asteroidsDiam = asteroids.diams[i];
      var r = isInside(asteroidsLoc, asteroidsDiam, spaceship.location, spaceship.size-15);

      if(r){
        fill(255);
        textSize(30);
        text("Your spaceship has been destroyed.", width/2, height/2);
        gameOver();
      }
    }

    //asteroid-2-earth collisions
    //YOUR CODE HERE (2-3 lines approx)
    for(var i=0; i<asteroids.locations.length; i++){
      var asteroidsLoc = asteroids.locations[i];
      var asteroidsDiam = asteroids.diams[i];
      var r = isInside(asteroidsLoc, asteroidsDiam, earthLoc, earthSize.y);

      if(r){       
        fill(255);
        textSize(30);
        text("Earth has been damaged.", width/2, height/2);
        gameOver();
      }
    }

    //spaceship-2-earth
    //YOUR CODE HERE (1-2 lines approx)
    var spacehip2earth = isInside(spaceship.location, spaceship.size, earthLoc, earthSize.y);

    if(spacehip2earth){
      fill(255);
      textSize(30);
      text("Your spaceship has crashed.", width/2, height/2);
      gameOver();
    }
    

    //spaceship-2-atmosphere
    //YOUR CODE HERE (1-2 lines approx)
    var spacehip2atmosphere = isInside(spaceship.location, spaceship.size, atmosphereLoc, atmosphereSize.y);

    if(spacehip2atmosphere && !gameIsOver){
      fill(255);
      textSize(15);
      text("Press F to boost your spaceship!", width/2, height/2);
      spaceship.setNearEarth();
    }

    //bullet collisions
    //YOUR CODE HERE (3-4 lines approx)

    var bulletSys = spaceship.bulletSys; 
    var bullets = bulletSys.bullets; 

    for(var i=0; i<bullets.length; i++){
      for(var j=0; j<asteroids.locations.length; j++){
        var asteroidsLoc = asteroids.locations[j];
        var asteroidsDiam = asteroids.diams[j];
        var r = isInside(asteroidsLoc, asteroidsDiam, bullets[i], bulletSys.diam);
        if(r){
          asteroids.destroy(j);
          destroySound.play();
          destroyedCounter++;
        }
      }
    }


}

//////////////////////////////////////////////////
//helper function checking if there's collision between object A and object B
function isInside(locA, sizeA, locB, sizeB){
    // YOUR CODE HERE (3-5 lines approx)

    var d = dist(locA.x, locA.y, locB.x, locB.y);
    var maxDist = sizeA/2 + sizeB/2;
    if(maxDist<d){
      return false;
    }
    else{
      return true;
    }
}

//////////////////////////////////////////////////
function keyPressed(){
  if (keyIsPressed && keyCode === 32 && !gameIsOver && !gameIsPaused){ // if spacebar is pressed, fire!
    spaceship.fire();
  }
  if (keyIsPressed && keyCode === 32 && gameIsOver && !gameIsPaused){ // if spacebar is pressed, fire!
    location.reload();
  }
  if (keyIsPressed && keyCode === 72 && !gameIsOver){ // if H is pressed, display help
    if(!gameIsPaused){
      gameIsPaused=true;
      pauseOnSound.play();
      noLoop();
    }else{
      gameIsPaused=false;
      pauseOffSound.play();
      loop();
    }
  }

}

//////////////////////////////////////////////////
// function that ends the game by stopping the loops and displaying "Game Over"
function gameOver(){
  gameOverSound.play();
  fill(255,120);
  rectMode(CENTER);
  rect(width/2,height/2-35,600,210);
  fill(102,0,204);
  textSize(80);
  text("GAME OVER", width/2, height/2-50);
  textSize(30);
  fill(255);
  text("Press space to restart", width/2, height/2+40);
  gameIsOver=true;
  noLoop();
}

//////////////////////////////////////////////////
// function that ends the game when destroyed enough aesteroids and displaying Game Win
function gameWin(){
  gameWinSound.play();
  fill(255,120);
  rectMode(CENTER);
  rect(width/2,height/2-35,1000,210);
  fill(255,255,0);
  textSize(80);
  text("CONGRATULATIONS!", width/2, height/2-50);
  textSize(30);
  text("You protected Earth!  ", width/2, height/2);
  text("Press space to restart", width/2, height/2+40);
  gameIsOver=true;
  noLoop();
}
//////////////////////////////////////////////////
// function that creates a star lit sky
function sky(){
  push();
  while (starLocs.length<300){
    starLocs.push(new createVector(random(width), random(height)));
  }
  fill(255);
  for (var i=0; i<starLocs.length; i++){
    rect(starLocs[i].x, starLocs[i].y,2,2);
  }

  if (random(1)<0.3) starLocs.splice(int(random(starLocs.length)),1);
  pop();
}
