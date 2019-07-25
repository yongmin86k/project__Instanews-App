const gulp = require("gulp"),
  terser = require("gulp-terser"),
  rename = require("gulp-rename"),
  browserSync = require("browser-sync"),
  cssnano = require("gulp-cssnano"),
  autoprefixer = require("gulp-autoprefixer"),
  eslint = require('gulp-eslint');


gulp.task("watch", function() {
  gulp.watch("js/*.js", gulp.series("scripts"));
  gulp.watch("css/*.css", gulp.series("styles"));
  gulp.watch("*.html").on("change", browserSync.reload);
});

gulp.task("lint", function () {
    return (
        gulp
        .src(['./js/*.js'])
        .pipe(eslint())
        .pipe(eslint.format())
        .pipe(eslint.failAfterError())
    );
});

gulp.task('scripts',
    gulp.series('lint', 
        function () { 
            return gulp
                .src(['./js/*.js'])
                .pipe(terser())
                .pipe(rename({ extname: ".min.js" }))
                .pipe(gulp.dest("./build/js"));
        })
);

gulp.task("styles", function() {
  return gulp
    .src("./css/*.css")
    .pipe(
      autoprefixer({
        browsers: ["last 2 versions"]
      })
    )
    .pipe(cssnano())
    .pipe(rename({ extname: ".min.css" }))
    .pipe(gulp.dest("./build/css"));
});

gulp.task("browser-sync", function() {
  browserSync.init({
    server: {
      baseDir: "./"
    }
  });

  gulp
    .watch(["build/css/*.css", "build/js/*.js"])
    .on("change", browserSync.reload);
});

gulp.task("default", gulp.parallel("browser-sync", "watch"));