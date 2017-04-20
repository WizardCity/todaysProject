// public/js/controllers/MainCtrl.js
myApp = angular.module('MainCtrl', []);

myApp.controller('MainController', ['$scope', '$http', '$sce', '$location', '$routeParams', function($scope, $http, $sce, $location, $routeParams) {

	$scope.getHomePage = function() {
		$http.get('/api/news').then(function(response) {
			$scope.news = response.data.map(function (srcUrl) {
	        srcUrl.video_url = $sce.trustAsResourceUrl(srcUrl.video_url);
	        return srcUrl;

	      });
		});
	}
	
}]);