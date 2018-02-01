angular.module('app.players').controller("PlayerDetailController", function($scope, $http, $routeParams, $uibModal, RegionService, SessionService, PlayerService) {
    RegionService.setRegion($routeParams.region);
    $scope.regionService = RegionService;
    $scope.sessionService = SessionService;
    $scope.playerService = PlayerService;

    $scope.modalInstance = null;
    $scope.disableButtons = false;
    $scope.errorMessage = false;

    $scope.player = null;
    $scope.playerId = $routeParams.playerId;
    $scope.mergePlayer = "";
    $scope.matches = null;

    $scope.matchStatus = 'L';

    $scope.numQualifying = 0;

    $scope.showFormulas = false;

    /** PAGENATION **/
    $scope.totalItems = 0;
    $scope.viewby = 15;
    $scope.currentPage = 1;
    $scope.itemsPerPage = $scope.viewby;
    $scope.maxSize = 5;
    $scope.setPage = function (pageNo) {
        $scope.currentPage = pageNo;
    };
    $scope.setItemsPerPage = function(num) {
        $scope.itemsPerPage = num;
        $scope.currentPage = 1;
    }
    /** END PAGENATION **/

    $scope.determineMatchStatus = function(match){
        var status = '';
        status = match.result == 'win' ? "W" : "L";
        if(match.result === 'excluded')
            status = 'EX';
        return status;
    }

    $scope.openDetailsModal = function() {
        $scope.modalInstance = $uibModal.open({
            templateUrl: 'app/players/views/player_details_modal.html',
            scope: $scope,
            size: 'lg'
        });

        $scope.postParams = {name: $scope.player.name}
        $scope.playerRegionCheckbox = {}
        $scope.isSuperAdmin = $scope.sessionService.isSuperAdmin();

        $scope.sessionService.getAdminRegions().forEach(
            function(regionId){
                if ($scope.isPlayerInRegion(regionId)) {
                    $scope.playerRegionCheckbox[regionId] = "IN_REGION";
                } else if (!$scope.isPlayerInRegion(regionId)) {
                    $scope.playerRegionCheckbox[regionId] = "NOT_IN_REGION";
                } 
            }
        );

        $scope.getRemainingRegions = function() {
            retRegions = []
            adminRegions = $scope.sessionService.getAdminRegions();
            $scope.regionService.regions.forEach(
                function(region) {
                    if (!adminRegions.includes(region.id)) {
                        retRegions.push(region);
                    }
                }
            )
            return retRegions;
        }
        
        $scope.disableButtons = false;
        $scope.errorMessage = false;
    };

    $scope.closeDetailsModal = function() {
        $scope.modalInstance.close()
    };

    $scope.updatePlayerDetails = function() {
        url = hostname + $routeParams.region + '/players/' + $scope.playerId;
        $scope.disableButtons = true;

        playerInRegion = function(regionId){
            return $scope.playerRegionCheckbox[regionId]!=="NOT_IN_REGION";
        };

        $scope.postParams['regions'] = $scope.sessionService.getAdminRegions().filter(playerInRegion);

        successCallback = function(data) {
            $scope.player = data;
            $scope.closeDetailsModal();
        };

        failureCallback = function(data) {
            $scope.disableButtons = false;
            $scope.errorMessage = true;
        };

        $scope.sessionService.authenticatedPut(url, $scope.postParams, successCallback, failureCallback);

        return;
    };

    $scope.isPlayerInRegion = function(regionId) {
        return $scope.player.regions.indexOf(regionId) > -1
    };

    $scope.submitMerge = function() {
        if ($scope.mergePlayer.id === undefined) {
            alert("You must select a player to merge");
            return;
        }
        url = hostname + $routeParams.region + '/merges';
        params = {"source_player_id": $scope.playerId, "target_player_id": $scope.mergePlayer.id};

        successCallback = function(data) {
            alert("These two accounts have been merged.");
            window.location.reload();
        };

        failureCallback = function(data) {
            alert("Your merge didn't go through. Please check that both players are in the region you administrate and try again later.");
        };
        $scope.sessionService.authenticatedPut(url, params,
            successCallback,
            failureCallback);
    };

    $scope.notCurrentPlayer = function(player) {
      return player.id != $scope.playerId;
    };

    $scope.showFormulasFcn = function(){
        if($scope.showFormulas)
            $scope.showFormulas = false
        else
            $scope.showFormulas = true
    };

    $http.get(hostname + $routeParams.region + '/players/' + $routeParams.playerId).
        success(function(data) {
            $scope.player = data;
            if($scope.player.merged){
                $http.get(hostname + $routeParams.region + '/players/' + $scope.player.merge_parent).
                    success(function(data) {
                        $scope.mergeParent = data;
                    });
            }
        });

    $http.get(hostname + $routeParams.region + '/matches/' + $routeParams.playerId).
        success(function(data) {
            $scope.matches = data.matches.reverse();
            $scope.numQualifying = data.num_qualifying;
            $scope.totalItems = $scope.matches.length;
        });

});
