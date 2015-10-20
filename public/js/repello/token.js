function Token(type) {
  Operand.apply(this, arguments);

  this.type = type;
}

inherit(Token, Operand);

Token.TYPE = {
  GOLD: 5,
  SILVER: 3,
  BLACK: 1
};

