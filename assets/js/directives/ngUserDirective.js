/**
 * ngMatch directive for matching password input
 */

app.directive('ngUser', function () {

    return {
        restrict: 'E',
        scope: {
            data: '='
        },
        templateUrl: "../../../partials/directives/ngUserDirective.ejs",
        controller: function($scope) {
            // console.log($scope.data);
        },
        link: function (scope, element, attributes) {
            element.click(function () {
                // alert('clicked');
            });
        }
    };
});