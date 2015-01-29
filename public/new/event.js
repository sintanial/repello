var EventEmitter = (function () {
  function EventEmitter() {
    this._events = {};
  }

  function on(evt, cb, context, once) {
    var p = evt.split('.');
    var name = p[0];
    var namespace = p[1];

    if (this._events[name] === undefined) {
      this._events[name] = {};
    }

    if (namespace === undefined) {
      namespace = '__' + name + '__';
    }

    if (this._events[name][namespace] === undefined) {
      this._events[name][namespace] = [];
    }

    this._events[name][namespace].push({
      ctx: context,
      cb: cb,
      once: !!once,
      triggered: false
    });
  }

  function apply(data, args) {
    if (data.once === true) {
      if (data.triggered !== true) {
        data.cb.apply(data.ctx, args);
        data.triggered = true;
      }
    } else {
      data.cb.apply(data.ctx, args);
    }
  }

  extend(EventEmitter.prototype, {
    on: function (evt, cb, context) {
      on.call(this, evt, cb, context);
      return this;
    },
    once: function (evt, cb, context) {
      on.call(this, evt, cb, context, true);
      return this;
    },
    off: function (evt) {
      var p = evt.split('.');
      var name = p[0];
      var namespace = p[1];

      if (!namespace) {
        delete this._events[name];
      } else {
        delete this._events[name][namespace];
      }

      return this;
    },
    events: function () {
      return this._events;
    },
    emit: function (evt) {
      var p = evt.split('.');
      var args = [].slice.call(arguments, 1);

      var name = p[0];
      var namespace = p[1];

      if (!namespace) {
        var e = this._events[name];
        for (var key in e) {
          var list = e[key];
          for (var i = 0, l = list.length; i < l; i++) {
            apply(list[i], args);
          }
        }
      } else {
        var list = this._events[name][namespace];
        if (list) {
          for (var i = 0, l = list.length; i < l; i++) {
            apply(list[i], args);
          }
        }
      }

      return this;
    }
  });

  return EventEmitter;
})();
