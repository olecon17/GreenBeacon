//initialize app module, include services and auth dependencies

angular.module('app', ['app.auth', 'app.queue', 'app.services', 'ngRoute', 'ngSanitize'])

.config(function($routeProvider){

	$routeProvider
		.when('/signin', {
			templateUrl: 'app/auth/signin.html',
			controller: 'AuthController'
		})
		.when('/tickets', {
			templateUrl: 'app/queue/queue.html',
			 controller: 'QueueController'
		})
		.otherwise({
			redirectTo: '/tickets'
		});

});
