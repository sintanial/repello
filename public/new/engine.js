function Engine(map) {
  this.map = map;
  this.racks = {};
}

/**
 * Устанавливает стойку на карту
 *
 * @param rack
 * @param coord
 */
Engine.prototype.putRack = function (rack, coord) {
  if (this.racks[rack.color]) {
    throw new EngineError(
      'Rack ' + rack.color + ' already in the game',
      EngineError.RACK_ALREADY_IN_GAME,
      {rack: rack, coord: coord}
    );
  }

  var point = this.map.get(coord);

  if (point.isBusy()) {
    throw new EngineError(
      'Point: {coord} is busy'.format(point.coord),
      EngineError.BUSY_POINT,
      {rack: rack, point: point}
    );
  }

  rack.coord = coord;
  point.setRack(rack);

  this.racks[rack.color] = rack;
};

/**
 * Двигает стойку
 *
 * @param rack
 * @param movePoint
 * @returns {Array}
 */
Engine.prototype.moveRack = function (rack, movePoint) {
  if (!rack.isEnoughTokens()) {
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
  var vdirect = Math.sign(movePoint.coord[0] - start[0]), hdirect = Math.sign(movePoint.coord[1] - start[1]);

  // кол-во шагов
  var stepCount = movePoint.num;

  // логи шагов
  var steps = [];
  for (var i = 0; i < stepCount; i++) {
    hstep += hdirect;
    if (hstep <= 0 || hstep >= this.map.length - 1) hdirect *= -1;

    vstep += vdirect;
    if (vstep <= 0 || vstep >= this.map.length - 1) vdirect *= -1;

    var stepPoint = this.map.get(vstep, hstep);
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

  var startPoint = this.map.get(start);
  var endPoint = this.map.get(vstep, hstep);

  endPoint.setRack(startPoint.removeRack(rack));
  startPoint.setChip(Point.TYPE.BLACK);

  this.checkConflicts(startPoint);
  this.checkConflicts(endPoint);

  return steps;
};

/**
 * Проверяет конфликты
 *
 * @param point
 */
Engine.prototype.checkConflicts = function (point) {
  var coord = point.coord;
  for (var i = coord[0] - 1; i <= coord[0] + 1; i++) {
    for (var j = coord[1] - 1; j <= coord[1] + 1; j++) {
      if (i == coord[0] && j == coord[1]) continue;

      var p = this.map.get(i, j);
      if (p.isBusy()) {
        point.addConflict(p);
        p.addConflict(point);

        this.conflicts++;
      }
    }
  }
};


/**
 * Решает конфликты
 *
 * @param targetPoint
 * @param movePoint
 * @returns {*}
 */
Engine.prototype.solveConflict = function (targetPoint, movePoint) {
  if (!targetPoint.isConflictable()) {
    throw new EngineError(
      "Point {coord} has't conflicts".format(targetPoint.coord),
      EngineError.POINT_NO_CONFLICTS,
      {conflictPoint: targetPoint, movePoint: movePoint}
    );
  }

  if (movePoint.isBusy()) {
    throw new EngineError(
      "Point to move {coord} is busy".format(movePoint.coord),
      EngineError.BUSY_POINT,
      {conflictPoint: targetPoint, movePoint: movePoint}
    );
  }


  var chipCoord = targetPoint.coord;
  var moveCoord = movePoint.coord;

  var vdirect = Math.sign(moveCoord[0] - chipCoord[0]), hdirect = Math.sign(moveCoord[1] - chipCoord[1]);

  var confPoint = this.map.get(chipCoord[0] + (-1) * vdirect, chipCoord[1] + (-1) * hdirect);
  if (!targetPoint.isInConflict(confPoint)) {
    throw new EngineError(
      "Target {target.coord}, has no conflict with Point {point.coord}".format(chipCoord, confPoint.coord),
      EngineError.TARGET_NO_CONFLICTED_WITH_POINT,
      {targetPoint: targetPoint, conflictPoint: confPoint, movePoint: movePoint}
    )
  }

  targetPoint.clearConflict(confPoint);

  if (!!targetPoint.chip) {
    movePoint.setChip(targetPoint.removeChip());
  } else {
    movePoint.setRack(targetPoint.removeRack());
  }
  this.conflicts--;

  this.checkConflicts(movePoint);

  return movePoint;
};


/**
 * Проверяет находится ли точка в окружности стойки
 * @param rack
 * @param point
 * @returns {boolean}
 */
Engine.prototype.isPointInRackArea = function (rack, point) {
  var i = Math.abs(rack.coord[0] - point.coord[0]);
  var j = Math.abs(rack.coord[1] - point.coord[1]);

  return (i == 1 && j == 1) || (i == 1 && j == 0) || (i == 0 && j == 1);
};
