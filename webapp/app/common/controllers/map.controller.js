angular.module('app.common').controller("MapController", 
	function($scope, $routeParams, $uibModal, $q, RegionService, SessionService) {
		$scope.regionService = RegionService;
		$scope.sessionService = SessionService;

		$scope.setupMap = function($element){
			$scope.activeRegions = $scope.regionService.macroRegionsPromise
			.success(function(data){
				$scope.states = {};
				$scope.activeRegion = null;
				$scope.mapElement = null;
				$scope.map = null;

				$scope.macroRegions = data.macro_regions;
				$scope.activeStates = $scope.macroRegions.map(m => { return m.state_code; });
				$scope.activeStates.forEach(function(e){
					$scope.states[e]  = {};
					$scope.states[e].fill = "lightblue";
				});

				$scope.mapElement = $('#map');

				$scope.map = $scope.mapElement.usmap({
					'stateStyles': {
				      fill: 'grey', 
				      "stroke-width": 1,
				      'stroke' : 'black'
				    },
				    'stateSpecificStyles': $scope.states,
				    'stateSpecificHoverStyles': {
				      'HI' : {fill: '#ff0'}
				    },
				    
				    'mouseoverState': {
				      'HI' : function(event, data) {
				        //return false;
				      }
				    },
				    
				    'click' : function(event, data) {
				    	if($scope.activeStates.indexOf(data.name) >= 0){
				    		$scope.activeRegion = null;
				    		$scope.macroRegions.forEach(r => {
				    			if(r.state_code == data.name)
				    				$scope.activeRegion = r;
				    		})

				    		if(!$scope.activeRegion)
				    			throw new Error('region does not match an active macro region');
				    		else if($scope.activeRegion.subregions.length == 1){
				    			var url = '/#/' + $scope.activeRegion.subregions[0].id + '/rankings';
				    			window.location.href = url;
				    		}

					    };
					}
				})
			})
			.error(function(err){
				console.error(err);
			})
		}

		$scope.activeRegions = $scope.regionService.macroRegionsPromise
			.success(function(data){
				$scope.activeStates = data.macro_regions.map(m => { return m.state_code; });
				$scope.activeStatesColors = $scope.activeStates.map(function(e){
					var state = {};
					state[e]  = {};
					state[e].fill = "lightblue";
					return state
				});

				$scope.clickHandler = function(){

				}
				/*
				var mapE = document.getElementById('map');
				var map = mapE.usmap({
					'stateStyles': {
				      fill: 'grey', 
				      "stroke-width": 1,
				      'stroke' : 'black'
				    },
				    'stateSpecificStyles': states,
				    'stateSpecificHoverStyles': {
				      'HI' : {fill: '#ff0'}
				    },
				    
				    'mouseoverState': {
				      'HI' : function(event, data) {
				        //return false;
				      }
				    },
				    
				    'click' : function(event, data) {
				    	if(activeStates.indexOf(data.name) >= 0){
					    	console.log(data);
					    	window.location.href="/#/"+ data.name;
					    }
				      $('#alert')
				        .text('Click '+data.name+' on map 1')
				        .stop()
				        .css('backgroundColor', '#ff0')
				        .animate({backgroundColor: '#ddd'}, 1000);
				    }
				  });
				  */

			})
			.error(function(err){
				console.error(err);
			})
	}
)	
 