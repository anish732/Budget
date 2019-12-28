var budgetController = (function() {
  //constructor function for Income and Expense
  var Income = function(id, description, value) {
    (this.id = id), (this.description = description), (this.value = value);
  };

  var Expense = function(id, description, value) {
    (this.id = id),
      (this.description = description),
      (this.value = value),
      (this.percentage = -1);
  };

  Expense.prototype.calcPercentages = function(totalIncome) {
    if (totalIncome > 0) {
      this.percentage = Math.round((this.value / totalIncome) * 100);
    } else {
      this.percentage = -1;
    }
  };
  Expense.prototype.getPercentages = function() {
    return this.percentage;
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
    deleteItem: function(type, id) {
      var ids, index;
      // delete id = 6
      // data.allitems[type].[id]
      //ids = [1 2 4 6 8]
      // index = 3

      ids = data.allItems[type].map(function(current) {
        return current.id;
      });

      index = ids.indexOf(id);

      if (index !== -1) {
        data.allItems[type].splice(index, 1);
      }
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
    calculatePercentages: function() {
      data.allItems.exp.forEach(function(cur) {
        cur.calcPercentages(data.totals.inc);
      });
    },

    getPercentages: function() {
      var allPerc = data.allItems.exp.map(function(cur) {
        return cur.getPercentages();
      });
      return allPerc;
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
    container: ".container",
    expensesPercLabel: ".item__percentage",
    dateLable: ".budget__title--month"
  };
  var formatNumber = function(num, type) {
    var type;
    /*
     + or - before number 
     exactly 2 decimal points 
     comma separating the thousands
     2310.4567 -> + 2,310.46
     2000 -> + 2,000.00
     */
    num = Math.abs(num);
    num = num.toFixed(2);

    var numSplit = num.split(".");
    var int = numSplit[0];

    if (int.length > 3) {
      int = int.substr(0, int.length - 3) + "," + int.substr(int.length - 3, 3); //if input is 2310, output 2,310
    }
    var dec = numSplit[1];

    return (type === "exp" ? "-" : "+") + " " + int + "." + dec;
  };
  var nodeListForEach = function(list, callback) {
    for (var i = 0; i < list.length; i++) {
      callback(list[i], i);
    }
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
      newHtml = newHtml.replace("%value%", formatNumber(obj.value, type));

      // Insert the HTML into the DOM
      document.querySelector(element).insertAdjacentHTML("beforeend", newHtml);
    },
    deleteListItem: function(selectorID) {
      var el = document.getElementById(selectorID);
      el.parentNode.removeChild(document.getElementById(el));
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
      var type;
      obj.budget > 0 ? (type = "inc") : (type = "exp");
      document.querySelector(DOMstrings.budgetLable).textContent = formatNumber(
        obj.budget,
        type
      );
      document.querySelector(DOMstrings.incomeLable).textContent = formatNumber(
        obj.totalInc,
        "inc"
      );
      document.querySelector(
        DOMstrings.expenseLable
      ).textContent = formatNumber(obj.totalExp, "exp");

      if (obj.percentage > 0) {
        document.querySelector(DOMstrings.percentageLable).textContent =
          obj.percentage + "%";
      } else {
        document.querySelector(DOMstrings.percentageLable).textContent = "---";
      }
    },
    displayPerctages: function(percentages) {
      var fields = document.querySelectorAll(DOMstrings.expensesPercLabel);

      nodeListForEach(fields, function(current, index) {
        if (percentages[index] > 0) {
          current.textContent = percentages[index] + "%";
        } else {
          current.textContent = "---";
        }
      });
    },
    displayMonth: function() {
      var now, months, month, year;

      now = new Date();
      months = [
        "January",
        "February",
        "March",
        "April",
        "May",
        "June",
        "July",
        "August",
        "September",
        "October",
        "November",
        "December"
      ];
      month = now.getMonth();
      year = now.getFullYear();
      document.querySelector(DOMstrings.dateLable).textContent =
        months[month] + " " + year;
    },
    changeType: function() {
      var fields = document.querySelectorAll(
        DOMstrings.inputType +
          "," +
          DOMstrings.inputDescription +
          "," +
          DOMstrings.inputValue
      );
      nodeListForEach(fields, function(cur) {
        cur.classList.toggle("red-focus");
      });

      document.querySelector(DOMstrings.inputBtn).classList.toggle("red");
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

    document
      .querySelector(DOM.inputType)
      .addEventListener("change", UIctrl.changeType);
  };

  var updateBudget = function() {
    // 1. Calculate the budget
    budgetctrl.calculateBudget();

    // 2. Return the budget
    var budget = budgetctrl.getBudget();

    // 3. Display the budget
    UIctrl.displayBudget(budget);
  };

  var updatePercentages = function() {
    //1. calculate percentages

    budgetctrl.calculatePercentages();
    //2. Read percentages from the budget controller
    var percentages = budgetctrl.getPercentages();
    //3. Update the UI with the new percentages

    UIctrl.displayPerctages(percentages);
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

      //  calculate  and update budget
      updateBudget();

      // Calculate and update percentages
      updatePercentages();
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
      ID = parseInt(splitID[1]);

      //1. Delete the item from the data structure
      budgetctrl.deleteItem(type, ID);

      //2. Delete the item from the UI
      UIctrl.deleteListItem(itemID);

      //3. Update and show the new budget
      updateBudget();

      //4. Calculate and update percentages
      updatePercentages();
    }
  };

  return {
    init: function() {
      console.log("Application has started");
      UIctrl.displayMonth();
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
