var p            = require('./package.json');
var gulp         = require('gulp');
var bower        = require('gulp-bower');
var bowerMain    = require('main-bower-files');
var sass         = require('gulp-sass');
var watch        = require('gaze');
var concat       = require('gulp-concat');
var sourcemaps   = require('gulp-sourcemaps');
var handleErrors = require('./src/util/handleErrors');
var gulpFilter   = require('gulp-filter');
var rename       = require('gulp-rename');
var uglify       = require('gulp-uglify');
var imagemin     = require('gulp-imagemin');
var minifyCSS    = require('gulp-minify-css');
var spritesmith  = require('gulp.spritesmith');
var flatten      = require('gulp-flatten');
var copy         = require('gulp-copy');
var gulpsync     = require('gulp-sync')(gulp);
var merge        = require('merge-stream');
var gm           = require('gulp-gm');
var babel        = require('gulp-babel');
var browserSync  = require('browser-sync').create();
var reload      = browserSync.reload;
 
 
var jsFilter = gulpFilter('*.js')
var cssFilter = gulpFilter('*.css')
var fontFilter = gulpFilter(['*.eot', '*.woff', '*.svg', '*.ttf'])
var imageFilter = gulpFilter(['*.gif', '*.png', '*.svg', '*.jpg', '*.jpeg'])
 
 
gulp.task('default', gulpsync.sync(['bower', 'bower_bundle', ['retina-images', 'sprites'], ['scripts', 'copy_images', 'copy_fonts', 'sass', 'browser-sync','watch']]), function() {
     
});
 
gulp.task('serve', ['sass', 'sass-after', 'watch'], function() {
 
});
 
 
gulp.task('watch', function () {
    watch('./src/scss/**/*', function(err, watcher) {
      this.on('all', function(event, filepath) {
        gulp.start(['sass']);
      });
    });
    watch('./src/js/**/*', function(err, watcher) {
      this.on('all', function(event, filepath) {
        gulp.start(['scripts']);
      });
    });
    watch('./*.aspx', function(err, watcher) {
      this.on('change', function(event, filepath) {
        reload()
      });
    });
    watch('./src/images/**', function(err, watcher) {
      this.on('all', function(event, filepath) {
        gulp.start(['copy_images']);
      });
    });
    watch('./src/fonts/**', function(err, watcher) {
      this.on('all', function(event, filepath) {
        gulp.start(['copy_fonts']);
      });
    });
});
 
 
gulp.task('browser-sync', function() {
    browserSync.init({
        server: {
            baseDir: "./"
        }
    });
});
 
gulp.task('retina-images', function () {
    var moveRetinaImages = gulp.src('./src/sprites/retina-images/*.png')
                            .pipe(rename({
                                suffix: "-2x"
                            }))
                           .pipe(gulp.dest('./src/sprites'));
 
 
    var createNormalImages = gulp.src('./src/sprites/retina-images/*.png')
        .pipe(gm(function (gmfile, done) {
            gmfile.size(function (err, size) {
 
                done(null, gmfile.resize(
                    size.width * 0.5,
                    size.height * 0.5
                ));
 
            });
        }))
        .pipe(gulp.dest('./src/sprites'));
 
    return merge(moveRetinaImages, createNormalImages);
});
 
 
gulp.task('sprites', function () {
  var spriteData = gulp.src('./src/sprites/*.png').pipe(spritesmith({
    imgName: 'spritesheet.png',
    imgPath: '../img/spritesheet.png',
    //retinaSrcFilter: ['./src/sprites/*-2x.png'],
    //retinaImgName: 'spritesheet-2x.png',
    //retinaImgName: '../img/spritesheet-2x.png',
    cssName: '_sprites.scss'
  }));
 
  spriteData.img
    .pipe(imagemin())
    .pipe(gulp.dest('./assets/img/'));
 
  spriteData.css
    .pipe(gulp.dest('./src/scss/globals'));
 
  return merge(spriteData.img, spriteData.css);
});
 
 
gulp.task('sass', function () {
    return gulp.src('./src/scss/style.scss')
        .pipe(sass())
        .on('error', handleErrors)
        .pipe(gulp.dest('./assets/debug/css'))
        .pipe(minifyCSS({keepBreaks:true}))
        .pipe(rename({
            suffix: ".min"
        }))
        .pipe(gulp.dest('./assets/css'))
        .pipe(reload({stream: true}));
 
});
 
 
gulp.task('scripts', function() {
    return gulp.src('./src/js/**')
        .pipe(concat('all.js'))
        .pipe(gulp.dest('./assets/debug/js'))
        .pipe(uglify())
        .on('error', handleErrors)
        .pipe(rename({
            suffix: ".min"
        }))
        .pipe(gulp.dest('./assets/js'));
});
 
 
gulp.task('copy_fonts', function() {
    return gulp.src('./src/fonts/**')
                .pipe(gulp.dest('./assets/fonts'));
});
 
gulp.task('copy_images', function() {
    return gulp.src('./src/images/**')
                 .pipe(imagemin())
                 .pipe(gulp.dest('./assets/img'));
});
 
gulp.task('bower', function() {
  return bower();
 
});
 
gulp.task('bower_bundle', function() {
  return gulp.src(bowerMain())
 
    // JS
    .pipe(jsFilter)
    .pipe(concat('plugins.js'))
    .pipe(gulp.dest('./assets/debug/js'))
    .pipe(uglify())
    .pipe(rename({
        suffix: ".min"
    }))
    .pipe(gulp.dest('./assets/js'))
    .pipe(jsFilter.restore())
     
    // CSS
    .pipe(cssFilter)
    .pipe(concat('plugins.css'))
    .pipe(gulp.dest('./assets/debug/css'))
    .pipe(minifyCSS({keepBreaks:true}))
    .pipe(rename({
        suffix: ".min"
    }))
    .pipe(gulp.dest('./assets/css'))
    .pipe(cssFilter.restore())
     
    // FONTS
    .pipe(fontFilter)
    .pipe(flatten())
    .pipe(gulp.dest('./assets/fonts'))
    .pipe(fontFilter.restore())
     
    // IMAGES
    .pipe(imageFilter)
    .pipe(flatten())
    .pipe(gulp.dest('./assets/img'))
    .pipe(imageFilter.restore())
     
});