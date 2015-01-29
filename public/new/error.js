function EngineError(message, type, data) {
  this.name = 'EngineError';
  this.message = message;
  this.type = type;
  this.data = data;
  this.conflicts = 0;
}
EngineError.prototype = new Error();
EngineError.prototype.constructor = EngineError;

EngineError.RACK_ALREADY_IN_GAME = 0;
EngineError.BUSY_POINT = 1;
EngineError.CHIPS_ENDED = 2;
EngineError.POINT_NOT_IN_RACK_ARIA = 3;
EngineError.POINT_NO_CONFLICTS = 4;
EngineError.TARGET_NO_CONFLICTED_WITH_POINT = 5;
