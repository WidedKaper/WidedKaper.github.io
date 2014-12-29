/* --------------------------------- *
 * Gulp requires / plugins           *
 * --------------------------------- */
var gulp        = require('gulp');
var plugins     = require('gulp-load-plugins')();
var runSequence = require('run-sequence');





/* --------------------------------- *
 * Tasks                             *
 * --------------------------------- */
// Watcher.
gulp.task('watch', function() {

    plugins.livereload.listen();

    gulp.watch('sass/**/*.scss').on('change', plugins.livereload.changed);
    gulp.watch('sass/**/*.scss', ['css:sass', 'css:autoprefix']);
    gulp.watch(['js/**/*.js', '!js/scripts.js'], ['js:dev']);

});

// SASS.
gulp.task('css:sass', function() {

    return gulp.src('sass/**/*.scss')
        .pipe(plugins.sourcemaps.init())
        .pipe(plugins.sass())
        .on('error', swallowError)
        .pipe(plugins.sourcemaps.write())
        .pipe(gulp.dest('css/'))
        .pipe(plugins.livereload());

});

// Autoprefix CSS.
gulp.task('css:autoprefix', function() {

    return gulp.src('css/style.css')
        .pipe(plugins.autoprefixer({
            browsers: ['last 5 versions', 'ie 9', 'ie 8']
        }))
        .pipe(gulp.dest('css/'));

});

// Lint JS.
gulp.task('js:lint', function() {

    return gulp.src(['js/*.js', '!js/scripts.js', '!js/scripts.min.js'])
        .pipe(plugins.jshint())
        .pipe(plugins.jshint.reporter('jshint-stylish'));

});

// Concat JS.
gulp.task('js:concat', function() {

    return gulp.src(['js/vendor/fonts.js', 'js/*.js', '!js/scripts.js', '!js/scripts.min.js'])
        .pipe(plugins.concat('scripts.js'))
        .pipe(gulp.dest('js/'));

});

// Uglify JS.
gulp.task('js:uglify', function() {

    return gulp.src('js/scripts.js')
        .pipe(plugins.uglify())
        .pipe(plugins.rename('scripts.min.js'))
        .pipe(gulp.dest('js/'));

});

// Minify images.
gulp.task('img:minify', function() {

    return gulp.src('img/**/*.*')
        .pipe(plugins.imagemin())
        .pipe(gulp.dest('dist/img/'));

});





/* --------------------------------- *
 * Sequenced dev tasks               *
 * --------------------------------- */
// CSS autoprefixing.
gulp.task('css:dev', function(done) {

    runSequence(
        'css:sass',
        'css:autoprefix',
    done);

});

// JS lint and concat.
gulp.task('js:dev', function(done) {

    runSequence(
        'js:lint',
        'js:concat',
    done);

});





/* --------------------------------- *
 * Sequenced dist tasks              *
 * --------------------------------- */
// CSS compilation and autoprefixing.
gulp.task('css:dist', function(done) {

    runSequence(
        'css:sass',
        'css:autoprefix',
    done);

});

// JS lint, concat and uglify.
gulp.task('js:dist', function(done) {

    runSequence(
        'js:lint',
        'js:concat',
        'js:uglify',
    done);

});





/* --------------------------------- *
 * Functions                         *
 * --------------------------------- */
// Logs error but keeps stream going.
function swallowError(error) {

    console.log(error.toString());
    this.emit('end');

}





/* --------------------------------- *
 * Gulp commands                     *
 * --------------------------------- */
gulp.task('default', ['watch']);
gulp.task('dev', ['css:dev', 'js:dev', 'img:minify']);
gulp.task('dist', ['css:dist', 'js:dist', 'img:minify']);
