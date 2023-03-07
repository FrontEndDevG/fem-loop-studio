const { src, dest, watch, series } = require("gulp");
const sass = require("gulp-sass")(require("sass"));
const postcss = require("gulp-postcss");
const autoprefixer = require("autoprefixer");
const cssnano = require("cssnano");
const babel = require("gulp-babel");
const terser = require("gulp-terser");
const browsersync = require("browser-sync").create();
const dotenv = require("dotenv").config();

// Use dart-sass for @use

sass.compiler = require("dart-sass");

function scssTask() {
  return src("app/scss/**/*.scss", { sourcemaps: true })
    .pipe(sass())
    .pipe(
      postcss([
        autoprefixer({
          overrideBrowserslist: ["last 10 versions"],
          cascade: false,
        }),
        cssnano(),
      ])
    )
    .pipe(dest("dist/css", { sourcemaps: "." }));
}

function jsTask() {
  return src("app/js/**/*.js", { sourcemaps: true })
    .pipe(babel({ presets: ["@babel/preset-env"] }))
    .pipe(terser())
    .pipe(dest("dist/js", { sourcemaps: "." }));
}

function browsersyncServe(cb) {
  if (process.env.ENABLE_BROWSERSYNC === "true") {
    browsersync.init({
      server: {
        baseDir: ".",
      },
    });
  }
  cb();
}

function browsersyncReload(cb) {
  browsersync.reload();
  cb();
}

function watchTask() {
  watch("*.html", browsersyncReload);
  watch(
    ["app/scss/**/*.scss", "app/js/**/*.js"],
    series(scssTask, jsTask, browsersyncReload)
  );
}

exports.default = series(scssTask, jsTask, browsersyncServe, watchTask);
