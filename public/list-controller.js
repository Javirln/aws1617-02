angular.module("ResearcherListApp").controller("ListCtrl", function($scope, $http, $location, $q) {

    var socket = io();

    $scope.universities = [];
    $scope.groups = [];
    $scope.projects = [];
    $scope.researcher = {
        projects: []
    };

    socket.on('connect', function() {
        console.log("Connected to socket: " + socket.id);
    });

    function updateResearchList() {
        $http.get("/api/v1/researchers", {
            headers: {
                'Authorization': 'Bearer ' + $scope.token
            }
        }).then(function(response) {
            $scope.researchers = response.data;
        });
    }

    function refresh() {
        if ($location.search().access_token == undefined) {
            console.log("Using default token");
            $('#login-provider').show();
            $('#logout-provider').hide();
            $scope.titleLogin = "Log in"
            $scope.token = "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpYXQiOjE0OTI3NjYyMjQsImV4cCI6MTQ5Mzk3NTgyNH0.WExNusVFHUcM6LKCwp3cz2SudqM1-CWF3DCZZIPNF-E ";
            $scope.messageLogin = "Right now you are using the default token (" + $scope.token + "). Click on some of this providers to log in with them.";
        }
        else {
            console.log("Using non-default token");
            $scope.titleLogin = "Logged!";
            $scope.token = $location.search().access_token;
            $scope.messageLogin = "Right now you are using a token provided by Google or Facebook: " + $scope.token;
            $('#login-provider').hide();
            $('#logout-provider').show();
        }
        console.log("Refreshing");
        $scope.actionTitle = "Add researcher";
        $scope.action = "Add";
        $scope.buttonClass = "btn btn-primary";
        $scope.researcher.projects = [];
        //$scope.universities = [];
        $scope.projects = [];
        $scope.groups = [];
        $scope.searchResult = null;
        $scope.searchError = null;
        $scope.updateCreateResult = null;
        $scope.updateCreateError = null;

        $http.get("/api/v1/researchers", {
            headers: {
                'Authorization': 'Bearer ' + $scope.token
            }
        }).then(function(response) {
            $scope.researchers = response.data;
            $scope.disabledSearch = true;
            $scope.addResearcherForm.$setPristine();
            $scope.newResearcher = {};
            $scope.orcidFilter = null;
        });

        //$scope.loadUniversities();
    }

    $scope.loadUniversities = function() {
        console.log("Loading universities");
        $scope.universities = [];

        $http.get("https://aws1617-04.herokuapp.com/api/v1/universities", {}).then(function(response) {
            $scope.universities = response.data;
        });
    };

    $scope.loadResearchGroups = function() {
        var university = $scope.newResearcher.university.acronym;
        console.log("Loading groups for university " + university);
        $scope.groups = [];

        return $http.get("https://aws1617-03.herokuapp.com/api/v1/groups?fields=university&values=" + university, {
            headers: {
                'Authorization': 'Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsImtpZCI6IlEwUkJNemt5T1RWQlEwWTFNVFZDUlRjelJUZ3hRMFF4TkVSRVFqWkdOemcyTVVNMk0wWTFSUSJ9.eyJpc3MiOiJodHRwczovL2Rhbmk4YXJ0LmV1LmF1dGgwLmNvbS8iLCJzdWIiOiJnb29nbGUtb2F1dGgyfDExMDY5NDc2Mzg0ODg5OTg3MTY2NyIsImF1ZCI6IkVSQnR5eHNpNUpUQ09UWGU3dHFweHpIVWZaV0VLTktUIiwiZXhwIjoxNDk1NDgzOTcxLCJpYXQiOjE0OTU0NDc5NzEsIm5vbmNlIjoiTlkzQ2tHbjBpTWVLWUt5SlNnWU1US1YzakF3RW53TGoiLCJhdF9oYXNoIjoiaktpMDlpa3NFbk5HWjhWVDlQVkg0QSJ9.U9Ewe6gMs79CVe72g_h3HmraLVHJ3cnzbsK2zgKL9l2jG2h70Eu2tJfSTNBs_5M1qEumH-Eo8BNqnSV_ZTsDq2EfWgyUqRqRP0uShXcIOK7CJ_Nfu7HnDzwWDVjRjqV4da-y2EvdajTJ0kQm2elFb1CkqHOs0Ei82PY967xALWkehESsmWri_gRHbkM0z2RJCi1hNwtY6k8SmybdK7N1WoltbD4Zp2PshanQNqcjmBUvE0cqKTco7ZEV1Hj-l8ZyAVuoF4ENW7eJZzPDpnZc99cNIlhcD6iFAyfZqm_YlvLkTB9Bd1i2-W70vp8teEI_F-Q1mvrLp9OHTo2REhb0EA'
            }
        }).then(function(response) {
            $scope.groups = response.data;
        });
    };

    $scope.loadResearchProjects = function() {
        var group = $scope.newResearcher.group._id;
        console.log("Loading projects for group " + group);
        $scope.projects = [];

        $http.get("https://aws1617-01.herokuapp.com/api/v1/projectsbygroup/" + group, {}).then(function(response) {
            $scope.projects = response.data;
            for (var i = 0; i < $scope.projects.length; i++) {
                $scope.projects[i].id = parseInt($scope.projects[i].id);
            }
        });
    };

    $scope.submitForm = function() {
        $scope.newResearcher.university = $scope.newResearcher.university.acronym;
        $scope.newResearcher.group = $scope.newResearcher.group._id;
        $scope.newResearcher.projects = $scope.researcher.projects;
        if ($scope.actionTitle == "Add researcher") {
            console.log("Adding researcher " + $scope.newResearcher.name);
            $http.post("/api/v1/researchers", $scope.newResearcher, {
                headers: {
                    'Authorization': 'Bearer ' + $scope.token
                }
            }).then(function() {
                socket.emit('nr', 'ok');
                refresh();
            }, function(response) {
                refresh();
                $scope.updateCreateResult = "alert alert-danger";
                $scope.updateCreateError = response.data.msg;
            });
        }
        else if ($scope.actionTitle == "Update researcher") {
            console.log("Updating researcher " + $scope.researcherToUpdate.name);
            $http.put("/api/v1/researchers/" + $scope.researcherToUpdate.orcid, $scope.newResearcher, {
                headers: {
                    'Authorization': 'Bearer ' + $scope.token
                }
            }).then(function() {
                socket.emit('nr', 'ok');
                refresh();
            }, function(response) {
                refresh();
                $scope.updateCreateResult = "alert alert-danger";
                $scope.updateCreateError = response.data.msg;
            });
        }
    };

    $scope.addResearcher = function() {
        console.log("Adding researcher " + $scope.newResearcher.name);
        $http.post("/api/v1/researchers", $scope.newResearcher, {
            headers: {
                'Authorization': 'Bearer ' + $scope.token
            }
        }).then(function() {
            socket.emit('nr', 'ok');
            refresh();
        });

    };

    $scope.deleteResearcher = function(idx) {
        if (confirm("Are you sure!?")) {
            console.log("Deleting researcher " + $scope.researchers[idx].name);
            $http.delete("/api/v1/researchers/" + $scope.researchers[idx].orcid, {
                headers: {
                    'Authorization': 'Bearer ' + $scope.token
                }
            }).then(function() {
                socket.emit('nr', 'ok');
                refresh();
            }, function(response) {
                refresh();
                $scope.updateCreateResult = "alert alert-danger";
                $scope.updateCreateError = response.data.msg;
            });
        }
    };

    $scope.preUpdateResearcher = function(idx) {
        console.log("Pre-updating researcher " + $scope.researchers[idx].name);
        $scope.actionTitle = "Update researcher";
        $scope.action = "Update";
        $scope.buttonClass = "btn btn-warning";
        $scope.updateCreateResult = null;
        $scope.updateCreateError = null;
        $scope.researcherToUpdate = $scope.researchers[idx];
        $scope.newResearcher.orcid = $scope.researcherToUpdate.orcid;
        $scope.newResearcher.name = $scope.researcherToUpdate.name;
        $scope.newResearcher.phone = parseInt($scope.researcherToUpdate.phone);
        $scope.newResearcher.email = $scope.researcherToUpdate.email;
        $scope.newResearcher.address = $scope.researcherToUpdate.address;

        var index = $scope.universities.findIndex(function(item, i) {
            return item.acronym === $scope.researcherToUpdate.university;
        });
        $scope.newResearcher.university = $scope.universities[index];
        $q.all([$scope.loadResearchGroups()]).then(function(ret) {
            index = $scope.groups.findIndex(function(item, i) {
                return item._id === $scope.researcherToUpdate.group;
            });
            $scope.newResearcher.group = $scope.groups[index];
            $scope.loadResearchProjects();

            $scope.researcher.projects = $scope.researcherToUpdate.projects;
            $scope.newResearcher.gender = $scope.researcherToUpdate.gender;
        });

    };

    $scope.searchResearcher = function() {
        console.log("Get researcher " + $scope.orcidFilter);
        $http.get("/api/v1/researchers/" + $scope.orcidFilter, {
            headers: {
                'Authorization': 'Bearer ' + $scope.token
            }
        }).then(function(response) {
            $scope.researchers = response.data;
            $scope.addResearcherForm.$setPristine();
            $scope.newResearcher = {};
        }, function(response) {
            $scope.searchResult = "alert alert-danger";
            $scope.searchError = response.data.msg;
            console.log("Unauthorized!");
        });
    };

    $scope.deleteAll = function() {
        if (confirm("Are you sure!?")) {
            console.log("Deleting all");
            $http.delete("/api/v1/researchers/", {
                headers: {
                    'Authorization': 'Bearer ' + $scope.token
                }
            }).then(function() {
                refresh();
            });
        }

    };

    $scope.refresh = function() {
        refresh();
    };

    socket.on('newResearcher', function(data) {
        updateResearchList();
    });
    
    $scope.loadUniversities();
    refresh();
});
