(function () {
    'use strict';

    angular.module('NarrowItDownApp', [])
        .controller('NarrowItDownController', NarrowItDownController)
        .service('MenuSearchService', MenuSearchService)
        .constant('ApiBasePath', "http://davids-restaurant.herokuapp.com")
        .directive('foundItems', FoundItemsDirective);

    NarrowItDownController.$inject = ['MenuSearchService'];
    function NarrowItDownController(MenuSearchService) {
        var list = this;

        list.searchTerm = '';

        list.getMatchedMenuItems = function () {
            if (list.searchTerm === "") {
                list.items = [];
                return;
            }

            var promise = MenuSearchService.getMatchedMenuItems(list.searchTerm);

            promise.then(function (response) {
                list.items = response;
            })
                .catch(function (error) {
                    console.log("Something went wrong", error);
                });
        };

        list.removeItem = function(index) {
            list.items.splice(index, 1);
        };
    }

    MenuSearchService.$inject = ['$http', 'ApiBasePath'];
    function MenuSearchService($http, ApiBasePath) {
        var service = this;

        service.getMatchedMenuItems = function (searchTerm) {
            return $http({
                method: "GET",
                url: (ApiBasePath + "/menu_items.json")
            }).then(function (result) {
                var foundItems = [];
                var result_array = result.data['menu_items'];

                for (var i = 0; i < result_array.length; i++) {
                    if (result_array[i].description.toLowerCase().indexOf(searchTerm.toLowerCase()) == 0) {
                        foundItems.push(result_array[i]);
                    }
                }
                return foundItems;
            });
        }
    }

    function FoundItemsDirective() {
        var ddo = {
            templateUrl: 'foundItems.html',
            scope: {
                found: '<',
                onRemove: '&'
            },
            controller: NarrowItDownDirectiveController,
            controllerAs: 'list',
            bindToController: true
        };

        return ddo;
    }

    function NarrowItDownDirectiveController() {
        var list = this;

        list.isEmpty = function() {
            return list.found != undefined && list.found.length === 0;
        }
        
        list.isNotEmpty = function () {
            return list.found != undefined && list.found.length != 0;
        }
    }
})();
