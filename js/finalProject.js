// CSCI-E3: Intro to Web Programming with JavaScript
// Final Project
// Author: Nicole Watson
// I created a Flappy Bird-based game called "Faster, Magikarp! Swim! Swim!" It has some of the functionality
// as the original Flappy Bird but with a few differences. I created this with vanilla JavaScript,
// no libraries. All sprites, sound effects, and background images are from online public databases,
// and they're royalty-free and do not require credit.

"use strict";

window.onload = function() {
  
  const gameArea = document.getElementById("gameArea");
  const ctx = gameArea.getContext("2d");

  // This loads images into canvas
  var magikarp = new Image();
  var background = new Image();
  var foreground = new Image();
  var upperPipe = new Image();      
  var lowerPipe = new Image();

  magikarp.src = "assets/magikarp.png";
  background.src = "assets/background.png";
  foreground.src = "assets/foreground.png";
  upperPipe.src = "assets/upperPipe.png";
  lowerPipe.src = "assets/lowerPipe.png";

  // This loads audio files into canvas
  var swim = new Audio();
  var scoreSound = new Audio();

  swim.src = "sounds/swim.mp3";
  scoreSound.src = "sounds/score.mp3";

  // Magikarp's movement variables
  var magikarpX = 10;
  var magikarpY = 150;
  var gravity = 1;

  // Magikarp's movement functions
  function movements() {
    this.swimUp = function() {
      magikarpY -= 26;
      swim.play();
    }
    this.swimDown = function() {
      magikarpY += 26;
      swim.play();
    }
  }

  var moveMagikarp = new movements();

  // Movement keydown event listeners
  // These are button event handlers for Magkarp's up and down movements
  document.addEventListener("keydown", function(event) {
    if (event.which == 38 || event.keyCode == 38 || event.which == 87 || event.keyCode == 87) {
      event.preventDefault(); // This prevents the page from moving up when the user clicks the up button
      moveMagikarp.swimUp();
    } else if (event.which == 40 || event.keyCode == 40 || event.which == 83 || event.keyCode == 83) {
      event.preventDefault(); // This prevents the page from moving down when the user clicks the down button
      moveMagikarp.swimDown();
    }
  });

  // This adds a gap in-between the upper and lower pipes
  var gap = upperPipe.height + 360;

  // Score variables
  var highestScore = document.getElementById("highestScore");
  var score = 0;
  var scoreData = JSON.parse(window.localStorage.getItem("highScoreStorage"));

  // Score button event listener
  // This is the variable and click event handler for clearing the user's high score
  var deleteButton = document.getElementById("deleteButton");
  deleteButton.addEventListener("click", function() {
    scoreData = 0;
  });

  // Pipes' starting array and coordinates
  var pipes = [];
  // Pipe object
  pipes[0] = {
    x: gameArea.width, 
    y: 0
  };

  // DRAW FUNCTION
  // The function to draw elements into the canvas
  function draw() {
    //This draws the background into the canvas
    ctx.drawImage(background, 0, 0);

    // This gives us multiple pipes
    pipes.forEach ((pipe, index) => {
      ctx.drawImage(upperPipe, pipe.x, pipe.y);
      ctx.drawImage(lowerPipe, pipe.x, pipe.y + gap);   
      pipe.x--; 

      // This randomnizes the pipes' length
      if (pipe.x == 100) {
        pipes.push({
          x: gameArea.width,
          y: Math.floor(Math.random() * upperPipe.height) - upperPipe.height
        });
      }  

      // This detects if Magikarp touches a pipe or the ground
      function detectCollision() {
        if (magikarpX <= pipe.x + upperPipe.width && magikarpX + magikarp.width >= pipe.x && 
        (magikarpY + magikarp.height >= pipe.y + gap || magikarpY <= pipe.y + upperPipe.height) 
        || gameArea.height - foreground.height + 50 <= magikarpY + magikarp.height) { 
          location.reload(); // This reloads the page if Magikarp touches a pipes or the ground  
          if (score == 0 && scoreData == 0) {
            window.localStorage.setItem("highScoreStorage", "0"); // This ensures the High Score won't say null if the user clears the high score
          }; 
        }
      };
      detectCollision();

      // This increases the score once Magikarp successfully passes a pipes
      if (pipe.x == 5) {
        score++
        scoreSound.play();
        // This updates the highest score shown
        if (score > scoreData) {
          window.localStorage.setItem("highScoreStorage", JSON.stringify(score));
        }
      } 
    });

    // This draws the foreground into the canvas
    ctx.drawImage(foreground, 0, gameArea.height - foreground.height + 50);

    // This draws the star of the show, Magikarp!
    ctx.drawImage(magikarp, magikarpX, magikarpY);
    magikarpY += gravity;

    // This draws the scoreboard into the canvas
    ctx.fillStyle = "#00000";
    ctx.font = "16px Verdana";
    ctx.fillText("Score: " + score, 17, gameArea.height - 20);
    ctx.fillText("High Score: " + scoreData, 150, gameArea.height - 20);

    requestAnimationFrame(draw);
  }
  draw();
}

// This concludes my final project! I hope you enjoyed it! :D