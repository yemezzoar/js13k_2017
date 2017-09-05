var fc = 0,
  sce = 0,
  lvl = 3,
  tileSize = 50,
  code = -1,
  keypressed = 0;
window.addEventListener("keydown", this.keyDown, 0);
window.addEventListener("keyup", this.keyUp, 0);

function keyDown(e) {
  code = e.keyCode;
  keypressed = !event.repeat;
}

function keyUp(e) {
  code = e.keyCode;
  keypressed = 0;
}

function startGame() {
  myGameArea.start();
}

var myGameArea = {
  cv: document.createElement("canvas"),
  start: function() {
    this.cv.width = tileSize * 16;
    this.cv.height = tileSize * 12;
    this.ctx = this.cv.getContext("2d");
    this.ctx.font = "30px Courier";
    this.ctx.textAlign="center";
    document.body.insertBefore(this.cv, document.body.childNodes[0]);
    this.interval = setInterval(updateGameArea, 20);
    this.title = new title(this.cv.width / 2, this.cv.height / 2);
    this.level = new level(this.cv.width / 2, this.cv.height / 2);
  },
  clear: function() {
    this.ctx.setTransform(1, 0, 0, 1, 0, 0);
    this.ctx.fillStyle = "#000";
    this.ctx.fillRect(0, 0, this.cv.width, this.cv.height);
  },
  update: function() {
    switch (sce) {
      case 0:
        this.title.update();
        if (keypressed) this.title.fade = 1;
        break;
      case 1:
        this.level.update();
        if (keypressed) this.level.fade = 1;
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
  var a = 1, pos = [5, -49, -45, -39, 63, -36, 60, -58, 102, -37, -84, -23, -50, -30];
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
    var d = Math.floor(fc / 10) % 10;
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
    //if (best == 0){
    ctx.fillText("Press any key to start.", x, y + 100);
    //}else{
      //ctx.fillText("Best Level: "+prevLvl, x, y + 100);
    //}
    ctx.fillStyle = "#000";
    ctx.fillText("L O S T", x, y + pos[13] + d);
  };
}

function house() {
  this.draw = function() {
    ctx = myGameArea.ctx;
    ctx.fillStyle = "#fff";
    ctx.beginPath();
    ctx.moveTo(1, tileSize / 2);
    ctx.lineTo(tileSize - 1, tileSize / 2);
    ctx.lineTo(tileSize / 2, 1);
    ctx.fill();
    ctx.closePath();
    ctx.fillRect(
      tileSize / 4 - 4,
      tileSize / 2,
      tileSize / 2 + 8,
      tileSize / 2 - 2
    );
    ctx.fillStyle = "#000";
    ctx.fillRect(
      tileSize / 4 + 4,
      tileSize / 2 + 2,
      tileSize / 2 - 8,
      tileSize / 2 - 4
    );
  };
}

function player(X, Y) {
  this.home = false;
  this.a = 1;
  this.dX = 0;
  this.dY = 0;
  this.x = X;
  this.y = Y;
  this.draw = function() {
    ctx = myGameArea.ctx;
    if (this.home) {
      this.a -= 0.01;
      if (this.a <= 0) {
        lvl++;
      }
    }
    ctx.fillStyle = "rgba(200,200,200," + this.a + ")";
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
  this.goHome = function() {
    this.home = 1;
  };
}

function level(cx, cy) {
  var a = 1,
    state = 0,
    playerTurn = 0,
    stepsTaken = 0;
  var pastD = [],
    pPos = [{ x: 0, y: 1 }],
    now = { x: 0, y: 1 },
    e = [{ x: -1, y: 0 }, { x: 0, y: -1 }, { x: 1, y: 0 }, { x: 0, y: 1 }];
  this.fade = 0;
  this.p = new player(now.x, now.y);
  this.h = new house();
  this.lvlUp = function() {
    a = 1;
    this.fade = 0;
    state = 0;
    playerTurn = 0;
    lvl++;
    stepsTaken = 0;
    sce = 1;
  };
  this.pMove = function() {
    if (state == 1 && keypressed && code > 36 && code < 41) {
      var d = e[code - 37];
      now.x += d.x;
      now.y += d.y;
      this.p.move(now, 1000);
      if (JSON.stringify(now) === JSON.stringify(pPos[pPos.length - 2])) {
        pPos.pop();
      } else {
        state = 3;
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
      nPos = newPos[rand(newPos.length)];
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
  this.update = function() {
    if (state == 1) {
      if (playerTurn && pPos.length == 1) {
        state = 2;
      }
      if (this.p.still()) {
        if (playerTurn) {
          this.pMove();
        } else {
          this.cpuMove();
        }
      }
    }
    if (state == 2 && this.p.still() && keypressed) sce = 2;
    this.p.update();
    this.draw();
  };
  this.draw = function() {
    ctx = myGameArea.ctx;
    if (state == 0) {
      if (this.fade) {
        if (a > 0) {
          a -= 0.01;
        } else {
          state++;
        }
      }
      ctx.fillStyle = "rgba(200,200,200," + a + ")";
      ctx.fillText("Level " + lvl, cx, cy-150);
    } else {
      ctx.fillStyle = "#fff";
      if (state == 2) {
        ctx.fillText("Press any key to go to next level.", cx, cy + 100);
      }
      if (state == 1 && lvl < 3) {
        //show instructions
        var pos = [-60, -20, -20, 20, 60, -20, -20, -20];
        for (var i = 0; i < 4; i++) {
          if (i == arrow) {
            //blink
          }
          ctx.fillRect(x + pos[i * 2], y + pos[i * 2 + 1], 38, 38);
        }
      }
      if (state == 3){
        ctx.fillText("LOST!" + lvl, cx, cy-50);
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
    this.h.draw();
    this.p.draw();
  };
}

function rand(n) {
  return Math.floor(Math.random() * n);
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
