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

    /** OPTIONAL TIER LIST VIEW **/
    $scope.tiers = [];
    $scope.newTiers = [];
    $scope.newTierForms = [];
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

    $scope.insertNewRankingTier = function(newTier){
        var url = hostname + $routeParams.region + '/rankings/tierlist';
        var putParams = {
            'tier_name': newTier.name,
            'tier_color': newTier.new_color,
            'tier_upper_rank': newTier.new_upper_rank,
            'tier_lower_rank': newTier.new_lower_rank,
            'tier_upper_skill': newTier.new_upper_skill,
            'tier_lower_skill': newTier.new_lower_skill
        }

        $http.put(url, putParams)
            .then(function(data){
                // TODO Add tier to the $scope.tiers list

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
            'new_name': $scope.newTier.new_name,
            'new_color': $scope.newTier.new_color,
            'new_upper_rank': $scope.newTier.new_upper_rank,
            'new_lower_rank': $scope.newTier.new_lower_rank,
            'new_upper_skill': $scope.newTier.new_upper_skill,
            'new_lower_skill': $scope.newTier.new_lower_skill
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

    $scope.applyTiersToRankings = function(){
        $scope.tierlistView = !$scope.tierlistView;

        if($scope.tierlistView){
            $scope.tiers.forEach(function(tier){

            })

        }
        else{

        }
    }

    $scope.addNewTierForm = function(){

    }

    var rankingCriteria = $scope.getRegionRankingCriteria()
});