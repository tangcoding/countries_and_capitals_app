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