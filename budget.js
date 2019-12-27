var budgetController = (function() {
  //constructor function for Income and Expense
  var Income = function(id, description, value) {
    (this.id = id), (this.description = description), (this.value = value);
  };

  var Expense = function(id, description, value) {
    (this.id = id), (this.description = description), (this.value = value);
  };

  //creat data structure to store newely created objects.
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
  //keep all the class in one var
  var DOMstrings = {
    inputType: ".increase",
    inputDescription: ".description",
    inputValue: ".number",
    inputBtn: ".add_btn",
    incomeContainer: ".income_list",
    expensesContainer: ".expenses_list"
  };

  return {
    getInput: function() {
      return {
        type: document.querySelector(DOMstrings.inputType).value,
        description: document.querySelector(DOMstrings.inputDescription).value,
        value: document.querySelector(DOMstrings.inputValue).value
      };
    },
    addListItem: function(obj, type) {
      var html, newHtml, element;
      // Create HTML string with placeholder text

      if (type === "inc") {
        element = DOMstrings.incomeContainer;

        html =
          '<div class="item clearfix" id="inc-%id%"> <div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
      } else if (type === "exp") {
        element = DOMstrings.expensesContainer;

        html =
          '<div class="item clearfix" id="exp-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__percentage">21%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
      }

      // Replace the placeholder text with some actual data
      newHtml = html.replace("%id%", obj.id);
      newHtml = newHtml.replace("%description%", obj.description);
      newHtml = newHtml.replace("%value%", obj.value);

      // Insert the HTML into the DOM
      document.querySelector(element).insertAdjacentHTML("beforeend", newHtml);
    },
    getDOMstrings: function() {
      return DOMstrings;
    }
  };
})();

var controller = (function(budgetctrl, UIctrl) {
  // all EventListners
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
    var newItem = budgetctrl.addItem(
      input.type,
      input.description,
      input.value
    );

    // Add the item to the UI

    UIctrl.addListItem(newItem, input.type);
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
