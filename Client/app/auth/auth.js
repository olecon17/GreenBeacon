//Signin controller
angular.module('app.auth', [])
.controller('AuthController', ['$scope', 'Auth', function ($scope, Auth) {
//Signin function attached to scope
  $scope.signin = function() {
    //Triggers signin from Auth factory
    Auth.signin();
  };
}]);
