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
    var input = UIctrl.getInput();
  };

  return {
    init: function() {
      console.log("Application has started");
      setupEventListners();
    }
  };
})(budgetController, UIcontroller);

controller.init();
