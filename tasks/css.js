/**
 * Created by LiRong on 2017/11/19.
 */
import gulp from 'gulp';
import gulpif from 'gulp-if';
import livereload from 'gulp-livereload';
import args from './util/args';

gulp.task('css',()=>{
    return gulp.src('app/**/*.css')
        .pipe(gulp.dest('server/public'))

})