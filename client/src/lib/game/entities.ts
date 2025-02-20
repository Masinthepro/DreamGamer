export interface Entity {
  x: number;
  y: number;
  width: number;
  height: number;
  update(deltaTime: number): void;
  render(ctx: CanvasRenderingContext2D): void;
}

export class Player implements Entity {
  x: number;
  y: number;
  width: number = 40;
  height: number = 40;
  health: number;
  velocity: number = 0;
  maxVelocity: number = 8;
  acceleration: number = 0.5;
  friction: number = 0.92;
  private lastShot: number = 0;
  private shootCooldown: number = 250; // 250ms cooldown between shots

  constructor(x: number, y: number, initialHealth: number = 100) {
    this.x = x;
    this.y = y;
    this.health = initialHealth;
  }

  update(deltaTime: number) {
    // Apply friction to slow down naturally
    this.velocity *= this.friction;

    // Update position based on velocity
    this.x += this.velocity;
  }

  moveLeft() {
    this.velocity = Math.max(this.velocity - this.acceleration, -this.maxVelocity);
  }

  moveRight() {
    this.velocity = Math.min(this.velocity + this.acceleration, this.maxVelocity);
  }

  canShoot(): boolean {
    const now = performance.now();
    return now - this.lastShot >= this.shootCooldown;
  }

  shoot(): void {
    this.lastShot = performance.now();
  }

  render(ctx: CanvasRenderingContext2D) {
    // Draw player ship
    ctx.fillStyle = "#00ff00";
    ctx.beginPath();
    ctx.moveTo(this.x + this.width / 2, this.y);
    ctx.lineTo(this.x + this.width, this.y + this.height);
    ctx.lineTo(this.x, this.y + this.height);
    ctx.closePath();
    ctx.fill();

    // Render health bar
    const healthBarWidth = this.width;
    const healthBarHeight = 4;
    ctx.fillStyle = "#ff0000";
    ctx.fillRect(this.x, this.y - 10, healthBarWidth, healthBarHeight);
    ctx.fillStyle = "#00ff00";
    ctx.fillRect(
      this.x,
      this.y - 10,
      (healthBarWidth * this.health) / 100,
      healthBarHeight
    );

    // Render reload indicator
    if (!this.canShoot()) {
      const reloadProgress = Math.min(
        (performance.now() - this.lastShot) / this.shootCooldown,
        1
      );
      const reloadWidth = this.width * reloadProgress;
      ctx.fillStyle = "#ffff00";
      ctx.fillRect(this.x, this.y - 15, reloadWidth, 2);
    }
  }

  takeDamage(amount: number) {
    this.health -= amount;
    if (this.health < 0) this.health = 0;
  }
}

export type EnemyType = "basic" | "shooter" | "zigzag";

export class Enemy implements Entity {
  x: number;
  y: number;
  width: number = 30;
  height: number = 30;
  type: EnemyType;
  private time: number = 0;
  private amplitude: number = 100;
  private frequency: number = 0.002;
  speed: number;

  constructor(x: number, y: number, type: EnemyType = "basic", baseSpeed: number = 3) {
    this.x = x;
    this.y = y;
    this.type = type;
    this.speed = baseSpeed;

    // Adjust speed based on enemy type
    if (type === "shooter") {
      this.speed = baseSpeed * 0.7; // Slower
    } else if (type === "zigzag") {
      this.speed = baseSpeed * 1.3; // Faster
    }
  }

  update(deltaTime: number) {
    this.time += deltaTime;

    switch (this.type) {
      case "basic":
        this.y += this.speed;
        break;
      case "shooter":
        this.y += this.speed;
        break;
      case "zigzag":
        this.y += this.speed;
        this.x += Math.sin(this.time * this.frequency) * this.amplitude * 0.1;
        break;
    }
  }

  render(ctx: CanvasRenderingContext2D) {
    switch (this.type) {
      case "basic":
        ctx.fillStyle = "#ff0000";
        break;
      case "shooter":
        ctx.fillStyle = "#ff00ff";
        break;
      case "zigzag":
        ctx.fillStyle = "#ff8800";
        break;
    }

    ctx.beginPath();
    ctx.moveTo(this.x + this.width / 2, this.y + this.height);
    ctx.lineTo(this.x + this.width, this.y);
    ctx.lineTo(this.x, this.y);
    ctx.closePath();
    ctx.fill();
  }
}

export class Bullet implements Entity {
  x: number;
  y: number;
  width: number = 4;
  height: number = 10;
  speed: number = 7;
  isEnemy: boolean;

  constructor(x: number, y: number, isEnemy: boolean = false) {
    this.x = x;
    this.y = y;
    this.isEnemy = isEnemy;
    if (isEnemy) {
      this.speed = 5;
    }
  }

  update(deltaTime: number) {
    this.y += this.isEnemy ? this.speed : -this.speed;
  }

  render(ctx: CanvasRenderingContext2D) {
    ctx.fillStyle = this.isEnemy ? "#ff0000" : "#ffff00";
    ctx.fillRect(this.x - this.width / 2, this.y, this.width, this.height);
  }
}