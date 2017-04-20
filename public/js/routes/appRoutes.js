angular.module('appRoutes', []).config(['$routeProvider', '$locationProvider', function($routeProvider, $locationProvider) {

    $routeProvider
        .when('/', {
          templateUrl: 'views/home.html',
          controller: 'MainController'
        })

        .when('/about', {
          templateUrl: 'views/about.html',
          controller: 'AboutController'
        })

        //future projects page that will use the FpController
        .when('/future_projects', {
            templateUrl: 'views/future_projects.html',
            controller: 'FpController'
        })

        .when('/contact', {
          templateUrl: 'views/contact.html',
          controller: 'ContactController'
        })

        .when('/register', {
          templateUrl: 'views/register.html',
          controller: 'RegController'
        })

        .when('/login', {
          templateUrl: 'views/login.html',
          controller: 'LoginController'
        })
        
        .otherwise({
            redirectTo: '/'
        });


    $locationProvider.html5Mode(true);

}]);