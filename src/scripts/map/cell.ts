import { ConfigTerrain, TerrainType, TerraintypesConst, TypesEnum } from "./terrain.js";

export class CellFactory {
  private attributes: Cell;
  private maxCellHeightDiff!: number;

  constructor(attributes: Cell, maxCellHeightDiff: number) {
    this.attributes = attributes;
    this.maxCellHeightDiff = maxCellHeightDiff;
  }

  // createRandomCell(baseHeight: number, color: string, adjacentHeights: number[]): Cell {
  public createRandomCell(): Cell {
    const typeIndex = Math.floor(Math.random() * TerraintypesConst.length);
    // TODO Melhorar a geração de altura
    let height = Math.floor(this.getRandomHeight(this.attributes.height));

    // Ajustar a altura para garantir que a diferença máxima não seja ultrapassada
    for (const adjHeight of this.attributes.adjacentHeights) {
      if (Math.abs(height - adjHeight) > this.maxCellHeightDiff) {
        if (height > adjHeight) {
          height = adjHeight + this.maxCellHeightDiff;
        } else {
          height = adjHeight - this.maxCellHeightDiff;
        }
      }
    }

    return new Cell({
      height,
      minHeight: height - this.maxCellHeightDiff,
      maxHeight: height + this.maxCellHeightDiff,
      color: this.attributes.color,
      borderColor: this.attributes.borderColor,
      adjacentTypes: this.attributes.adjacentTypes,
      adjacentHeights: this.attributes.adjacentHeights,
      terrain: this.attributes.terrain,
      type: this.attributes.terrain.getType(),
    });
  }

  public getRandomHeight(baseHeight: number): number {
    const heightDifferenceChances: { [key: number]: number } = {
      0: 0.4,
      1: 0.2,
      2: 0.1,
      3: 0.1,
      4: 0.1,
      5: 0.1
    };

    const r = Math.random();
    let random = Math.floor(r * 10) / 10;
    let cumulativeChance = 0;
    let upAndDownTendency = baseHeight > -this.maxCellHeightDiff ? -1 : baseHeight < this.maxCellHeightDiff ? 1 : 0;
    let impulse = random > 0.8 ? 1 : random < 0.2 ? -1 : 0;

    //TODO AUmentar chances de cair no diff
    for (let diff = 0; diff <= 5; diff++) {
      cumulativeChance += heightDifferenceChances[diff];
      if (random < cumulativeChance) {
        upAndDownTendency += baseHeight < this.maxCellHeightDiff * 2 ? 0.5 : 1;
        upAndDownTendency += baseHeight > this.maxCellHeightDiff * 2 ? 1 : 0.5;
        return (baseHeight + (random > upAndDownTendency ? diff + impulse : (diff + impulse) * -1));
      }
    }

    upAndDownTendency += baseHeight + random < this.maxCellHeightDiff ? 1 : 0;
    upAndDownTendency += baseHeight - random > this.maxCellHeightDiff ? -1 : 0;

    return baseHeight + ((upAndDownTendency > 0) ? 1 + impulse : 0 + impulse);
  }

  public drawCell(context: CanvasRenderingContext2D, cell: Cell, tileSize: number, x: number, y: number): void {
    context.fillStyle = cell.color;
    context.fillRect(x, y, tileSize, tileSize);
    context.fillStyle = cell.color;
    context.fillRect(x, y, tileSize, tileSize);

    context.strokeStyle = cell.borderColor;
    context.strokeRect(x, y, tileSize, tileSize);

    context.fillStyle = '#000000';
    context.font = '9px Arial';
    context.textAlign = 'center';
    context.textBaseline = 'middle';
    context.fillText(cell.height.toFixed(0), x + tileSize / 2, y + tileSize / 2);
  }
}

// Usage example
export const CellConst: Cell = {
  height: 0,
  minHeight: 0,
  maxHeight: 255,
  color: '#fff',
  borderColor: '#999',
  adjacentTypes: [],
  adjacentHeights: [],
  terrain: new TerrainType(new ConfigTerrain(0, [], 0, 0)),
  type: TypesEnum.grass
};

export class Cell implements ICell {
  height!: number;
  minHeight!: number;
  maxHeight!: number;
  color!: string;
  borderColor!: string;
  adjacentTypes!: string[];
  adjacentHeights!: number[];
  terrain!: TerrainType;
  type!: TypesEnum;

  constructor(cell: ICell) {
    Object.assign(this, cell);
    this.type = cell.type ? cell.type : TypesEnum.grass;
  }
}

export interface ICell {
  height: number;
  minHeight: number;
  maxHeight: number;
  color: string;
  borderColor: string;
  adjacentTypes: string[];
  adjacentHeights: number[];
  terrain: TerrainType;
  type?: TypesEnum;
}