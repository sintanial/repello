function Map() {
  var map = [
    [3, 4, 5, 6, 1, 2, 3, 4, 5, 6, 1, 2, 3],
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
    [5, 6, 1, 2, 3, 4, 5, 6, 1, 2, 3, 4, 5]
  ];

  for (var i = 0; i < map.length; i++) {
    for (var j = 0; j < map[i].length; j++) {
      map[i][j] = new Point(map, map[i][j], [i, j]);
    }
  }

  map[0][1].setOperand(Token.TYPE.BLACK);
  map[0][6].setOperand(Token.TYPE.SILVER);
  map[0][11].setOperand(Token.TYPE.BLACK);

  map[6][1].setOperand(Token.TYPE.SILVER);
  map[6][6].setOperand(Token.TYPE.GOLD);
  map[6][11].setOperand(Token.TYPE.SILVER);

  map[11][1].setOperand(Token.TYPE.BLACK);
  map[11][6].setOperand(Token.TYPE.SILVER);
  map[11][11].setOperand(Token.TYPE.BLACK);

  this.matrix = map;
}

inherit(Map, EventEmitter);

Map.prototype.get = function (coord) {
  if (!Array.isArray(coord)) coord = [].slice.call(arguments);

  return this.matrix[coord[0]][coord[1]];
};
