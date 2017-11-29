// module/class
var budgetController = (function () {

    // private members

    // Data Objects:
    var Expense = function (id, description, value) {
        this.id = id;
        this.description = description;
        this.value = value;
    };

    var Income = function (id, description, value) {
        this.id = id;
        this.description = description;
        this.value = value;
    };

    var calculateTotal = function (type) {
        var sum = 0;

        data.allItems[type].forEach(function (current, index, array) {
            sum += current.value;
        });

        data.totals[type] = sum;
    };

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
        // -1 means non existent
        percentage: -1
    };

    var removeItem = function (type, id) {
        console.log('removeItem called with type ' + type + ' and id ' + id);
        var ids, index;

        // create an Array of all ids
        ids = data.allItems[type].map(function (current) {
            console.log('current id is ' + current.id);
            return current.id;
        });
        console.log('ids are ' + ids);

        //get index of element to remove
        index = ids.indexOf(id);
        console.log('index ' + index);

        //if no element is found don't remove anything
        if (index !== -1) {
            //remove element
            data.allItems[type].splice(index, 1);
        }
    };

    // public members
    return {
        addItem: function (type, des, val) {
            var newItem, ID;

            //[1 2 3 4 5], next ID = 6
            //[1 2 4 6 8], next ID = 9
            // ID = last ID + 1

            // Create new ID
            if (data.allItems[type].length > 0)
                ID = data.allItems[type][data.allItems[type].length - 1].id + 1;
            else
                ID = 0;

            // Create new item based on 'inc' or 'exp' type
            if (type === 'exp')
                newItem = new Expense(ID, des, val);
            else if (type === 'inc')
                newItem = new Income(ID, des, val);

            data.allItems[type].push(newItem);

            return newItem;
        },

        calculateBudget: function () {
            // calculate total income and budget
            calculateTotal('exp');
            calculateTotal('inc');

            // calculate budget: income - budget
            data.budget = data.totals.inc - data.totals.exp;

            // calculate percentage of income
            if (data.totals.inc > 0)
                data.percentage = Math.round((data.totals.exp / data.totals.inc) * 100);
            else
                data.percentage = -1;
        },

        getBudget: function () {
            return {
                budget: data.budget,
                income: data.totals.inc,
                expense: data.totals.exp,
                percentage: data.percentage
            }
        },

        deleteItem: function (idArray) {
              removeItem(idArray[0], parseInt(idArray[1]));
        },

        testing: function () {
            console.log(data);
        }
    };

})
// invoking anonymous function / module
();


// ***************************************************


var UIController = (function () {

    // private members
    var DOMSrings = {
        inputTypeCSS: '.add__type',
        inputDescriptionCSS: '.add__description',
        inputValueCSS: '.add__value',
        inputButtonCSS: '.add__btn',
        incomeListCSS: '.income__list',
        expensesListCSS: '.expenses__list',
        budgetValueCSS: '.budget__value',
        budgetIncomeCSS: '.budget__income--value',
        budgetExpenseCSS: '.budget__expenses--value',
        budgetPercentageCSS: '.budget__expenses--percentage',
        containerCSS: '.container'
    };

    // public members
    return {
        getInput: function () {
            return {
                type: document.querySelector(DOMSrings.inputTypeCSS).value,
                description: document.querySelector(DOMSrings.inputDescriptionCSS).value,
                value: parseFloat(document.querySelector(DOMSrings.inputValueCSS).value)
            }
        },

        addListItem: function (obj, type) {
            var html, newHtml, element;

            // create HTML String with placeholder text
            if (type === 'inc')
                html = '<div class="item clearfix" id="inc-%id%"> <div class="item__description">%description%</div> <div class="right clearfix"> <div class="item__value">%value%</div> <div class="item__delete"> <button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
            else if (type === 'exp')
                html = '<div class="item clearfix" id="exp-%id%"> <div class="item__description">%description%</div> <div class="right clearfix"> <div class="item__value">%value%</div> <div class="item__percentage">21%</div> <div class="item__delete"> <button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';

            // Replace placeholder with data
            newHtml = html.replace('%id%', obj.id);
            newHtml = newHtml.replace('%description%', obj.description);
            newHtml = newHtml.replace('%value%', obj.value);

            // insert HTML to DOM
            if (type === 'inc')
                element = document.querySelector(DOMSrings.incomeListCSS);
            else if (type === 'exp')
                element = document.querySelector(DOMSrings.expensesListCSS);

            element.insertAdjacentHTML('afterbegin', newHtml);
        },

        deleteListItem: function (itemId) {
            console.log(itemId);

            var element = document.querySelector('#' + itemId);
            if (element)
                element.parentNode.removeChild(element);
            else
                console.log('Element not found');
        },

        clearFields: function () {
            var fields, fieldsArray;

            //fields is a list here and must be converted to an Array in the next step
            fields = document.querySelectorAll(DOMSrings.inputDescriptionCSS + ', ' + DOMSrings.inputValueCSS);

            //convert list to Array by using Array method slice with generic call method
            fieldsArray = Array.prototype.slice.call(fields);

            //clear all fields
            //call-back function has access to current element, index of array, whole array
            fieldsArray.forEach(function (current, index, array) {
                current.value = "";
            });

            fieldsArray[0].focus();
        },

        displayBudget: function (obj) {

            document.querySelector(DOMSrings.budgetValueCSS).textContent = obj.budget;
            document.querySelector(DOMSrings.budgetIncomeCSS).textContent = obj.income;
            document.querySelector(DOMSrings.budgetExpenseCSS).textContent = obj.expense;

            if (obj.percentage > 0)
                document.querySelector(DOMSrings.budgetPercentageCSS).textContent = obj.percentage + '%';
            else
                document.querySelector(DOMSrings.budgetPercentageCSS).textContent = '---';

        },

        getDOMStrings: function () {
            return DOMSrings;
        }
    }

})();


// ***************************************************


var appController = (function (budgetCtrl, UICtrl) {

    // private members
    var setupEventListeners = function () {
        var domStrings = UICtrl.getDOMStrings();

        document.querySelector(domStrings.inputButtonCSS).addEventListener('click', ctrlAddItem);

        document.addEventListener('keypress', function (event){
            if (event.code === 'Enter' || event.which === 13)
                ctrlAddItem();
        });

        document.querySelector(domStrings.containerCSS).addEventListener('click', ctrlDeleteItem);
    };

    var updateBudget = function () {
        // 1. Calculate budget
        budgetCtrl.calculateBudget();

        // 2. Return budget
        var budget = budgetCtrl.getBudget();

        // 3. Display budget to UI
        console.log(budget);
        UICtrl.displayBudget(budget);
    };

    var ctrlAddItem = function () {
        var input, newItem;

        // 1. get input data
        input = UICtrl.getInput();
        console.log(input);

        if (input.description !== "" && !isNaN(input.value) && input.value > 0){
            // 2. add item to budget
            newItem = budgetCtrl.addItem(input.type, input.description, input.value);

            // 3. add item to UI
            UICtrl.addListItem(newItem, input.type);

            // 4. calculate budget
            updateBudget();

            // 5. display budget in UI

        }

        UICtrl.clearFields();

    };

    var ctrlDeleteItem = function (event) {
        var itemId, splitId;

        itemId = event.target.parentNode.parentNode.parentNode.parentNode.id;

        if (itemId) {
            splitId = itemId.split('-');
            budgetCtrl.deleteItem(splitId);
            UICtrl.deleteListItem(itemId);
            budgetCtrl.calculateBudget();
            UICtrl.displayBudget(budgetCtrl.getBudget());

        }
    };

    // public members
    return {
        init: function () {
            console.log('started');
            setupEventListeners();
        }
    }

})(budgetController, UIController);

appController.init();