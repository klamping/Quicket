angular.module('quicketApp', [
        'ngCookies',
        'ngSanitize',
        'ui.router',
        'firebase'
    ])
    .config(function ($stateProvider, $urlRouterProvider, $locationProvider) {
        $locationProvider.html5Mode(true);

        // For any unmatched url, redirect home
        $urlRouterProvider.otherwise('/');

        $stateProvider
            .state('login', {
                url: 'login',
                templateUrl: '/partials/login.html'
            })
            .state('signup', {
                url: 'signup',
                templateUrl: '/partials/signup.html'
            })
            .state('games', {
                url: '/',
                templateUrl: '/partials/games.html',
                controller: 'MainCtrl'
            })
            .state('games.game', {
                url: 'games/:id',
                templateUrl: '/partials/game.html',
                controller: 'GameCtrl'
            });
    })
    // establish authentication
    .run(function() {

        // TODO figure out user auth
        // Figure out how to list other users
        // Figure out how to have names for other users
        // Fetch all other user's names
        // angularFireAuth.initialize(new Firebase(FBURL), {
        //     scope: $rootScope,
        //     name: 'auth',
        //     path: '/signin'
        // });
        // $rootScope.FBURL = FBURL;
    });