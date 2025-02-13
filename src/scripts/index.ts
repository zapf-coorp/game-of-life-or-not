import { Game } from "./game.js";

console.log('Hello World!');

class Start {
  private tileSize = 16;
  private mapWidth = 1336;
  private mapHeight = 768;
  private maxCellHeight = 25;
  private maxCellHeightDiff = 5;
  private mustHaveWater = true;
  // private mapWidth = 1336;
  // private mapHeight = 768;
  constructor(
    private game = new Game(document),
  ) {
    console.log('Construiu a classe Start');
    // Carregar imagens e sons
    // Criar os CellAtributes

    // Criar Conjunto de Regras

    game.addRule('mustHaveLand');
    game.addRule('mustHaveWater');

    // Configurar o mapa
    game.createMap(this.mapWidth, this.mapHeight, this.tileSize, this.maxCellHeight, this.maxCellHeightDiff, undefined);
    // Calcula o tamanho total do canvas
    game.setScreen();
    // Função para desenhar o mapa
    game.drawMap();

  }
}


new Start();