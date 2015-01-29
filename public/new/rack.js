function Rack(tokens, color) {
  Operand.apply(this, arguments);

  this.tokens = tokens;
  this.color = color;
}

inherit(Rack, Operand);

Rack.prototype.pickToken = function () {
  if (this.isEnoughTokens()) return false;
  return --this.tokens;
};

Rack.prototype.isEnoughTokens = function () {
  return this.tokens > 0;
};
