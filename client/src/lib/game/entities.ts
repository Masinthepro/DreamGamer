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

  constructor(x: number, y: number) {
    this.x = x;
    this.y = y;
  }

  update(deltaTime: number) {}

  render(ctx: CanvasRenderingContext2D) {
    ctx.fillStyle = "#00ff00";
    ctx.beginPath();
    ctx.moveTo(this.x + this.width / 2, this.y);
    ctx.lineTo(this.x + this.width, this.y + this.height);
    ctx.lineTo(this.x, this.y + this.height);
    ctx.closePath();
    ctx.fill();
  }
}

export class Enemy implements Entity {
  x: number;
  y: number;
  width: number = 30;
  height: number = 30;
  speed: number = 2;

  constructor(x: number, y: number) {
    this.x = x;
    this.y = y;
  }

  update(deltaTime: number) {
    this.y += this.speed;
  }

  render(ctx: CanvasRenderingContext2D) {
    ctx.fillStyle = "#ff0000";
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

  constructor(x: number, y: number) {
    this.x = x;
    this.y = y;
  }

  update(deltaTime: number) {
    this.y -= this.speed;
  }

  render(ctx: CanvasRenderingContext2D) {
    ctx.fillStyle = "#ffff00";
    ctx.fillRect(this.x - this.width / 2, this.y, this.width, this.height);
  }
}
