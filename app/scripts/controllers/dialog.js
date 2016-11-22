
function DialogController($scope, $mdDialog,$controller) {
	//var vm=this;
	var vm=$controller('MainCtrl');
console.log('vm',vm);
  $scope.hide = function() {
    $mdDialog.hide();
  };
  $scope.cancel = function() {
    $mdDialog.cancel();
  };
  $scope.answer = function(answer) {
    $mdDialog.hide(answer);
  };
$scope.toggleAll=vm.toggleAll;
$scope.isChecked=vm.isChecked;
$scope.isIndeterminate=vm.isIndeterminate;
$scope.exists=vm.exists;
$scope.toggle=vm.toggle;
}