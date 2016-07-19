'use strict';

var play = function(turns) {
  turns = turns||5;
  var tiles;
  for (turns; turns>0; turns--) {
    tiles = $('.tile');
    tiles[Math.floor(Math.Random*tiles.length())].click();
  }
};

describe('mamahjong', function() {

  it('should create a new game', function() {
    game.newGame();
  });

  it('should work with all tilesets', function() {
    for(var key in game.tilesets) {
      game.selectedTileset = game.tilesets[key];
      game.newGame();
    }
  });

  it('should work with all layouts', function() {
    for(var key in game.layouts) {
      game.selectedLayout = game.layouts[key];
      game.newGame();
    }
  });

  it('should have 35 free tiles on start', function() {
    game.selectedLayout = game.layouts.turtle;
    game.newGame();
    expect(game.getFreeTiles().length).toBe(35);
  });

  it('should recalculate the same amount of free tiles', function() {
    game.selectedLayout = game.layouts.turtle;
    game.newGame();
    var oldValue = game.getFreeTiles().length;
    game.updateFreeTiles();
    var newValue = game.getFreeTiles().length;
    expect(newValue).toBe(oldValue);
  });

  it('should be playable for a while', function() {
    play(1000);
  });
});
