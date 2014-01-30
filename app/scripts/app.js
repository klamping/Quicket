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

        var ref = new Firebase(FB_URL);

        $stateProvider
            .state('games', {
                url: '/',
                templateUrl: '/partials/games.html',
                controller: 'GamesCtrl',
                resolve: {
                    auth: function ($firebaseSimpleLogin) {
                        return $firebaseSimpleLogin(ref);
                    },
                    games: function ($firebase, auth) {
                        var fire = $firebase(ref);

                        return auth.$getCurrentUser().then(function (user) {
                            return fire.$child('users/' + user.id);
                        });
                    }
                }
            })
            .state('games.game', {
                url: 'games/:id',
                templateUrl: '/partials/game.html',
                controller: 'GameCtrl',
                resolve: {
                    game: function ($firebaseSimpleLogin, $stateParams) {
                        $firebaseSimpleLogin(ref).$getCurrentUser.then(function (user) {

                            return ref.child('users/' + user.id + '/games/' + $stateParams.id);
                        });
                    }
                }
            });
    })
    .run(function ($rootScope) {
        $rootScope.$on("$firebaseSimpleLogin:login", function(e, user) {
            console.log("User " + user.id + " successfully logged in!");
        });
    });