(function () {
    angular.module('myApp.services', ['ngResource', 'ngAnimate']);
    angular.module('myApp.controllers', []);

    var myApp = angular.module('myApp', [
        'myApp.services',
        'myApp.controllers',
        'long2know',
        'ngSanitize',
        'ui.bootstrap',
        'ui']);

    var toastCtrl = function ($sce, toastData) {
        var vm = this,
            initialize = function () {
                vm.message = $sce.trustAsHtml(toastData.message);
            };

        vm.ok = function () {
            toastData.sharedData.time = new Date().getTime();
            toastData.closeToast();
        };

        initialize();
    };

    toastCtrl.$inject = ['$sce', 'toastData'];
    angular
        .module('myApp.controllers')
        .controller('toastCtrl', toastCtrl);

    var myController = function ($log, toastSvc) {
        var
            vm = this,
            times = [],
            closeToast = function (toast) {
                toast.close();                
                // Perform whatever other processing we need to on the resolves..
                $log.log('Return data: ' + vm.sharedData.time);
                vm.times.push(vm.sharedData.time);
                
            };
            
        vm.times = [];
        vm.sharedData = {
            time: new Date().getTime()
        };
        
        vm.openSimpleToast = function () {
            toastSvc.success("I'm a simple toast");
        }

        vm.openInteractiveToast = function () {
            var message = "I'm a complex toast.";
            var toast = toastSvc.render({
                templateUrl: 'toastTemplate.html',
                controller: 'toastCtrl as tc',
                resolves: {
                    toastData: function () {
                        return {
                            closeToast: function () {
                                closeToast(toast);
                            },
                            message: message,
                            sharedData: vm.sharedData
                        };
                    }
                }
            });
        }
    };

    myController.$inject = ['$log', 'toastService'];
    angular.module('myApp.controllers')
        .controller('myCtrl', myController);

    myApp.config(['$locationProvider',
        function ($locationProvider) {
            $locationProvider.html5Mode(false);
        }]);

    myApp.run(['$log', function ($log) { $log.log("Start."); }]);
})()
