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


function inherit() {
  throw new Error('release this method');
}
