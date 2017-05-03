angular.module("ResearcherListApp", []).config(['$locationProvider', function($locationProvider) {
    $locationProvider.html5Mode({
        enabled: true,
        requireBase: false,
        rewriteLinks: false
    });
}])
