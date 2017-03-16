angular.module("ResearcherListApp").controller("ListCtrl", function($scope, $http) {

    function refresh() {
        console.log("Refreshing");
        $scope.actionTitle = "Add researcher";
        $scope.action = "Add";
        $scope.buttonClass = "btn btn-primary";
        $http.get("/api/v1/researchers").then(function(response) {
            $scope.contacts = response.data;
            $scope.addContactForm.$setPristine();
            $scope.newContact = {};
            $scope.dniFilter = null;
        });
    }

    $scope.submitForm = function() {
        if ($scope.actionTitle == "Add researcher") {
            console.log("Adding researcher " + $scope.newContact.name);
            $http.post("/api/v1/researchers", $scope.newContact).then(function() {
                refresh();
            });
        }
        else if ($scope.actionTitle == "Update researcher") {
            console.log("Updating researcher " + $scope.contactToUpdate.name);
            $http.put("/api/v1/researchers/" + $scope.contactToUpdate.dni, $scope.newContact).then(function() {
                refresh();
            });
        }
    };

    $scope.addContact = function() {
        console.log("Adding researcher " + $scope.newContact.name);
        $http.post("/api/v1/researchers", $scope.newContact).then(function() {
            refresh();
        });

    };

    $scope.deleteContact = function(idx) {
        console.log("Deleting researcher " + $scope.contacts[idx].name);
        $http.delete("/api/v1/researchers/" + $scope.contacts[idx].dni).then(function() {
            refresh();
        });

    };

    $scope.preUpdateContact = function(idx) {
        console.log("Pre-updating researcher " + $scope.contacts[idx].name);
        $scope.actionTitle = "Update researcher";
        $scope.action = "Update";
        $scope.buttonClass = "btn btn-warning";
        $scope.contactToUpdate = $scope.contacts[idx];
        $scope.newContact.dni = $scope.contactToUpdate.dni;
        $scope.newContact.name = $scope.contactToUpdate.name;
        $scope.newContact.phone = $scope.contactToUpdate.phone;
        $scope.newContact.email = $scope.contactToUpdate.email;
        $scope.newContact.address = $scope.contactToUpdate.address;
        $scope.newContact.gender = $scope.contactToUpdate.gender;

    };

    $scope.searchContact = function() {
        console.log("Get researcher " + $scope.dniFilter);
        $http.get("/api/v1/researchers/" + $scope.dniFilter).then(function(response) {
            $scope.contacts = response.data;
            $scope.addContactForm.$setPristine();
            $scope.newContact = {};
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
    }

    refresh();

});
