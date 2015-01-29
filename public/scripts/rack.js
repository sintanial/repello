function Rack(chips, color) {
  this.chips = chips;
  this.color = color;
  this.coord = null;
}

Rack.prototype.pickChips = function () {
  if (this.isEnoughTokens()) return false;
  return --this.chips;
};

Rack.prototype.isEnoughTokens = function () {
  return this.chips > 0;
};


inherit(Rack, Operand);
