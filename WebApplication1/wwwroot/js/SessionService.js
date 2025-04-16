app.service('SessionService', function () {
    var sessionisonline = ""; 

    return {
        getSessionStatus: function () {
            return sessionisonline;
        },
        setSessionStatus: function (status) {
            sessionisonline = status;
        }
    };
});
