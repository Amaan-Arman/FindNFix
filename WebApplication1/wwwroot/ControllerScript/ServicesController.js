var app = angular.module('Homeapp', []);
app.controller('ServicesController', function ($scope, $http, signalRService) {

    localStorage.setItem('URLIndexHome', '/Home/')
    localStorage.setItem('URLIndex', '/Admin/')
    $http.get(localStorage.getItem('URLIndex') + 'GetserviceList').then(function (i) {
        $scope.GetserviceList = i.data;
    },
    function (error) {
        alert(error);
        $scope.GetserviceList = error;
    });
    $http.get(localStorage.getItem('URLIndex') + 'GetAcceptPost').then(function (i) {
        $scope.GetAcceptPost = i.data;
    },
        function (error) {
            alert(error);
            $scope.GetAcceptPost = error;
        });
    $http.get(localStorage.getItem('URLIndex') + 'GetPostRequests').then(function (i) {
        $scope.GetPostRequests = i.data;
    },
        function (error) {
            alert(error);
            $scope.GetPostRequests = error;
        });

    $http.get(localStorage.getItem('URLIndex') + 'GetServicePostadmin').then(function (i) {
        $scope.GetServicePostadmin = i.data;
    },
        function (error) {
            alert(error);
            $scope.GetServicePostadmin = error;
        });


    $scope.showDeleteMessage = function (ID) {
        debugger
        Swal.fire({
            title: "Are you sure?",
            text: "Do want to delete this post",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes "
        }).then((result) => {
            if (result.isConfirmed) {
                var data = {
                    ID: ID,
                };
                $.ajax({
                    type: "Post",
                    url: localStorage.getItem('URLIndex') + 'DeletePost',
                    data: JSON.stringify(data), // Convert data to JSON string
                    contentType: "application/json", // Set content type
                    processData: false,
                    success: function (result) {
                        debugger
                        if (result == "Saved") {
                            Swal.fire({
                                title: "Deleted!",
                                text: "Your Post file has been deleted.",
                                icon: "success"
                            });
                            $http.get(localStorage.getItem('URLIndex') + 'GetServicePostadmin').then(function (i) {
                                $scope.GetServicePostadmin = i.data;
                            },
                                function (error) {
                                    alert(error);
                                    $scope.GetServicePostadmin = error;
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
            } else {
                Swal.fire({
                    title: "Cancelled!",
                    text: "Your Post file is safe.",
                    icon: "error"
                });
            }
        });

    } 


    $scope.SaveService = function () {
        debugger
        var ServiceID_id = $("#ServiceID_id").val();
        if (!ServiceID_id) {
            $("#ServiceID_id").css({ "border-color": "#fb7c72", "border-width": "2px", "border-style": "solid" });
            return;
        }
        else {
            var data = new FormData;
            var ServiceID_Name = $("#ServiceID_id").find("option:selected").text();
            data.append("ServiceID", ServiceID_id);
            data.append("ServiceName", ServiceID_Name);
            $.ajax({
                type: "Post",
                url: localStorage.getItem('URLIndex') + 'SaveService',
                data: data,
                contentType: false,
                processData: false,
                success: function (result) {
                    debugger
                    if (result == "Saved") {
                        $("#ServiceID_id").get(0).value = "";
                        $http.get(localStorage.getItem('URLIndex') + 'GetserviceList').then(function (i) {
                            $scope.GetserviceList = i.data;
                        },
                            function (error) {
                                alert(error);
                                $scope.GetserviceList = error;
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
    }

    $scope.PostService = function () {
        debugger
        var title_id = $("#title_id").val();
        var description_id = $("#description_id").val();
        var price_id = $("#price_id").val();
        var featured_id = $("#featured_id").get(0).files;
        var fileExtension = ['jpeg', 'jpg', 'png'];
        if (!title_id) {
            $("#title_id").css({ "border-color": "#fb7c72", "border-width": "2px", "border-style": "solid" });
            alert("title is mandatory");
            return;
        }
        else if (!description_id) {
            $("#description_id").css({ "border-color": "#fb7c72", "border-width": "2px", "border-style": "solid" });
            alert("description is mandatory");
            return;
        }
        else if (!price_id) {
            $("#price_id").css({ "border-color": "#fb7c72", "border-width": "2px", "border-style": "solid" });
            alert("price is mandatory");
            return;
        }
        else if (featured_id.length == 0) {
            $("#attachment_errormessage").html("Please upload Image!");
            return;
        }
        else if ($.inArray($("#featured_id").val().split('.').pop().toLowerCase(), fileExtension) == -1) {
            $("#attachment_errormessage").html("Invalid format!");
            return;
        }
        else {
            var data = new FormData;
            data.append("title", title_id);
            data.append("description", description_id);
            data.append("CustomPrice", price_id);
            data.append("featuredImage", featured_id[0]);

         $.ajax({
            type: "Post",
            url: localStorage.getItem('URLIndex') + 'PostService',
            data: data,
            contentType: false,
            processData: false,
            success: function (result) {
                debugger
                if (result == "Saved") {
                    $("#title_id").get(0).value = "";
                    $("#description_id").get(0).value = "";
                    $("#price_id").get(0).value = "";
                    $("#featured_id").get(0).value = "";

                    $http.get(localStorage.getItem('URLIndex') + 'GetServicePostadmin').then(function (i) {
                        $scope.GetServicePostadmin = i.data;
                    },
                    function (error) {
                        alert(error);
                        $scope.GetServicePostadmin = error;
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
    }

    $scope.Updatebooking = function (booking_ID, user_id, status) {

        var data = {
            bookingID: booking_ID,
            userID: user_id,
            Status: status
        };
        $.ajax({
            type: "Post",
            url: localStorage.getItem('URLIndex') + 'updatebooking',
            data: JSON.stringify(data), // Convert data to JSON string
            contentType: "application/json", // Set content type
            processData: false,
            success: function (result) {
                debugger
                if (result == "Saved") {
                    $http.get(localStorage.getItem('URLIndex') + 'GetPostRequests').then(function (i) {
                        $scope.GetPostRequests = i.data;
                    },
                        function (error) {
                            alert(error);
                            $scope.GetPostRequests = error;
                        });
                    $http.get(localStorage.getItem('URLIndex') + 'GetAcceptPost').then(function (i) {
                        $scope.GetAcceptPost = i.data;
                    },
                        function (error) {
                            alert(error);
                            $scope.GetAcceptPost = error;
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

    $http.get(localStorage.getItem('URLIndexHome') + 'GetSessionData').then(function (response) {
        $scope.sessionuserID = response.data.userId;  // Assign session value to AngularJS scope
        $scope.sessionisonline = response.data.isonline;
        $scope.sessionisonline = ($scope.sessionisonline === 'True');
    })
        .catch(function (error) {
            console.error("Error fetching session data:", error);
        });
    signalRService.onReceiveMessage(function (userId, user_name, message, type) {
        debugger
        if (type === "Request" && userId == $scope.sessionuserID) {
            $http.get(localStorage.getItem('URLIndex') + 'GetRequestList').then(function (i) {
                debugger
                $scope.GetRequestList = i.data;
            },
                function (error) {
                    alert(error);
                    $scope.GetRequestList = error;
                });
            $http.get(localStorage.getItem('URLIndex') + 'GetPostRequests').then(function (i) {
                $scope.GetPostRequests = i.data;
            },
                function (error) {
                    alert(error);
                    $scope.GetPostRequests = error;
                });

        }
        else if (type === "Accept" && userId == $scope.sessionuserID) {
            $scope.offerblock = true;
            $scope.acceptblock = false;
            showMessage("Your Offer is Accepted..!");

            if (navigator.geolocation) {
                navigator.geolocation.watchPosition(updatePosition, showError, {
                    enableHighAccuracy: true,
                    maximumAge: 0
                });
            } else {
                alert("Geolocation is not supported.");
            }
            function updatePosition(position) {
                var userLat = position.coords.latitude;
                var userLng = position.coords.longitude;

                if (!ourMarker) {
                    ourMarker = L.marker([userLat, userLng]).addTo(mapa).bindPopup("<b>You</b>");
                } else {
                    ourMarker.setLatLng([userLat, userLng]);
                }
                mapa.setView([userLat, userLng], 13);
            }

        } else if (type === "Completed" && userId == $scope.sessionuserID) {
            $http.get(localStorage.getItem('URLIndex') + 'GetRequestList').then(function (i) {
                $scope.GetRequestList = i.data;
            },
                function (error) {
                    alert(error);
                    $scope.GetRequestList = error;
                });
            $("#adminmodal").modal('hide');
            Swal.fire({
                title: "Congrats!",
                text: "Service completed successfully.",
                icon: "success"
            });
        }
        else {
            console.log("Undefined type:" + type);
        }
    });


});
