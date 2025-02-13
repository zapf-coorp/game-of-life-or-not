import { Cell, CellFactory } from "./map/cell.js";
import { ConfigTerrain, TerrainType } from "./map/terrain.js";


export class GameMap {
  width: number;
  height: number;
  tileSize: number;
  maxCellHeight: number = 255;
  maxCellHeightDiff: number;
  grid!: Cell[][];
  cellFactory!: CellFactory;
  private minHeight: number;
  private maxHeight: number;
  private amplifier = 10;
  private rules: string[] = [];
  private fillTheRules: boolean = false;

  constructor(width: number, height: number, tileSize: number, maxCellHeight: number = 255, maxCellHeightDiff: number = 5, rules: string[], cell?: Cell) {
    this.rules = rules;
    this.width = width / tileSize;
    this.height = height / tileSize;
    this.tileSize = tileSize;
    this.maxCellHeight = maxCellHeight;
    this.maxCellHeightDiff = maxCellHeightDiff || 5;
    this.minHeight = -this.maxCellHeight;
    this.maxHeight = this.maxCellHeight;
    const emptyAdjacentTypes: [] = [];

    while (!this.fillTheRules) {
      const fisrtHeight = this.randomHeightInRange(-this.maxCellHeightDiff, this.maxCellHeightDiff);
      const configFirstTerrain: ConfigTerrain = new ConfigTerrain(
        fisrtHeight,
        emptyAdjacentTypes,
        -this.minHeight * this.amplifier,
        this.maxHeight * this.amplifier
      );
      const terrain: TerrainType =  new TerrainType(configFirstTerrain);
      this.cellFactory = cell ? new CellFactory(cell, maxCellHeightDiff) : new CellFactory(new Cell({
        height: fisrtHeight,
        adjacentTypes: [],
        minHeight: fisrtHeight - this.maxCellHeightDiff,
        maxHeight: fisrtHeight + this.maxCellHeightDiff,
        borderColor: '#999',
        color: terrain.calculateColorForTerrain(terrain.getType()),
        terrain: terrain,
        adjacentHeights: [],
      }), maxCellHeightDiff);

      this.grid = this.createGrid();

      const allCellHeightsBellowZero = this.grid.every(row => row.every(cell => cell.height <= 0));
      const allCellHeightsAboveZero = this.grid.every(row => row.every(cell => cell.height > 0));
      if (this.rules.includes('mustHaveWater') && allCellHeightsBellowZero) {
        console.log('Drowning, rebuilding');
        this.fillTheRules = false;
        continue;
      }
      if (this.rules.includes('mustHaveLand') && allCellHeightsAboveZero) {
        console.log('Wasteland, rebuilding');
        this.fillTheRules = false;
        continue;
      }

      this.fillTheRules = true;
      console.log(this.grid.map(row => row.map(cell => { return { h: cell.height, t: cell.type, a: cell.terrain } })));
    }
  }

  private createGrid(): Cell[][] {
    let grid: Cell[][] = [];
      for (let i = 0; i < this.height; i++) {
        grid[i] = [];
        for (let j = 0; j < this.width; j++) {
          const adjacentHeights = this.getAdjacentHeights(i, j, grid);
          const configTerrain: ConfigTerrain = new ConfigTerrain(
            this.generateHeight(adjacentHeights),
            this.getAdjacentTypes(i, j, grid),
            -this.maxCellHeight,
            this.maxCellHeight,
          );
          const terrain: TerrainType = new TerrainType(configTerrain);
          const cell: Cell = this.cellFactory.createRandomCell();
          let minHeight = cell.height - this.maxCellHeightDiff;
          let maxHeight = cell.height + this.maxCellHeightDiff;
          grid[i][j] = cell;
          cell.color = terrain.getColor()
          if (cell.height < minHeight) cell.minHeight = cell.height;
          if (cell.height > maxHeight) cell.maxHeight = cell.height;
        }
      }

      for (let i = 0; i < this.height; i++) {
        for (let j = 0; j < this.width; j++) {
          const cell: Cell = grid[i][j];
          if (cell.height <= 0) {
            cell.color = cell.terrain.calculateColorForNegativeHeight(cell.height, cell.height - this.maxCellHeightDiff);
          } else {
            cell.color = cell.terrain.calculateColorForTerrain(cell.type);
          }
        }
      }
    return grid;
  }

  private generateHeight(adjacentHeights: number[]): number {
    if (adjacentHeights.length === 0) {
      return this.randomHeight();
    }

    let minHeight = Math.min(...adjacentHeights) - this.maxCellHeightDiff;
    let maxHeight = Math.max(...adjacentHeights) + this.maxCellHeightDiff;

    let newHeight = this.randomHeightInRange(minHeight, maxHeight);

    while (adjacentHeights.some(height => {
      return Math.abs(height - newHeight) > this.maxCellHeightDiff
    })) {
      newHeight = this.randomHeightInRange(minHeight, maxHeight);
    }

    return newHeight;
  }

  private randomHeight(): number {
    return Math.floor(Math.random() * this.maxCellHeightDiff) - this.maxCellHeightDiff;
  }

  private randomHeightInRange(min: number, max: number): number {
    // TODO Verificar se não é aqui que está travando a proximidade dos heights
    // TODO Se tiver 5 vizinhos entre -5 e 0 em volta aumentar a probabilidade de ser maior que zero
    // TODO Se tiver 5 vizinhos entre 0 e 5 em volta aumentar a probabilidade de ser menor que zero
    // TODO Tentar criar continuidade dos rios aumentando a probabilidade de manter agua ao ser cercado de terra e ao ser terra se cercado de agua
    // TODO Tentar criar efeito de picos afinando em montanhas aumentando a amplitude quanto maior for e a tendenciar for de subir e vice e versa
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  private getAdjacentHeights(i: number, j: number, grid: Cell[][]): number[] {
    const adjacentHeights: number[] = [];

    if (i > 0 && grid[i - 1] && grid[i - 1][j] !== undefined) adjacentHeights.push(grid[i - 1][j].height); // Top
    if (j > 0 && grid[i] && grid[i][j - 1] !== undefined) adjacentHeights.push(grid[i][j - 1].height); // Left
    if (i > 0 && j > 0 && grid[i - 1] && grid[i - 1][j - 1] !== undefined) adjacentHeights.push(grid[i - 1][j - 1].height); // Top-left
    if (i > 0 && j < this.width - 1 && grid[i - 1] && grid[i - 1][j + 1] !== undefined) adjacentHeights.push(grid[i - 1][j + 1].height); // Top-right
    if (j < this.width - 1 && grid[i] && grid[i][j + 1] !== undefined) adjacentHeights.push(grid[i][j + 1].height); // Right
    if (i < this.height - 1 && grid[i + 1] && grid[i + 1][j] !== undefined) adjacentHeights.push(grid[i + 1][j].height); // Bottom
    if (i < this.height - 1 && j > 0 && grid[i + 1] && grid[i + 1][j - 1] !== undefined) adjacentHeights.push(grid[i + 1][j - 1].height); // Bottom-left
    if (i < this.height - 1 && j < this.width - 1 && grid[i + 1] && grid[i + 1][j + 1] !== undefined) adjacentHeights.push(grid[i + 1][j + 1].height); // Bottom-right

    return adjacentHeights;
  }

  private getAdjacentTypes(x: number, y: number, grid: any[][]): string[] {
    const types = [];
    const directions = [
      [-1, 0], [1, 0], [0, -1], [0, 1], // N, S, W, E
      [-1, -1], [-1, 1], [1, -1], [1, 1] // NW, NE, SW, SE
    ];
    for (const [dx, dy] of directions) {
      const nx = x + dx;
      const ny = y + dy;
      if (nx >= 0 && nx < grid.length && ny >= 0 && ny < grid[0].length) {
        if (grid[nx][ny]) {
          types.push(grid[nx][ny].type);
        }
      }
    }
    return types;
  }

  public draw(context: CanvasRenderingContext2D): void {
    for (let i = 0; i < this.height; i++) {
      for (let j = 0; j < this.width; j++) {
        const cell = this.grid[i][j];
        const x = j * this.tileSize;
        const y = i * this.tileSize;

        this.cellFactory.drawCell(context, cell, this.tileSize, x, y);
      }
    }
  }
}