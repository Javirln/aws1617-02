angular.module("ResearcherListApp", ["checklist-model", 'angular.chosen']).config(['$locationProvider', function($locationProvider) {
    $locationProvider.html5Mode({
        enabled: true,
        requireBase: false,
        rewriteLinks: false
    });
}])
