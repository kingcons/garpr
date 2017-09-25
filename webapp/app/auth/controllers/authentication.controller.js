angular.module('app.auth').controller("AuthenticationController", function($scope, $uibModal, AuthenticationService) {
    $scope.postParams = {};
    $scope.errorTxt = "";

    $scope.handleLoginSuccess = function() {
        $scope.errorTxt = "";
        $scope.closeLoginModal();
    };

    $scope.handleLoginFailure = function() {
        $scope.errorTxt = "Login Failed";
    };

    $scope.login = function() {
        AuthenticationService.login($scope.postParams, $scope.handleLoginSuccess, $scope.handleLoginFailure);
    };

    $scope.logout = function() {
        AuthenticationService.logout();
    };

    $scope.closeLoginModal = function() {
        $scope.postParams = {};
        $scope.modalInstance.close()
    };

    $scope.openLoginModal = function() {
        $scope.modalInstance = $uibModal.open({
            templateUrl: 'app/auth/views/login_modal.html',
            scope: $scope,
            size: 'lg'
        });
    };
});
