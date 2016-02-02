angular.module('fresh.controllers', [])

.controller('AppCtrl', function($scope, $ionicModal, $timeout,$cartservice) {

  // With the new view caching in Ionic, Controllers are only called
  // when they are recreated or on app start, instead of every page change.
  // To listen for when this page is active (for example, to refresh data),
  // listen for the $ionicView.enter event:
  //$scope.$on('$ionicView.enter', function(e) {
  //});

  // Form data for the login modal
  $scope.loginData = {};

  // Create the login modal that we will use later
  $ionicModal.fromTemplateUrl('templates/login.html', {
    scope: $scope
  }).then(function(modal) {
    $scope.modal = modal;
  });

  // Triggered in the login modal to close it
  $scope.closeLogin = function() {
    $scope.modal.hide();
  };

  // Open the login modal
  $scope.login = function() {
    $scope.modal.show();
  };

  // Perform the login action when the user submits the login form
  $scope.doLogin = function() {
    console.log('Doing login', $scope.loginData);

    // Simulate a login delay. Remove this and replace with your login
    // code if using a login system
    $timeout(function() {
      $scope.closeLogin();
    }, 1000);
  };
    
    $scope.cartservice=$cartservice;
    
    $scope.$watch("cartservice.getTotalPrice()",function(newval){
        $scope.totalprice=newval;
    });
    
    
})

.controller('PlaylistsCtrl', function($scope,$productservice,$cartservice) {
  $scope.items = $productservice.getItems();
  $scope.addToCart=function(item){
     item.quantity=$cartservice.addItem(item);
     $scope.totalprice=$cartservice.getTotalPrice();  
  };
  $scope.removeFromCart=function(item){
     item.quantity=$cartservice.removeItem(item);
     $scope.totalprice=$cartservice.getTotalPrice();  
  };
})
.controller('CartCtrl',function($scope,$cartservice) {
    $scope.totalprice=0;
    $scope.cartservice=$cartservice;
    $scope.$watch("cartservice.getTotalPrice()",function(newval){
        $scope.totalprice=newval;
    });    
    $scope.items=$cartservice.getItems();
    $scope.shouldShowDelete=false
    $scope.edit=function(){
        $scope.shouldShowDelete=!$scope.shouldShowDelete;
    }
})
.controller('PlaylistCtrl', function($scope, $stateParams) {
})


;
