angular.module('quicketApp', [
        'ngCookies',
        'ngSanitize',
        'ui.router',
        'firebase',
        'waitForAuth'
    ])
    .constant('FB_URL', 'https://quicket.firebaseio.com')
    .config(function ($stateProvider, $urlRouterProvider, $locationProvider, FB_URL) {
        $locationProvider.html5Mode(true);

        // For any unmatched url, redirect home
        $urlRouterProvider.otherwise('/');

        $stateProvider
            .state('games', {
                url: '/',
                templateUrl: '/partials/games.html',
                controller: 'GamesCtrl',
                resolve: {
                    games: function ($firebase) {
                        var ref = new Firebase(FB_URL + '/games');

                        return $firebase(ref);
                    },
                    auth: function ($firebaseSimpleLogin) {
                        var ref = new Firebase(FB_URL);

                        return $firebaseSimpleLogin(ref);
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
    .run();