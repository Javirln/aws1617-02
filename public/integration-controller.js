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

    $scope.loadResearchGroups = function() {
        $scope.projects = [];
        $scope.selectedProject = null;
        $scope.researchers = [];
        
        $http.get("https://aws1617-01.herokuapp.com/api/v1/projects", {}).then(function(response) {
            $scope.projects = response.data;
        });

    };

    $scope.showResearchersProject = function(project) {
        $scope.researchers = [];
        $scope.selectedProject = project;
        project.investigador.forEach((element) => {
            $http.get("https://aws1617-02.herokuapp.com/api/v1/researchers/"+element, {}).then(function(response) {
                $scope.researchers.push(response.data[0]);
            });
        });

    }

    $scope.loadUniversities();

});
