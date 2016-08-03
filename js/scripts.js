angular.module('loktra', [])
    .controller('mainCtrl', function($scope, $window){
                $scope.total = 0;
                $scope.left = 1000;
                $scope.numbersOnly = /^\d+$/;
                $scope.giveNow = function(){
                    $scope.total += Number($scope.donate);
                    if($scope.total > 1000){
                        $scope.total -= Number($scope.donate);
                        swal({
                          title: "Warning!",
                          text: "The total donation cannot exceed 1000!",
                          type: "warning",
                          confirmButtonText: "Ok"
                        });
                        $scope.donate = 0;
                    }
                    else
                    {
                        $scope.totalPercent = Number(($scope.total / 1000) * 100) + "%";
                        $scope.left = Number(1000 - $scope.total);
                        $scope.donate = 0;
                    }
                };
                $scope.save = function(){
                    swal({
                          title: "Saved!",
                          text: "Thank you!",
                          type: "success",
                          confirmButtonText: "Ok"
                    });
                }
                $scope.share = function(){
                   FB.login(function(){
                        // Note: The call will only work if you accept the permission request
                        FB.api('/me/feed', 'post', {message: 'Yay, I donated!'});
                    }, {scope: 'publish_actions'});
                    $window.open("https://twitter.com/intent/tweet?text='Yay, I donated!'");
                };
            });
