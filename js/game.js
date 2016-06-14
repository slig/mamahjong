var game = {layouts: {}};

//Defaults
game.boardWidth = 800;
game.boardHeight = 600;
game.tileAspectRatio = 1.4;


game.layouts.turtle = {
  tile_size: [2,2],
  gridWidth: 28,
  gridHeight: 16,
  tile_layers: [
    [
      "  #*#*#*#*#*#*#*#*#*#*#*#*  \n",
      "  ************************  \n",
      "      #*#*#*#*#*#*#*#*      \n",
      "      ****************      \n",
      "    #*#*#*#*#*#*#*#*#*#*    \n",
      "    ********************    \n",
      "  #*#*#*#*#*#*#*#*#*#*#*#*  \n",
      "#*************************#*\n",
      "**#*#*#*#*#*#*#*#*#*#*#*#***\n",
      "  ************************  \n",
      "    #*#*#*#*#*#*#*#*#*#*    \n",
      "    ********************    \n",
      "      #*#*#*#*#*#*#*#*      \n",
      "      ****************      \n",
      "  #*#*#*#*#*#*#*#*#*#*#*#*  \n",
      "  ************************  \n"
    ],
    [
      "                            \n",
      "                            \n",
      "        #*#*#*#*#*#*        \n",
      "        ************        \n",
      "        #*#*#*#*#*#*        \n",
      "        ************        \n",
      "        #*#*#*#*#*#*        \n",
      "        ************        \n",
      "        #*#*#*#*#*#*        \n",
      "        ************        \n",
      "        #*#*#*#*#*#*        \n",
      "        ************        \n",
      "        #*#*#*#*#*#*        \n",
      "        ************        \n",
      "                            \n",
      "                            \n"
    ],
    [
      "                            \n",
      "                            \n",
      "                            \n",
      "                            \n",
      "          #*#*#*#*          \n",
      "          ********          \n",
      "          #*#*#*#*          \n",
      "          ********          \n",
      "          #*#*#*#*          \n",
      "          ********          \n",
      "          #*#*#*#*          \n",
      "          ********          \n",
      "                            \n",
      "                            \n",
      "                            \n",
      "                            \n"
    ],
    [
      "                            \n",
      "                            \n",
      "                            \n",
      "                            \n",
      "                            \n",
      "                            \n",
      "            #*#*            \n",
      "            ****            \n",
      "            #*#*            \n",
      "            ****            \n",
      "                            \n",
      "                            \n",
      "                            \n",
      "                            \n",
      "                            \n",
      "                            \n"
    ],
    [
      "                            \n",
      "                            \n",
      "                            \n",
      "                            \n",
      "                            \n",
      "                            \n",
      "                            \n",
      "             #*             \n",
      "             **             \n",
      "                            \n",
      "                            \n",
      "                            \n",
      "                            \n",
      "                            \n",
      "                            \n",
      "                            \n"
    ]
  ]
};

game.selectedLayout = game.layouts.turtle;
game.gridWidth = game.selectedLayout.gridWidth;
game.gridHeight = game.selectedLayout.gridHeight;

game.tiles = [];

game.createTile = function(x, y, z) {
  var newTile = {x:x, y:y, z:z};
  newTile.element = $('<div class="tile"></div>');
  newTile.element.css('z-index', (y + x*10 + z*100));
  $('.board').append(newTile.element);
  game.tiles.push(newTile);
  return (newTile);
};

game.readSelectedLayout = function() {
  for (var i=0; i<game.selectedLayout.tile_layers.length; i++) {
    for (var j=0; j<game.selectedLayout.tile_layers[i].length; j++) {
      for (var k=0; k<game.selectedLayout.tile_layers[i][j].length; k++) {
        if (game.selectedLayout.tile_layers[i][j][k] === '#') {
          game.createTile(k, j, i);
        }
      }
    }
  }
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

$(document).ready(function(){
  $(window).on('resize', function() {
    game.updateTiles();
  });

  game.readSelectedLayout();
  game.updateTiles();

});
