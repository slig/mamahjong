'use strict';

var game = {};

//===============================================
//                     Data
//===============================================

game.languages = {
  'default': 'english',

  english: {
    text: {
      eng: 'English',
      ger: 'Englisch'
    },
    id: 'eng'
  },

  german: {
    text: {
      eng: 'German',
      ger: 'Deutsch'
    },
    id: 'ger'
  }
};

game.dict = {'default': 'eng'};
game.dict.eng = {
  button_menu: 'Menu',
  button_new_game: 'New Game',
  header_menu: 'Menu',
  option_language: 'Language',
  option_tileset: 'Tileset',
  option_layout: 'Layout',
  option_highlight_free: 'Highlight removable tiles',
  option_inform_loss: 'No valid turns notification',
  option_show_timer: 'Timer',
};
game.dict.ger = {
  button_menu: 'Menü',
  button_new_game: 'Neues Spiel',
  header_menu: 'Menü',
  option_language: 'Sprache',
  option_tileset: 'Bilder Set',
  option_layout: 'Muster',
  option_highlight_free: 'Freie Steine hervorheben',
  option_inform_loss: 'Hinweis bei Niederlage',
  option_show_timer: 'Zeige Zeit',
};

game.layouts = {'default': 'turtle'};
game.layouts.turtle = {
  text: {
    eng: 'Turtle',
    ger: 'Schildkröte'
  },
  tile_size: [2,2],
  gridWidth: 30,
  gridHeight: 16,
  tile_layers: [
    [
      '  #*#*#*#*#*#*#*#*#*#*#*#*    \n',
      '  ************************    \n',
      '      #*#*#*#*#*#*#*#*        \n',
      '      ****************        \n',
      '    #*#*#*#*#*#*#*#*#*#*      \n',
      '    ********************      \n',
      '  #*#*#*#*#*#*#*#*#*#*#*#*    \n',
      '#*************************#*#*\n',
      '**#*#*#*#*#*#*#*#*#*#*#*#*****\n',
      '  ************************    \n',
      '    #*#*#*#*#*#*#*#*#*#*      \n',
      '    ********************      \n',
      '      #*#*#*#*#*#*#*#*        \n',
      '      ****************        \n',
      '  #*#*#*#*#*#*#*#*#*#*#*#*    \n',
      '  ************************    \n'
    ],
    [
      '                              \n',
      '                              \n',
      '        #*#*#*#*#*#*          \n',
      '        ************          \n',
      '        #*#*#*#*#*#*          \n',
      '        ************          \n',
      '        #*#*#*#*#*#*          \n',
      '        ************          \n',
      '        #*#*#*#*#*#*          \n',
      '        ************          \n',
      '        #*#*#*#*#*#*          \n',
      '        ************          \n',
      '        #*#*#*#*#*#*          \n',
      '        ************          \n',
      '                              \n',
      '                              \n'
    ],
    [
      '                              \n',
      '                              \n',
      '                              \n',
      '                              \n',
      '          #*#*#*#*            \n',
      '          ********            \n',
      '          #*#*#*#*            \n',
      '          ********            \n',
      '          #*#*#*#*            \n',
      '          ********            \n',
      '          #*#*#*#*            \n',
      '          ********            \n',
      '                              \n',
      '                              \n',
      '                              \n',
      '                              \n'
    ],
    [
      '                              \n',
      '                              \n',
      '                              \n',
      '                              \n',
      '                              \n',
      '                              \n',
      '            #*#*              \n',
      '            ****              \n',
      '            #*#*              \n',
      '            ****              \n',
      '                              \n',
      '                              \n',
      '                              \n',
      '                              \n',
      '                              \n',
      '                              \n'
    ],
    [
      '                              \n',
      '                              \n',
      '                              \n',
      '                              \n',
      '                              \n',
      '                              \n',
      '                              \n',
      '             #*               \n',
      '             **               \n',
      '                              \n',
      '                              \n',
      '                              \n',
      '                              \n',
      '                              \n',
      '                              \n',
      '                              \n'
    ]
  ]
};

game.tilesets = {
  'default': 'classic',

  classic: {
    text: {
      eng: 'Classic',
      ger: 'Klassisch'
    },
    img: 'img/tileset01.svg',
    tileAspectRatio: 1.3,
    tileColor: function(type, selected){return selected?'lightblue':'';}
  },

  helldivers: {
    text: {
      eng: 'Helldivers',
      ger: 'Helldivers'
    },
    img: 'img/tileset02.svg',
    tileAspectRatio: 1,
    tileColor: function(type, selected){
      if (type<23) {return selected ? 'rgb(26, 66, 111)':'rgb(76, 116, 161)';}
      else if (type<30) {return selected ? 'rgb(75, 109, 49)':'rgb(125, 159, 99)';}
      else {return selected ? 'rgb(89, 41, 31)':'rgb(139, 91, 81)';}
    }
  }
};

//===============================================
//                    Methods
//===============================================

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
  tile.free = false;
  tile.detached = true;
};

game.hasValidTurn = function() {
  var freeTiles = [];
  for (var i=0; i<game.tiles.length; i++) {
    if (game.tiles[i].free && game.tiles[i].element) {
      if (freeTiles[game.tiles[i].type]) {
        return true;
      } else {
        freeTiles[game.tiles[i].type] = 1;
      }
    }
  }
  return false;
};

game.getFreeTiles = function() {
  var freeTiles = [];
  var pos = 0;
  for (var i=0; i<game.tiles.length; i++) {
    if (game.tiles[i].free) {
      freeTiles[pos] = game.tiles[i];
      pos++;
    }
  }
  return freeTiles;
};

game.onTileClick = function(event){
  var id = parseInt(event.target.id);
  var tile = game.tiles[id];

  if (!tile.free) {
    return;
  }


  if (game.markedTile) {
    if ((game.markedTile.type == tile.type) && (game.markedTile.id != tile.id)) {
      game.locked = true;

      game.detachTile(game.markedTile);
      game.markedTile.element.css({
        'z-index': 1000,
        'background-color': game.selectedTileset.tileColor(game.markedTile.type)
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
      if (!game.hasValidTurn()) {
        alert('No valid turns left!');
      }
    } else {
      tile.element.css('background-color', game.selectedTileset.tileColor(tile.type));
      game.markedTile = null;
    }
  } else {
    game.markedTile = tile;
    tile.element.css('background-color', game.selectedTileset.tileColor(tile.type, true));
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
  newTile.element.css('background-position', type%6*20 + '% ' + Math.floor(type/6)*20 + '%' );
  newTile.element.css('background-color', game.selectedTileset.tileColor(newTile.type));
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
  var types = [];
  for (var i=0; i<36; i++) {
    types[i] = 4;
  }
  var tLength = types.length;
  var type = 0;
  var tileCount = 0;

  for (i=0; i<game.selectedLayout.tile_layers.length; i++) {
    for (var j=0; j<game.selectedLayout.tile_layers[i].length; j++) {
      for (var k=0; k<game.selectedLayout.tile_layers[i][j].length; k++) {
        if (game.selectedLayout.tile_layers[i][j][k] === '#') {
          if (tileCount == 144) {
            console.error('Too many tiles in layout');
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

  game.gridAspectRatio = (game.gridHeight / game.gridWidth) * game.selectedTileset.tileAspectRatio;

  var offsetLeft;
  if (game.height/game.width > game.gridAspectRatio) {
    game.tileWidth = (game.width) / game.gridWidth;
    game.tileHeight = game.tileWidth * game.selectedTileset.tileAspectRatio;
    offsetLeft = 0;
  } else {
    game.tileHeight = game.height / game.gridHeight;
    game.tileWidth =  game.tileHeight / game.selectedTileset.tileAspectRatio;
    offsetLeft = (game.width - game.tileWidth*game.gridWidth) / 2;
  }

  var allTiles = $('.tile');
  allTiles.css('width', (game.tileWidth*game.selectedLayout.tile_size[0]).toString() + 'px');
  allTiles.css('height', (game.tileHeight*game.selectedLayout.tile_size[0]).toString() + 'px');

  game.borderThickness = game.tileWidth/3;
  for (var i=0; i< this.tiles.length; i++) {
    game.tiles[i].element.css('background-image', 'url("' + game.selectedTileset.img + '")');
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
  if (tile.detach) {return;}
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

game.fillSelection = function(option, source) {
  var element = $('.menu [name="' + option + '"]');
  for(var key in source) {
    if (key=='default') {continue;}
    element.append('<option value="{0}">{1}</option'
                   .replace('{0}', key)
                   .replace('{1}', source[key].text[game.selectedLanguage.id]));
  }
};

game.translateSelection = function(option, source) {
  var options = $('.menu [name="' + option + '"]').children();
  for (var i=0; i<options.length; i++) {
    options[i].text = source[options[i].value].text[game.selectedLanguage.id];
  }
}

game.updateLanguage = function() {
  game.translateSelection('language', game.languages);
  game.translateSelection('tileset', game.tilesets);
  game.translateSelection('layout', game.layouts);

  var element = {};
  for (var key in game.dict[game.dict.default]) {
    element = $('#' + key);
    if (typeof(element.text) === 'function') {
      element.text(game.dict[game.selectedLanguage.id][key]);
    } else {
      element.text = game.dict[game.selectedLanguage.id][key];
    }
  }
};

game.handleOptions = function() {
  var newLanguage = $('.menu [name="language"]').val();
  var newTileset = $('.menu [name="tileset"]').val();
  var newLayout = $('.menu [name="layout"]').val();
  var newHighlightFree = $('.menu [name="highlightFree"]').val();
  var newInformLoss = $('.menu [name="informLoss"]').val();
  var newShowTimer = $('.menu [name="showTimer"]').val();

  if (game.selectedLanguage != game.languages[newLanguage]) {
    game.selectedLanguage = game.languages[newLanguage];
    game.updateLanguage();
  } else if (game.selectedLayout != game.layouts[newLayout]) {
    game.selectedLayout = game.layouts[newLayout];
    game.newGame();
  } else if (game.selectedTileset != game.tilesets[newTileset]) {
    game.selectedTileset = game.tilesets[newTileset];
    game.newGame();
  } else if (game.highlightFree != newHighlightFree) {
    game.highlightFree = newHighlightFree;
  } else if (game.informLoss != newInformLoss) {
    game.informLoss = newInformLoss;
  } else if (game.showTimer != newShowTimer) {
    game.showTimer = newShowTimer;
  }
};

game.readURLParams = function() {
  //TODO: Sanitize parameters
  var params = location.search.substring(1).split('&');
  var param = '';
  var value = '';
  for (var i=0;i<params.length;i++) {
    param = params[i].split('=')[0];
    value = params[i].split('=')[1];
    if (param=='layout' && game.layouts[value]) {
      game.selectedLayout = game.layouts[value];
    }
    if (param=='tileset' && game.tilesets[value]) {
      game.selectedTileset = game.tilesets[value];
    }
    if (param=='language' && game.languages[value]) {
      game.selectedLanguage = game.languages[value];
    }
  }
};

//===============================================
//                Initialization
//===============================================

$(document).ready(function(){
  //Establish defaults
  var clientLang = navigator.language || navigator.userLanguage;
  var langDict = {
    'en-US': 'english',
    'de-DE': 'german'
  };
  game.selectedLanguage = game.languages[langDict[clientLang]] ||
                          game.languages[game.languages.default];
  game.selectedLayout = game.layouts[game.layouts.default];
  game.selectedTileset = game.tilesets[game.tilesets.default];
  game.highlightFree = false;
  game.informLoss = true;
  game.showTimer = false;
  game.gridWidth = game.selectedLayout.gridWidth;
  game.gridHeight = game.selectedLayout.gridHeight;
  game.readURLParams();

  //Initialize menu
  game.fillSelection('language', game.languages);
  game.fillSelection('tileset', game.tilesets);
  game.fillSelection('layout', game.layouts);
  game.updateLanguage();

  //Register callbacks
  $(window).on('resize', function() {
    game.updateTiles();
  });

  $('.newGame').click(game.newGame);

  $('.open-menu, .curtain, .menu-exit').click(function(){
    $('.menu').fadeToggle();
    $('.curtain').fadeToggle();
  });

  $('.menu-input').on('change', game.handleOptions);

  //Start game
  game.newGame();
  game.updateTiles();
});
