
// Шаблон интерактивного объекта
function Operand() {
  this.point = null;
  this.conflicts = [];
}

extend(Operand.prototype, {
  setPoint: function (point) {
    this.point = point;
  },
  removePoint: function () {
    this.point = null;
  },
  addConflict: function (operand) {
    if (!this.isConflictOperand(operand)) this.conflicts.push(operand);
  },
  removeConflict: function (operand) {
    var index = this.conflicts.indexOf(operand);
    if (index !== -1) {
      this.conflicts.splice(index, 1);
      return true;
    }

    return false;
  },
  isConflictOperand: function (operand) {
    return this.conflicts.indexOf(operand) !== -1;
  },
  hasConflicts: function () {
    return !!this.conflicts.length;
  },
  clearConflicts: function () {
    for (var i = 0; i < this.conflicts.length; i++) {
      this.conflicts[i].removeConflict(this);
    }

    this.conflicts = [];
  }
});
