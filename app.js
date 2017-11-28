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

    // public members
    return {
        addItem: function (type, des, val) {
            var newItem, ID;

            //[1 2 3 4 5], next ID = 6
            //[1 2 4 6 8], next ID = 9

            // Create new ID
            ID = data.allItems[type][data.allItems[type].length - 1].id + 1;

            // Create new item based on 'inc' or 'exp' type
            if (type === 'exp')
                newItem = new Expense(ID, des, val);
            else if (type === 'inc')
                newItem = new Income(ID, des, val);

            data.allItems[type].push(newItem);

            return newItem;
        }
    };

})
// invoking anonymous function / module
();


var UIController = (function () {

    // private members
    var DOMSrings = {
        inputTypeCSS: '.add__type',
        inputDescriptionCSS: '.add__description',
        inputValueCSS: '.add__value',
        inputButtonCSS: '.add__btn'
    };

    // public members
    return {
        getInput: function () {
            return {
                type: document.querySelector(DOMSrings.inputTypeCSS).value,
                description: document.querySelector(DOMSrings.inputDescriptionCSS).value,
                value: document.querySelector(DOMSrings.inputValueCSS).value
            }
        },

        getDOMStrings: function () {
            return DOMSrings;
        }
    }

})();


var appController = (function (budgetCtrl, UICtrl) {

    // private members
    var setupEventListeners = function () {
        var domStrings = UICtrl.getDOMStrings();

        document.querySelector(domStrings.inputButtonCSS)
            .addEventListener('click', ctrlAddItem);

        document.addEventListener('keypress', function (event){
            if (event.code === 'Enter' || event.which === 13)
                ctrlAddItem();
        });
    };

    var ctrlAddItem = function () {
        // 1. get input data
        var input = UICtrl.getInput();
        console.log(input);
        // 2. add item to budget
        // 3. add item to UI
        // 4. calculate budget
        // 5. display budget in UI

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