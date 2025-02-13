import { Game } from "./game";

export class Start {
  tileSize = 16;
  mapWidth = 1336;
  mapHeight = 900;
  maxCellHeight = 32;
  maxCellHeightDiff = 5;
  ctx!: CanvasRenderingContext2D;
  game!: Game;
  rules: string[] = [];

  constructor() {
    // Configurar o jopgo
    this.game = new Game(document);
    // configurar regras
    this.game.addRule('mustHaveLand');
    this.game.addRule('mustHaveWater');

    // Criar o contexto
    this.ctx = this.game.getContext();

    // Carregar imagens e sons

    // Calcula o tamanho da tela
    this.game.setScreen();

    // Cria o mapa
    this.game.createMap(this.mapWidth, this.mapHeight, this.tileSize, this.maxCellHeight, this.maxCellHeightDiff);

    // this.game.drawMap();
  }
}
