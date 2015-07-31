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




country_app.controller('ctr_controller',['$scope', '$http', '$location', '$interpolate', 'current_ctr',
  function($scope, $http, $location, $interpolate, current_ctr){

    $scope.error_message = '';

    var url = 'http://api.geonames.org/countryInfo';
       
    var request = {
            username: 'lala99',
            type: 'JSON'
    };

    $http({url:url, params:request, method: 'GET'})
    .success(success)
    .error(error);

    function success(data, status, headers, config){

      $scope.countries = data.geonames;
    }

    function error(data, status, headers, config){
      $scope.error_message = 'There some errors when dealing with your request.\n Please try again later.';
    }

    $scope.ctr_click = function(country){

      //var path = $interpolate('/countries/{{code}}')({code:country.countryCode});
      //console.log(path);

      current_ctr.countryCode = country.countryCode;
      current_ctr.countryName = country.countryName;
      current_ctr.population = country.population;
      current_ctr.area = country.areaInSqKm;
      current_ctr.capital = country.capital;
      current_ctr.continent = country.continent;
      //current_ctr.timezone = country.timezone;

      var path = '/countries/'+country.countryCode;
      $location.path(path);
    };

  }
  ]);

country_app.controller('ctr_detail_controller',['$scope', '$http', 'current_ctr', 'geo_request',
  function($scope, $http, current_ctr, geo_request){


    //console.log(current_ctr);

    // initialize some values
    $scope.countryCode = current_ctr.countryCode;
    $scope.countryName = current_ctr.countryName;
    $scope.population = current_ctr.population;
    $scope.area = current_ctr.area;
    $scope.capital = current_ctr.capital;
    $scope.continent = current_ctr.continent;

    //console.log($scope.countryName);


    // search capital population

    var url = 'http://api.geonames.org/search';
       
    var request = {
            username: 'lala99',
            type: 'JSON',
            q: $scope.capital,
            country: $scope.countryCode,
            isNameRequired: true,
            name_equals: $scope.capital
    };

    geo_request(url, request).then(
      function(data){
          //console.log(data);

          if(data.geonames.length > 1) {
              $scope.cap_result = data.geonames[0];
          }
          else{
              $scope.cap_result = data.geonames;
          }

      //console.log($scope.cap_result);

      });


    //search neighbor

    var url2 = 'http://api.geonames.org/neighboursJSON';
       
    var request2 = {
            username: 'lala99',
            country: $scope.countryCode
    };

    geo_request(url2, request2).then(
      function(data){
          //console.log(data);
          $scope.ngb_results = data.geonames;
      });


  }
  ]);