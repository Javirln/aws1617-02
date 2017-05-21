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

        $("#modal-header").empty();
        $("#modal-body").empty();
        $("#modal-papers").empty();

        var university_acronym = $scope.university.acronym;

        console.log("Loading groups for university " + university_acronym);

        $http.get("https://aws1617-03.herokuapp.com/api/v1/groups?fields=university&values=" + university_acronym, {
            headers: {
                'Authorization': 'Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsImtpZCI6IlEwUkJNemt5T1RWQlEwWTFNVFZDUlRjelJUZ3hRMFF4TkVSRVFqWkdOemcyTVVNMk0wWTFSUSJ9.eyJpc3MiOiJodHRwczovL2Rhbmk4YXJ0LmV1LmF1dGgwLmNvbS8iLCJzdWIiOiJnb29nbGUtb2F1dGgyfDExMDY5NDc2Mzg0ODg5OTg3MTY2NyIsImF1ZCI6IkVSQnR5eHNpNUpUQ09UWGU3dHFweHpIVWZaV0VLTktUIiwiZXhwIjoxNDk1NDAxNzY5LCJpYXQiOjE0OTUzNjU3NjksIm5vbmNlIjoiLWZpeGJxZE1IMW0udHppNy1xLmRqQlU5VE1iUW5FMWoiLCJhdF9oYXNoIjoiSG82X2RBS2VQcW9nS1dxU2xKYy1mdyJ9.BCAMsrEZkSdzE3uC6XCKBNYt5qA9bS285LojvAx3G7pUOmpn0I69lKzGDH3kgRoCq4C4Wz10TXXVn0-AuGkhP6qB_KJHXmJpY0qEQSHzHKw63n2wCAw7XkKTeqFnxkMYJE6LEyqXixfkzbERFiNtl4ZbH_WZdZs9YQa_eOQl_VclhzoeVA6q_RI-cvrNdkxF8Iswd9hLjAkS-v8nYkfp3i0y2TPOoRUrHMSIcOerk6ZaM7sesqpUhXs533o21FQrbv9hHApRne0vbog4FQEamzju5-nvHgHOvE5VO5xF6RKfNatqHLoIt-e5SR0raBaX4gOavMKDAsCkQ1_G0o3bwg'
            }
        }).then(function(response) {
            $scope.groups = response.data;
            if ($scope.groups.length == 0)
                alert("There are no groups for that university!");
        }, function errorCallback(response) {
            console.log("No groups for that university");
            alert("There are no groups for that university!");
        });

    };

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
