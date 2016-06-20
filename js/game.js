var game = {layouts: {}};

//Defaults
game.boardWidth = 800;
game.boardHeight = 600;
game.tileAspectRatio = 1.4;


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

game.onTileClick = function(event){
  var id = parseInt(event.target.id);
  var tile = game.tiles[id];

  //check if tile is free
  if (!tile.free) {
    return;
  }

  if (game.markedTile) {
    if ((game.markedTile.type == tile.type) && (game.markedTile.id != tile.id)) {
      game.markedTile.element.remove();
      game.markedTile = null;
      tile.element.remove();
      game.tileCount -= 2;
      if (game.tileCount <= 0) {
        alert('Game won!');
        game.readSelectedLayout();
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
  newTile.element = $('<div id="'+newTile.id+'" class="tile">'+type+'</div>');
  newTile.element.css('z-index', (y + x*10 + z*100));
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
  allTiles.css('width', (game.tileWidth*game.selectedLayout.tile_size[0] - 1).toString() + "px");
  allTiles.css('height', (game.tileHeight*game.selectedLayout.tile_size[0] - 1).toString() + "px");

  for (var i=0; i< this.tiles.length; i++) {
    game.tiles[i].element.css('left', (game.tileWidth*game.tiles[i].x-game.tiles[i].z*(game.tileWidth/12) + offsetLeft).toString() + 'px');
    game.tiles[i].element.css('top', (game.tileHeight*game.tiles[i].y-game.tiles[i].z*(game.tileWidth/16)).toString() + 'px');
    game.tiles[i].element.css('border-right', (game.tileWidth/8).toString() + 'px solid gray');
    game.tiles[i].element.css('border-bottom', (game.tileWidth/8).toString() + 'px solid gray');
    game.tiles[i].element.css('border-radius', (game.tileWidth/3).toString() + 'px');


  }
};

game.updateFreeTiles = function() {
  var tileCount = game.tiles.length;
  var tile = {};
  for (var i=0; i<tileCount; i++) {
    tile = game.tiles[i];
    if ((tile.leftTiles.count>0 && tile.rightTiles.count>0) || tile.topTiles.count>0) {
      tile.free = false;
      tile.element.css('background-blend-mode', 'normal');
    } else {
      tile.free = true;
      tile.element.css('background-blend-mode', 'exclusion');
    }
  }

};

$(document).ready(function(){
  $(window).on('resize', function() {
    game.updateTiles();
  });

  game.readSelectedLayout();
  game.updateTiles();
  game.updateFreeTiles();

});
