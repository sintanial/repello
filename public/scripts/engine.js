function EngineError(message, type, data) {
  this.name = 'EngineError';
  this.message = message;
  this.type = type;
  this.data = data;
  this.conflicts = 0;
}
EngineError.prototype = new Error();
EngineError.prototype.constructor = EngineError;

EngineError.RACK_ALREADY_IN_GAME = 0;
EngineError.BUSY_POINT = 1;
EngineError.CHIPS_ENDED = 2;
EngineError.POINT_NOT_IN_RACK_ARIA = 3;
EngineError.POINT_NO_CONFLICTS = 4;

function Engine() {
  this.map = new Map();
  this.racks = {};
}

Engine.prototype.putRack = function (rack, coord) {
  if (this.racks[rack.color]) {
    throw new EngineError(
      'Rack ' + rack.color + ' already in the game',
      EngineError.RACK_ALREADY_IN_GAME,
      {rack: rack, coord: coord}
    );
  }

  var point = this.map[coord[0]][coord[1]];

  if (point.isBusy()) {
    throw new EngineError(
      'Point: {coord} is busy'.format(point.coord),
      EngineError.BUSY_POINT,
      {rack: rack, point: point}
    );
  }

  rack.coord = coord;

  this.racks[rack.color] = rack;
};

Engine.prototype.moveRack = function (rack, movePoint) {
  if (!rack.isEnoughChips()) {
    throw new EngineError(
      'Not enough chips for point: {point}'.format(movePoint),
      EngineError.CHIPS_ENDED,
      {rack: rack, movePoint: movePoint}
    )
  }

  if (!this.isPointInRackArea(rack, movePoint)) {
    throw new EngineError(
      'Invalid move point for rack'.format(movePoint),
      EngineError.POINT_NOT_IN_RACK_ARIA,
      {rack: rack, movePoint: movePoint}
    );
  }

  // стартовая позиция стойки
  var start = rack.coord;

  // начальные координаты
  var vstep = start[0], hstep = start[1];
  // направление шага
  var vdirect = Math.sign(movePoint[0] - start[0]), hdirect = Math.sign(movePoint[1] - start[1]);

  // кол-во шагов
  var stepCount = this.map[movePoint[0]][movePoint[1]].num;

  // логи шагов
  var steps = [];
  for (var i = 0; i < stepCount; i++) {
    hstep += hdirect;
    if (hstep <= 0 || hstep >= this.map.length - 1) hdirect *= -1;

    vstep += vdirect;
    if (vstep <= 0 || vstep >= this.map.length - 1) vdirect *= -1;

    var stepPoint = this.map[vstep][hstep];
    if (stepPoint.isBusy()) {
      throw new EngineError(
        'Point: {coord} is busy'.format(stepPoint.coord),
        EngineError.BUSY_POINT,
        {rack: rack, movePoint: movePoint, busyPoint: stepPoint, steps: steps}
      );
    }

    steps.push(stepPoint);
  }

  rack.pickChips();

  var startPoint = this.map[start[0]][start[1]];
  var endPoint = this.map[vstep][hstep];

  startPoint.setChip(Point.TYPE.BLACK);
  endPoint.setRack(rack);

  this.checkConflicts(startPoint);
  this.checkConflicts(endPoint);

  return steps;
};

Engine.prototype.checkConflicts = function (point) {
  var coord = point.coord;
  for (var i = coord[0] - 1; i < coord[0] + 1; i++) {
    for (var j = coord[1] - 1; j < coord[1] + 1; j++) {
      if (i != coord[0] && j != coord[1]) continue;

      var p = this.map[i][j];
      if (p.isBusy()) {
        point.addConflict(p);
        p.addConflict(point);
      }
    }
  }

  this.conflicts += point.conflicts.length;
};

Engine.prototype.solveConflict = function (conflictPoint, movePoint) {
  if (!conflictPoint.isConflictable()) {
    throw new EngineError(
      "Point {coord} has't conflicts".format(conflictPoint.coord),
      EngineError.POINT_NO_CONFLICTS,
      {conflictPoint: conflictPoint, movePoint: movePoint}
    );
  }

  if (movePoint.isBusy()) {
    throw new EngineError(
      "Point to move {coord} is busy".format(movePoint.coord),
      EngineError.BUSY_POINT,
      {conflictPoint: conflictPoint, movePoint: movePoint}
    );
  }
  var confCoord = conflictPoint.coord;
  var moveCoord = movePoint.coord;

  var vdirect = Math.sign(moveCoord[0] - confCoord[0]), hdirect = Math.sign(moveCoord[1] - confCoord[1]);

};

Engine.prototype.isPointInRackArea = function (rack, point) {
  return (Math.abs(rack.coord[0] - point.coord[0]) == 1 && Math.abs(rack.coord[1] - point.coord[1]) == 1);
};
