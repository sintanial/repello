function User(rack) {
  this.rack = rack;
  this.dibs = [];
}

function Rack(dibs, color) {
  this.dibs = dibs;
  this.color = color;
  this.coord = null;
}

Rack.prototype.pop = function () {
  if (this.dibs <= 0) return false;
  this.dibs--;
  return this.coord;
};

function Engine() {
  var map = [
    //r
    //e
    //d
    [3, 4, 5, 6, 1, 2, 3, 4, 5, 6, 1, 2, 3], //green
    [5, 6, 1, 2, 3, 4, 5, 6, 1, 2, 3, 4, 5],
    [1, 2, 3, 4, 5, 6, 3, 2, 3, 4, 5, 6, 1],
    [4, 5, 6, 1, 2, 3, 4, 5, 6, 1, 2, 3, 4],
    [6, 1, 2, 3, 4, 5, 6, 1, 2, 3, 4, 5, 6],
    [2, 3, 4, 5, 6, 1, 2, 3, 4, 5, 6, 1, 2],
    [4, 5, 6, 1, 2, 3, 4, 5, 6, 1, 2, 3, 4],
    [6, 1, 2, 3, 4, 5, 6, 1, 2, 3, 4, 5, 6],
    [2, 3, 4, 5, 6, 1, 2, 3, 4, 5, 6, 1, 2],
    [5, 6, 5, 2, 3, 4, 5, 6, 1, 2, 3, 4, 5],
    [1, 2, 3, 4, 5, 6, 3, 2, 3, 4, 5, 6, 1],
    [3, 4, 5, 6, 1, 2, 1, 4, 5, 6, 1, 2, 3],
    [5, 6, 1, 2, 3, 4, 5, 6, 1, 2, 3, 4, 5] //blue
  ];

  for (var i = 0; i < map.length; i++) {
    for (var j = 0; j < map[i].length; j++) {
      var num = map[i][j];
      map[i][j] = {
        num: num,
        dib: false,
        rack: false,
      };
    }
  }

  var DIBS_TYPE = {
    gold: 5,
    silver: 3,
    black: 1,
  };

  map[0][1].dib = DIBS_TYPE.black;
  map[0][6].dib = DIBS_TYPE.silver;
  map[0][11].dib = DIBS_TYPE.black;

  map[6][1].div = DIBS_TYPE.silver;
  map[6][6].div = DIBS_TYPE.gold;
  map[6][11].div = DIBS_TYPE.silver;

  map[11][1].dib = DIBS_TYPE.black;
  map[11][6].dib = DIBS_TYPE.silver;
  map[11][11].dib = DIBS_TYPE.black;


  this.map = map;
  this.racks = {};
}

Engine.prototype.putRack = function (rack, coord) {
  if (this.racks[rack.color]) {
    throw new Error('rack ' + rack.color + ' already in the game');
  }

  this.racks[rack.color] = rack;

  rack.coord = coord;
  this.map[coord[0]][coord[1]].rack = rack;

  this.emit('putRack', rack);
};
Engine.prototype.moveRack = function (rack, coord) {
  if (!this.isCoordInRackArea(rack, coord)) {
    throw new Error('invalid coord move for rack: %s');
  }

  var length = this.map[coord[0]][coord[1]].num;
  var right = coord[0] - rack.coord[0] > 0;
  var down = coord[1] - rack.coord[1] > 0;

  if (rack.coord[0] == coord[0]) {
    // идём по вертикали
    var moves = [];
    for (var j = 0; j < length; j++) {
      if (down) {
        var step = coord[0] + j;
      } else {
        var step = Math.abs(coord[0] - j);
      }
      var map = this.map[step];
      moves.push([step, coord[1]]);
      if (map.dib || map.rack) throw new Error('invalid coord move, barrier');
    }

    rack.coord = [moves[moves.length - 1]];

    return moves;
  } else if (rack.coord[1] == coord[1]) {
    // идём по горизонтали
    for (var i = 0; i < length; i++) {

    }
  } else {
    // идём по диагонали
  }

  var dibcoord = rack.pop();
  if (dibcoord === false) {
    throw new Error('no enough dib for move');
  }

  var data = this.map[coord[0]][coord[1]];

};
Engine.prototype.solveConflict = function () {
};
Engine.prototype.isCoordInRackArea = function (rack, coord) {
  return (Math.abs(rack.coord[0] - coord[0]) == 1 && Math.abs(rack.coord[1] - coord[1]) == 1);
};





