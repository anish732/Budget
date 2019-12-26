var budgetController = (function() {
  var Income = function(id, discription, value) {
    (this.id = id), (this.discription = discription), (this.value = value);
  };

  var Expense = function(id, discription, value) {
    (this.id = id), (this.discription = discription), (this.value = value);
  };
  var data = {
    allItems: {
      exp: [],
      inc: []
    },
    totals: {
      exp: 0,
      inc: 0
    }
  };

  return {
    addItem: function(type, des, val) {
      var newItem, ID;

      //Creat new ID
      if (data.allItems[type].length > 0) {
        ID = data.allItems[type][data.allItems[type].length - 1].id + 1;
      } else {
        ID = 0;
      }
      // create a new item based on 'inc or 'exp' type
      if (type === "exp") {
        newItem = new Expense(ID, des, val);
      } else if (type === "inc") {
        newItem = new Income(ID, des, val);
      }
      // push it into our data structure
      data.allItems[type].push(newItem);

      // return the new element
      return newItem;
    },
    testing: function() {
      console.log(data);
    }
  };
})();

var UIcontroller = (function() {
  var DOMstrings = {
    inputType: ".increase",
    inputDiscription: ".discription",
    inputValue: ".number",
    inputBtn: ".add_btn"
  };

  return {
    getInput: function() {
      return {
        type: document.querySelector(DOMstrings.inputType).value,
        discription: document.querySelector(DOMstrings.inputDiscription).value,
        value: document.querySelector(DOMstrings.inputValue).value
      };
    },
    getDOMstrings: function() {
      return DOMstrings;
    }
  };
})();

var controller = (function(budgetctrl, UIctrl) {
  var setupEventListners = function() {
    var DOM = UIctrl.getDOMstrings();

    document.querySelector(DOM.inputBtn).addEventListener("click", ctrlAddItem);

    document.addEventListener("keypress", function(event) {
      if (event.keyCode === 13 || event.which === 13) {
        ctrlAddItem();
      }
    });
  };
  var ctrlAddItem = function() {
    // Get the field input data
    var input = UIctrl.getInput();

    // Add the item to the budget controller
    var newItem = budgetController.addItem(
      input.type,
      input.discription,
      input.value
    );

    // Add the item to the UI

    // Calculate the budget

    // Display the budget on the UI
  };

  return {
    init: function() {
      console.log("Application has started");
      setupEventListners();
    }
  };
})(budgetController, UIcontroller);

controller.init();
