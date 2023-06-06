var gameboard = document.getElementById("gameboard");
var scoreboard = document.getElementById("scoreboard");
var startButton = document.getElementById("startButton");
var snake;
var direction;
var food;
var score;
var intervalId;

startButton.addEventListener("click", startGame);

function startGame() {
  clearGameboard();
  startButton.disabled = true; // 遊戲開始後禁用按鈕
  startButton.style.display = "none";

  snake = [{ x: 5, y: 5 }];
  direction = "right";
  food = { x: 10, y: 10 };
  score = 0;
  scoreboard.innerHTML = "得分：" + score;
  intervalId = setInterval(moveSnake, 100); // 開始移動貪吃蛇
  drawSnake();
  candy = { x: 8, y: 8 };
generateCandy();

  drawFood();
}

function clearGameboard() {
  while (gameboard.firstChild) {
    gameboard.removeChild(gameboard.firstChild);
  }
}

function drawSnake() {
  var snakeElements = document.getElementsByClassName("snake");
  while (snakeElements.length > 0) {
    snakeElements[0].parentNode.removeChild(snakeElements[0]);
  }
  for (var i = 0; i < snake.length; i++) {
    var snakeElement = document.createElement("div");
    snakeElement.classList.add("snake");
    if (i === 0) {
      snakeElement.classList.add("head");
      snakeElement.style.transform = "rotate(" + getHeadRotation() + "deg)";
    } else {
      snakeElement.classList.add("body");
    }
    
    snakeElement.style.left = snake[i].x * 20 + "px";
    snakeElement.style.top = snake[i].y * 20 + "px";
    gameboard.appendChild(snakeElement);
    if (i > 0) {
      var prevBody = snake[i - 1];
      var currBody = snake[i];
      var bodyDirection = getBodyDirection(prevBody, currBody);
      snakeElement.style.transform = "rotate(" + bodyDirection + "deg)";
    }
  }
} 

function getBodyDirection(prevBody, currBody) {
  if (prevBody.x < currBody.x) {
    return 0; // 向右
  } else if (prevBody.x > currBody.x) {
    return 180; // 向左
  } else if (prevBody.y < currBody.y) {
    return 90; // 向下
  } else if (prevBody.y > currBody.y) {
    return -90; // 向上
  }
}
function drawFood() {
  var foodElement = document.createElement("div");
  foodElement.classList.add("food");
  foodElement.style.left = food.x * 20 + "px";
  foodElement.style.top = food.y * 20 + "px";
  gameboard.appendChild(foodElement);
}

function generateCandy() {
    var candyElement = document.getElementsByClassName("candy")[0];
    if (candyElement) {
      gameboard.removeChild(candyElement);
    }
  
    var x = Math.floor(Math.random() * (gameboard.clientWidth / 20));
    var y = Math.floor(Math.random() * (gameboard.clientHeight / 20));
  
    for (var i = 0; i < snake.length; i++) {
      if (snake[i].x === x && snake[i].y === y) {
        return generateCandy(); // 避免糖果生成在貪吃蛇身體上
      }
    }
  
    if (food.x === x && food.y === y) {
      return generateCandy(); // 避免糖果生成在食物位置上
    }
  
    candy.x = x;
    candy.y = y;
  
    var candyElement = document.createElement("div");
    candyElement.classList.add("candy");
    candyElement.style.left = candy.x * 20 + "px";
    candyElement.style.top = candy.y * 20 + "px";
    gameboard.appendChild(candyElement);
  }
  


  

  function moveSnake() {
    var newHead = { x: snake[0].x, y: snake[0].y };
    if (direction === "right") {
      newHead.x++;
    } else if (direction === "left") {
      newHead.x--;
    } else if (direction === "up") {
      newHead.y--;
    } else if (direction === "down") {
      newHead.y++;
    }
    if (isCollision(newHead) || isOutOfBounds(newHead)) {
      gameOver();
      return;
    }
    clearHead(); // 清除頭部原來的位置
    snake.unshift(newHead);
    if (newHead.x === food.x && newHead.y === food.y) {
      score++;
      scoreboard.innerHTML = "得分：" + score;
      generateFood();
      generateCandy();
      // 在吃到食物後新增身體部分
      var newBodyPart = { x: snake[0].x, y: snake[0].y };
      snake.splice(1, 0, newBodyPart);
    } else if (newHead.x === candy.x && newHead.y === candy.y) {
      if (score === -1) {
        gameOver();
        return;
      }
      score--;
      scoreboard.innerHTML = "得分：" + score;
      generateCandy();
      generateFood();
      // 減少身體長度兩個單位
      snake.pop();
      snake.pop();
      snake.pop();
    } else {
      snake.pop();
    }
    if (score === -1) {
        gameOver();
        return;
      }
    drawSnake();
  }
  
  
  
  
  
  

function clearHead() {
  var headElement = document.querySelector(".head");
  if (headElement) {
    headElement.classList.remove("head");
  }
}

function generateFood() {
  var x = Math.floor(Math.random() * (gameboard.clientWidth / 20));
  var y = Math.floor(Math.random() * (gameboard.clientHeight / 20));

  for (var i = 0; i < snake.length; i++) {
    if (snake[i].x === x && snake[i].y === y) {
      return generateFood(); // 避免食物生成在貪吃蛇身體上
    }
  }
  food.x = x;
  food.y = y;
  var foodElement = document.getElementsByClassName("food")[0];
  foodElement.style.left = food.x * 20 + "px";
  foodElement.style.top = food.y * 20 + "px";
}

function isCollision(position) {
  for (var i = 1; i < snake.length; i++) {
    if (snake[i].x === position.x && snake[i].y === position.y) {
      return true; // 碰撞檢查
    }
  }
  return false;
}

function isOutOfBounds(position) {
  return (
    position.x < 0 ||
    position.x >= gameboard.clientWidth / 20 ||
    position.y < 0 ||
    position.y >= gameboard.clientHeight / 20
  );
}

function gameOver() {
  clearInterval(intervalId); // 停止遊戲循環
  startButton.disabled = false; // 允許重新開始遊戲
  startButton.style.display = "block";

  alert("遊戲結束！得分：" + score);
}

function getHeadRotation() {
  switch (direction) {
    case "right":
      return 0;
    case "left":
      return 180;
    case "up":
      return -90;
    case "down":
      return 90;
    default:
      return 0;
  }
}


document.addEventListener("keydown", function (event) {
  if (event.keyCode === 37 && direction !== "right") {
    direction = "left";
  } else if (event.keyCode === 38 && direction !== "down") {
    direction = "up";
  } else if (event.keyCode === 39 && direction !== "left") {
    direction = "right";
  } else if (event.keyCode === 40 && direction !== "up") {
    direction = "down";
  }
});
