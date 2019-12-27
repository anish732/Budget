var budgetController = (function() {
  //constructor function for Income and Expense
  var Income = function(id, description, value) {
    (this.id = id), (this.description = description), (this.value = value);
  };

  var Expense = function(id, description, value) {
    (this.id = id), (this.description = description), (this.value = value);
  };

  var calculateTotal = function(type) {
    var sum = 0;
    data.allItems[type].forEach(function(cur) {
      sum += cur.value;
    });

    data.totals[type] = sum;
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
    },
    budget: 0,
    percentage: -1
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
    calculateBudget: function() {
      //Calculate the total income and expenses
      calculateTotal("exp");
      calculateTotal("inc");

      //Calculate Budget = total income-total-expenses
      data.budget = data.totals.inc - data.totals.exp;

      // Calculate percentage of the income we have spent

      if (data.totals.inc > 0) {
        data.percentage = Math.round((data.totals.exp / data.totals.inc) * 100);
      } else {
        data.percentage = -1;
      }
    },
    getBudget: function() {
      return {
        budget: data.budget,
        totalInc: data.totals.inc,
        totalExp: data.totals.exp,
        percentage: data.percentage
      };
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
    expensesContainer: ".expenses_list",
    budgetLable: ".budget__value",
    incomeLable: ".budget__income--value",
    expenseLable: ".budget__expenses--value",
    percentageLable: ".budget__expenses--percentage",
    container: ".container"
  };

  return {
    getInput: function() {
      return {
        type: document.querySelector(DOMstrings.inputType).value,
        description: document.querySelector(DOMstrings.inputDescription).value,
        value: parseFloat(document.querySelector(DOMstrings.inputValue).value)
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
    clearFields: function() {
      var fields, fieldsArr;
      fields = document.querySelectorAll(
        DOMstrings.inputDescription + ", " + DOMstrings.inputValue
      );
      fieldsArr = Array.prototype.slice.call(fields);
      fieldsArr.forEach(function(current, index, array) {
        current.value = "";
      });
      fieldsArr[0].focus();
    },
    displayBudget: function(obj) {
      document.querySelector(DOMstrings.budgetLable).textContent = obj.budget;
      document.querySelector(DOMstrings.incomeLable).textContent = obj.totalInc;
      document.querySelector(DOMstrings.expenseLable).textContent =
        obj.totalExp;

      if (obj.percentage > 0) {
        document.querySelector(DOMstrings.percentageLable).textContent =
          obj.percentage + "%";
      } else {
        document.querySelector(DOMstrings.percentageLable).textContent = "---";
      }
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
    document
      .querySelector(DOM.container)
      .addEventListener("click", ctrlDeleteItem);
  };

  var updateBudget = function() {
    // 1. Calculate the budget
    budgetctrl.calculateBudget();
    // 2. Return the budget

    var budget = budgetctrl.getBudget();

    // 3. Display the budget
    UIctrl.displayBudget(budget);
  };

  var ctrlAddItem = function() {
    var input, newItem;
    // Get the field input data
    input = UIctrl.getInput();

    // If there is no value in input then click button shouldn't work

    if (input.description !== "" && !isNaN(input.value) && input.value > 0) {
      // Add the item to the budget controller
      newItem = budgetctrl.addItem(input.type, input.description, input.value);

      // Add the item to the UI

      UIctrl.addListItem(newItem, input.type);

      // clear the field
      UIctrl.clearFields();

      // Call calculate budget
      updateBudget();

      // Display the budget on the UI
    }
  };
  var ctrlDeleteItem = function(event) {
    var itemID, splitID, type, ID;

    //get the id of the item we want to delete
    itemID = event.target.parentNode.parentNode.parentNode.parentNode.id;

    if (itemID) {
      // split inc-1
      splitID = itemID.split("-");
      type = splitID[0];
      ID = splitID[1];

      //1. Delete the item from the data structure

      //2. Delete the item from the UI

      //3. Update and show the new budget
    }
  };

  return {
    init: function() {
      console.log("Application has started");
      UIctrl.displayBudget({
        budget: 0,
        totalInc: 0,
        totalExp: 0,
        percentage: -1
      });

      setupEventListners();
    }
  };
})(budgetController, UIcontroller);

controller.init();
