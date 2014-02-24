'use strict';
// https://api.github.com/repos/hasadna/Open-Knesset/tags
// https://api.github.com/repos/hasadna/Open-Knesset/branches
// https://api.github.com/repos/hasadna/Open-Knesset/languages
// https://api.github.com/repos/hasadna/Open-Knesset/contributors
// https://api.github.com/repos/hasadna/Open-Knesset/commits

var App = angular.module('App', [
    'ngResource', 'ngRoute', 'ngSanitize', 'ui.utils', 'App.filters']);

App.controller('ListCtrl', function($scope, $http, $sce) {

    $scope.selectedLabels = new Array();

    var http_request = $http({
        method: 'GET',
        url: 'https://api.github.com/repos/hasadna/Open-Knesset/issues'
    });
    //http_request.error(function(data, status, headers, config) {});
    http_request.success(function(data, status, headers, config) {
        var labels = new Array();
        //Add title/body_lang  attribute  with hebrew Or english values - for text alignment.
        for (var i = 0; i < data.length; i++) {
            if (isMostHebrew(data[i].body))
                data[i].body_lang = "hebrew";
            else
                data[i].body_lang = "english";

            if (isMostHebrew(data[i].title))
                data[i].title_lang = "hebrew";
            else
                data[i].title_lang = "english";

            // Collect the labels
            for (var j = 0; j < data[i].labels.length; j++) {
                labels.push(data[i].labels[j]);
            }
        }

        $scope.issues = data;

        // Count labels and remove duplicates
        $scope.labels = ArrayUtill.clusterNcount(labels, 'name');

//        window.console.log($sce);
        $scope.to_trusted = function(html_code) {
            return $sce.trustAsHtml(html_code);
        };
        $scope.render = function(e) {
            return $(e).html();
        };

        $scope.setSelectedLabels = function() {
            var name = this.lbl.name;
            if (_.contains($scope.selectedLabels, name))
                $scope.selectedLabels = _.without($scope.selectedLabels, name);
            else
                $scope.selectedLabels.push(name);

            return false;
        };

        $scope.isChecked = function(name) {
            if (_.contains($scope.selectedLabels, name))
                return 'glyphicon-ok';

            return false;
        };
        //window.console.log(JSON.stringify($scope.labels));
//        window.console.log(JSON.stringify(data));
        $scope.loadComments = function(evt, issue) {
            var http_request = $http({
                method: 'GET',
                url: issue.comments_url
            });
            http_request.success(function(data, status, headers, config) {
                issue.comments_list = data;
            });
        }

    });
});

/***
 * 
 * @param {ngRoute.$routeProvider} $routeProvider
 */
App.config(function($routeProvider) {
    $routeProvider.when('/', {
        controller: 'ListCtrl',
        templateUrl: 'list.html'
    });
    $routeProvider.otherwise({
        redirectTo: '/'
    });
});

angular.module('App.filters', []).filter('githubTagsFilter', [function() {

        /***
         * @description Filter issues by labels.
         * @param {Array<Object>} issues
         * @param {Array<string>} selectedLabels
         * @returns {Array} of issues.
         */
        return function(issues, selectedLabels) {
            if (selectedLabels === undefined)
                return issues;
            else if (issues === undefined)
                return issues;

            if (selectedLabels.length > 0)// Do we need to filter?
            {
                var tempIssues = new Array();

                for (var j = 0; j < issues.length; j++) { // for each issue
                    var issue_labels = new Array();

                    // Get all the names of the labels into issue_labels
                    for (var i = 0; i < issues[j].labels.length; i++)
                        issue_labels.push(issues[j].labels[i].name);

                    // If all the selectedLabels appears in issue_labels add it to tempIssues
                    if (_.difference(selectedLabels, issue_labels).length === 0)
                        tempIssues.push(issues[j]);
                }
                return tempIssues;
            } else {
                return issues; //Nothing is selected - return the original.
            }
        };
    }
]);
