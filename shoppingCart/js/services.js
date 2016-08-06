"use strict";

angular.module('services.cart', [])
  .service('Cart', function ($rootScope, Reviewer) {


    var itemsDictionary = JSON.parse(localStorage.getItem('cart') || '{}');


    // notifies all the childs about status of cart.

    var refresh = function() {
        $rootScope.$broadcast('refresh-cart')
    };


    // saves the item dictionary to the localStorage.

    var persist = function() {
        localStorage.setItem('cart', JSON.stringify(itemsDictionary));
    };


    // Checks if the cart can be persisted through the Reviewer service if so, it persists it.

    var save = function() {
      var self = this;

      Reviewer.review(this.getCart()).then(function(data) {
        self.persist();
        self.refresh();
      },
      function(errorMsg) {
        throw new Error("Cart Service save error " + errorMsg);
      });
    };




    // return an array constructed from the items dictionary

    var getCart = function() {
      var items = [];

      for(var key in itemsDictionary){
          items.push(itemsDictionary[key]);
      }

      return items;
    };



    // add item to cart

    var addItem = function(id, quantity) {
      if(typeof id === "undefined" || id === null)
        throw new Error("Cart Service error - item id is invalid");

      if(itemsDictionary.hasOwnProperty(id))
        throw new Error("Cart Service error - the item id " + id + " already exists");

      if(typeof quantity === "undefined" || quantity === null || quantity <= 0)
        throw new Error("Cart Service error - the quantity " + quantity + " is invalid");

      itemsDictionary[id] = {id:id, quantity:quantity};
      this.save();
    };

    // add list of items to cart

    var addItems = function(items) {
      if(typeof items === "undefined" || items === null)
        throw new Error("Cart Service error - item id is not valid");

      // items are in loop suppose

      for(var i = 0; i < items.length; i++)
        this.addItem(items[i].id, items[i].quantity);
    };


    // remove item from cart

    var remove = function (id) {
      if(typeof id === "undefined" || id === null)
        throw new Error("Cart Service error - item id is not valid");

      if(itemsDictionary.hasOwnProperty(id)) {
        delete itemsDictionary[id];
        this.save();
      } else {
        throw new Error("Cart Service error - the item id " + id + " doesn't exist");
      }
    };



    // clear the cart

    var clear = function() {
        if(Object.keys(itemsDictionary).length == 0){
            throw new Error("Cart already empty!");
        }
        else{
            itemsDictionary = {};
            this.save();
        }
    };



    // changes the quantity of one item.

    var changeQuantity = function (id, quantity) {
      if(typeof id === "undefined" || id === null)
        throw new Error("Cart Service error - item id is not valid");

      if(!itemsDictionary.hasOwnProperty(id))
        throw new Error("Cart Service error - the id " + id + " doesn't exist");

      if(typeof quantity === "undefined" || quantity === null)
        throw new Error("Cart Service error - the quantity " + quantity + " is not valid");

      //if the quantity is zero, then the user wants to remove this item.
      if(quantity === 0) {
        this.remove(id);
      } else {
        itemsDictionary[id].quantity = quantity;
        this.save();
      }
    };


    return {
      getCart: getCart,
      addItem: addItem,
      addItems: addItems,
      save: save,
      persist: persist,
      remove: remove,
      clear: clear,
      changeQuantity: changeQuantity,
      refresh: refresh
    };

  })
  .service('Reviewer', function($q, $timeout){
    this.review = function(cart){
        var deferred = $q.defer();
        $timeout(function(){
            var ls_cart = JSON.parse(localStorage.getItem('cart'));
            if(ls_cart)
            {
                if(cart.length !== Object.keys(ls_cart).length){
                    deferred.resolve();
                }
                else
                {
                    cart.forEach(function(key){
                        if(ls_cart[key.id] && ls_cart[key.id].quantity !== key.quantity) deferred.resolve();
                    });

                    deferred.reject("Persist failed!");
                }
            }
            else
            {
                deferred.resolve();
            }
        }, 100);
        return deferred.promise;
    };
});
