(function () {
    var long2know;
    try {
        long2know = angular.module("long2know")
    } catch (err) {
        long2know = null;
    }

    if (!long2know) {
        angular.module('long2know.services', ['ngResource', 'ngAnimate']);
        angular.module('long2know.controllers', []);
        angular.module('long2know.directives', []);
        angular.module('long2know.constants', []);
        angular.module('long2know',
            [
                'long2know.services',
                'long2know.controllers',
                'long2know.directives',
                'long2know.constants'
            ]);
    }

    var watchCount = function () {
        // I return the count of watchers on the current page.
        function getWatchCount() {
            var total = 0;
            angular.element(".ng-scope").each(
                function ngScopeIterator() {
                    var scope = $(this).scope();
                    total += scope.$$watchers
                        ? scope.$$watchers.length
                        : 0;
                }
                );

            return (total);
        }

        // For convenience, let's serialize the above method and convert it to
        // a bookmarklet that can easily be run on ANY AngularJS page.
        getWatchCount.bookmarklet = (
            "javascript:alert('Watchers:'+(" +
            getWatchCount.toString()
                .replace(/\/\/.*/g, " ")
                .replace(/\s+/g, " ") +
            ")());void(0);"
            );

        return {
            getWatchCount: getWatchCount
        };
    }

    angular.module('long2know.services')
        .factory('watchCountService', watchCount);
})()