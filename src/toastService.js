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
        angular.module('long2know',
            [
                'long2know.services',
                'long2know.controllers',
                'long2know.directives'
            ]);
    };

    var toastrOptions = {
        positionClass: 'toast-bottom-right',
        "closeButton": false,
        "debug": false,
        "newestOnTop": false,
        "progressBar": false,
        "preventDuplicates": false,
        "showDuration": "0",
        "hideDuration": "0",
        "timeOut": "0",
        "extendedTimeOut": "0",
        "tapToDismiss": false,
        "onclick": null
    };

    var globalToastrOptions = {
        positionClass: 'toast-bottom-right'
    };

    toastr.options = globalToastrOptions;

    var toastService = function ($q, $timeout, $compile, $injector, $rootScope, $controller, $templateCache) {
        var
            success = function (message) {
                toastr.success(message || 'DefaultSuccess');
            },

            error = function (message) {
                toastr.error(message, "GeneralError");
            },

            info = function (message) {
                toastr.info(message);
            },

            render = function (options) {
                var
                    returnSvc = {
                        $toast: null,
                        close: null
                    },
                    tplContent = $templateCache.get(options.templateUrl),
                    scope = $rootScope.$new(), ctrlInstance, ctrlLocals = {}, resolveIndex = 0,
                    promisesArr = [];

                // Define promises that we want to resolve
                angular.forEach(options.resolves, function (value) {
                    if (angular.isFunction(value) || angular.isArray(value)) {
                        promisesArr.push($q.when($injector.invoke(value)));
                    }
                });

                // Resolve any resolves for which we gathered promises
                var resolvePromise = $q.all(promisesArr);

                // Once we finish resolving, get busy!
                resolvePromise.then(function resolveSuccess(vars) {
                    //controllers
                    if (options.controller) {
                        ctrlLocals.scope = scope;
                        ctrlLocals.$scope = scope;

                        // Set the resolves we got back as members on the controller's locals
                        angular.forEach(options.resolves, function (value, key) {
                            ctrlLocals[key] = vars[resolveIndex++];
                        });

                        // Now create our controller with its locals
                        ctrlInstance = $controller(options.controller, ctrlLocals);

                        // If controllerAs was passed in as an option, set it.
                        if (options.controllerAs) {
                            scope[controllerAs] = ctrlInstance;
                        }
                    }

                    // Compile our DOM element
                    var angularDomEl = $compile(tplContent)(scope);

                    // Instantiate the $toast
                    var toast = toastr.info(angularDomEl, '', toastrOptions);
                    returnSvc.toast = toast;
                    
                    toast.on('$destroy', function () {
                        scope.$destroy();                      
                    });
                    
                    // Create a cloase method accessible by the return object                   
                    returnSvc.close = function () {
                         toast.fadeOut(500, function() { $(this).remove(); });
                    };
                });

                return returnSvc;
            };

        return {
            success: success,
            error: error,
            info: info,
            render: render
        };
    };

    toastService.$inject = ['$q', '$timeout', '$compile', '$injector', '$rootScope', '$controller', '$templateCache'];
    angular.module("long2know.services")
        .factory('toastService', toastService);
})()