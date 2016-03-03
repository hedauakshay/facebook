//var app = angular.module('fb_reg', ['ngMessages']);
	//console.log("reched here");

var app = angular.module('fb_s_login', []);
//defining the login controller
app.controller('login', function($scope,$http, $window) {
	console.log("reched here");
	$scope.data = {
			status: $scope.status
	};
	$scope.submit = function(){
		$http({
			method : 'POST',
			url : '/status',
			data : $scope.status
		}).success(function(response){
			$window.location.assign('/afterSignIn');
		}).Error(function(error){
			console.log(error);
		});
	};
});