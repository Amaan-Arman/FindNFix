var app = angular.module('Homeapp', []);
app.controller('HistoryController', function ($scope, $http) {

    localStorage.setItem('URLIndex', '/Admin/')
    $http.get(localStorage.getItem('URLIndex') + 'GetEarning').then(function (i) {
        debugger
        $scope.GetEarning = i.data;
    },
        function (error) {
            alert(error);
            $scope.GetEarning = error;
        });

    $http.get(localStorage.getItem('URLIndex') + 'GethistoryList').then(function (i) {
        $scope.GethistoryList = i.data;
    },
    function (error) {
        alert(error);
        $scope.GethistoryList = error;
    });
  
    $http.get(localStorage.getItem('URLIndex') + 'Getuserlist').then(function (i) {
        $scope.Getuserlist = i.data;
    },
    function (error) {
        alert(error);
        $scope.Getuserlist = error;
        });
    $http.get(localStorage.getItem('URLIndex') + 'Getuserlistactive').then(function (i) {
        $scope.Getuserlistactive = i.data;
    },
        function (error) {
            alert(error);
            $scope.Getuserlistactive = error;
        });

    $scope.UserActive = function (ID,status) {
        debugger
        Swal.fire({
            title: "Are you sure?",
            text: "Do want to "+ status + " this User",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes "
        }).then((result) => {
            if (result.isConfirmed) {
                var data = {
                    ID: ID,
                    Status: status,
                };
                $.ajax({
                    type: "Post",
                    url: localStorage.getItem('URLIndex') + 'UserActive',
                    data: JSON.stringify(data), // Convert data to JSON string
                    contentType: "application/json", // Set content type
                    processData: false,
                    success: function (result) {
                        debugger
                        if (result == "Saved") {
                            Swal.fire({
                                title: "Deleted!",
                                text: "User has been activated.",
                                icon: "success"
                            });
                            $http.get(localStorage.getItem('URLIndex') + 'Getuserlist').then(function (i) {
                                $scope.Getuserlist = i.data;
                            },
                            function (error) {
                                alert(error);
                                $scope.Getuserlist = error;
                                });
                            $http.get(localStorage.getItem('URLIndex') + 'Getuserlistactive').then(function (i) {
                                $scope.Getuserlistactive = i.data;
                            },
                                function (error) {
                                    alert(error);
                                    $scope.Getuserlistactive = error;
                                });
                        }
                        else if (result == "DataBaseError") {
                            showWithTitleMessage("<strong>Database Connectivity Error</strong>, Please check  application database connection...");
                        }
                        else if (result == "NetworkError") {
                            showWithTitleMessage("<strong>Internet Connectivity Error</strong>, Please check the Internet connection...");
                        }
                        else if (result == "ExceptionError") {
                            showWithTitleMessage("<strong>Exception Error</strong>, Please Check the Error Log...");
                        }
                        else {
                            showWithTitleMessage(result);
                        }
                    },
                    error: function (xhr, status, error) {
                        var errorMessage = xhr.status + ': ' + xhr.statusText
                        alert('Error - ' + errorMessage);
                    }
                })
            }
        });
    } 

});