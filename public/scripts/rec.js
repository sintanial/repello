var start = [5, 3];
var move = [6, 4];
var steps = 6;

var size = 8;

var hdirection = Math.sign(move[1] - start[1]);
var vdirection = Math.sign(move[0] - start[0]);

var hstep = start[1], vstep = start[0];
for (var i = 0; i < steps; i++) {
  hstep += hdirection;
  if (hstep <= 0 || hstep >= size - 1) hdirection *= -1;

  vstep += vdirection;
  if (vstep <= 0 || vstep >= size - 1) vdirection *= -1;
}
