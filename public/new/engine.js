function Engine(map) {
  this.map = map;
  this.racks = [];
}

/**
 * Устанавливает стойку на карту
 *
 * @param rack
 * @param point
 */
Engine.prototype.putRack = function (rack, point) {

  if (this.racks.indexOf(rack) !== -1) {
    throw new EngineError(
      'Rack {rack} already in the game'.format(rack),
      EngineError.RACK_ALREADY_IN_GAME,
      {rack: rack, point: point}
    );
  }

  if (point.isBusy()) {
    throw new EngineError(
      'Point {point} is busy'.format(point),
      EngineError.BUSY_POINT,
      {rack: rack, point: point}
    );
  }

  point.setOperand(rack);

  this.racks.push(rack);
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
      'Not enough tokens for point {point}'.format(movePoint),
      EngineError.TOKEN_ENDED,
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
  var rackPoint = rack.point;

  // начальные координаты
  var vstep = rackPoint.x, hstep = rackPoint.y;
  // направление шага
  var vdirect = Math.sign(movePoint.x - rackPoint.x), hdirect = Math.sign(movePoint.y - rackPoint.y);

  // кол-во шагов
  var stepCount = movePoint.num;

  // логи шагов
  var rackSteps = [];
  for (var i = 0; i < stepCount; i++) {
    hstep += hdirect;
    if (hstep <= 0 || hstep >= this.map.length - 1) hdirect *= -1;

    vstep += vdirect;
    if (vstep <= 0 || vstep >= this.map.length - 1) vdirect *= -1;

    var stepPoint = this.map.get(vstep, hstep);

    if (stepPoint.isBusy()) {
      throw new EngineError(
        'Point {coord} is busy'.format(stepPoint),
        EngineError.BUSY_POINT,
        {rack: rack, movePoint: movePoint, busyPoint: stepPoint, steps: rackSteps}
      );
    }

    rackSteps.push(stepPoint);
  }

  var token = rack.pickToken();

  var endPoint = this.map.get(vstep, hstep);

  endPoint.setOperand(rackPoint.removeOperand());
  rackPoint.setOperand(token);

  this.checkConflicts(token);
  this.checkConflicts(rack);

  return rackSteps;
};

/**
 * Проверяет конфликты
 *
 * @param operand
 */
Engine.prototype.checkConflicts = function (operand) {
  var point = operand.point;
  for (var i = point.x - 1; i <= point.x + 1; i++) {
    for (var j = point.y - 1; j <= point.y + 1; j++) {
      if (i == point.x && j == point.y) continue;

      var conflictPoint = this.map.get(i, j);
      if (conflictPoint.isBusy()) {
        var conflictOperand = conflictPoint.operand;

        operand.addConflict(conflictOperand);
        conflictOperand.addConflict(operand);

        this.conflicts++; // TODO: доделать
      }
    }
  }
};


/**
 * Решает конфликты
 *
 * @param operand
 * @param movePoint
 * @returns {*}
 */
Engine.prototype.solveConflict = function (operand, movePoint) {

  if (!operand.hasConflicts()) {
    throw new EngineError(
      "Point {coord} has't conflicts".format(operand),
      EngineError.POINT_NO_CONFLICTS,
      {operand: operand, movePoint: movePoint}
    );
  }

  if (movePoint.isBusy()) {
    throw new EngineError(
      "Point to move {coord} is busy".format(movePoint),
      EngineError.BUSY_POINT,
      {operand: operand, movePoint: movePoint}
    );
  }


  var operandPoint = operand.point;

  var vdirect = Math.sign(movePoint.x - operandPoint.x), hdirect = Math.sign(movePoint.y - operandPoint.y);

  var conflictOperand = this.map.get(operandPoint.x + (-1) * vdirect, operandPoint.y + (-1) * hdirect).operand;
  if (!operand.isConflictOperand(conflictOperand)) {
    throw new EngineError(
      "Moved operand {move.operand}, has no conflict with operand {point.operand}".format(operand, conflictOperand),
      EngineError.TARGET_NO_CONFLICTED_WITH_POINT,
      {operand: operand, conflictOperand: conflictOperand, movePoint: movePoint}
    )
  }

  operand.clearConflicts();

  movePoint.setOperand(operandPoint.removeOperand());
  this.conflicts--; // TODO: доделать

  this.checkConflicts(operand);
};


/**
 * Проверяет находится ли точка в окружности стойки
 * @param rack
 * @param point
 * @returns {boolean}
 */
Engine.prototype.isPointInRackArea = function (rack, point) {
  var i = Math.abs(rack.point.x - point.x);
  var j = Math.abs(rack.point.y - point.y);

  return (i == 1 && j == 1) || (i == 1 && j == 0) || (i == 0 && j == 1);
};
