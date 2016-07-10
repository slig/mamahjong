module.exports = function(config){
  config.set({

    basePath : './',

    files : [
      'js/jquery.js',
      'js/*.js'
    ],

    autoWatch : true,

    frameworks: ['jasmine'],

    browsers : ['Chrome', 'Firefox'],

    plugins : [
            'karma-chrome-launcher',
            'karma-firefox-launcher',
            'karma-jasmine',
            ],
  });
};
