angular.module('app.players')
  .controller("PlayerTypeaheadController", function($scope, PlayerService) {
    $scope.playerService = PlayerService;

    $scope.notEqual = function(id) {
      return function(player) {
        return player.id != id;
      }
    };
  });

