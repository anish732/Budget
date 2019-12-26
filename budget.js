var budgetController = (function() {})();

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
  var DOM = UIctrl.getDOMstrings();
  var ctrlAddItem = function() {
    var input = UIctrl.getInput();

    console.log(input);
  };

  document.querySelector(DOM.inputBtn).addEventListener("click", ctrlAddItem);

  document.addEventListener("keypress", function(event) {
    if (event.keyCode === 13 || event.which === 13) {
      ctrlAddItem();
    }
  });
})(budgetController, UIcontroller);
