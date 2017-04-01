angular.module("ResearcherListApp").controller("TokenCtrl", function($scope, $http) {


    $scope.createToken = function() {
        console.log("Create token for DNI " + $scope.newToken.dni);

        $http.post("/api/v1/tokens", $scope.newToken).then(function() {
            //Success
            $http.post("/api/v1/tokens/authenticate", $scope.newToken).then(function(response) {
                //Success
                $scope.tokenGenerated = response.data.token;
                $scope.tokenResult = "alert alert-success";
                $scope.result = "Nice!";
                $scope.tokenGenerated = "Your token is: " + response.data.token;
                console.log("Your token is: " + response.data.token);
            }, function(response) {
                $scope.tokenResult = "alert alert-danger";
                $scope.result = "Ups!";
                $scope.tokenGenerated = "It looks like we have some problems, please try again.";
                console.log("Error: " + response.data.msg);
            });
        }, function(response) {
            $http.post("/api/v1/tokens/authenticate", $scope.newToken).then(function(response) {
                $scope.tokenResult = "alert alert-danger";
                $scope.result = "Ups!";
                $scope.tokenGenerated = "It looks like that DNI is already used. Please try again or use this token: " + response.data.token;
                console.log("Error: " + response.data.msg);
            }, function(response) {
                $scope.tokenResult = "alert alert-danger";
                $scope.result = "Ups!";
                $scope.tokenGenerated = "It looks like we have some problems, please try again.";
                console.log("Error: " + response.data.msg);
            });
        });
    };

    $scope.deleteToken = function() {
        if (confirm("Are you sure!?")) {
            console.log("Deleting token for DNI " + $scope.existingToken.dni);
            $http.delete("/api/v1/tokens/" + $scope.existingToken.dni).then(function() {
                $scope.tokendeleteResult = "alert alert-success";
                $scope.resultdelete = "Its okay!";
                $scope.tokendeleteGenerated = "Your token has been deleted";
            }, function(response) {
                console.log("Error: " + response.data.msg);
                $scope.tokendeleteResult = "alert alert-danger";
                $scope.resultdelete = "Ups!";
                $scope.tokendeleteGenerated = "We don't have tokens associated to that DNI.";
            });
        }
    };

});
