var game = {layouts: {}};

//Defaults
game.boardWidth = 800;
game.boardHeight = 600;
game.tileAspectRatio = 1.3;


game.layouts.turtle = {
  tile_size: [2,2],
  gridWidth: 30,
  gridHeight: 16,
  tile_layers: [
    [
      "  #*#*#*#*#*#*#*#*#*#*#*#*    \n",
      "  ************************    \n",
      "      #*#*#*#*#*#*#*#*        \n",
      "      ****************        \n",
      "    #*#*#*#*#*#*#*#*#*#*      \n",
      "    ********************      \n",
      "  #*#*#*#*#*#*#*#*#*#*#*#*    \n",
      "#*************************#*#*\n",
      "**#*#*#*#*#*#*#*#*#*#*#*#*****\n",
      "  ************************    \n",
      "    #*#*#*#*#*#*#*#*#*#*      \n",
      "    ********************      \n",
      "      #*#*#*#*#*#*#*#*        \n",
      "      ****************        \n",
      "  #*#*#*#*#*#*#*#*#*#*#*#*    \n",
      "  ************************    \n"
    ],
    [
      "                              \n",
      "                              \n",
      "        #*#*#*#*#*#*          \n",
      "        ************          \n",
      "        #*#*#*#*#*#*          \n",
      "        ************          \n",
      "        #*#*#*#*#*#*          \n",
      "        ************          \n",
      "        #*#*#*#*#*#*          \n",
      "        ************          \n",
      "        #*#*#*#*#*#*          \n",
      "        ************          \n",
      "        #*#*#*#*#*#*          \n",
      "        ************          \n",
      "                              \n",
      "                              \n"
    ],
    [
      "                              \n",
      "                              \n",
      "                              \n",
      "                              \n",
      "          #*#*#*#*            \n",
      "          ********            \n",
      "          #*#*#*#*            \n",
      "          ********            \n",
      "          #*#*#*#*            \n",
      "          ********            \n",
      "          #*#*#*#*            \n",
      "          ********            \n",
      "                              \n",
      "                              \n",
      "                              \n",
      "                              \n"
    ],
    [
      "                              \n",
      "                              \n",
      "                              \n",
      "                              \n",
      "                              \n",
      "                              \n",
      "            #*#*              \n",
      "            ****              \n",
      "            #*#*              \n",
      "            ****              \n",
      "                              \n",
      "                              \n",
      "                              \n",
      "                              \n",
      "                              \n",
      "                              \n"
    ],
    [
      "                              \n",
      "                              \n",
      "                              \n",
      "                              \n",
      "                              \n",
      "                              \n",
      "                              \n",
      "             #*               \n",
      "             **               \n",
      "                              \n",
      "                              \n",
      "                              \n",
      "                              \n",
      "                              \n",
      "                              \n",
      "                              \n"
    ]
  ]
};

game.selectedLayout = game.layouts.turtle;
game.gridWidth = game.selectedLayout.gridWidth;
game.gridHeight = game.selectedLayout.gridHeight;

game.detachTile = function(tile) {
  var id = tile.id;
  for (var key in tile.leftTiles) {
    if (key === 'count') {continue;}
    tile.leftTiles[key].rightTiles.count--;
    game.updateTileState(tile.leftTiles[key]);
    tile.leftTiles.count--;
    game.updateTileState(tile);
  }
  for (key in tile.rightTiles) {
    if (key === 'count') {continue;}
    tile.rightTiles[key].leftTiles.count--;
    game.updateTileState(tile.rightTiles[key]);
    tile.rightTiles.count--;
    game.updateTileState(tile);
  }
  for (key in tile.bottomTiles) {
    if (key === 'count') {continue;}
    tile.bottomTiles[key].topTiles.count--;
    game.updateTileState(tile.bottomTiles[key]);
    tile.bottomTiles.count--;
    game.updateTileState(tile);
  }
};

game.onTileClick = function(event){
  var id = parseInt(event.target.id);
  var tile = game.tiles[id];

  if (!tile.free || game.locked) {
    return;
  }


  if (game.markedTile) {
    if ((game.markedTile.type == tile.type) && (game.markedTile.id != tile.id)) {
      game.locked = true;

      game.detachTile(game.markedTile);
      game.markedTile.element.css({
        'z-index': 1000,
        'background-color': ''
      }).animate({
        left: '-=' + game.borderThickness.toString(),
        top: '-=' + game.borderThickness.toString()
      }).animate({
        left: '-100px',
        top: '-100px'
      }).queue( function(next) {
        game.markedTile.element.remove();
        game.markedTile = null;
        next();
      });

      game.detachTile(tile);
      game.locked = true;
      tile.element.css('z-index', 1000).animate({
        left: '-=' + game.borderThickness.toString(),
        top: '-=' + game.borderThickness.toString()
      }).animate({
        left: '-100px',
        top: '-100px'
      }).queue( function(next) {
        game.locked = false;
        tile.element.remove();
        next();
      });

      game.tileCount -= 2;
      if (game.tileCount <= 0) {
        alert('Game won!');
        game.newGame();
      }
    } else {
      game.markedTile.element.css('background-color', '');
      game.markedTile = null;
    }
  } else {
    game.markedTile = tile;
    tile.element.css('background-color', 'lightblue');
  }
};

game.createTile = function(x, y, z, type) {
  var newTile = {x:x, y:y, z:z, type:type};
  var xd = game.selectedLayout.tile_size[0];
  var yd = game.selectedLayout.tile_size[1];
  newTile.id = game.tiles.length;
  newTile.topTiles = {count:0};
  newTile.bottomTiles = {count:0};
  newTile.leftTiles = {count:0};
  newTile.rightTiles = {count:0};
  newTile.element = $('<div id="'+newTile.id+'" class="tile"/>');
  newTile.element.css('z-index', (y + x*10 + z*100));
  newTile.element.css('background-position-x', type%6*20 + '%');
  newTile.element.css('background-position-y', Math.floor(type/6)*20 + '%');
  newTile.element.on('click', game.onTileClick);
  $('.board').append(newTile.element);
  for (var i=0; i<newTile.id; i++) {
    //Check left neighbours
    if (game.tiles[i].z===z &&
        game.tiles[i].x===x-xd &&
        y+yd>game.tiles[i].y &&
        game.tiles[i].y>y-yd){
      newTile.leftTiles[i] = game.tiles[i];
      newTile.leftTiles.count++;
      game.tiles[i].rightTiles[newTile.id] = newTile;
      game.tiles[i].rightTiles.count++;
    }
    //Check right neighbours
    if (game.tiles[i].z===z &&
        game.tiles[i].x==x+xd &&
        y+yd>game.tiles[i].y &&
        game.tiles[i].y>y-yd){
      newTile.rightTiles[i] = game.tiles[i];
      newTile.rightTiles.count++;
      game.tiles[i].leftTiles[newTile.id] = newTile;
      game.tiles[i].leftTiles.count++;
    }
    //Check bottom neighbours
    if (game.tiles[i].z===z-1 &&
        x+xd>game.tiles[i].x &&
        game.tiles[i].x>x-xd &&
        y+yd>game.tiles[i].y &&
        game.tiles[i].y>y-yd){
      newTile.bottomTiles[i] = game.tiles[i];
      newTile.bottomTiles.count++;
      game.tiles[i].topTiles[newTile.id] = newTile;
      game.tiles[i].topTiles.count++;
    }
  }
  game.tiles.push(newTile);
  return (newTile);
};

game.readSelectedLayout = function() {
  game.tiles = [];
  $('.tile').remove();
  types = [];
  for (var i=0; i<36; i++) {
    types[i] = 4;
  }
  tLength = types.length;
  var type = 0;
  var tileCount = 0;

  for (i=0; i<game.selectedLayout.tile_layers.length; i++) {
    for (var j=0; j<game.selectedLayout.tile_layers[i].length; j++) {
      for (var k=0; k<game.selectedLayout.tile_layers[i][j].length; k++) {
        if (game.selectedLayout.tile_layers[i][j][k] === '#') {
          if (tileCount == 144) {
            console.error("Too many tiles in layout");
            return;
          }
          do {
            type = Math.floor(Math.random()*tLength);
          } while (types[type]===0);
          types[type]--;
          game.createTile(k, j, i, type);
          tileCount++;
        }
      }
    }
  }
  game.tileCount = tileCount;
  game.updateTiles();
};

game.updateTiles = function() {
  var board = $('.board');
  game.width = board.width();
  game.height = board.height();

  game.gridAspectRatio = (game.gridHeight / game.gridWidth) * game.tileAspectRatio;

  var offsetLeft;
  if (game.height/game.width > game.gridAspectRatio) {
    game.tileWidth = (game.width) / game.gridWidth;
    game.tileHeight = game.tileWidth * game.tileAspectRatio;
    offsetLeft = 0;
  } else {
    game.tileHeight = game.height / game.gridHeight;
    game.tileWidth =  game.tileHeight / game.tileAspectRatio;
    offsetLeft = (game.width - game.tileWidth*game.gridWidth) / 2;
  }

  var allTiles = $('.tile');
  allTiles.css('width', (game.tileWidth*game.selectedLayout.tile_size[0]).toString() + "px");
  allTiles.css('height', (game.tileHeight*game.selectedLayout.tile_size[0]).toString() + "px");

  game.borderThickness = game.tileWidth/3;
  for (var i=0; i< this.tiles.length; i++) {
    game.tiles[i].element.css('left', (game.tileWidth*game.tiles[i].x-game.tiles[i].z*(game.borderThickness -1 ) + offsetLeft).toString() + 'px');
    game.tiles[i].element.css('top', (game.tileHeight*game.tiles[i].y-game.tiles[i].z*(game.borderThickness -1)).toString() + 'px');
    game.tiles[i].element.css('border-radius', (game.tileWidth/3).toString() + 'px');
    game.tiles[i].element.css('border-radius', (game.tileWidth/3).toString() + 'px');
    game.tiles[i].element.css('box-shadow', ('{0}px {0}px brown, {1}px {1}px gray'
                                             .replace(/\{0\}/g, game.borderThickness/2)
                                             .replace(/\{1\}/g, game.borderThickness)));
  }
};

game.updateTileState = function(tile) {
  if ((tile.leftTiles.count>0 && tile.rightTiles.count>0) || tile.topTiles.count>0) {
    tile.free = false;
  } else {
    tile.free = true;
  }
};

game.updateFreeTiles = function() {
  var tileCount = game.tiles.length;
  var tile = {};
  for (var i=0; i<tileCount; i++) {
    tile = game.tiles[i];
    game.updateTileState(tile);
  }
};

game.newGame = function() {
  game.readSelectedLayout();
  game.updateTiles();
  game.updateFreeTiles();
};

$(document).ready(function(){
  $(window).on('resize', function() {
    game.updateTiles();
  });
  $('.newGame').click(game.newGame);

  game.newGame();

  game.updateTiles();
});
