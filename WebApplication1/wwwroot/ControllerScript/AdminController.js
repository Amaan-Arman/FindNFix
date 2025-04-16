var app = angular.module('Homeapp', []);
app.controller('AdminController', function ($scope, $http, signalRService) {

    localStorage.setItem('URLIndex', '/Admin/')
    localStorage.setItem('URLIndexHome', '/Home/')
    $scope.offerblock = false; 
    $scope.acceptblock = true;




    // Add Map Layer
    var mapa = L.map('mapa').setView([0, 0], 5); // Default View
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap contributors'
    }).addTo(mapa);
    var ourMarker, routingControl;

    $http.get(localStorage.getItem('URLIndexHome') + 'GetSessionData').then(function (response) {
        $scope.sessionuserID = response.data.userId;  // Assign session value to AngularJS scope
        $scope.sessionisonline = response.data.isonline;
        $scope.sessionisonline = ($scope.sessionisonline === 'True');
    })
    .catch(function (error) {
        console.error("Error fetching session data:", error);
    });


    $http.get(localStorage.getItem('URLIndex') + 'GetRequestList').then(function (i) {
        $scope.GetRequestList = i.data;
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(function (position) {
                let latitude = position.coords.latitude;
                let longitude = position.coords.longitude;
                $scope.GetRequestList.forEach((c) => {
                    const result = getDistanceAndTime(latitude, longitude, c.latitude, c.longitude);
                    c.distance = result.distance;
                    c.caltime = result.caltime;
                });
                //console.log("Latitude: " + latitude + ", Longitude: " + longitude);
            }, function (error) {
                console.error("Error getting location: ", error.message);
            });
        } else {
            console.log("Geolocation is not supported by this browser.");
        }
       
    },
    function (error) {
        alert(error);
        $scope.GetRequestList = error;
        });

  
    function getDistanceAndTime(lat1, lon1, lat2, lon2) {
        const R = 6371; // Radius of the Earth in km
        const toRadians = (degree) => degree * (Math.PI / 180);

        const dLat = toRadians(lat2 - lat1);
        const dLon = toRadians(lon2 - lon1);

        const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(toRadians(lat1)) * Math.cos(toRadians(lat2)) *
            Math.sin(dLon / 2) * Math.sin(dLon / 2);

        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

        const distance = R * c; // Distance in km

        const avgSpeed = 20; // Assume 20 km/h for bike or car
        const caltime = distance / avgSpeed * 60; // Time in minutes

        //return `${distance.toFixed(2)} km, ${Math.round(time)} min`;
        return { distance: distance.toFixed(2), caltime: Math.round(caltime) };
    }

    // Listen for messages
    signalRService.onReceiveMessage(function (userId, user_name, message, type) {
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

        } else if (type === "Completed" && userId == $scope.sessionuserID ) {
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

    // 🔥 Send message via SignalR
    $scope.sendMessage = function () {
        if ($scope.message.trim() !== "") {
            signalRService.sendMessage($scope.user, $scope.user, $scope.message, "message");
            $scope.message = "";
        }
    };

    $scope.setOffer = function (ID, userID, lat, lng) {
        localStorage.setItem('ReqID', ID);
        localStorage.setItem('userID', userID);
        localStorage.setItem('lat', lat);
        localStorage.setItem('lng', lng);

        $("#adminmodal").modal('show');
        $("#adminmodal").on('shown.bs.modal', function () {
            if (mapa) {
                mapa.invalidateSize();
            }
        });
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(showPosition, showError);

        } else {
            alert("Geolocation is not supported.");
        }

    };
    function showPosition(position) {
        debugger
        var lat = position.coords.latitude;
        var lng = position.coords.longitude;

        mapa.setView([lat, lng], 13);
        ourMarker = L.marker([lat, lng]).addTo(mapa).bindPopup("You are here!").openPopup();

        var userLat = localStorage.getItem('lat');
        var userLng = localStorage.getItem('lng');
        selectMechanic(userLat, userLng);

    }
    function selectMechanic(userLat, userLng) {
        debugger

        if (routingControl) mapa.removeControl(routingControl);
        routingControl = L.Routing.control({
            waypoints: [
                L.latLng(ourMarker.getLatLng().lat, ourMarker.getLatLng().lng), // Current User
                L.latLng(userLat, userLng) // Selected Mechanic
            ],
            routeWhileDragging: true
        }).addTo(mapa);
    }
    function showError(error) {
        switch (error.code) {
            case error.PERMISSION_DENIED:
                showMessage(" User denied the request for Geolocation");
                break;
            case error.POSITION_UNAVAILABLE:
                alert("Location information is unavailable.");
                break;
            case error.TIMEOUT:
                alert("The request to get user location timed out.");
                break;
            case error.UNKNOWN_ERROR:
                alert("An unknown error occurred.");
                break;
        }
    }

    $scope.Sendoffer = function () {
        debugger
        var ReqID = localStorage.getItem('ReqID');
        var userID = localStorage.getItem('userID');
        var lat = localStorage.getItem('lat');
        var lng = localStorage.getItem('lng');
        var offerPrice = $("#offerPrice").val();

        if (offerPrice == "") {
            $("#offerPrice").css({ "border-color": "#fb7c72", "border-weight": "5px", "border-style": "solid" });
            showMessage(" Question is mandatory");
        }
        else {
            var data = {
                ID: ReqID,
                userID: userID,
                Lat: lat,
                Lng: lng,
                offerPrice: offerPrice,
            };
            $.ajax({
                type: "Post",
                url: localStorage.getItem('URLIndex') + 'Offer',
                data: JSON.stringify(data), // Convert data to JSON string
                contentType: "application/json", // Set content type
                processData: false,
                success: function (result) {
                    debugger
                    if (result == "Saved")
                    {
                        showAutoCloseTimerMessage();
                    }
                    else if (result == "DataBaseError") {
                        showMessage("<strong>Database Connectivity Error</strong>, Please check  application database connection...");
                    }
                    else if (result == "NetworkError") {
                        showMessage("<strong>Internet Connectivity Error</strong>, Please check the Internet connection...");
                    }
                    else if (result == "ExceptionError") {
                        showMessage("<strong>Exception Error</strong>, Please Check the Error Log...");
                    }
                    else
                    {
                        alert(result);
                    }
                },
                error: function (xhr, status, error) {
                    var errorMessage = xhr.status + ': ' + xhr.statusText
                    alert('Error - ' + errorMessage);
                }
            })
        }
    }

    function showMessage(msg) {
        Swal.fire({
            text: msg
        });
    }
    function showAutoCloseTimerMessage() {
        Swal.fire({
            position: "center",
            icon: "success",
            //title: "Your work has been saved",
            text: "Request send successfully, Please Wait..!",
            showConfirmButton: false,
            timer: 10000
        });
    } 

    $scope.Completed = function () {
        var message = "Have they completed work ?";
        signalRService.sendMessage(localStorage.getItem('userID'), "Name", message, "message");
    }
    
 

    //online offline function
    $(function () {
        $("#statusSwitch").change(function () {
                    debugger
            if (this.checked) {
                var onlineStatus = "True";
            } else {
                var onlineStatus = "False";
            }
            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(function (position) {
                    var _lat = position.coords.latitude;
                    var _lng = position.coords.longitude;
                    var data = {
                        Status: onlineStatus,
                        Lat: _lat,
                        Lng: _lng
                    };
                    $.ajax({
                        type: "Post",
                        url: localStorage.getItem('URLIndex') + 'SetOnline',
                        data: JSON.stringify(data), // Convert data to JSON string
                        contentType: "application/json", // Set content type
                        processData: false,
                        success: function (result) {
                            if (result == "Saved") {
                                $http.get(localStorage.getItem('URLIndexHome') + 'GetSessionData').then(function (response) {
                                    $scope.sessionuserID = response.data.userId;  // Assign session value to AngularJS scope
                                    $scope.sessionisonline = response.data.isonline;
                                    $scope.sessionisonline = ($scope.sessionisonline === 'True');
                                })
                                .catch(function (error) {
                                    console.error("Error fetching session data:", error);
                                });
                            }
                            else if (result == "DataBaseError") {
                                showMessage("<strong>Database Connectivity Error</strong>, Please check  application database connection...");
                            }
                            else if (result == "NetworkError") {
                                showMessage("<strong>Internet Connectivity Error</strong>, Please check the Internet connection...");
                            }
                            else if (result == "ExceptionError") {
                                showMessage("<strong>Exception Error</strong>, Please Check the Error Log...");
                            }
                            else {
                                showMessage(result);
                            }
                        },
                        error: function (xhr, status, error) {
                            var errorMessage = xhr.status + ': ' + xhr.statusText
                            alert('Error - ' + errorMessage);
                        }
                    })
                }, function (error) {
                    console.error("Error getting location: ", error.message);
                });
            } else {
                alert("Geolocation is not supported.");
            }
          
        })
    });

});