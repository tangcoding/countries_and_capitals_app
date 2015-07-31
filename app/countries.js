country_app.controller('ctr_controller',['$scope', '$http', '$location', 'geo_request', 'current_ctr',
  function($scope, $http, $location, geo_request, current_ctr){

    var url = 'http://api.geonames.org/countryInfo';
       
    var request = {
            username: 'lala99',
            type: 'JSON'
    };

    geo_request(url, request)
    .then(
      function(data){
          //console.log(data);
          $scope.countries = data.geonames;

      });


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
