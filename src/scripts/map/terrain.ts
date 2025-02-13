export class TerrainType {
  private type!: TypesEnum;
  private color!: string;
  private height!: number;
  private adjacentTypes!: string[];
  constructor(terrain: ConfigTerrain) {
    this.height = terrain.height;
    this.adjacentTypes = terrain.adjacentTypes;
    this.type = terrain.type ?? this.determineTerrainType();
  }

  public getType(): TypesEnum {
    return this.type;
  }

  public getColor(): string {
    return this.color;
  }

  public determineTerrainType(): TypesEnum {
    const typeCounts = this.adjacentTypes.reduce((counts: Record<string, number>, type: string) => {
      counts[type] = (counts[type] || 0) + 1;
      return counts;
    }, {});
    const r = Math.random();
    const rnd = Math.floor( r * 10) / 10;

    if (this.height <= 2) {
      if (typeCounts['sand'] > 2) { // Sand > Grass > Montain
        return rnd < 0.7 ? TypesEnum.sand :
          rnd < 0.3 && rnd > 0.1 ? TypesEnum.grass : TypesEnum.sand;
      } else if (typeCounts['grass'] > 2) {
        return rnd < 0.7 ? TypesEnum.sand :
          rnd < 0.3 && rnd > 0.1 ? TypesEnum.grass : TypesEnum.montain;
      } else if (typeCounts['montain'] > 2) {
        return rnd < 0.7 ? TypesEnum.sand :
          rnd < 0.3 && rnd > 0.1 ? TypesEnum.grass : TypesEnum.sand;
      } else {
        return TypesEnum.sand;
      }

    } else if (this.height > 2 && this.height < 10) { // Grass > Sand > Montain
      if (typeCounts['grass'] > 3) {
        return rnd < 0.7 ? TypesEnum.grass :
          rnd < 0.3 && rnd > 0.1 ? TypesEnum.sand : TypesEnum.grass;
      } else if (typeCounts['sand'] > 3) {
        return rnd < 0.7 ? TypesEnum.grass :
          rnd < 0.3 && rnd > 0.1 ? TypesEnum.sand : TypesEnum.montain;
      } else if (typeCounts['montain'] > 3) {
        return rnd < 0.7 ? TypesEnum.grass :
          rnd < 0.3 && rnd > 0.1 ? TypesEnum.sand : TypesEnum.grass;
      } else {
        return TypesEnum.grass;
      }
    } else if (this.height >= 10 && this.height < 25) { // Montain > Grass > Sand >
      if (typeCounts['montain'] > 3) {
        return rnd < 0.7 ? TypesEnum.montain :
          rnd < 0.3 && rnd > 0.1 ? TypesEnum.grass : TypesEnum.montain;
      } else if (typeCounts['grass'] > 3) {
        return rnd < 0.7 ? TypesEnum.montain :
          rnd < 0.3 && rnd > 0.1 ? TypesEnum.grass : TypesEnum.grass;
      } else if (typeCounts['sand'] > 3) {
        return rnd < 0.7 ? TypesEnum.montain :
          rnd < 0.3 && rnd > 0.1 ? TypesEnum.grass : TypesEnum.montain;
      } else {
        return TypesEnum.montain;
      }
    } else { // Montain > Montain > grass >
      if (typeCounts['montain'] > 3) {
        return rnd < 0.7 ? TypesEnum.montain :
          rnd < 0.2 && rnd > 0.1 ? TypesEnum.grass : TypesEnum.montain;
      } else if (typeCounts['grass'] > 3) {
        return rnd < 0.7 ? TypesEnum.montain :
          rnd < 0.2 && rnd > 0.1 ? TypesEnum.grass : TypesEnum.grass;
      } else if (typeCounts['sand'] > 3) {
        return rnd < 0.7 ? TypesEnum.montain :
          rnd < 0.2 && rnd > 0.1 ? TypesEnum.grass : TypesEnum.montain;
      } else {
        return TypesEnum.montain;
      }
    }
    return TypesEnum.grass;
  }

  public calculateColorForTerrain(type: string): string {
    // const ratio = (height - minHeight) / (maxHeight - minHeight);
    switch (type) {
      case 'grass':
        return `rgb(0, 250, 50)`;
      case 'mountain':
        return `rgb(100, 100, 100)`;
      case 'sand':
        return `rgb(250, 200, 100)`;
      case 'watter':
        return `rgb(100, 100, 250)`;
      default:
        return `rgb(255, 255, 255)`; // default to white if type is unknown
    }
  }

  public calculateColorForNegativeHeight(height: number, minHeight: number): string {
    const ratio = height / minHeight;
    const blueValue = Math.floor(255 * (ratio + 100));
    return `rgb(100, 50, 200)`;
  }
}

export enum TypesEnum {
  grass = 'grass',
  water = 'water',
  sand = 'sand',
  montain = 'montain',
}

export const TerraintypesConst: TypesEnum[] = [TypesEnum.grass, TypesEnum.water, TypesEnum.sand, TypesEnum.montain];

interface IConfigTerrain {
  height: number;
  adjacentTypes: string[];
  minHeight: number;
  maxHeight: number;
  type?: TypesEnum;
}
export class ConfigTerrain implements IConfigTerrain {
  height!: number;
  adjacentTypes!: string[];
  minHeight!: number;
  maxHeight!: number;
  type?: TypesEnum;

  constructor(height: number, adjacentTypes: string[], minHeight: number, maxHeight: number, type?: TypesEnum) {
    this.height = height;
    this.adjacentTypes = adjacentTypes;
    this.minHeight = minHeight;
    this.maxHeight = maxHeight;
    this.type = type;
  }
}