var app = angular.module('Homeapp', []);
app.controller('SettingController', function ($scope, $http) {

    localStorage.setItem('URLIndex', '/Admin/')
    $http.get(localStorage.getItem('URLIndex') + 'Getprofile').then(function (i) {
        $scope.Getprofile = i.data;
    },
        function (error) {
            alert(error);
            $scope.Getprofile = error;
        });

});