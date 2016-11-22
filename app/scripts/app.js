'use strict';

/**
 * @ngdoc overview
 * @name projetwebApp
 * @description
 * # projetwebApp
 *
 * Main module of the application.
 */
angular
  .module('projetwebApp', [
    'ngAnimate',
    'ngCookies',
    'ngMessages',
    'ngResource',
    'ngRoute',
    'ngSanitize',
   // 'ngTouch',
    'ngMap',
    'ngMaterial',
    'base64',
    'nvd3',
    'synbioz.angular-c3js',
    

  ])
  .config(function ($routeProvider) {
    $routeProvider
      .when('/', {
        templateUrl: 'views/main.html',
        controller: 'MainCtrl',
        controllerAs: 'vm'
      })
      .when('/about', {
        templateUrl: 'views/about.html',
        controller: 'AboutCtrl',
        controllerAs: 'ctrl'
      })
      .when('/login',{
        templateUrl:'views/login.html',
        controller:'LoginCtrl',
        controllerAs:'vm'
      })
     /* .when('/liste',{
        templateUrl:'views/dialog.html'
      })
      .when('/ajout',{
        templateUrl:'views/dialog.html'
      })
      .when('/modif',{
        templateUrl:'views/dialog.html'
      })*/
      .otherwise({
        redirectTo: '/'
      });
      
  })
   .config(['$httpProvider', function($httpProvider){
        // django and angular both support csrf tokens. This tells
        // angular which cookie to add to what header.
        $httpProvider.defaults.xsrfCookieName = 'csrftoken';
        $httpProvider.defaults.xsrfHeaderName = 'X-CSRFToken';
    }])
   .config(function($mdThemingProvider) {
  $mdThemingProvider.theme('default')
   // .primaryPalette('blue')
    .accentPalette('pink');
    //.backgroundPalette('white');
});
 
//a voir
/*// [1] https://tools.ietf.org/html/rfc2617
// [2] https://developer.mozilla.org/en-US/docs/Web/API/Window.btoa
// [3] https://docs.djangoproject.com/en/dev/ref/settings/#append-slash
// [4] https://github.com/tbosch/autofill-event
// [5] http://remysharp.com/2010/10/08/what-is-a-polyfill*/