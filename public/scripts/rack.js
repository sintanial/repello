function Rack(chips, color) {
  this.chips = chips;
  this.color = color;
  this.coord = null;
}

Rack.prototype.pickChips = function () {
  if (this.isEnoughChips()) return false;
  return --this.chips;
};

Rack.prototype.isEnoughChips = function () {
  return this.chips > 0;
};
