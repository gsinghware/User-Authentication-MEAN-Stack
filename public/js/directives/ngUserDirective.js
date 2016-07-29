/**
 * ngMatch directive for matching password input
 */

app.directive('ngUser', function () {

    return {
        restrict: 'E',
        scope: {
            data: '=',
            user: '='
        },
        templateUrl: "../../../partials/directives/ngUserDirective.ejs",
        controller: function($scope) {
            // console.log($scope.user);
        },
        link: function (scope, element, attributes) {
            element.click(function () {
                // alert('clicked');
            });
        }
    };
});