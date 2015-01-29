if (!String.prototype.format) {
  String.prototype.format = function () {
    var args = arguments;
    return this.replace(/{(\d+)}/g, function (match, number) {
      return typeof args[number] != 'undefined'
        ? JSON.stringify(args[number])
        : match
        ;
    });
  };
}


function inherit(ctor, superCtor) {
  ctor.super_ = superCtor;
  ctor.prototype = Object.create(superCtor.prototype, {
    constructor: {
      value: ctor,
      enumerable: false,
      writable: true,
      configurable: true
    }
  });
}

function extend() {
  var target = arguments[0]
    , i = 1;
  for (; i < arguments.length; ++i) {
    var options = arguments[i];
    for (var name in options) {
      if (options.hasOwnProperty(name)) {
        target[name] = options[name];
      }
    }
  }
  return target;
}
