function Point(map, num, coord) {
  this.map = map;

  this.num = num;

  this.coord = coord;

  this.x = coord[0];
  this.y = coord[1];

  this.operand = null;
}

Point.prototype.isBusy = function () {
  return !!this.operand;
};

Point.prototype.setOperand = function (operand) {
  this.operand = operand;
  operand.setPoint(this);
};

Point.prototype.removeOperand = function () {
  var operand = this.operand;
  operand.removePoint();

  this.operand = null;

  return operand;
};
