// public/js/controllers/RegCtrl.js
var myApp = angular.module('RegCtrl', []);

myApp.controller('RegController', ['$scope', '$http', '$location', '$routeParams', function($scope, $http, $location, $routeParams) {
	console.log('Regestration Controller loaded......');

	$scope.addUser = function() {
		$http.post('/api/users/', $scope.user).then(function(response) {
			window.location.href='/'
		});
	}

}]);