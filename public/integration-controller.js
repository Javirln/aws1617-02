angular.module("ResearcherListApp").controller("IntCtrl", function($scope, $http, $location) {

    $scope.universities = [];
    $scope.projects = [];
    $scope.groups = [];
    $scope.selectedProject = null;
    $scope.selectedGroup = null;
    $scope.researchers = [];

    $scope.loadUniversities = function() {
        console.log("Loading universities");
        $scope.universities = [];

        $http.get("https://aws1617-04.herokuapp.com/api/v1/universities", {}).then(function(response) {
            $scope.universities = response.data;
        });
    };

    $scope.loadResearchGroups = function() {
        $scope.groups = [];
        $scope.selectedGroup = null;
        $scope.researchers = [];
        var university_acronym = $scope.university.acronym;
        $http.get("https://aws1617-03.herokuapp.com/api/v1/groups?fields=university&values=" + university_acronym, {
            headers: {
                'Authorization': 'Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsImtpZCI6IlEwUkJNemt5T1RWQlEwWTFNVFZDUlRjelJUZ3hRMFF4TkVSRVFqWkdOemcyTVVNMk0wWTFSUSJ9.eyJpc3MiOiJodHRwczovL2Rhbmk4YXJ0LmV1LmF1dGgwLmNvbS8iLCJzdWIiOiJnb29nbGUtb2F1dGgyfDExMDY5NDc2Mzg0ODg5OTg3MTY2NyIsImF1ZCI6IkVSQnR5eHNpNUpUQ09UWGU3dHFweHpIVWZaV0VLTktUIiwiZXhwIjoxNDk1NDgzOTcxLCJpYXQiOjE0OTU0NDc5NzEsIm5vbmNlIjoiTlkzQ2tHbjBpTWVLWUt5SlNnWU1US1YzakF3RW53TGoiLCJhdF9oYXNoIjoiaktpMDlpa3NFbk5HWjhWVDlQVkg0QSJ9.U9Ewe6gMs79CVe72g_h3HmraLVHJ3cnzbsK2zgKL9l2jG2h70Eu2tJfSTNBs_5M1qEumH-Eo8BNqnSV_ZTsDq2EfWgyUqRqRP0uShXcIOK7CJ_Nfu7HnDzwWDVjRjqV4da-y2EvdajTJ0kQm2elFb1CkqHOs0Ei82PY967xALWkehESsmWri_gRHbkM0z2RJCi1hNwtY6k8SmybdK7N1WoltbD4Zp2PshanQNqcjmBUvE0cqKTco7ZEV1Hj-l8ZyAVuoF4ENW7eJZzPDpnZc99cNIlhcD6iFAyfZqm_YlvLkTB9Bd1i2-W70vp8teEI_F-Q1mvrLp9OHTo2REhb0EA'
            }
        }).then(function(response) {
            $scope.groups = response.data;
            if ($scope.groups.length == 0)
                alert("There are no groups for that university!");
        });
    };
/*
    $scope.loadResearchProjects = function() {
        var university = $scope.university.id;
        console.log("Loading projects for university " + university);
        $scope.projects = [];
        $scope.selectedProject = null;
        $scope.researchers = [];
        $("#modal-header").empty();
        $("#modal-body").empty();
        $("#modal-papers").empty();

        $http.get("https://aws1617-01.herokuapp.com/api/v1/projectsbyuniversity/" + university, {}).then(function(response) {
            $scope.projects = response.data;
            for (var i = 0; i < $scope.projects.length; i++) {
                $scope.projects[i].id = parseInt($scope.projects[i].id);
            }
        }, function errorCallback(response) {
            console.log("No projects for that university");
            alert("There are no projects for that university!");
        });
    };
*/

    $scope.showResearchersGroup = function(group) {
        $scope.researchers = [];
        $scope.selectedGroup = group;
        console.log(group);
        $http.get("/api/v1/researchers?group=" + $scope.selectedGroup._id, {
            headers: {
                'Authorization': 'Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpYXQiOjE0OTI3NjYyMjQsImV4cCI6MTQ5Mzk3NTgyNH0.WExNusVFHUcM6LKCwp3cz2SudqM1-CWF3DCZZIPNF-E '
            }
        }).then(function(response) {
            $scope.researchers = response.data;
        });
    };

    $scope.loadPapers = function(orcid) {
        console.log("Invoking https://aws1617-02.herokuapp.com/api/v1/researchers/" + orcid);
        $.ajax({
            type: 'GET',
            url: 'https://aws1617-02.herokuapp.com/api/v1/researchers/' + orcid,
            headers: {
                'Authorization': 'Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpYXQiOjE0OTI3NjYyMjQsImV4cCI6MTQ5Mzk3NTgyNH0.WExNusVFHUcM6LKCwp3cz2SudqM1-CWF3DCZZIPNF-E '
            },
            success: function(data, textStatus, request) {
                $("#modal-header").html("<b>Researcher</b> | " + data[0].name);
                $("#modal-body").html("<b>ORCID:</b> " + data[0].orcid + "<br><b>Name:</b> " + data[0].name + "<br><b>Phone:</b> " + data[0].phone + "<br><b>Email: </b><a href=\"mailto:" + data[0].email + "\">" + data[0].email + "</a><br><b>Address:</b> " + data[0].address + "<br><b>Gender: </b>" + data[0].gender + "<br>");
                $("#myModal").modal();
            }
        });

        // ONLY WORKS IN US NETWORK
        /*$http.get(
            "https://api.elsevier.com/content/search/author?query=orcid(" + orcid + ")&apiKey=c3fc66dd92e97d5b54e49a58e001bdb1"
        ).then(function(response) {
            var auid = response.data["search-results"].entry[0]["dc:identifier"];
            auid = auid.substring(10, auid.length);
            $http.get(
                "https://api.elsevier.com/content/search/scopus?query=au-id(" + auid + ")&apiKey=c3fc66dd92e97d5b54e49a58e001bdb1"
            ).then(function(response) {
                var papers = "<ul>";
                for (var i = 0; i < response.data["search-results"].entry.length; i++) {
                    var entry = response.data["search-results"].entry[i];
                    papers += "<li><b><a href=https://www.scopus.com/inward/record.uri?partnerID=HzOxMe3b&scp=\"" + entry["eid"].substring(7, entry["eid"].length) + "\">" + entry["dc:title"] + "</a></b><ul><li>" + entry["prism:publicationName"] + "</li><li>Cited by " + entry["citedby-count"] + "</li></ul></li>";
                    if (i == 5)
                        break;
                }
                $("#modal-papers").html(papers + "</ul>");
            });
        });*/
    }

    $scope.loadUniversities();

});
