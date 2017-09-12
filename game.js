//coder's comment: not much best practices nor code optimisation here because i'm trying to fit it all in 13kb

var fc = 0, //framecount
  sce, //scene
  lvl, //level
  bestLvl = 0; //best level
(tileSize = 50),
  (code = -1), //keyCode
  (keypressed = 0); //is key pressed or not

//add keyboard event listeners
window.addEventListener("keydown", this.keyDown, 0);
window.addEventListener("keyup", this.keyUp, 0);

function keyDown(e) {
  code = e.keyCode;
  console.log(code);
  keypressed = !event.repeat; //prevents repeats from holding down key
}

function keyUp(e) {
  if (code == e.keyCode) keypressed = 0;
}

function startGame() {
  //called once document is loaded
  myGameArea.setup();
}

var myGameArea = {
  cv: document.createElement("canvas"),
  setup: function() {
    this.cv.width = tileSize * 16;
    this.cv.height = tileSize * 12;
    this.ctx = this.cv.getContext("2d");
    this.ctx.textAlign = "center";
    document.body.insertBefore(this.cv, document.body.childNodes[0]);
    this.interval = setInterval(updateGameArea, 20); //50fps. not the best rate but i have no idea why it's 50.
    this.start();
  },
  start: function() {
    sce = 0;
    lvl = 1;
    this.title = new title(this.cv.width / 2, this.cv.height / 2);
    this.level = new level(this.cv.width / 2, this.cv.height / 2);
  },
  clear: function() {
    this.ctx.setTransform(1, 0, 0, 1, 0, 0); //reset transform matrix
    this.ctx.fillStyle = "#000"; //paint it black
    this.ctx.fillRect(0, 0, this.cv.width, this.cv.height);
    this.ctx.font = "20px Courier";
  },
  update: function() {
    switch (sce) {
      case 0: //title screen
        this.title.update();
        if (keypressed) this.title.fade = 1;
        break;
      case 1: //in-game
        this.level.update();
        if (keypressed) {
          if (this.level.state == 0) this.level.fade = 1;
          if (this.level.state == 3) {
            if (code == 89) this.level.showAns(0);
            if (code == 78) this.level.showAns(1);
          }
        }
        break;
      case 2: //level up!
        this.level.lvlUp();
        break;
    }
  }
};

function updateGameArea() {
  myGameArea.clear();
  myGameArea.update();
  fc++; //increase framecount
}

function title(x, y) {
  var a = 0,
    pos = [0, -49, -50, -39, 58, -36, 55, -58, 97, -37, -89, -23, -55, -30];
  this.fade = -1;
  this.update = function() {
    ctx = myGameArea.ctx;
    switch (this.fade) {
      case 1: //fade out
        if (a >= 0) {
          a -= 0.02;
        } else {
          sce++;
        }
      case -1: //fade in
      if (a <= 1) {
        a += 0.01;
      } else{
        this.fade = 0;
      }
    }
    var d = Math.floor(fc / 10) % 10; //displacement for floating animation
    if (d > 4) {
      d = 9 - d;
    }
    for (var i = 0; i < 6; i++) {
      ctx.fillStyle = "rgba(255, 255, 255, " + a + ")";
      ctx.fill();
      ctx.beginPath();
      ctx.arc(
        x + pos[i * 2],
        y + pos[i * 2 + 1] + d,
        (10 - i) * 5,
        0,
        2 * Math.PI,
        false
      );
      ctx.closePath();
    }
    ctx.fillText("Press any key to start.", x, y + 100);
    ctx.font = "15px Courier";
    if (lvl > 1) {
      ctx.fillText("Best: " + lvl + " steps away", x, y - 150);
    }
    ctx.fillStyle = "#000";
    ctx.font = "20px Courier";
    ctx.fillText("Way Home", x, y + pos[13] + d);
  };
}

function house(s = 0, X = 0, Y = 0) {
  this.state = s; //0 - shows a house, 1 - image not found, 2 - 'loading' animation
  var x = X, //only needed when in 'loading' state
    y = Y,
    t = 0;
    console.log(x+" "+y);
  this.draw = function() {
    ctx = myGameArea.ctx;
    ctx.fillStyle = "#fff";
    switch (this.state) {
      case 0: //a houses
        //triangle
        ctx.beginPath();
        ctx.moveTo(1, tileSize / 2);
        ctx.lineTo(tileSize - 1, tileSize / 2);
        ctx.lineTo(tileSize / 2, 1);
        ctx.fill();
        ctx.closePath();
        //sqaure
        ctx.fillRect(
          tileSize / 4 - 4,
          tileSize / 2,
          tileSize / 2 + 8,
          tileSize / 2 - 2
        );
        ctx.fillStyle = "#000";
        //door
        ctx.fillRect(
          tileSize / 4 + 4,
          tileSize / 2 + 2,
          tileSize / 2 - 8,
          tileSize / 2 - 4
        );
        break;
      case 1: //404 not found
        ctx.strokeStyle = "#fff";
        ctx.lineWidth = 1;
        ctx.strokeRect(0, 0, tileSize, tileSize);
        ctx.fillRect(4, 4, tileSize / 4, tileSize / 4);
        //'X'
        ctx.strokeStyle = "#000";
        ctx.beginPath();
        ctx.moveTo(6, 6);
        ctx.lineTo(tileSize / 4, tileSize / 4);
        ctx.stroke();
        ctx.closePath();
        ctx.beginPath();
        ctx.moveTo(6, tileSize / 4);
        ctx.lineTo(tileSize / 4, 6);
        ctx.stroke();
        ctx.closePath();
        break;
      case 2: //loading
        var a = Math.floor((fc % 80) / 10) + 1; //to shift opacity values; rotates opacity value once in 10 frames
        for (var i = a; i < a + 8; i++) {
          //draw 8 circles with varying opacity
          ctx.fillStyle = "rgba(200,200,200," + (i - a) * 1 / 8 + ")";
          ctx.beginPath();
          //drawing circles in a circle
          ctx.arc(
            x *tileSize+
              tileSize / 2 +
              (tileSize / 2 - 4) * Math.sin(i * 2 * Math.PI / 8),
            y *tileSize+
              tileSize / 2 +
              (tileSize / 2 - 4) * Math.cos(i * 2 * Math.PI / 8),
            tileSize / 8 * ((i - a) / 8),
            0,
            2 * Math.PI,
            false
          );
          ctx.fill();
          ctx.closePath();
        }
        break;
    }
  };
}

function player(X, Y) {
  //draws player
  var a = 1; //alpha value
  this.dX = 0; //displacement (for when moving)
  this.dY = 0;
  this.x = X; //position
  this.y = Y;
  this.update = function() {
    this.x += this.dX;
    this.x = r2(this.x);
    this.y += this.dY;
    this.y = r2(this.y);
    if (this.x == this.nX && this.y == this.nY) {
      this.dX = 0;
      this.dY = 0;
    }
    if (this.x == 0 && this.y == 0 && a > 0) {
      a -= 0.02;
    } else {
      this.fade = 0;
    }
    if (a <= 0) myGameArea.start(); //restart game
  };
  this.draw = function() {
    ctx = myGameArea.ctx;
    if (this.home) {
      //fading when same position as house
      this.a -= 0.01;
    }
    ctx.fillStyle = "rgba(255,255,255," + a + ")";
    ctx.beginPath();
    ctx.arc(
      this.x * tileSize + tileSize / 2,
      this.y * tileSize + tileSize / 2,
      tileSize / 2 - 10,
      0,
      2 * Math.PI,
      false
    );
    ctx.fill();
    ctx.closePath();
  };
  this.move = function(nPos, time) {
    this.nX = nPos.x;
    this.nY = nPos.y;
    this.dX = r2((nPos.x - this.x) / (time / 20.0));
    this.dY = r2((nPos.y - this.y) / (time / 20.0));
  };
  this.still = function() {
    return this.dX == 0 && this.dY == 0;
  };
}

function level(cx, cy) {
  var a = 1, //alpha value for text
    playerTurn = 0,
    stepsTaken = 0,
    showAns = 0;
  var pastD = [],
    pPos = [{ x: 0, y: 1 }],
    now = { x: 0, y: 1 },
    e = [{ x: -1, y: 0 }, { x: 0, y: -1 }, { x: 1, y: 0 }, { x: 0, y: 1 }];
  this.fade = 0;
  this.state = 0; //0 - show level no., 1 - main game state, 2 - animation state to continue to next level, 3 - gameover? state
  this.p = new player(now.x, now.y);
  this.h = new house();
  this.lvlUp = function() {
    a = 1;
    this.fade = 0;
    this.state = 0;
    pastD = [],
    pPos = [{ x: 0, y: 1 }],
    now = { x: 0, y: 1 },
    e = [{ x: -1, y: 0 }, { x: 0, y: -1 }, { x: 1, y: 0 }, { x: 0, y: 1 }];
    this.p.x = 0;
    this.p.y = 1;
    playerTurn = 0;
    lvl++;
    stepsTaken = 0;
    sce = 1;
  };
  this.pMove = function() {
    if (this.state == 1 && keypressed && code > 36 && code < 41) {  //37-40: left, up, right, down
      var d = e[code - 37];
      now.x += d.x;
      now.y += d.y;
      this.p.move(now, 1000);
      if (JSON.stringify(now) === JSON.stringify(pPos[pPos.length - 2])) {
        pPos.pop(); //continue moving
      } else {
        this.state = 3; //lose level
      }
    }
  };
  this.cpuMove = function() {
    var newPos = []; //stores possible new positions
    for (var i = 0; i < 4; i++) {
      var d = { x: now.x + e[i].x, y: now.y + e[i].y }; //each tile around the current position
      var blk = 0; //number of blocks
      if (d.x != 0 && d.y != 0 && !findPos(pPos, d)) {
        //make sure d is a valid position i.e. not taken up by house or any previous steps
        for (var h = 0; h < 4; h++) {
          var dBlk = { x: d.x + e[h].x, y: d.y + e[h].y }; //for each tile around d
          if ((dBlk.x == 0 && dBlk.y == 0) || findPos(pPos, dBlk)) {
            //check if boxed in by previous steps, hence making it not an ideal direction to move to
            blk++;
          }
        }
      } else {
        //is out of the question
        blk = 4;
      }
      if (blk > -1 && blk < 3) {
        //0 to 2 blks are fine
        newPos.push(d);
      }
    }
    if (pastD.length > 2 && newPos.length > 1) { //keep track of past few directions to prevent travelling in the same direction for too long
      var i = 0;
      var sum = 0;
      while (i < pastD.length) {
        sum += pastD[i];
        i++;
      }
      if (sum == 0 || sum == 3) { // if either x-direction or y-direction for all past 3 directions
        for (var i = newPos.length - 1; i > 0; i--) { //remove all travel direction that is the same from the possible new positions
          if (newPos.length > 1) {
            if (pastD[0] == 0 && newPos[i].x == now.x) {
              newPos.splice(i, 1);
            } else if (pastD[0] == 1 && newPos[i].y == now.y) {
              newPos.splice(i, 1);
            }
          }
        }
      }
    }
    var nPos; //new position
    if (newPos.length > 1) {
      nPos = newPos[Math.floor(Math.random() * newPos.length)]; //randomly select one
    } else {
      nPos = newPos[0];
    }
    if (newPos != undefined) {
      if (pPos[pPos.length - 1].x == nPos.x) {
        pastD.push(0);
      } else {
        pastD.push(1);
      }
      if (pastD.length > 3) {
        pastD.shift();
      }
      now = { x: nPos.x, y: nPos.y };
      pPos.push({ x: nPos.x, y: nPos.y });
      this.p.move(nPos, 1000);
      stepsTaken++;
    }
    if (stepsTaken == lvl) {
      playerTurn = 1;
    }
  };
  this.goHome = function() {
    //animates player token going home
    pPos.unshift({ x: 0, y: 0 });
    this.p.move(pPos[pPos.length - 1], 500);
    pPos.pop();
  };
  this.update = function() {
    if (this.state == 1) {
      if (playerTurn && pPos.length == 1) this.state = 2; //completes level
      if (this.p.still()) {
        if (playerTurn) {
          this.pMove();
        } else {
          this.cpuMove();
        }
      }
    }
    if (this.state == 2 && this.p.still() && keypressed) sce = 2; //
    if (this.state == 4) {
      if (this.nh == undefined) {
        //player token travels back to house and resets level (game restart)
        if (this.p.still()) {
          if (pPos.length > 0) {
            this.goHome();
          }
        }
      }
    }
    this.p.update();
    this.draw();
  };
  this.draw = function() {
    ctx = myGameArea.ctx;
    if (this.state == 0) {
      if (this.fade) {
        if (a > 0) {
          a -= 0.01;
        } else {
          this.state++;
        }
      }
      ctx.fillStyle = "rgba(200,200,200," + a + ")";
      ctx.fillText("Level " + lvl, cx, cy - 150);
    } else {
      ctx.fillStyle = "#fff";
      if (this.state == 2) {
        ctx.fillText("Press any key to go to next level.", cx, cy + 100);
      }
      if (this.state == 1 && lvl < 4 && pPos.length > 1) {
        //show arrow keys (tutorial)
        var arrowPos = [-55, 0, -15, -40, 25, 0, -15, 0];
        var ans = {
          x: pPos[pPos.length - 2].x - now.x,
          y: pPos[pPos.length - 2].y - now.y
        };
        var arrow = e.findIndex(function(d) {
          return ans.x == d.x && ans.y == d.y;
        });
        for (var i = 0; i < 4; i++) {
          if (i == arrow && playerTurn && this.p.still()) {
            ctx.fillStyle =
              "rgba(200,200,200," + Math.floor((fc % 60) / 30) + ")";
            ctx.strokeStyle = ctx.fillStyle;
          } else {
            ctx.fillStyle = "#333";
            ctx.strokeStyle = "#333";
          }
          ctx.fillRect(
            cx + arrowPos[i * 2],
            cy + arrowPos[i * 2 + 1] + 150,
            30,
            30
          );
          ctx.lineJoin = "round";
          ctx.lineWidth = 5;
          ctx.strokeRect(
            cx + arrowPos[i * 2],
            cy + arrowPos[i * 2 + 1] + 150,
            30,
            30
          );
        }
      }
      if (this.state == 3) {
        ctx.fillText("Is home where you are? (y/n)", cx, cy + 140);
      }
    }
    if (showAns) {
      //reveal right path home and animate player token going home
      ctx.setTransform(
        1,
        0,
        0,
        1,
        cx - (this.p.x * tileSize + tileSize / 2),
        cy - (this.p.y * tileSize + tileSize / 2)
      );
      if (pPos.length > 1) {
        for (var i = 1; i < pPos.length; i++) {
          ctx.beginPath();
          ctx.arc(
            pPos[i].x * tileSize + tileSize / 2,
            pPos[i].y * tileSize + tileSize / 2,
            tileSize / 8,
            0,
            2 * Math.PI,
            false
          );
          ctx.fill();
          ctx.closePath();
        }
      }
    }
    ctx.setTransform(
      1,
      0,
      0,
      1,
      cx - (this.p.x * tileSize + tileSize / 2),
      cy - (this.p.y * tileSize + tileSize / 2)
    );
    if (this.nh != undefined) {
      this.nh.draw();
    }
    this.h.draw();
    this.p.draw();
  };
  this.showAns = function(b) {
    if (b == 0) {
      //existing home becomes 404 and new home token constructed
      this.h.state = 1;
      this.nh = new house(2, this.p.x, this.p.y - 1);
      //level starts again after 4 seconds
      setTimeout(function(self) {
        self.nh.state = 0;
        self.h = self.nh;
        self.nh = undefined;
        lvl--;
        self.lvlUp();
      }, 4000, this);
      t = fc;
    } else if (b == 1) {
      //show way back home
      showAns = 1;
    }
    this.state++;
  };
}

//round num to 2 d.p.
function r2(num) {
  return +(Math.round(num + "e+2") + "e-2");
}

//returns true if pos d is in array
function findPos(array, d) {
  var found = false;
  array.forEach(function(e) {
    if (d.x == e.x && d.y == e.y) {
      found = true;
    }
  });
  return found;
}
