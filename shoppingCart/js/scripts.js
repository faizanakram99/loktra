"use strict";

angular.module('services.cart', [])
  .service('Cart', function ($rootScope, Reviewer) {

    //we need to use an object literal instead of array,
    //because seeking in a hash table is faster than seeking in an array.
    var itemsDictionary = {};

    /**
     * checks if the localStorage api exists.
     */
    var hasLocalStorage = function() {
      try {
        return (window.hasOwnProperty("localStorage") && window["localStorage"] !== null)
      } catch(error) {
        return false;
      }
    };

    /**
     * notifies all the child scopes in order to perform specific actions.
     */
    var refresh = function() {
      $rootScope.$broadcast("refresh-cart");
    };

    /**
     * saves the dictionary to the localStorage, so it can be retrieved later.
     */
    var persist = function() {
      if(hasLocalStorage()) {
        window.localStorage["cart"] = itemsDictionary;
      }
    };

    /**
     * Checks if the cart can be persisted through the Reviewer service:
     * if so, it persists it.
     */
    var save = function() {
      var self = this;
      //the Reviewer.review returns a promise.
      Reviewer.review(this.getCart()).then(function(data) {
        self.persist();
        self.refresh();
      },
      function(error) {
        throw new Error("Cart Service :: save - " + error);
      });
    };

    //setting the dictionary to the already existing cart (if any).
    if(hasLocalStorage()) {
      itemsDictionary = window.localStorage["cart"] || {};
    }

    /**
     * return an array constructed from the items dictionary,
     * I asusme we are going to use the 'repeat' directive somewhere in the html
     * so we need an array to do that. (unless we have a filter that can help)
     */
    var getCart = function() {
      var items = [];

      for(var itemKey in itemsDictionary)
        items.push(itemsDictionary[itemKey]);

      return items;
    };

    /**
     * registers a new item. throws errors if there is a problem validating
     * the parameters.
     */
    var addItem = function(itemId, quantity) {
      if(typeof itemId === "undefined" || itemId === null)
        throw new Error("Cart Service :: addItem - itemId is undefined/null");

      if(itemsDictionary.hasOwnProperty(itemId))
        throw new Error("Cart Service :: addItem - this itemId " + itemId + " already exists");

      if(typeof quantity === "undefined" || quantity === null || quantity <= 0)
        throw new Error("Cart Service :: addItem - the quantity " + quantity + " is not valid");

      itemsDictionary[itemId] = {itemId: itemId, quantity: quantity};
      this.save();
    };

    /**
     * adds a list of items
     */
    var addItems = function(items) {
      if(typeof items === "undefined" || items === null)
        throw new Error("Cart Service :: addItems - itemId undefined/null");

      //assuming that items is an array. ex: [{itemId:Z56M, quantity:2}, {itemId:9J7H, quantity:1}]
      //if not, the loop would be a for in loop.
      for(var i = 0; i < items.length; i++)
        this.addItem(items[i].itemId, items[i].quantity);
    };

    /**
     * delete an item from the dictionary.
     */
    var remove = function (itemId) {
      if(typeof itemId === "undefined" || itemId === null)
        throw new Error("Cart Service :: remove - itemId is undefined/null");

      if(itemsDictionary.hasOwnProperty(itemId)) {
        delete itemsDictionary[itemId];
        this.save();
      } else {
        throw new Error("Cart Service :: remove - this itemId " + itemId + " doesn't exist");
      }
    };

    /**
     * clears the cart, simply assigns an empty object to th dictionary.
     */
    var clear = function() {
      itemsDictionary = {};
      this.save();
    };

    /**
     * changes the quantity of one item in the dictionary.
     * throws errors if ther is any problem in validation.
     */
    var changeQuantity = function (itemId, quantity) {
      if(typeof itemId === "undefined" || itemId === null)
        throw new Error("Cart Service :: changeQuantity - itemId is undefined/null");

      if(itemsDictionary.hasOwnProperty(itemId))
        throw new Error("Cart Service :: changeQuantity - this itemId " + itemId + " doesn't exist");

      if(typeof quantity === "undefined" || quantity === null)
        throw new Error("Cart Service :: changeQuantity - the quantity " + quantity + " is not valid");

      //if the quantity is zero, then the user wants to remove this item.
      if(quantity === 0) {
        this.remove(itemId);
      } else {
        itemsDictionary[itemId].quantity = quantity;
        this.save();
      }
    };

    /**
     * Encapsulation
     * Exposing only what the other components/parts of the application need to see.
     */
    return {
      getCart: getCart,
      addItem: addItem,
      addItems: addItems,
      save: save,
      remove: remove,
      clear: clear,
      changeQuantity: changeQuantity,
      refresh: refresh
    };

  });
