angular.module("ResearcherListApp").controller("IntCtrl", function($scope, $http, $location) {

    $scope.universities = [];
    $scope.projects = [];
    $scope.selectedProject = null;
    $scope.researchers = [];

    $scope.loadUniversities = function() {

        /*
        //Load universities for adding form
        $http.get("https://aws1617-04.herokuapp.com/api/v1/universities", {
            
        }).then(function(response) {
            //Fill universities array
        });*/
        $scope.universities.push({
            id: 1,
            name: "Universidad de Sevilla",
            icon: "http://ftp.us.es/ftp/pub/Logos/marca-tinta-roja_300.gif"
        });
        $scope.universities.push({
            id: 2,
            name: "Universidad de Cadiz",
            icon: "http://actividades.uca.es/logotipos/LogoUCA/image_preview"
        });
    };

    /*$scope.loadResearchGroups = function() {
        $scope.projects = [];
        $scope.selectedProject = null;
        $scope.researchers = [];

        $http.get("https://aws1617-01.herokuapp.com/api/v1/projects", {}).then(function(response) {
            $scope.projects = response.data;
        });

    };*/

    $scope.loadResearchGroups = function() {
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

    }

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
