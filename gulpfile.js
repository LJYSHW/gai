var gulp        = require('gulp');
var browserSync = require('browser-sync').create();

var path = {
    baseDir:'./'
}

// Static server
gulp.task('browser-sync', function() {
    var files = [
    './src/**/*'
    ];
    browserSync.init(files,{
        server: {
            baseDir: './'
        }
    });
}); 

// Domain server
//gulp.task('brows er-sync', function() {
//    browserSync.init({
//        proxy: "yourlocal.dev"
//    });  
//});

gulp.task('default',['browser-sync'],function(files){
    //console.log('start');
    gulp.watch(path.baseDir).on('change',function(){
        console.log(files);
        browserSync.reload; 
    });
}); 