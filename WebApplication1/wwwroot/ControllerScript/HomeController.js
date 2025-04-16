//const { json } = require("d3-fetch");
var app = angular.module('Homeapp', []);
app.controller('HomeController', function ($scope, $http, signalRService, SessionService, $timeout) {

    localStorage.setItem('URLIndex', '/Home/');
    localStorage.setItem('URLIndexAdmin', '/Admin/');

    //const notiSound = new Audio('/admin_assets/sound/notification.wav');
    //localStorage.setItem('Search', "done");

    $http.get(localStorage.getItem('URLIndex') + 'getserviceList').then(function (response) {
        $scope.getserviceList = response.data;

        // Delay Selectize init to wait for ng-repeat rendering
        $timeout(function () {
            $('#Search_ID')[0].selectize && $('#Search_ID')[0].selectize.destroy(); // Destroy old instance if re-initializing
            $('#Search_ID').selectize({
                placeholder: 'Select your Service',
                allowEmptyOption: true
            });
        }, 0);
    }, function (error) {
        alert("Error: " + error.statusText);
    });

    $http.get(localStorage.getItem('URLIndex') + 'GetTrackPostRequests').then(function (i) {
        $scope.GetTrackPostRequests = i.data;
    },
        function (error) {
            alert(error);
            $scope.GetTrackPostRequests = error;
        });
    $http.get(localStorage.getItem('URLIndex') + 'GetServicePost').then(function (i) {
        $scope.GetServicePost = i.data;
    },
        function (error) {
            alert(error);
            $scope.GetServicePost = error;
        });
    $http.get(localStorage.getItem('URLIndex') + 'GetSessionData').then(function (response) {
        $scope.sessionuserID = response.data.userId;  // Assign session value to AngularJS scope
        $scope.sessionisonline = response.data.isonline;
        $scope.sessionisonline = ($scope.sessionisonline === 'True');
    })
        .catch(function (error) {
            console.error("Error fetching session data:", error);
        });

    //UserDetail
    $scope.UserDetail = function (ID) {
        var User_ID = ID;
        $.ajax({
            url: localStorage.getItem('URLIndex') + 'GetPostDetail',
            type: 'GET',
            data: { id: User_ID },
            success: function (response) {
                debugger
                if (response.redirectTo) {
                    window.location.href = response.redirectTo;
                } else if (response === "DataBaseError") {
                    alert("Database Connectivity Error. Please check the application database connection.");
                } else if (response === "NetworkError") {
                    alert("Internet Connectivity Error. Please check your Internet connection.");
                } else if (response === "ExceptionError") {
                    alert("An unexpected error occurred. Please check the error log.");
                } else {
                    $scope.$applyAsync(() => {
                        $scope.GetPostDetailList = response;
                        $("#exampleModalToggle2").modal('show');
                    });
                }
            },
            error: function (xhr, status, error) {
                console.error("AJAX Error:", status, error);
                alert("Something went wrong while fetching data.");
            }
        });
    };
    $scope.OpenBookingModal = function (id, userID, title) {
        debugger
        localStorage.setItem('serviceid', id);
        localStorage.setItem('serviceproviderid', userID);
        localStorage.setItem('title', title);

        $("#BookingModal").modal('show');
    }
    $scope.RequestBooking = function () {
        debugger
        var AddressID = $("#AddressID").val();
        var Date_of_Booking = $("#Date_of_Booking").val();
        if (!AddressID) {
            $("#AddressID").css({ "border-color": "#fb7c72", "border-width": "2px", "border-style": "solid" });
            alert("Address is mandatory");
            return;
        }
        else if (!Date_of_Booking) {
            $("#Date_of_Booking").css({ "border-color": "#fb7c72", "border-width": "2px", "border-style": "solid" });
            alert("Date is mandatory");
            return;
        }
        else {
            var serviceid = localStorage.getItem("serviceid");
            var serviceproviderid = localStorage.getItem("serviceproviderid");
            var title = localStorage.getItem("title");

            var data = new FormData;
            data.append("ServiceID", serviceid);
            data.append("userID", serviceproviderid );
            data.append("title", title);
            data.append("address", AddressID);
            data.append("dateofbooking", Date_of_Booking);
            $.ajax({
                type: "Post",
                url: localStorage.getItem('URLIndex') + 'BookingRequest',
                data: data,
                contentType: false,
                processData: false,
                success: function (result) {
                    debugger
                    if (result == "Saved") {
                        $("#AddressID").get(0).value = "";
                        $("#Date_of_Booking").get(0).value = "";
                        Swal.fire({
                            title: "Congrats!",
                            text: "Requset send successfully, Please wait for responce",
                            icon: "success"
                        });
                        $("#exampleModalToggle2").modal('hide');
                        $("#BookingModal").modal('hide');
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
                    else if(result.redirectTo) {
                        window.location.href = result.redirectTo;
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

    $scope.cancelRequest = function(){
        debugger
        $scope.listdata = $scope.SearchServiceList
        var data = {
            SearchServiceListcancle: $scope.listdata // Pass the list as a parameter
        };
        $.ajax({
            type: "Post",
            url: localStorage.getItem('URLIndex') + 'cancelRequest',
            data: JSON.stringify(data), // Convert data to JSON string
            contentType: "application/json" , // Set content type
            processData: false,
            success: function (result) {
                debugger
                if (result == "Saved") {
                    $("#exampleModalToggle").modal('hide');
                }
                else if (result == "DataBaseError") {
                    $("#exampleModalToggle").modal('hide');
                    showWithTitleMessage("<strong>Database Connectivity Error</strong>, Please check  application database connection...");
                }
                else if (result == "NetworkError") {
                    $("#exampleModalToggle").modal('hide');
                    showWithTitleMessage("<strong>Internet Connectivity Error</strong>, Please check the Internet connection...");
                }
                else if (result == "ExceptionError") {
                    $("#exampleModalToggle").modal('hide');
                    showWithTitleMessage("<strong>Exception Error</strong>, Please Check the Error Log...");
                }
                else {
                    $("#exampleModalToggle").modal('hide');
                    console.log(result);
                }
            },
            error: function (xhr, status, error) {
                var errorMessage = xhr.status + ': ' + xhr.statusText
                alert('Error - ' + errorMessage);
            }
        })
    }


    window.onPick = function (value) {
        Swal.fire("Thanks for your rating!", `You rated us ${value}/3`, "success");
    };
    function showCancelMessage(msg) {
        Swal.fire({
            title: "Are you sure?",
            text: msg,
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes "
        }).then((result) => {
            if (result.isConfirmed) {
                var data = {
                    ID: localStorage.getItem("resquestID") ,
                    userID: localStorage.getItem("providerID"),
                };
                $.ajax({
                    type: "Post",
                    url: localStorage.getItem('URLIndex') + 'CompleteService',
                    data: JSON.stringify(data), // Convert data to JSON string
                    contentType: "application/json", // Set content type
                    processData: false,
                    success: function (result) {
                        debugger
                        if (result == "Saved") {
                            $("#AcceptModel").modal('hide');
                            signalRService.sendMessage(localStorage.getItem("providerID"), "Name", "message", "Completed");
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
                Swal.fire({
                    title: "How was your experience?",
                    html: `
                        <button class="mood-btn" onclick="onPick('1')">😔</button>
                        <button class="mood-btn" onclick="onPick('2')">😐</button>
                        <button class="mood-btn" onclick="onPick('3')">😊</button>
                    `,
                    showCancelButton: true,
                    cancelButtonText: "Close",
                    showConfirmButton: false
                });
            }
        });
      
    } 


    // Listen for messages
    signalRService.onReceiveMessage(function (userId, user_name, message, type) {
        if (type === "Request") {
            $http.get(localStorage.getItem('URLIndexAdmin') + 'GetRequestList').then(function (i) {
                debugger
                $scope.GetRequestList = i.data;
            },
                function (error) {
                    alert(error);
                    $scope.GetRequestList = error;
                });
        }
        else if (type === "Offer") {
            $http.get(localStorage.getItem('URLIndex') + 'GetOfferList').then(function (response) {
                let offerList = response.data;

                // Loop through each offer and create a toast dynamically
                offerList.forEach(offer => {
                    let toastId = "toast-" + new Date().getTime(); // Unique ID for each toast

                    // Append toast to container
                    $(".toast-container").append(`
                    <div id="${toastId}" class="toast fade" role="alert" aria-live="assertive" aria-atomic="true" data-bs-autohide="true" data-bs-delay="10000">
                        <div class="toast-header">
                            <img src="..." class="rounded me-2" alt="...">
                            <strong class="me-auto">${offer.name}</strong>
                            <small class="text-body-secondary">just now</small>
                            <button type="button" class="btn-close" data-bs-dismiss="toast" aria-label="Close"></button>
                        </div>
                        <div class="toast-body">
                            Hi, I do this in <storng>${offer.offerprice} PKR</storng>
                            <div class="mt-2 pt-2 border-top">
                              <button type="button" class="btn btn-secondary btn-sm" data-bs-dismiss="toast">Close</button>
                              <button type="button" class="btn btn-success btn-sm" onclick="acceptofferFun('${offer.id}', '${offer.userID}', '${offer.latitude}', '${offer.longitude}')">Accept</button>
                            </div>
                        </div>
                    </div>
                    `);
                    //<button type="button" class="btn btn-success btn-sm onclick="acceptofferFun(${offer.id},${offer.userID},${offer.latitude},${offer.longitude})">Accept</button>

                    // Show the newly added toast
                    setTimeout(() => {
                        $("#" + toastId).toast("show");
                    }, 100);
                });

            }, function (error) {
                console.error(error);
            });
        }
        else if (type === "message" && userId == $scope.sessionuserID) {
            showCancelMessage(message);
        }
        else {
            console.log("Undefined type: " + type);
        }
    });

    // 🔥 Send message via SignalR
    $scope.sendMessage = function () {
        if ($scope.message.trim() !== "") {
            signalRService.sendMessage($scope.user, $scope.user, $scope.message, "message");
            $scope.message = "";
        }
    };

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
        const time = distance / avgSpeed * 60; // Time in minutes

        //return `${distance.toFixed(2)} km, ${Math.round(time)} min`;
        return { distance: distance.toFixed(2), time: Math.round(time) };
    }
    //console.log(getDistanceAndTime(userMarker.getLatLng().lat, userMarker.getLatLng().lng, provider.latitude, provider.longitude));

    $scope.getLocation = function () {
        var Search_ID = $("#Search_ID").val().trim();
        debugger
        if (!Search_ID) {
            $("#Search_ID").css({ "border-color": "#fb7c72", "border-width": "2px", "border-style": "solid" });
            alert("Option is mandatory");
            return;
        } else {
            $("#Search_ID").css({ "border-color": "", "border-width": "", "border-style": "" });
        }
        $.ajax({
            url: localStorage.getItem('URLIndex') + 'SearchService',
            type: 'GET',
            data: { id: Search_ID },
            success: function (response) {
                debugger
                if (response.redirectTo) {
                    window.location.href = response.redirectTo;
                } else if (response === "DataBaseError") {
                    alert("Database Connectivity Error. Please check the application database connection.");
                } else if (response === "NetworkError") {
                    alert("Internet Connectivity Error. Please check your Internet connection.");
                } else if (response === "ExceptionError") {
                    alert("An unexpected error occurred. Please check the error log.");
                } else {
                    $scope.SearchServiceList = response;
                    $("#exampleModalToggle").modal('show');

                    $("#exampleModalToggle").on('shown.bs.modal', function () {
                        if (map) {
                            map.invalidateSize();
                        }
                    });
                    if (navigator.geolocation) {
                        navigator.geolocation.getCurrentPosition(showPosition, showError);
                    } else {
                        alert("Geolocation is not supported by this browser.");
                    }
                }
            },
            error: function (xhr, status, error) {
                console.error("AJAX Error:", status, error);
                alert("Something went wrong while fetching data.");
            }
        });
    };

    var map = L.map('map').setView([0, 0], 5); // Default View

    // Add Map Layer
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap contributors'
    }).addTo(map);

    var userMarker, routingControl;
    function showPosition(position) {
        var lat = position.coords.latitude;
        var lng = position.coords.longitude;

        map.setView([lat, lng], 13);
        userMarker = L.marker([lat, lng]).addTo(map).bindPopup("You are here!").openPopup();
        SendRequest();
    }

    // **🚀 Start Tracking Live Location**
    $scope.startTracking = function () {
        if (navigator.geolocation) {
            navigator.geolocation.watchPosition(updatePosition, showError, {
                enableHighAccuracy: true,
                maximumAge: 0
            });
        } else {
            alert("Geolocation is not supported.");
        }
    }
    function updatePosition(position) {
        var userLat = position.coords.latitude;
        var userLng = position.coords.longitude;

        if (!userMarker) {
            userMarker = L.marker([userLat, userLng]).addTo(map).bindPopup("<b>You</b>");
        } else {
            userMarker.setLatLng([userLat, userLng]);
        }

        map.setView([userLat, userLng], 13);
    }

    // Function to Handle Errors
    function showError(error) {
        switch (error.code) {
            case error.PERMISSION_DENIED:
                alert("User denied the request for Geolocation.");
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

    function SendRequest() {
        debugger
        var userlat = userMarker.getLatLng().lat;
        var userlng = userMarker.getLatLng().lng;
        var data = {
            lat: userlat,
            lng: userlng,
            searchServiceList: $scope.SearchServiceList // Pass the list as a parameter
        };
        $.ajax({
            type: "Post",
            url: localStorage.getItem('URLIndex') + 'SetRequest',
            data: JSON.stringify(data), // Convert data to JSON string
            contentType: "application/json", // Set content type
            processData: false,
            success: function (result) {
                debugger
                if (result == "Saved")
                {
                    $scope.$applyAsync(() => {
                        $scope.SearchServiceList.forEach(function (provider) {
                            L.marker([provider.latitude, provider.longitude])
                                .addTo(map)
                                .bindPopup(`<b>${provider.name}</b><br><p class="p-0 m-0">${provider.serviceName}</p><br>
                                    <button class="offer" onclick="selectMechanic(${provider.latitude}, ${provider.longitude})">Offer</button>`);
                        });

                        // Update distance and time
                        $scope.SearchServiceList.forEach((c) => {
                            const result = getDistanceAndTime(userMarker.getLatLng().lat, userMarker.getLatLng().lng, c.latitude, c.longitude);
                            c.distance = result.distance;
                            c.time = result.time;
                        });

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
                else if (result == "") {
                    
                }
                else
                {
                    console.log(result);
                }
            },
            error: function (xhr, status, error) {
                var errorMessage = xhr.status + ': ' + xhr.statusText
                alert('Error - ' + errorMessage);
            }
        })
    }


    // Add Map Layer
    var mapd = L.map('mapd').setView([0, 0], 13); // Default View
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap contributors'
    }).addTo(mapd);
    // **🛣️ Function to Show Directions**
    //window.selectMechanic = function (mechLat, mechLng) {
    //    debugger
    //    $("#exampleModalToggle3").modal('show');
    //    $("#exampleModalToggle3").on('shown.bs.modal', function () {
    //        if (mapd) {
    //            mapd.invalidateSize();
    //        }
    //    });

    //    if (routingControl) mapd.removeControl(routingControl);
    //    routingControl = L.Routing.control({
    //        waypoints: [
    //            L.latLng(userMarker.getLatLng().lat, userMarker.getLatLng().lng), // Current User
    //            L.latLng(mechLat, mechLng) // Selected Mechanic
    //        ],
    //        routeWhileDragging: true
    //    }).addTo(mapd);
    //}

    window.acceptofferFun = function (resquestID, uID, mechLat, mechLng) {
        localStorage.setItem('resquestID', resquestID);
        localStorage.setItem('providerID', uID);
        debugger
        var data = {
            ID: resquestID,
            userID: uID,
        };
        $.ajax({
            type: "Post",
            url: localStorage.getItem('URLIndex') + 'AcceptOffer',
            data: JSON.stringify(data), // Convert data to JSON string
            contentType: "application/json", // Set content type
            processData: false,
            success: function (result) {
                debugger
                if (result == "Saved") {
                    $("#AcceptModel").modal('show');
                    $("#exampleModalToggle").modal('hide');
                    
                    $("#AcceptModel").on('shown.bs.modal', function () {
                        if (mapd) {
                            mapd.invalidateSize();
                        }
                    });

                    if (routingControl) mapd.removeControl(routingControl);
                    routingControl = L.Routing.control({
                        waypoints: [
                            L.latLng(userMarker.getLatLng().lat, userMarker.getLatLng().lng), // Current User
                            L.latLng(mechLat, mechLng) // Selected Mechanic
                        ],
                        routeWhileDragging: true
                    }).addTo(mapd);
                    mapd.setView([mechLat, mechLng], 13);
                
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
                    alert(result);
                }
            },
            error: function (xhr, status, error) {
                var errorMessage = xhr.status + ': ' + xhr.statusText
                alert('Error - ' + errorMessage);
            }
        })
    }

});