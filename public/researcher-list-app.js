angular.module("ResearcherListApp", ["checklist-model", 'localytics.directives']).config(['$locationProvider', function($locationProvider) {
    $locationProvider.html5Mode({
        enabled: true,
        requireBase: false,
        rewriteLinks: false
    });
}])
