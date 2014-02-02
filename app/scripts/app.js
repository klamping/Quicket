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

        var ref = new Firebase(FB_URL);

        $stateProvider
            .state('signIn', {
                url: '/',
                templateUrl: '/partials/signin.html'
            })
            .state('games', {
                url: '/games',
                templateUrl: '/partials/games.html',
                controller: 'GamesCtrl',
                resolve: {
                    games: function ($rootScope, $firebase, $q) {
                        var deferred = $q.defer();

                        var getGames = function (user) {
                            return $firebase(ref).$child('users/' + user.id);
                        };

                        if ($rootScope.user === null) {
                            $rootScope.$watch('user', function () {
                                deferred.resolve(getGames($rootScope.user));
                            });
                        } else {
                            return getGames($rootScope.user);
                        }

                        return deferred.promise;
                    }
                }
            })
            .state('games.game', {
                url: '/:id',
                templateUrl: '/partials/game.html',
                controller: 'GameCtrl',
                resolve: {
                    game: function ($rootScope, $stateParams, games) {
                        return games.$child($stateParams.id);
                    }
                }
            });
    })
    .run(function ($rootScope, $state, FB_URL, $firebaseSimpleLogin) {
        $rootScope.$on('$firebaseSimpleLogin:login', function (e, user) {
            $rootScope.user = user;
            $state.go('games');
        });
        $rootScope.$on('$firebaseSimpleLogin:logout', function () {
            $state.go('/');
        });

        $rootScope.auth = $firebaseSimpleLogin(new Firebase(FB_URL));
    });