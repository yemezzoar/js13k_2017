var fc = 0, //framecount
  sce = 0, //scene
  lvl = 1, //level
  tileSize = 50,
  code = -1, //keyCode
  keypressed = 0;
window.addEventListener("keydown", this.keyDown, 0);
window.addEventListener("keyup", this.keyUp, 0);

function keyDown(e) {
  code = e.keyCode;
  //console.log(code);
  keypressed = !event.repeat; //prevents repeats
}

function keyUp(e) {
  if (code == e.keyCode) keypressed = 0;
}

function startGame() { //called once document is loaded
  myGameArea.start();
}

var myGameArea = {
  cv: document.createElement("canvas"),
  start: function() {
    this.cv.width = tileSize * 16;
    this.cv.height = tileSize * 12;
    this.ctx = this.cv.getContext("2d");
    this.ctx.textAlign = "center";
    document.body.insertBefore(this.cv, document.body.childNodes[0]);
    this.interval = setInterval(updateGameArea, 20);
    this.title = new title(this.cv.width / 2, this.cv.height / 2);
    this.level = new level(this.cv.width / 2, this.cv.height / 2);
  },
  clear: function() {
    this.ctx.setTransform(1, 0, 0, 1, 0, 0);
    this.ctx.fillStyle = "#000";
    this.ctx.fillRect(0, 0, this.cv.width, this.cv.height);
    this.ctx.font = "20px Courier";
  },
  update: function() {
    switch (sce) {
      case 0:
        this.title.update();
        if (keypressed) this.title.fade = 1;
        break;
      case 1:
        this.level.update();
        if (keypressed) {
          if (this.level.state == 0) this.level.fade = 1;
          if (this.level.state == 3) {
            if (code == 89) this.level.showAns(0);
            if (code == 78) this.level.showAns(1);
          }
        }
        break;
      case 2:
        this.level.lvlUp();
        break;
      case 3:
        this.gameover.update();
        break;
    }
  }
};

function updateGameArea() {
  myGameArea.clear();
  myGameArea.update();
  fc++;
}

function title(x, y) {
  var a = 1,
    pos = [0, -49, -50, -39, 58, -36, 55, -58, 97, -37, -89, -23, -55, -30];
  this.fade = 0;
  this.update = function() {
    ctx = myGameArea.ctx;
    if (this.fade) {
      if (a > 0) {
        a -= 0.01;
      } else {
        sce++;
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

/*
* House object
*/
function house(s = 0, X = 0, Y = 0) {
  this.state = 0; //0 - shows a house, 1 - image not found, 2 - loading gif
  this.delete = 0; //true when new house object (state=2) replaces previous house object (state=1)
  var x = X, //only needed when in 'loading' state
    y = Y,
    t = 0;
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
        console.log(fc - t);
        if (fc - t > 240) { //after showing not found icon for 4 sec, delete this object
          this.delete = 1;
        }
        ctx.strokeStyle = "#fff";
        ctx.lineWidth = 1;
        ctx.strokeRect(x, y, tileSize, tileSize);
        ctx.fillRect(x + 4, y + 4, tileSize / 4, tileSize / 4);
        ctx.strokeStyle = "#000";
        ctx.beginPath();
        ctx.moveTo(x + 6, y + 6);
        ctx.lineTo(x + tileSize / 4, y + tileSize / 4);
        ctx.stroke();
        ctx.closePath();
        ctx.beginPath();
        ctx.moveTo(x + 6, y + tileSize / 4);
        ctx.lineTo(x + tileSize / 4, y + 6);
        ctx.stroke();
        ctx.closePath();
        break;
      case 2: //loading
        var a = Math.floor((fc % 80) / 10) + 1; //to shift opacity values; rotates opacity value once in 10 frames
        for (var i = a; i < a + 8; i++) {//draw 8 circles with varying opacity
          x + (tileSize / 2 - 4) * Math.sin(i * 2 * Math.PI / 8),
            y + (tileSize / 2 - 4) * Math.sin(i * 2 * Math.PI / 8);
          ctx.fillStyle = "rgba(200,200,200," + (i - a) * 1 / 8 + ")";
          ctx.beginPath();
          ctx.arc(
            x +
              tileSize / 2 +
              (tileSize / 2 - 4) * Math.sin(i * 2 * Math.PI / 8),
            y +
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
  var a = 1; //alpha
  this.dX = 0; //displacement (for when moving)
  this.dY = 0;
  this.x = X; //position
  this.y = Y;
  this.draw = function() {
    ctx = myGameArea.ctx;
    if (this.home) { //fading when position is same as house
      this.a -= 0.01;
      if (this.a <= 0) {//
        lvl++;
      }
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
  var a = 1,
    playerTurn = 0,
    stepsTaken = 0,
    showAns = 0;
  t = 0;
  var pastD = [],
    pPos = [{ x: 0, y: 1 }],
    now = { x: 0, y: 1 },
    e = [{ x: -1, y: 0 }, { x: 0, y: -1 }, { x: 1, y: 0 }, { x: 0, y: 1 }];
  this.fade = 0;
  this.state = 0;
  this.p = new player(now.x, now.y);
  this.h = new house();
  this.lvlUp = function() {
    a = 1;
    this.fade = 0;
    this.state = 0;
    playerTurn = 0;
    lvl++;
    stepsTaken = 0;
    sce = 1;
  };
  this.pMove = function() {
    if (this.state == 1 && keypressed && code > 36 && code < 41) {
      var d = e[code - 37];
      now.x += d.x;
      now.y += d.y;
      this.p.move(now, 1000);
      if (JSON.stringify(now) === JSON.stringify(pPos[pPos.length - 2])) {
        pPos.pop();
      } else {
        this.state = 3;
      }
    }
  };
  this.cpuMove = function() {
    var newPos = [];
    for (var i = 0; i < 4; i++) {
      var d = { x: now.x + e[i].x, y: now.y + e[i].y };
      var blk = 0;
      if (d.x != 0 && d.y != 0 && !findPos(pPos, d)) {
        for (var h = 0; h < 4; h++) {
          var dBlk = { x: d.x + e[h].x, y: d.y + e[h].y };
          if ((dBlk.x == 0 && dBlk.y == 0) || findPos(pPos, d)) {
            blk++;
          }
        }
      } else {
        blk = 4;
      }
      if (blk > -1 && blk < 4) {
        newPos.push(d);
      }
    }
    if (pastD.length > 2 && newPos.length > 1) {
      var i = 0;
      var sum = 0;
      while (i < pastD.length) {
        sum += pastD[i];
        i++;
      }
      if (sum == 0 || sum == 3) {
        for (var i = newPos.length - 1; i > 0; i--) {
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
    var nPos;
    if (newPos.length > 1) {
      nPos = newPos[Math.floor(Math.random() * newPos.length)];
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
    this.p.move(pPos[pPos.length - 1], 1000);
    pPos.pop();
  };
  this.update = function() {
    if (this.state == 1) {
      if (playerTurn && pPos.length == 1) {
        this.state = 2;
      }
      if (this.p.still()) {
        if (playerTurn) {
          this.pMove();
        } else {
          this.cpuMove();
        }
      }
    }
    if (this.state == 2 && this.p.still() && keypressed) sce = 2;
    if (this.state == 4) {
      if (this.nh != undefined) {
        //show for 4 seconds before restarting game
        console.log(fc - t);
        if (fc - t > 80) {
          this.h = this.nh;
          this.h.state = 0;
          lvl = 0;
          this.levelUp();
        }
      } else {
        if (this.p.still()) {
          if (pPos.length > 0) {
            //player token travels back to home and restart current level
            this.goHome();
          } else{
            myGameArea.restart();
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
    if (this.nh != undefined) {
      this.nh.draw();
    }
    ctx.setTransform(
      1,
      0,
      0,
      1,
      cx - (this.p.x * tileSize + tileSize / 2),
      cy - (this.p.y * tileSize + tileSize / 2)
    );
    this.h.draw();
    this.p.draw();
  };
  this.showAns = function(b) {
    if (b == 0) {
      //existing home becomes 404 and new home token constructed
      this.h.state = 1;
      this.nh = new house(this.p.x, this.p.y - 1, 2);
      t = fc;
    } else if (b == 1) {
      //show way back home
      showAns = 1;
    }
    this.state++;
  };
}

function is_same(a1, a2) {
  var same =
    a1.length == a2.length &&
    a1.every(function(element, index) {
      return element === a2[index];
    });
  return same;
}

function r2(num) {
  return +(Math.round(num + "e+2") + "e-2");
}

function findPos(array, d) {
  var found = false;
  array.forEach(function(e) {
    if (d.x == e.x && d.y == e.y) {
      found = true;
    }
  });
  return found;
}
