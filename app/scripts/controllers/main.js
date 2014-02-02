// TODO
// New game should prompt for other user
// CICD process (push to server automatically)
// Unit tests for scores
// more efficient scoring
// Only get games where player was involved
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
    .controller('GamesCtrl', function ($scope, games, $state) {
        $scope.games = games;

        $scope.newGame = function () {
            var opponent = $scope.opponent;

            var emptyRound = [0,0,0,0,0,0,0];

            var emptyRounds = [emptyRound, emptyRound, emptyRound];

            var add = $scope.games.$add({
                rounds: emptyRounds,
                date: Date.now(),
                opponent: {
                    username: opponent
                }
            });

            // TODO add game to opponent

            add.then(function (info) {
                $state.go('games.game', { id: info.name() });
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
        // TODO why no binding no more
        game.$bind($scope, 'game');

        $scope.targets = targets;

        $scope.result = function () {
            return 'You beat ';
        };
    })
    .filter('score', function (targets) {
        var scoreKit = function (hits, type, idx) {
            return hits * targets[idx].value;
        };

        return function scoreData (data, type) {
            var totalScore = 0;

            var calc;

            if (type == 'kit') {
                console.log(data);
            }

            switch (type) {
                case 'kit':
                    calc = scoreKit;
                    break;
                case 'round':
                    calc = scoreData;
                    type = 'kit';
                    break;
                case 'game':
                    calc = scoreData;
                    type = 'round';
                    break;
            }

            _.each(data, function (item, idx) {
                totalScore += calc(item, type, idx);
            });

            return totalScore;
        };
    });