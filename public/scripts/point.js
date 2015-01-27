function Point(map, num, coord) {
  this.chip = null;
  this.rack = null;
  this.num = num;
  this.coord = coord;
  this.map = map;
  this.conflicts = [];
}

Point.prototype.isBusy = function () {
  return this.chip || this.rack;
};

Point.prototype.setChip = function (chip) {
  this.map.emit('set:chip', chip);

  this.chip = chip;
};

Point.prototype.setRack = function (rack) {
  this.map.emit('set:rack', rack);

  this.rack = rack;
};

Point.prototype.clear = function () {
  this.chip = null;
  this.rack = null;
};

Point.prototype.addConflict = function (point) {
  this.conflicts.push(point);
};

Point.prototype.removeConflict = function (point) {
  var index = this.conflicts.indexOf(point);
  if (index !== -1) {
    this.conflicts.splice(index, 1);
    return true;
  }

  return false;
};

Point.prototype.isInConflict = function (point) {
  return this.conflicts.indexOf(point) !== -1;
};

Point.prototype.isConflictable = function () {
  return !!this.conflicts.length;
};

Point.TYPE = {
  GOLD: 5,
  SILVER: 3,
  BLACK: 1
};
