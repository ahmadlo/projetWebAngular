
  'use strict';

 var myapp=angular.module('projetwebApp');

 myapp.controller('LoginCtrl', function($scope, api,  isLogged, $location, $mdDialog) {
        // Angular does not detect auto-fill or auto-complete. If the browser
        // autofills "username", Angular will be unaware of this and think
        // the vm.username is blank. To workaround this we use the 
        // autofill-event polyfill [4][5]
        //$('#id_auth_form input').checkAndTriggerAutoFillEvent();
 var vm=this;
                        
 function cancel() {
    $mdDialog.cancel();
  }
  vm.cancel=cancel;
          function getCredentials(){
            return {login: vm.username, pwd: vm.password};
        }
 
        function login(){
            api.auth.login(getCredentials()).
                $promise.
                    then(function(data){
                        // on good username and password
                        vm.user = data.username;
                        //vm.is_authenticated=true;
                        //console.log(data);
                        console.log(data.user);
                        isLogged.init(true);
                        isLogged.exec();
                        vm.cancel();
                        $location.url('/');


                    }).
                    catch(function(data){
                        // on incorrect username and password
                        //console.log(data.data.detail);
                       console.log(data);

                    });
        }
 
        
vm.login=login;
 vm.getCredentials=getCredentials;
        /*vm.register = function($event){
            // prevent login form from firing
            $event.preventDefault();
            // create user and immediatly login on success
            api.users.create(vm.getCredentials()).
                $promise.
                    then(vm.login).
                    catch(function(data){
                        alert(data.data.username);
                    });
            };*/
    });
 

myapp.controller('navbarCtrl',function($scope, isLogged , $mdDialog, $mdMedia){
 
   
$scope.status = '  ';
  $scope.customFullscreen = $mdMedia('xs') || $mdMedia('sm');
   $scope.showAdvanced = function(ev) {
    var useFullScreen = ($mdMedia('sm') || $mdMedia('xs'))  && $scope.customFullscreen;
    $mdDialog.show({
      controller: 'LoginCtrl as vm',
      templateUrl: 'views/login.html',
      parent: angular.element(document.body),
      targetEvent: ev,
      clickOutsideToClose:true,
      fullscreen: useFullScreen
    })
    .then(function(answer) {
      $scope.status = 'You said the information was "' + answer + '".';
    }, function() {
      $scope.status = 'You cancelled the dialog.';
    });
    $scope.$watch(function() {
      return $mdMedia('xs') || $mdMedia('sm');
    }, function(wantsFullScreen) {
      $scope.customFullscreen = (wantsFullScreen === true);
    });
  };
     function logout(){
        //$scope.is_authenticated=false;
        isLogged.init(false);
                                isLogged.exec();



          /*
            api.auth.logout(function(){

                vm.user = undefined;
            });*/
        }
         $scope.$on('handleBroadcast', function() {
      $scope.is_authenticated =  isLogged.is_authenticated;
    });
        $scope.logout=logout;
});

