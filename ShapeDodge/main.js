// The title of the game to be displayed on the title screen
title  =  "Shape Dodge";

// The description, which is also displayed on the title screen
description  =  `
Dodge the black squares!
`;

// The array of custom sprites
characters = [
    `
      ll
      ll
    ccllcc
    ccllcc
    ccllcc
    cc  cc
    `,`
    rr  rr
    rrrrrr
    rrpprr
    rrrrrr
      rr
      rr
    `,`
    y  y
    yyyyyy
     y  y
    yyyyyy
     y  y
    `
    ];

// Game runtime options
// Refer to the official documentation for all available options
const G = {
	WIDTH: 150,
	HEIGHT: 150,
    ENEMY_MIN_BASE_SPEED: 0.6,
    ENEMY_MAX_BASE_SPEED: 2.0
};


options = {
	viewSize: {x: G.WIDTH, y: G.HEIGHT},
    theme: "dark",
    seed: 2,
    isPlayingBgm: true
};

/**
 * @typedef {{
 * pos: Vector,
 * }} Player
 */

/**
 * @type { Player }
 */
let player;

/**
 * @typedef {{
 * pos: Vector
 * dir: Vector
 * speed: number
 * }} Enemy
 */

/**
 * @type { Enemy [] }
 */
let enemies;

/**
 * @type { number }
 */
let currentEnemySpeed;

/**
 * @type { number }
 */
let waveCount;

let diff;
let shrinkCooldown
let resetting

// The game loop function
function  update() {
	// The init function
	if (!ticks) {
        player = {
            pos: vec(G.WIDTH * 0.5, G.HEIGHT * 0.5)
        };
        enemies = [];

        waveCount = 0;
        currentEnemySpeed = 0.5;
        diff = 0
        shrinkCooldown = 0
        resetting = false
	}

    diff += 1
    if (diff % 10 == 0) {
        addScore(1)
    }

    if (enemies.length === 0) {
        for (let i = 0; i < 7; i++) {
            const posX = rnd(0, G.WIDTH);
            const posY = -rnd(i * G.HEIGHT * 0.1);
            let dirX = rnd(-1, 1)
            if (dirX < 0) {
                dirX = 1
            }
            else {
                dirX = -1
            }
            let dirY = rnd(-1, 1)
            if (dirY < 0) {
                dirY = 1
            }
            else {
                dirY = -1
            }
            enemies.push({ pos: vec(posX, posY), dir: vec(dirX, dirY), speed: 0.6 })
        }
    }

    if (diff % 300 == 0) {
        const posX = rnd(0, G.WIDTH);
        const posY = -rnd(G.HEIGHT * 0.1);
        let dirX = rnd(-1, 1)
        if (dirX < 0) {
            dirX = 1
        }
        else {
            dirX = -1
        }
        let dirY = rnd(-1, 1)
        if (dirY < 0) {
            dirY = 1
        }
        else {
            dirY = -1
        }
        enemies.push({ pos: vec(posX, posY), dir: vec(dirX, dirY), speed: 0.6 })
    }

    player.pos = vec(input.pos.x, input.pos.y);
    player.pos.clamp(0, G.WIDTH, 0, G.HEIGHT);
    color("cyan")
    if (input.isPressed && shrinkCooldown < 120 && !resetting) {
        box(player.pos, 4).isColliding.rect.black;
        shrinkCooldown += 1
    }
    else {
        box(player.pos, 8).isColliding.rect.black;
        if (shrinkCooldown == 0) {
            shrinkCooldown += 1
            resetting = false
        }
        else {
            shrinkCooldown -= 1
            resetting = true
        }
    }


    enemies.forEach((e) => {
        if (diff % 120 == 0) {
            if (diff < 1200) {
                let chance = rnd(-1,1)
                if (chance < 0) {
                    e.speed += 0.05
                }
            }
        }
        if (e.pos.y >= G.HEIGHT) {
            e.dir.y = -1 + rnd(-0.2, 0.2)
        }
        if (e.pos.y <= 0) {
            e.dir.y = 1 + rnd(-0.2, 0.2)
        }
        if (e.pos.x >= G.WIDTH) {
            e.dir.x = -1 + rnd(-0.2, 0.2)
        }
        if (e.pos.x <= 0) {
            e.dir.x = 1 + rnd(-0.2, 0.2)
        }
        e.pos.y += e.speed * e.dir.y
        e.pos.x += e.speed * e.dir.x
        color("black");
        
        const colliding = box(e.pos, 4).isColliding.rect.cyan;
        if (colliding) {
            color("yellow");
            particle(e.pos);
            play("explosion")
            end()
        }
        
        return (e.pos.y > G.HEIGHT);
    });
    
}