angular.module("ResearcherListApp").controller("ListCtrl", function($scope, $http) {

    var socket = io.connect("https://researcher-api-test.herokuapp.com");

    function refresh() {
        console.log("Refreshing");
        $scope.actionTitle = "Add researcher";
        $scope.action = "Add";
        $scope.buttonClass = "btn btn-primary";
        $http.get("/api/v1/researchers").then(function(response) {
            $scope.researchers = response.data;
            $scope.addResearcherForm.$setPristine();
            $scope.newResearcher = {};
            $scope.dniFilter = null;
        });
    }

    $scope.submitForm = function() {
        if ($scope.actionTitle == "Add researcher") {
            console.log("Adding researcher " + $scope.newResearcher.name);
            $http.post("/api/v1/researchers", $scope.newResearcher).then(function() {
                socket.emit('newResearchers', {
                    "nr": "nr"
                });
            });
        }
        else if ($scope.actionTitle == "Update researcher") {
            console.log("Updating researcher " + $scope.researcherToUpdate.name);
            $http.put("/api/v1/researchers/" + $scope.researcherToUpdate.dni, $scope.newResearcher).then(function() {
                refresh();
            });
        }
    };

    $scope.addResearcher = function() {
        console.log("Adding researcher " + $scope.newResearcher.name);
        $http.post("/api/v1/researchers", $scope.newResearcher).then(function() {
            socket.broadcast.emit('newResearchers', {
                "nr": "nr"
            });
        });

    };

    $scope.deleteResearcher = function(idx) {
        console.log("Deleting researcher " + $scope.researchers[idx].name);
        $http.delete("/api/v1/researchers/" + $scope.researchers[idx].dni).then(function() {
            refresh();
        });

    };

    $scope.preUpdateResearcher = function(idx) {
        console.log("Pre-updating researcher " + $scope.researchers[idx].name);
        $scope.actionTitle = "Update researcher";
        $scope.action = "Update";
        $scope.buttonClass = "btn btn-warning";
        $scope.researcherToUpdate = $scope.researchers[idx];
        $scope.newResearcher.dni = $scope.researcherToUpdate.dni;
        $scope.newResearcher.name = $scope.researcherToUpdate.name;
        $scope.newResearcher.phone = parseInt($scope.researcherToUpdate.phone);
        $scope.newResearcher.email = $scope.researcherToUpdate.email;
        $scope.newResearcher.address = $scope.researcherToUpdate.address;
        $scope.newResearcher.gender = $scope.researcherToUpdate.gender;

    };

    $scope.searchResearcher = function() {
        console.log("Get researcher " + $scope.dniFilter);
        $http.get("/api/v1/researchers/" + $scope.dniFilter).then(function(response) {
            $scope.researchers = response.data;
            $scope.addResearcherForm.$setPristine();
            $scope.newResearcher = {};
        });
    };

    $scope.deleteAll = function() {
        if (confirm("Are you sure!?")) {
            console.log("Deleting all");
            $http.delete("/api/v1/researchers/").then(function() {
                refresh();
            });
        }

    };

    $scope.refresh = function() {
        refresh();
    };

    socket.on('newResearchers', function(data) {
        console.log(data);

        refresh();

    });
    
    socket.on('testing', function(data) {
        alert(data);
    });

    refresh();
});
