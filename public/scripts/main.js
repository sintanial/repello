function User(rack) {
  this.rack = rack;
  this.dibs = [];
}

function Rack(dibs, color) {
  this.dibs = dibs;
  this.color = color;
  this.coord = null;
}

Rack.prototype.pickDib = function () {
  if (this.isEnoughDib()) return false;
  this.dibs--;
  return this.coord;
};

Rack.prototype.isEnoughDib = function () {
  return this.dibs <= 0;
};

var DIBS_TYPE = {
  gold: 5,
  silver: 3,
  black: 1,
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
  this.map.vsize = map.length;
  this.map.hsize = map[0].length;

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

Engine.prototype.moveRack = function (rack, movePoint) {
  if (!rack.isEnoughDib()) throw new Error('not enough dibs for move');

  if (!this.isPointInRackArea(rack, movePoint)) {
    throw new Error('invalid coord move for rack: %s');
  }

  // стартовая позиция стойки
  var start = rack.coord;

  // начальные координаты
  var vstep = start[0], hstep = start[1];
  // направление шага
  var vdirect = Math.sign(movePoint[0] - start[0]), hdirect = Math.sign(movePoint[1] - start[1]);

  // кол-во шагов
  var stepcount = this.map[movePoint[0]][movePoint[1]].num;

  // логи шагов
  var steps = [];
  for (var i = 0; i < stepcount; i++) {
    hstep += hdirection;
    if (hstep <= 0 || hstep >= size - 1) hdirect *= -1;

    vstep += vdirection;
    if (vstep <= 0 || vstep >= size - 1) vdirect *= -1;

    steps.push(vstep, hstep);

    var mapPoint = this.map[vstep][hstep];
    if (mapPoint.dib || mapPoint.rack) {
      return {
        status: false,
        steps: steps
      }
    }
  }

  rack.pickDib();

  var data = this.map[vstep][hstep];
  data.dib = DIBS_TYPE.black;

  return {
    status: true,
    steps: steps
  }
};

Engine.prototype.getAvailableConflicts = function () {

};

Engine.prototype.solveConflict = function (dib, movePoint) {

  var movePointData = this.map[movePoint[0]][movePoint[1]];
  if (movePointData.dib || movePoint.rack) return false;

  var aroundDibs = [];
  for (var i = dib[0] - 1; i < 2; i++) {
    for (var j = dib[1] - 1; j < 2; j++) {
      var mapPoint = this.map[i][j];
      if (mapPoint.dib || mapPoint.rack) {
        aroundDibs.push(mapPoint);
      }
    }
  }

  for (var k = 0, l = aroundDibs.length; k < l; k++) {

  }
};

Engine.prototype.isPointInRackArea = function (rack, point) {
  return (Math.abs(rack.coord[0] - point[0]) == 1 && Math.abs(rack.coord[1] - point[1]) == 1);
};





