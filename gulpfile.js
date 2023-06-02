const gulp = require("gulp");
const browsersync = require("browser-sync");
const sass = require('gulp-sass')(require('sass'));
const scco = require('gulp-csso');
const include = require('gulp-file-include');
const htmlmin = require('gulp-htmlmin');
const del = require('del');
const concat = require('gulp-concat');
const autoprefixer = require('gulp-autoprefixer');

// import gulp from 'gulp';
// import browsersync from 'browser-sync';
// import dartSass from 'sass';
// import gulpSass from 'gulp-sass';
// const sass = gulpSass(dartSass);
// import scco from 'gulp-csso';
// import include from 'gulp-file-include';
// import htmlmin from 'gulp-htmlmin';
// import del from 'del';
// import concat from 'gulp-concat';
// import autoprefixer from 'gulp-autoprefixer';

const dist = "./dist/";

gulp.task("html", () => {
	return gulp.src("src/**.html")
		.pipe(include({
			prefix: '@@'
		}))
		.pipe(htmlmin({
			collapseWhitespace: true
		}))
		.pipe(gulp.dest(dist))
		.pipe(browsersync.stream())
});// include - отвечает за соединение файлов, dest - делает сборку, stream - перезагрузка сервера

gulp.task("scss", () => {
	return gulp.src("src/scss/**.scss")
		.pipe(sass())
		.pipe(autoprefixer({
			browsers: ['last 2 version']
		}))
		.pipe(scco())
		.pipe(concat('index.css'))
		.pipe(gulp.dest(dist))
		.pipe(browsersync.stream())
});// sass() скомпилировал scss в css, scco - минифицирует файлы, concat - соединяет файлы

gulp.task('clear', () => {
	return del('dist')
})

gulp.task("watch", () => {
	browsersync.init({
		server: "./dist/",
		port: 4000,
		notify: true
	});
	
	gulp.watch("src/**.html", gulp.parallel("html"))
	gulp.watch("src/scss/**.scss", gulp.parallel("scss"))
});

gulp.task("build", gulp.parallel("html", "scss")); // Режим разработки: запускать => gulp build

gulp.task("default", gulp.parallel("watch", "build")); // Режим продакшн : запускать => gulp