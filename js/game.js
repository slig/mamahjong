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
}

game.updateTiles = function() {
  var board = $('.board');
  game.width = parseInt(board.css('width').replace('px',''));
  game.height = parseInt(board.css('height').replace('px',''));

  if (game.height/game.gridHeight > game.width/game.gridWidth*game.tileAspectRatio) {
    game.tileWidth = (game.width) / game.gridWidth;
    game.tileHeight = (game.width*game.tileAspectRatio) / game.gridWidth;
  } else {
    game.tileWidth = (game.height/game.tileAspectRatio) / game.gridHeight;
    game.tileHeight = (game.height) / game.gridHeight;
  }

  var allTiles = $('.tile');
  allTiles.css('width', (game.tileWidth*game.selectedLayout.tile_size[0] - 1).toString() + "px");
  allTiles.css('height', (game.tileHeight*game.selectedLayout.tile_size[0] - 1).toString() + "px");

  for (var i=0; i< this.tiles.length; i++) {
    game.tiles[i].element.css('left', (game.tileWidth*game.tiles[i].x-game.tiles[i].z*3).toString() + 'px');
    game.tiles[i].element.css('top', (game.tileHeight*game.tiles[i].y-game.tiles[i].z*3).toString() + 'px');
  }
};

$(document).ready(function(){
  $(window).on('resize', function() {
    game.updateTiles();
  });

  game.readSelectedLayout();
  game.updateTiles();

});
