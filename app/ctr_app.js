var country_app = angular.module('country_app', ['ngRoute']);

country_app.value('current_ctr', {
  countryName: '',
  population: '',
  area: '',
  capital: '',
  cap_population: '',
  continent: '',
  timezone: ''
});

country_app.config(['$routeProvider',
  function($routeProvider){
  $routeProvider.when('/', {
    templateUrl: './home.html'
  })
  .when('/home', {
    templateUrl: './home.html'
  })
  .when('/countries', {
    templateUrl: './countries.html',
    controller: 'ctr_controller'
  })
  .when('/countries/:country', {
    templateUrl: './country.html',
    controller: 'ctr_detail_controller',
    
    /*
    resolve:{
      country: ['$route', function($route){
        console.log($route.current.params.city);
        return $route.current.params.city;
      }]
    
    }
    */
    
  })
  .when('/error', {
    template: '<p>Error  Page Not Found</p>'
  })
  .otherwise({
    redirectTo:'/error'
  });
}]);

country_app.run(function($rootScope, $location, $timeout) {


        $rootScope.$on('$routeChangeError', function() {
            $location.path("/error");
        });
        $rootScope.$on('$routeChangeStart', function() {
            $rootScope.isLoading = true;
        });
        $rootScope.$on('$routeChangeSuccess', function() {
          $timeout(function() {
            $rootScope.isLoading = false;
          }, 1000);
        });

});

country_app.factory('geo_request', ['$http','$q',
    function($http,$q){ 
    return function (path, req_params){

      var defer = $q.defer();
      $http({url:path, params:req_params, method: 'GET'})
        .success(function(data) {
          defer.resolve(data);
        })
      return defer.promise;
    };
  }
]);


