import { GameMap } from "./map.js";
import { Cell } from "./map/cell.js";

export class Game {
  canvas: HTMLCanvasElement;
  context!: CanvasRenderingContext2D;
  map!: GameMap;
  private rules: string[] = [];

  constructor(obj: any) {
    this.canvas = obj.getElementById('gameCanvas');
    this.context = this.canvas.getContext('2d') as CanvasRenderingContext2D;
    console.log('Canvas ready');
  }

  getContext(): CanvasRenderingContext2D {
    return this.context;
  }

  getCanvas(): HTMLCanvasElement {
    return this.canvas;
  }

  addRule(rule: string) {
    this.rules.push(rule);
  }

  removeRule(rule: string) {
    this.rules = this.rules.filter(r => r !== rule);
  }

  setScreen() {
    this.canvas.width = this.map.width * this.map.tileSize;
    this.canvas.height = this.map.height * this.map.tileSize;
    this.context.fillRect(0, 0, this.canvas.width, this.canvas.height);

  }
  createMap(width: number, height: number, tileSize: number, maxCellHeight?: number, maxCellHeightDiff?: number, cell?: Cell) {
    this.map = new GameMap(width, height, tileSize, maxCellHeight, maxCellHeightDiff, this.rules, cell);
  }

  drawMap() {
    this.map.draw(this.context);
  }
}