// TODO
// New game should prompt for other user
// CICD process (push to server automatically)
// Unit tests for scores
// more efficient scoring
// update names on games overview

angular.module('quicketApp')
    .value('targets', [
        {
            value: 15,
            maxHits: 9
        },
        {
            value: 16,
            maxHits: 9
        },
        {
            value: 17,
            maxHits: 9
        },
        {
            value: 18,
            maxHits: 9
        },
        {
            value: 19,
            maxHits: 9
        },
        {
            value: 20,
            maxHits: 9
        },
        {
            value: 25,
            maxHits: 6
        }
    ])
    .filter('range', function() {
        return function(input, total) {
            total = parseInt(total);
            for (var i = 0; i<total; i++) {
                input.push(i);
            }
            return input;
        };
    })
    .controller('GamesCtrl', function ($scope, games, auth, $state) {
        $scope.games = games;
        $scope.auth = auth;

        $scope.newGame = function () {
            // TODO select an opponent (maybe dropdown or text input?)
            var oppId = 2;

            var emptyRound = [
                [0, 0],
                [0, 0],
                [0, 0],
                [0, 0],
                [0, 0],
                [0, 0],
                [0, 0]
            ];

            var emptyRounds = [emptyRound, emptyRound, emptyRound];

            var add = $scope.games.$add({
                players: [auth.user.id, oppId],
                rounds: emptyRounds,
                date: Date.now()
            });

            add.then(function (info) {
                // TODO figure out if I can avoid weird path
                $state.go('games.game', { id: info.path.m[1] });
            });

        };

        $scope.deleteGame = function (gId) {
            $scope.games.$remove(gId);

            if ($state.includes('games.game', {id: gId})) {
                $state.go('games');
            }
        };

    })
    .controller('GameCtrl', function ($scope, targets, game) {
        game.$bind($scope, 'game');

        $scope.targets = targets;

        $scope.playerIdx = 0;
        $scope.opponentIdx = 1;

        $scope.opponent = 'Paul';

        $scope.result = function () {
            return 'You beat ';
        };

        var sumArray = function (arr) {
            if (arr.length > 0) {
                return arr.reduce(function(previousValue, currentValue){
                    return previousValue + currentValue;
                });
            } else {
                return 0;
            }
        };

        $scope.roundScore = function (player, round) {
            var scores = _.map(round, function (target, idx) {
                var numHits = target[player];
                var value = targets[idx].value;
                return parseInt(numHits * value, 10);
            });

            return sumArray(scores);
        };

        $scope.gameScore = function (player) {
            var rounds = $scope.game.rounds;
            var scores = _.map(rounds, function(round) {
                return $scope.roundScore(player, round);
            });

            return sumArray(scores);
        };
    });