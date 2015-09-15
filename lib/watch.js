var lazypipe = require('lazypipe');
var watchify = require('watchify');

var browserify = require('./browserify');
var bundle = require('./bundle');

var inherits = require('util').inherits;
// node version?
var EE = require('events');
inherits(Watch, EE);

module.exports = Watch;

function Watch(opts) {
  if (!(this instanceof Watch)) {
    return new Watch(opts);
  }
  this.options = opts;
  this._postpipes = [];
}

Watch.prototype.src = function(pattern, opts) {
  var b = browserify(pattern, opts);
  watchify(b, this.options);

  var onerror = this.emit.bind(this, 'error');
  var self = this;
  function _bundle() {
    var s = bundle(b, b._options.factor).on('error', onerror);
    if (self._lazypipe) {
      s.pipe(self._lazypipe());
    }
  }

  b.on('log', this.emit.bind(this, 'log'));
  b.on('error', onerror);
  b.on('update', _bundle);
  process.nextTick(_bundle);

  return this;
};

Watch.prototype.pipe = function() {
  if (!this._lazypipe) {
    this._lazypipe = lazypipe();
  }
  this._lazypipe = this._lazypipe.pipe.apply(this._lazypipe, arguments);
  return this;
};
