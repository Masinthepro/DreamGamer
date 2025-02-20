import { type Entity, Player, Enemy, Bullet, type EnemyType } from "./entities";

export interface GameState {
  player: Player;
  enemies: Enemy[];
  bullets: Bullet[];
  score: number;
  gameOver: boolean;
}

export class GameEngine {
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private state: GameState;
  private lastSpawn: number = 0;
  private spawnInterval: number = 800; // Decreased from 1000
  private lastEnemyShot: number = 0;
  private enemyShootInterval: number = 1500;
  private animationId: number | null = null;
  private lastTimestamp: number = 0;

  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas;
    this.ctx = canvas.getContext("2d")!;
    this.state = {
      player: new Player(canvas.width / 2, canvas.height - 50),
      enemies: [],
      bullets: [],
      score: 0,
      gameOver: false,
    };
  }

  start() {
    this.state.gameOver = false;
    this.state.score = 0;
    this.state.player.health = 100;
    this.lastTimestamp = performance.now();
    this.animate(this.lastTimestamp);
  }

  stop() {
    if (this.animationId) {
      cancelAnimationFrame(this.animationId);
    }
  }

  private animate(timestamp: number) {
    const deltaTime = timestamp - this.lastTimestamp;
    this.lastTimestamp = timestamp;

    this.update(deltaTime);
    this.render();

    if (!this.state.gameOver) {
      this.animationId = requestAnimationFrame((t) => this.animate(t));
    }
  }

  private update(deltaTime: number) {
    this.updateEntities(deltaTime);
    this.spawnEnemies(deltaTime);
    this.handleEnemyShooting(deltaTime);
    this.checkCollisions();
  }

  private updateEntities(deltaTime: number) {
    this.state.player.update(deltaTime);
    this.state.enemies.forEach(enemy => enemy.update(deltaTime));
    this.state.bullets.forEach(bullet => bullet.update(deltaTime));

    // Remove off-screen entities
    this.state.bullets = this.state.bullets.filter(
      bullet => bullet.y > 0 && bullet.y < this.canvas.height
    );
    this.state.enemies = this.state.enemies.filter(
      enemy => enemy.y < this.canvas.height && enemy.x > 0 && enemy.x < this.canvas.width
    );
  }

  private spawnEnemies(deltaTime: number) {
    this.lastSpawn += deltaTime;
    if (this.lastSpawn >= this.spawnInterval) {
      const x = Math.random() * (this.canvas.width - 30);
      const types: EnemyType[] = ["basic", "shooter", "zigzag"];
      const type = types[Math.floor(Math.random() * types.length)];
      this.state.enemies.push(new Enemy(x, -30, type));
      this.lastSpawn = 0;

      // Increase difficulty over time
      if (this.spawnInterval > 400) {
        this.spawnInterval -= 10;
      }
    }
  }

  private handleEnemyShooting(deltaTime: number) {
    this.lastEnemyShot += deltaTime;
    if (this.lastEnemyShot >= this.enemyShootInterval) {
      const shooters = this.state.enemies.filter(enemy => enemy.type === "shooter");
      shooters.forEach(shooter => {
        this.state.bullets.push(
          new Bullet(shooter.x + shooter.width / 2, shooter.y + shooter.height, true)
        );
      });
      this.lastEnemyShot = 0;
    }
  }

  private checkCollisions() {
    // Check player bullets hitting enemies
    this.state.bullets.forEach((bullet, bulletIndex) => {
      if (!bullet.isEnemy) {
        this.state.enemies.forEach((enemy, enemyIndex) => {
          if (this.checkCollision(bullet, enemy)) {
            this.state.bullets.splice(bulletIndex, 1);
            this.state.enemies.splice(enemyIndex, 1);
            this.state.score += enemy.type === "shooter" ? 150 : 
                               enemy.type === "zigzag" ? 200 : 100;
          }
        });
      }
    });

    // Check enemy bullets hitting player
    this.state.bullets.forEach((bullet, bulletIndex) => {
      if (bullet.isEnemy && this.checkCollision(bullet, this.state.player)) {
        this.state.bullets.splice(bulletIndex, 1);
        this.state.player.takeDamage(20);
        if (this.state.player.health <= 0) {
          this.state.gameOver = true;
        }
      }
    });

    // Check player-enemy collisions
    this.state.enemies.forEach(enemy => {
      if (this.checkCollision(this.state.player, enemy)) {
        this.state.player.takeDamage(50);
        if (this.state.player.health <= 0) {
          this.state.gameOver = true;
        }
      }
    });
  }

  private checkCollision(a: Entity, b: Entity): boolean {
    return (
      a.x < b.x + b.width &&
      a.x + a.width > b.x &&
      a.y < b.y + b.height &&
      a.y + a.height > b.y
    );
  }

  private render() {
    this.ctx.fillStyle = "#000033";
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

    this.state.player.render(this.ctx);
    this.state.enemies.forEach(enemy => enemy.render(this.ctx));
    this.state.bullets.forEach(bullet => bullet.render(this.ctx));

    // Render score
    this.ctx.fillStyle = "#ffffff";
    this.ctx.font = "20px 'Press Start 2P', system-ui";
    this.ctx.fillText(`Score: ${this.state.score}`, 10, 30);
  }

  shoot() {
    if (!this.state.gameOver) {
      const bullet = new Bullet(
        this.state.player.x + this.state.player.width / 2,
        this.state.player.y
      );
      this.state.bullets.push(bullet);
    }
  }

  movePlayer(direction: "left" | "right") {
    if (!this.state.gameOver) {
      const speed = 5;
      const newX = this.state.player.x + (direction === "left" ? -speed : speed);
      if (newX >= 0 && newX <= this.canvas.width - this.state.player.width) {
        this.state.player.x = newX;
      }
    }
  }

  getScore(): number {
    return this.state.score;
  }

  isGameOver(): boolean {
    return this.state.gameOver;
  }
}