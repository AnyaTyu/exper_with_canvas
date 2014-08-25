$(document).ready(function () {
	//цикл игры
	var FPS = 30;
	setInterval(function() {
		update();
		draw();
	}, 1000/FPS);

	function update() {
		if (keydown.space) {
    		player.shoot();
  		}
		if (keydown.left) {
    		player.x -= 5;
  		}
  		if (keydown.right) {
    		player.x += 5;
  		}
  		player.x = player.x.clamp(0, canvas.width - player.width);
  		playerBullets.forEach(function(bullet) {
    		bullet.update();
  		});

  		playerBullets = playerBullets.filter(function(bullet) {
    		return bullet.active;
  		});
  		enemies.forEach(function(enemy) {
    		enemy.update();
  		});

  		enemies = enemies.filter(function(enemy) {
    		return enemy.active;
  		});

  		if(Math.random() < 0.1) {
    		enemies.push(Enemy());
  		}

  		handleCollisions();
	};

	function draw() {
		context.clearRect(0, 0, canvas.width, canvas.height);
		player.draw();
		playerBullets.forEach(function(bullet) {
    		bullet.draw();
  		});
  		enemies.forEach(function(enemy) {
    		enemy.draw();
  		});
	};

})

var canvas = document.getElementById("drawingCanvas");
var context = canvas.getContext("2d");

//Обьекты игры
	var player = {
		x: 20,
		y: 580,
		width:64,
		height:64,
  		draw: function() {
  			var myImg2 = new Image();
			myImg2.src = "tank.jpg";
			context.drawImage(myImg2, player.x, player.y);
  		}
	};
	//пули
	var playerBullets = [];
	//самолетики
	enemies = [];

player.shoot = function() {
  var bulletPosition = this.midpoint();

  playerBullets.push(Bullet({
    speed: 5,
    x: bulletPosition.x,
    y: bulletPosition.y
  }));
};

player.midpoint = function() {
  return {
    x: this.x + this.width,
    y: this.y + this.height/4
  };
};

function Bullet(I) {
  I.active = true;

  I.xVelocity = 0;
  I.yVelocity = -I.speed;
  I.width = 3;
  I.height = 3;
  I.color = "#000";

  I.inBounds = function() {
    return I.x >= 0 && I.x <= canvas.width &&
      I.y >= 0 && I.y <= canvas.height;
  };

  I.draw = function() {
    context.fillStyle = this.color;
    context.fillRect(this.x, this.y, this.width, this.height);
  };

  I.update = function() {
    I.x += I.xVelocity;
    I.y += I.yVelocity;

    I.active = I.active && I.inBounds();
  };

  return I;
}

function Enemy(I) {
  I = I || {};

  I.active = true;
  I.age = Math.floor(Math.random() * 128);

  I.color = "#A2B";

  I.x = canvas.width / 4 + Math.random() * canvas.width / 2;
  I.y = 0;
  I.xVelocity = 0
  I.yVelocity = 2;

  I.width = 32;
  I.height = 32;

  I.inBounds = function() {
    return I.x >= 0 && I.x <= canvas.width &&
      I.y >= 0 && I.y <= canvas.height;
  };

  I.draw = function() {
    var myImg1 = new Image();
	myImg1.src = "plain.png";
	context.drawImage(myImg1, this.x, this.y);
  };

  I.update = function() {
    I.x += I.xVelocity;
    I.y += I.yVelocity;

    I.xVelocity = 3 * Math.sin(I.age * Math.PI / 64);

    I.age++;

    I.active = I.active && I.inBounds();
  };

  I.explode = function() {
    this.active = false;
    // Дополнительно: Добавляем графику для взрыва
  };

  return I;
};

player.explode = function() {
  this.active = false;
  // Дополнительно: Добавляем графику для взрыва и заканчиваем игру
};

function collides(a, b) {
  return a.x < b.x + b.width &&
         a.x + a.width > b.x &&
         a.y < b.y + b.height &&
         a.y + a.height > b.y;
}

function handleCollisions() {
  playerBullets.forEach(function(bullet) {
    enemies.forEach(function(enemy) {
      if (collides(bullet, enemy)) {
        enemy.explode();
        bullet.active = false;
      }
    });
  });

  enemies.forEach(function(enemy) {
    if (collides(enemy, player)) {
      enemy.explode();
      player.explode();
    }
  });
}