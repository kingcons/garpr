angular.module('app.players').service('PlayerService', function($http) {
    var service = {
        playerList: null,
        allPlayerList: null,
        getPlayerIdFromName: function (name) {
            for (i = 0; i < this.playerList.players.length; i++) {
                p = this.playerList.players[i]
                if (p.name == name) {
                    return p.id;
                }
            }
            return null;
        },
        addTypeaheadDisplayText: function(player){
            player.typeahead = player.name.toLowerCase();
            try{ 
                var minSig = 100;
                var mainRegion = "";
                player.regions.forEach(function(region)
                {
                    if(player.ratings[region] !== undefined && player.ratings[region].sigma < minSig)
                    {
                        minSig = player.ratings[region].sigma;
                        mainRegion = region;
                    }
                });
                if(mainRegion != "")
                    player.typeahead = player.name.toString() + ' ~ ' + mainRegion;
                else
                    player.typeahead = player.name.toString() + ' ~ ' + player.regions[0].toString();
            } catch(err){
                /* FAIL GRACEFULLY */
            }
        },
        getPlayerListFromQuery: function(query, filter_fn) {
            url = hostname + defaultRegion + '/players';
            params = {
                params: {
                    query: query
                }
            }

            var _parent = this;

            return $http.get(url, params).then(function(response) {
                players = response.data.players;
                if (filter_fn !== undefined) {
                    players = players.filter(filter_fn);
                }
                players.forEach(function(player) {
                    _parent.addTypeaheadDisplayText(player);
                });
                return players;
            });
        }
    };
    return service;
});
