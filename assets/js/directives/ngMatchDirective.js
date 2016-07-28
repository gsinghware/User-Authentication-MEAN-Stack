/**
 * ngMatch directive for matching password input
 */

app.directive('ngMatch', function () {

    function link(scope, element, attrs, ctrl) {
        var checker = function () {
            var newPassword = scope.ngMatch;            // get the new password value
            var newPasswordConfirm = element[0].value;  // get the confirmed password value
            return newPassword == newPasswordConfirm;
        };

        scope.$watch(checker, function (value) {
            ctrl.$setValidity('ngMatch', value);
        });
    }

    return {
        require: 'ngModel',
        scope: {
            ngMatch: '='
        },
        link: link
    };
});