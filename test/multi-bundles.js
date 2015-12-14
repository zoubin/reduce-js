var reduce = require('..')
var test = require('tap').test
var runSequence = require('callback-sequence').run
var path = require('path')
var del = require('del')
var uglify = require('gulp-uglify')
var gulp = require('gulp')
var equal = require('util-equal')

var fixtures = path.resolve.bind(path, __dirname)
var dest = fixtures.bind(null, 'build', 'multi-bundles')
var expect = fixtures.bind(null, 'expected', 'multi-bundles')

test('multiple bundles', function(t) {
  t.plan(1)
  runSequence([clean, bundle]).then(function () {
    equal(
      [dest('common.js'), dest('green.js'), dest('red.js')],
      [expect('common.js'), expect('green.js'), expect('red.js')],
      function (res) {
        t.ok(res)
      }
    )
  })
})

function clean() {
  return del(dest())
}

function bundle() {
  var opts = {
    basedir: fixtures('src', 'multi-bundles'),
    factor: {
      //entries: ['green.js', 'red.js'],
      //outputs: ['green.js', 'red.js'],
      needFactor: true,
      common: 'common.js',
    },
  }
  return reduce.src('*.js', opts)
    .pipe(uglify())
    .pipe(gulp.dest(dest()))
}

