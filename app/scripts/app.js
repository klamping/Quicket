angular.module('quicketApp', [
        'ngCookies',
        'ngSanitize',
        'ui.router',
        'firebase'
    ])
    .constant('FB_URL', 'https://quicket.firebaseio.com')
    .config(function ($stateProvider, $urlRouterProvider, $locationProvider, FB_URL) {
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
                controller: 'MainCtrl',
                resolve: {
                    games: function ($firebase) {
                        var ref = new Firebase(FB_URL + '/games');

                        return $firebase(ref);
                    }
                }
            })
            .state('games.game', {
                url: 'games/:id',
                templateUrl: '/partials/game.html',
                controller: 'GameCtrl',
                resolve: {
                    game: function ($firebase, $stateParams) {
                        var ref = new Firebase(FB_URL + '/games/' + $stateParams.id);

                        return $firebase(ref);
                    }
                }
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