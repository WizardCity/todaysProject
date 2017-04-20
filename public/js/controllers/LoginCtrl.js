// public/js/controllers/LoginCtrl.js
var myApp = angular.module('LoginCtrl', []);

myApp.controller('LoginController', ['$scope', '$http', '$location', '$routeParams', function($scope, $http, $location, $routeParams) {

	$scope.LoginUser = function() {
		$http.post('/api/users/authenticate', $scope.user).then(function(response) {
			if (response.data.success === true) {
				console.log('Login Success');
				$location.path('/');
			} else {
				console.log('Login Failed');
				$location.path('/register');
			}
		});
	}

}]);