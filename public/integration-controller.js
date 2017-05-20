angular.module("ResearcherListApp").controller("IntCtrl", function($scope, $http, $location) {

    $scope.universities = [];
    $scope.projects = [];
    $scope.groups = [];
    $scope.selectedProject = null;
    $scope.selectedGroup = null;
    $scope.researchers = [];

    $scope.loadUniversities = function() {

        /*
        //Load universities for adding form
        $http.get("https://aws1617-04.herokuapp.com/api/v1/universities", {
            
        }).then(function(response) {
            //Fill universities array
        });*/
        $scope.universities.push({
            acronym: "US",
            name: "Universidad de Sevilla",
            icon: "http://ftp.us.es/ftp/pub/Logos/marca-tinta-roja_300.gif"
        });
        $scope.universities.push({
            acronym: "UCA",
            name: "Universidad de Cadiz",
            icon: "http://actividades.uca.es/logotipos/LogoUCA/image_preview"
        });
    };

    $scope.loadResearchGroups = function() {
        $scope.groups = [];
        $scope.selectedGroup = null;
        $scope.researchers = [];
        var university_acronym = $scope.university.acronym;
        $http.get("https://aws1617-03.herokuapp.com/api/v1/groups?fields=acronym_university&values="+university_acronym, {
            headers: {
                    'Authorization': 'Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsImtpZCI6IlEwUkJNemt5T1RWQlEwWTFNVFZDUlRjelJUZ3hRMFF4TkVSRVFqWkdOemcyTVVNMk0wWTFSUSJ9.eyJpc3MiOiJodHRwczovL2Rhbmk4YXJ0LmV1LmF1dGgwLmNvbS8iLCJzdWIiOiJnb29nbGUtb2F1dGgyfDExMDYyMzc0ODcxMDAyMDE3ODM1NCIsImF1ZCI6IkVSQnR5eHNpNUpUQ09UWGU3dHFweHpIVWZaV0VLTktUIiwiZXhwIjoxNDk1MzI2OTIxLCJpYXQiOjE0OTUyOTA5MjEsIm5vbmNlIjoiR3R2ZC5uSW5-ZVUtdExSaFktbDNLcXNrZ2dpOUhyMC0iLCJhdF9oYXNoIjoiLUgzVDdkMTJuYnVNMzMxOUQ3d0JRQSJ9.lLHIBhQa1UogQMYNqxf-oEKkW4XqTpwQc1eTTk8OfNv-Axc7KZSuK_xQMMh_H1aUXeSJiDBfzr1q47jnZOdKn83flS56CDwjvbTepGANIxl830jmlWJ-YkgFDG3HVKkJ_XXLh3RMwcPvtBiAl-xkr7BG-tCmnR-yuEZO4oCyMHmdHmU6RZlGg07BiJSq2fj69qLB8wjB7zUfVwCKodtOdK05gtZ0cNPXyQbs4fytQjsAeTvohSwLMhHVliZytHGyBr0U4Qowa0bytE9HNPmfYg4qJca2NDd5TyZ23pQhvJrzOAsmLKv0wRqqlcTlRxE-3EqjAv4Gu0sFBRi-TLsHxw'
                }
        }).then(function(response) {
            $scope.groups = response.data;
        });

    };

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

    $scope.showResearchersProject = function(project) {
        $scope.researchers = [];
        $scope.selectedProject = project;
        project.investigador.forEach((element) => {
            $http.get("/api/v1/researchers/" + element, {
                headers: {
                    'Authorization': 'Bearer ' + $scope.token
                }
            }).then(function(response) {
                $scope.researchers.push(response.data[0]);
            });
        });

    };
    
    $scope.showResearchersGroup = function(group) {
        $scope.researchers = [];
        $scope.selectedGroup = group;
        
        $http.get("/api/v1/researchers?group" + $scope.selectedGroup.id, {
            headers: {
                'Authorization': 'Bearer ' + $scope.token
            }
        }).then(function(response) {
            $scope.researchers = response.data;
        });
    };

    $scope.loadPapers = function(orcid) {
        console.log("Invoking https://aws1617-02.herokuapp.com/api/v1/researchers/" + orcid);
        $http.get(
            "https://aws1617-02.herokuapp.com/api/v1/researchers/" + orcid
        ).then(function(response) {
            $("#modal-header").html("<b>Researcher</b> | " + response.data[0].name);
            $("#modal-body").html("<b>ORCID:</b> " + response.data[0].orcid + "<br><b>Name:</b> " + response.data[0].name + "<br><b>Phone:</b> " + response.data[0].phone + "<br><b>Email: </b><a href=\"mailto:" + response.data[0].email + "\">" + response.data[0].email + "</a><br><b>Address:</b> " + response.data[0].address + "<br><b>Gender: </b>" + response.data[0].gender + "<br>");
            $("#myModal").modal();
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
