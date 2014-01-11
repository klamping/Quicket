// TODO
// Figure out if firebase supports socket.io
// New game should prompt for other user

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
    .controller('MainCtrl', function ($scope, $firebase) {
        var ref = new Firebase('https://quicket.firebaseio.com/games');

        $scope.games = $firebase(ref);

        $scope.newGame = function () {
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

            $scope.games.$add({
                players: ['1', '2'],
                rounds: emptyRounds,
                date: Date.now()
            });
        };

        $scope.deleteGame = function (gId) {
            $scope.games.$remove(gId);
        };

    })
    .controller('GameCtrl', function ($scope, $firebase, $stateParams, targets) {
        var ref = new Firebase('https://quicket.firebaseio.com/games/' + $stateParams.id);

        $scope.game = $firebase(ref, $scope);

        $scope.targets = targets;

        $scope.playerIdx = 0;
        $scope.opponentIdx = 1;

        $scope.opponent = 'Paul';

        $scope.saveGame = function () {
            $scope.game.$save();
        };

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

    })
    .filter('range', function() {
        return function(input, total) {
            total = parseInt(total);
            for (var i = 0; i<total; i++) {
                input.push(i);
            }
            return input;
        };
    });