let boxes = document.querySelectorAll(".b");
let isstart = document.getElementById("start");
let issingle = document.getElementById("single");
let stts = document.getElementById("status");
let start = 0;
let draw = 0;
let turn = 0; // turn-0 x turn-1 o
let single = 0; // single-0 2-player
let b = [0, 0, 0, 0, 0, 0, 0, 0, 0];  //  2 for O & 1 for X
let winInd = [[0, 1, 2], [3, 4, 5], [6, 7, 8],
[0, 3, 6], [1, 4, 7], [2, 5, 8],
[0, 4, 8], [2, 4, 6]];

// =============================================
function checkwin() {
  let who = "";
  for (let i = 0; i < 8; i++) {
    if (b[winInd[i][0]] == b[winInd[i][1]] && b[winInd[i][0]] == b[winInd[i][2]] && b[winInd[i][0]] != 0) {
      if (b[winInd[i][0]] == 2) who = "O";
      else who = "X";
      return who;
    }
  }
  let tie = 1;
  for (let i = 0; i < 9; i++) {
    if (b[i] == 0) tie = 0;
  }
  if (tie) draw = 1;
  return who;
}
// =============================================
function canwin() {
  let win = -1;
  let val = turn ? 2 : 1;
  for (let i = 0; i < 8; i++) {
    if (b[winInd[i][0]] == val && b[winInd[i][1]] == val && b[winInd[i][2]] == 0) {
      win = winInd[i][2];
      break;
    }
    if (b[winInd[i][0]] == val && b[winInd[i][2]] == val && b[winInd[i][1]] == 0) {
      win = winInd[i][1];
      break;
    }
    if (b[winInd[i][2]] == val && b[winInd[i][1]] == val && b[winInd[i][0]] == 0) {
      win = winInd[i][0];
      break;
    }
  }
  return win;
}
// =============================================
function canstop() {
  let win = -1;
  let val = turn ? 1 : 2;
  for (let i = 0; i < 8; i++) {
    if (b[winInd[i][0]] == val && b[winInd[i][1]] == val && b[winInd[i][2]] == 0) {
      win = winInd[i][2];
      break;
    }
    if (b[winInd[i][0]] == val && b[winInd[i][2]] == val && b[winInd[i][1]] == 0) {
      win = winInd[i][1];
      break;
    }
    if (b[winInd[i][2]] == val && b[winInd[i][1]] == val && b[winInd[i][0]] == 0) {
      win = winInd[i][0];
      break;
    }
  }
  return win;
}
// =============================================
function optimal() {
  // -----------------------------------------
  if (b[4] == 0) {
    return 4;
  }
  // -----------------------------------------
  // if (b[0] == 0) return 0;
  // if (b[2] == 0) return 2;
  // if (b[6] == 0) return 6;
  // if (b[8] == 0) return 8;
  // ------ BELOW CODE IS FOR RANDOMNESS ABOVE IS ALSO FINE -------
  let choices = [];
  if(!b[0]) choices.push(0);
  if(!b[8]) choices.push(8);
  if(!b[6]) choices.push(6);
  if(!b[2]) choices.push(2);
  console.log(choices.length);
  if(choices.length>0){
    return choices[Math.floor(0+Math.random()*choices.length)];
  }
  // -----------------------------------------
  let val = turn ? 2 : 1;
  if (b[0] == val) {
    if (b[1] == 0) return 1;
    if (b[3] == 0) return 3;
  }
  if (b[2] == val) {
    if (b[1] == 0) return 1;
    if (b[5] == 0) return 5;
  }
  if (b[6] == val) {
    if (b[3] == 0) return 3;
    if (b[7] == 0) return 7;
  }
  if (b[8] == val) {
    if (b[5] == 0) return 5;
    if (b[7] == 0) return 7;
  }
}
// =============================================
function aiturn() {
  let win = canwin();
  let stop = canstop();
  let opt = optimal();
  if (win == -1) {
    if (stop == -1) {
      boxes[opt].innerHTML = turn ? "O" : "X";
      b[opt] = turn ? 2 : 1;
      return;
    } else {
      boxes[stop].innerHTML = turn ? "O" : "X";
      b[stop] = turn ? 2 : 1;
      return;
    }
  } else {
    boxes[win].innerHTML = turn ? "O" : "X";
    b[win] = turn ? 2 : 1;
    return;
  }
}
// =============================================
function boxind(ind) {
  if (start == 1) {
    let box = boxes[ind];
    // ----------------------------
    b[ind] = turn ? 2 : 1;
    box.innerHTML = turn ? "O" : "X";
    stts.innerHTML = turn ? "PLAYER X'S TURN" : "PLAYER O'S TURN";
    turn = !turn;
    let win = checkwin();
    if (win != "") {
      stts.innerHTML = `PLAYER ${win} WINS`;
      start = turn = 0;
      for (let i = 0; i < 8; i++) {
        if (b[winInd[i][0]] == b[winInd[i][1]] && b[winInd[i][1]] == b[winInd[i][2]] && b[winInd[i][0]] != 0) {
          boxes[winInd[i][0]].style.backgroundColor = boxes[winInd[i][1]].style.backgroundColor = boxes[winInd[i][2]].style.backgroundColor = "greenyellow";
          return;
        }
      }
      return;
    } else if (draw) {
      stts.innerHTML = `IT'S A DRAW`;
      start = turn = 0;
      return;
    }
    // --------------- BELOW CODE IS FOR AI ---------------------
    if (single) {
      aiturn();
      turn = !turn;
      stts.innerHTML = turn ? "PLAYER O'S TURN" : "PLAYER X'S TURN";
      let win = checkwin();
      if (win != "") {
        stts.innerHTML = `PLAYER ${win} WINS`;
        start = turn = 0;
        for (let i = 0; i < 8; i++) {
          if (b[winInd[i][0]] == b[winInd[i][1]] && b[winInd[i][1]] == b[winInd[i][2]] && b[winInd[i][0]] != 0) {
            boxes[winInd[i][0]].style.backgroundColor = boxes[winInd[i][1]].style.backgroundColor = boxes[winInd[i][2]].style.backgroundColor = "greenyellow";
            return;
          }
        }
        return;
      } else if (draw) {
        stts.innerHTML = `IT'S A DRAW`;
        start = turn = 0;
        return;
      }
    }
  }
}
// =============================================
for (let i = 0; i < 9; i++) {
  boxes[i].addEventListener("click", () => {
    if(b[i]==0) {
      boxind(i);
    }
  })
}
// =============================================
isstart.addEventListener("click", () => {
  stts.innerHTML = ""
  stts.innerHTML = "PLAYER X'S TURN";
  start = 1;
  draw = 0;
  for (let i = 0; i < 9; i++) {
    b[i] = 0;
    boxes[i].innerHTML = "";
    boxes[i].style.backgroundColor = "";
  }
})
// =============================================
issingle.addEventListener("click", () => {
  issingle.innerHTML = single ? "SWITCH TO SINGLE PLAYER" : "SWITCH TO DOUBLE PLAYER";
  stts.innerHTML = ""
  stts.innerHTML = "PLAYER X'S TURN";
  single = !single;
  start = 1;
  draw = 0;
  for (let i = 0; i < 9; i++) {
    b[i] = 0;
    boxes[i].innerHTML = "";
    boxes[i].style.backgroundColor = "";
  }
})