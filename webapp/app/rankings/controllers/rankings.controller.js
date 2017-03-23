angular.module('app.rankings').controller("RankingsController", function($scope, $http, $routeParams, $modal, RegionService, RankingsService, SessionService) {
    RegionService.setRegion($routeParams.region);
    $scope.regionService = RegionService;
    $scope.rankingsService = RankingsService
    $scope.sessionService = SessionService

    $scope.modalInstance = null;
    $scope.disableButtons = false;

    $scope.rankingNumDaysBack = 0;
    $scope.rankingsNumTourneysAttended = 0;
    $scope.tourneyNumDaysBack = 999;

    $scope.tiers = [];
    $scope.tierlistView = false;

    $scope.prompt = function() {
        $scope.modalInstance = $modal.open({
            templateUrl: 'app/rankings/views/generate_rankings_prompt_modal.html',
            scope: $scope,
            size: 'lg'
        });
    };

    $scope.confirm = function() {
        $scope.disableButtons = true;
        var url = hostname + $routeParams.region + '/rankings';
        successCallback = function(data) {
            $scope.rankingsService.rankingsList = data;
            $scope.modalInstance.close();
        };

        var postParams = {
            ranking_num_tourneys_attended: $scope.rankingsNumTourneysAttended,
            ranking_activity_day_limit: $scope.rankingNumDaysBack,
            tournament_qualified_day_limit: $scope.tourneyNumDaysBack
        }

        $scope.sessionService.authenticatedPost(url, postParams, successCallback, angular.noop);
    };

    $scope.cancel = function() {
        $scope.modalInstance.close();
    };

    $scope.getRegionRankingCriteria = function(){
        var url = hostname + $routeParams.region + '/rankings';
        $http.get(url)
        .then(
        (res) => {
            $scope.rankingNumDaysBack = res.data.ranking_criteria.ranking_activity_day_limit;
            $scope.rankingsNumTourneysAttended = res.data.ranking_criteria.ranking_num_tourneys_attended;
            $scope.tourneyNumDaysBack = res.data.ranking_criteria.tournament_qualified_day_limit;

        },
        (err) => {
            alert('There was an error getting the Ranking Criteria for the region')
        });

    }

    $scope.saveRegionRankingsCriteria = function(){
        var url = hostname + $routeParams.region + '/rankings';
        var putParams = {
            ranking_num_tourneys_attended: $scope.rankingsNumTourneysAttended,
            ranking_activity_day_limit: $scope.rankingNumDaysBack,
            tournament_qualified_day_limit: $scope.tourneyNumDaysBack
        }

        $scope.sessionService.authenticatedPut(url, putParams,
        (res) => {
            alert('Successfully updated Region: ' + $routeParams.region + ' Ranking Criteria.');
        },
        (err) => {
            alert('There was an error updating the Region Ranking Criteria. Please try again.');
        });
    };

    $scope.insertNewRankingTier = function(){
        var url = hostname + $routeParams.region + '/rankings/tierlist';
        var putParams = {
            'tier_name': $scope.newTier.name,
            'tier_color': $scope.newTier.newColor,
            'tier_upper_rank': $scope.newTier.newUpperRank,
            'tier_lower_rank': $scope.newTier.newLowerRank,
            'tier_upper_skill': $scope.newTier.newUpperSkill,
            'tier_lower_skill': $scope.newTier.newLowerSkill
        }

        $http.put(url, putParams)
            .then(function(data){
                // TODO Add tier to the dropdown

                // TODO Apply tier color to the ranking list

            },
            function(err){
                // TODO error handle
            })
    }

    $scope.updateRankingTier = function(tier){
        var url = hostname + $routeParams.region + '/rankings/tierlist';
        var postParams = {
            'tier_name': $scope.newTier.name,
            'new_name': $scope.newTier.newName,
            'new_color': $scope.newTier.newColor,
            'new_upper_rank': $scope.newTier.newUpperRank,
            'new_lower_rank': $scope.newTier.newLowerRank,
            'new_upper_skill': $scope.newTier.newUpperSkill,
            'new_lower_skill': $scope.newTier.newLowerSkill
        }

        $http.post(url, postParams)
            .then(function(data){
                // TODO update tier info in the dropdown

                // TODO apply any changes to the ranking list
            },
            function(err){
                // TODO error handle
            })

    }

    $scope.deleteRankingTier = function(tierName){
        var url = hostname + $routeParams.region + '/rankings/tierlist/' + tierName;
        $http.delete(url)
            .then(function(data){
                // TODO delete tier fromthe dropdown

                // TODO apply changes to the ranking list
            },
            function(err){
                // TODO error handle
            })
    }

    function applyTiersToRankings(){
        if($scope.tierlistView){
            $scope.tiers.forEach(function(tier){

            })
        }
        else{

        }
    }

    var rankingCriteria = $scope.getRegionRankingCriteria()
});