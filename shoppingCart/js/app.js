var cartApp = angular.module('cartApp',['services.cart']);


cartApp.controller('productCtrl',function($scope, $rootScope, Cart){
    $scope.products = [{id:1,quantity:1},{id:2,quantity:1},{id:3,quantity:1},{id:4,quantity:1},{id:5,quantity:1},{id:6,quantity:1}];

    $rootScope.$on('refresh-cart',function(){
        $rootScope.items = Cart.getCart();
    });


    $scope.add = function(){
        try{
            Cart.addItem(Number(this.product.id), 1);
            swal({
                title: "Added!",
                text: "Added to cart successfully!",
                type: "success",
                confirmButtonText: "Ok"
            });
        }
        catch(e){
            swal({
                title: "Alert!",
                text: e.message,
                type: "warning",
                confirmButtonText: "Ok"
            });
        }
    };

    $scope.lblClick = function(){
        $scope.showMe = true;
    };

    $scope.addItems = function(){
        var items = [];
        $scope.products.forEach(function(product){
            if(product.addtolist){
                items.push({id:product.id,quantity:product.quantity});
            }
        });
        try{
            Cart.addItems(items);
            swal({
                title: "Items added successfully!",
                text: "Items added to cart!",
                type: "success",
                confirmButtonText: "Ok"
            });
        }
        catch(e){
            swal({
                title: "Alert!",
                text: "Some or all of the selected items already exist in the cart!",
                type: "warning",
                confirmButtonText: "Ok"
            });
        }

    };
});


cartApp.controller('cartCtrl',function($scope, $rootScope, Cart){
    $rootScope.items = Cart.getCart();

    $scope.addOne = function(){
        try{
            Cart.changeQuantity(Number(this.item.id), Number(this.item.quantity + 1));
        }
        catch(e){
            swal({
                title: "Alert!",
                text: e.message,
                type: "warning",
                confirmButtonText: "Ok"
            });
        }
    };

    $scope.removeOne = function(){
        try{
            Cart.changeQuantity(Number(this.item.id), Number(this.item.quantity - 1));
        }
        catch(e){
            swal({
                title: "Alert!",
                text: e.message,
                type: "warning",
                confirmButtonText: "Ok"
            });
        }
    };

    $scope.delete = function(e){
        try{
            Cart.remove(e);
        }
        catch(e){
            swal({
                title: "Alert!",
                text: e.message,
                type: "warning",
                confirmButtonText: "Ok"
            });
        }
    }

    $scope.clear = function(){
        try{
            Cart.clear();
        }
        catch(e){
            swal({
                title: "Alert!",
                text: e.message,
                type: "warning",
                confirmButtonText: "Ok"
            });
        }
    }
});



