var products = products.productNames;
var unitDict = {
    "pc" : "Piece",
    "kg" : "Kilogram",
    "box" : "Box/Bag/Tray"};

// Global array storing names of already selected items.
// This acts as a barrier for user to select the same item
// twice.
var selectedItems = [];

/*
 * EventListener for orderDate input element.
 */
var odinput = document.querySelector('input[type="date"]');
odinput.addEventListener('click', function(){
    resetField(this.parentNode, 'date for this order; important');
});

odinput.addEventListener('input', function(){
    if (this.value == '' || this.value == null){
        submitBtnDisable();
        updateBtnDisable();
    } else {
        var day = new Date(this.value);
        if (day.getDay() == 0) {// Does not make order on Sundays
            makeInvalidField(this.parentNode, 'no order on Sundays');
            submitBtnDisable();
            updateBtnDisable();
        } else {
            makeValidField(this.parentNode);
            submitBtnActivate();
            if (orderExistAlready(day))
                updateBtnActivate(ordersTime[day.toISOString()]);
            else
                updateBtnDisable();
        }
    }
});



function orderExistAlready(selected){
    return !!ordersTimeList.find(
        item => {return item.getTime() == selected.getTime()}
    );
}


function autocomplete(inp, arr) {
    /*the autocomplete function takes two arguments,
      the text field element and an array of possible autocompleted values:*/
    var currentFocus;
    var lastValue;
    /*execute a function when someone writes in the text field:*/
    inp.addEventListener("input", function(e) {
        var a, b, i, val = this.value;
        /*close any already open lists of autocompleted values*/
        closeAllLists();
        if (!val) { return false;}
        currentFocus = -1;
        /*create a DIV element that will contain the items (values):*/
        a = document.createElement("DIV");
        a.setAttribute("id", this.id + "autocomplete-list");
        a.setAttribute("class", "autocomplete-items");
        /*append the DIV element as a child of the autocomplete container:*/
        this.parentNode.appendChild(a);
        /*for each item in the array...*/
        for (i = 0; i < arr.length; i++) {
            /* -- check if the item starts with the same letters as the text field value: -- */
            // Changed: Filter consider string within as oppose to only considering the first letter.
            var matchingIndex = arr[i].toUpperCase().indexOf(val.toUpperCase());
            if (matchingIndex > -1){
//            if (arr[i].substr(0, val.length).toUpperCase() == val.toUpperCase()) {
                /*create a DIV element for each matching element:*/
                b = document.createElement("DIV");
                /*make the matching letters bold:*/
                b.innerHTML = arr[i].substr(0, matchingIndex);
                b.innerHTML += "<u>" + arr[i].substr(matchingIndex, val.length) + "</u>";
                b.innerHTML += arr[i].substr(matchingIndex + val.length);
                /*insert a input field that will hold the current array item's value:*/
                b.innerHTML += "<input type='hidden' value='" + arr[i] + "'>";
                /*execute a function when someone clicks on the item value (DIV element):*/
                b.addEventListener("click", function(e) {
                    /*insert the value for the autocomplete text field:*/
                    inp.value = this.getElementsByTagName("input")[0].value;
                    /*close the list of autocompleted values,
                      (or any other open lists of autocompleted values:*/
                    closeAllLists();
                });
                a.appendChild(b);
            }
        }
    });
    /*execute a function presses a key on the keyboard:*/
    inp.addEventListener("keydown", function(e) {
        var x = document.getElementById(this.id + "autocomplete-list");
        if (x) x = x.getElementsByTagName("div");
        if (e.keyCode == 40) {
            /*If the arrow DOWN key is pressed,
              increase the currentFocus variable:*/
            currentFocus++;
            /*and and make the current item more visible:*/
            addActive(x);
        } else if (e.keyCode == 38) { //up
            /*If the arrow UP key is pressed,
              decrease the currentFocus variable:*/
            currentFocus--;
            /*and and make the current item more visible:*/
            addActive(x);
        } else if (e.keyCode == 13) {
            /*If the ENTER key is pressed, prevent the form from being submitted,*/
            e.preventDefault();
            if (currentFocus > -1) {
                /*and simulate a click on the "active" item:*/
                if (x) x[currentFocus].click();
            }
        }
    });

    /* 
     * Make input field valid regardless of previous state.
     * 
     */
    inp.addEventListener("click", function(e){
        resetField(inp.parentNode, 'product name');
    });

    /*
     * Remove 'active' status when input's focusout
     * Check input's value with a 0.3seconds delay (0.5seconds feels uncomfortable)
     * (reason for : user might use their pointing device
     *               to choose an product from the dropdown,
     *               those action will cause focus out,
     *               therefore for a breif second input field
     *               will be rendered as invalid.
     */
    inp.addEventListener("focusout", function(e){

        var sel = inp.parentNode.nextElementSibling.querySelector('select');
        if (lastValue != this.value && (lastValue != null || lastValue == undefined)){
            // lastValue != null counter for initial
            sel.value = "";
            resetField(sel.parentNode, 'unit');
            removeUnitSelector(this.parentNode.nextElementSibling);
            updateUnitSelector(this.value, this.parentNode.nextElementSibling);
        }
        
        setTimeout(function(){
            var needRemove = inp.parentNode.querySelector(".autocomplete-items");
            if (needRemove != null)
                inp.parentNode.removeChild(needRemove);
            verifyProductName(inp.parentNode);
        }, 300);
        lastValue = this.value;
    });

    function addActive(x) {
        /*a function to classify an item as "active":*/
        if (!x) return false;
        /*start by removing the "active" class on all items:*/
        removeActive(x);
        if (currentFocus >= x.length) currentFocus = 0;
        if (currentFocus < 0) currentFocus = (x.length - 1);
        /*add class "autocomplete-active":*/
        x[currentFocus].classList.add("autocomplete-active");
    }
    
    function removeActive(x) {
        /*a function to remove the "active" class from all autocomplete items:*/
        for (var i = 0; i < x.length; i++) {
            x[i].classList.remove("autocomplete-active");
        }
    }
    
    function closeAllLists(elmnt) {
        /*close all autocomplete lists in the document,
          except the one passed as an argument:*/
        var x = document.getElementsByClassName("autocomplete-items");
        for (var i = 0; i < x.length; i++) {
            if (elmnt != x[i] && elmnt != inp) {
                x[i].parentNode.removeChild(x[i]);
            }
        }
    }
}

function updateUnitSelector(val, e){
    if (val == '' || val == null) return;
    thisUnits = productsUnit[val];
    if (thisUnits == null) return;
    for (var i = 0; i < thisUnits.length; ++i){
        var opt = document.createElement('option');
        opt.value = thisUnits[i];
        opt.innerHTML = unitDict[thisUnits[i]];
        e.querySelector('select[name="unit"]').appendChild(opt);
    }
}

function removeUnitSelector(e){
    select = e.querySelector('select[name="unit"]');
    options = e.querySelectorAll('option');
    for (var i = 1; i < options.length; ++i){
        select.removeChild(options[i]);
    }
}


function unit_input (inp){
    var ops = inp.getElementsByTagName('option');
//    var validVals = []
//    for (var i = 1; i < ops.length; ++i)
//        validVals.push(ops[i].value);
    
    inp.addEventListener('click', function(){
        resetField(inp.parentNode, 'unit');
    });

    inp.addEventListener('focusout', function(){
        if (this.value != null && this.value != '')
            makeValidField(inp.parentNode);
    });
}

function quan_input (inp){
    //    var regFloat = new RegExp('^[0-9]+(\.[0-9]{0,2})?$');
    var regFloat = new RegExp('^([0-9]+(\.[0-9]{0,1})?|\.([0-9]{0,1})?)$');

    inp.addEventListener('click', function(){
        resetField(inp.parentNode, 'quantity');
    });

    inp.addEventListener('focusout', function(){
        this.value = parseFloat(this.value).toFixed(1);
        if (!inp.checkValidity()){
            makeInvalidField(inp.parentNode, 'invalid quantity');
            return;
        }

        if (inp.value == null || inp.value == '')
            return;

        if (!regFloat.test(inp.value))
            makeInvalidField(inp.parentNode, 'reasonable value only');
        else 
            makeValidField(inp.parentNode);
    });
}


function resetField(element, message){
    var input = element.querySelector('input');
    var selec = element.querySelector('select');
    var label = element.querySelector('span');

    if (input != null){
        input.classList.remove('invalid_input');
        input.classList.remove('valid_input');
    }
    if (selec != null){
        selec.classList.remove('invalid_input');
        selec.classList.remove('valid_input');
    }
    if (label != null){
        label.classList.remove('invalid_label');
        label.classList.remove('valid_label');
        label.innerHTML = message;
    }
}

function makeInvalidField(element, message){
    var input = element.querySelector('input');
    var selec = element.querySelector('select');
    var label = element.querySelector('span');

    if (input != null)
        input.classList.add('invalid_input');
    if (selec != null)
        selec.classList.add('invalid_input');
    if (label != null){
        label.classList.add('invalid_label');
        label.innerHTML = message;
    }
}
    

function makeValidField(element){
    var input = element.querySelector('input');
    var selec = element.querySelector('select');
    var label = element.querySelector('span');

    if (input != null)
        input.classList.add('valid_input');
    if (selec != null)
        selec.classList.add('valid_input');
    if (label != null){
        label.classList.add('valid_label');
    }
}


/*
 * args: <label ...>
 * return false when product name entered is not valid.
 * return true when input field contains valid product name
 */
function verifyProductName(element){
    var val = element.querySelector('input').value;
    if (val == null || val == '')
        return false;
    if (!products.includes(val)){
        makeInvalidField(element, 'product does not exist / invalid name');
        return false;
    }
    makeValidField(element);
    return true;
}

function submitBtnActivate(){
    var btn = document.getElementById('placeOrder');
    btn.classList.remove('disabled');
    btn.setAttribute('onclick', 'submitOrderForm()');
}


function submitBtnDisable(){
    var btn = document.getElementById('placeOrder');
    btn.classList.add('disabled');
    btn.setAttribute('onclick', '');
}

function updateBtnActivate(dateString){
    var btn = document.getElementById('update');
    btn.classList.remove('disabled');
    btn.setAttribute('onclick', "loadExistingOrder('"+dateString+"')");
}

function updateBtnDisable(){
    var btn = document.getElementById('update');
    btn.classList.add('disabled');
    btn.setAttribute('onclick', '');    
}


function newItem() {
    var toClone = document.querySelector('product');
    var cloned = toClone.cloneNode(true);
    cloned.style.display = 'grid';
    
    autocomplete(cloned.querySelector('input'), products);
    unit_input(cloned.querySelector('select[name="unit"]'));
    quan_input(cloned.querySelector('input[name="quantity"]'));
    
    var orderSection = document.querySelector("orderSection");
    var addBtn = document.querySelector("addBtn");
    orderSection.insertBefore(cloned, addBtn);
    var prevNum = cloned.previousElementSibling.querySelector('orderNumber').innerHTML;
    cloned.querySelector('orderNumber').innerHTML = parseInt(prevNum) + 1;
}



function newItemArgs(pname, punit, quantity){
    var toClone = document.querySelector('product');
    var cloned = toClone.cloneNode(true);
    cloned.style.display = 'grid';

    var temp = cloned.querySelector('input');
    temp.value = pname;
    autocomplete(temp, products);

    var sel = cloned.querySelector('select[name="unit"]');
    unit_input(sel);

    var quan = cloned.querySelector('input[name="quantity"]');
    quan_input(quan);
    quan.value = quantity;
    
    var orderSection = document.querySelector("orderSection");
    var addBtn = document.querySelector("addBtn");
    orderSection.insertBefore(cloned, addBtn);
    var prevNum = cloned.previousElementSibling.querySelector('orderNumber').innerHTML;
    cloned.querySelector('orderNumber').innerHTML = parseInt(prevNum) + 1;

    sel.value = punit;
    temp.dispatchEvent(new Event('focusout'));
    sel.querySelector('option[value="'+punit+'"]').selected = true;
    sel.dispatchEvent(new Event('focusout'));
    quan.dispatchEvent(new Event('focusout'));
}



function addItem(e){
    newItem();
}

// Remove corresponding <product> entry from <orderSection>
// In addition, update all following <orderNumber> within each <product>
function deleteItem(e){
    var target = e.target.parentNode;
    var from = document.querySelector('orderSection');
    var targetNum = parseInt(target.querySelector('orderNumber').innerHTML);
    var updates = from.querySelectorAll('product');
    
    for (var i = targetNum; i < updates.length; i++){
        var c = updates[i].querySelector('orderNumber');
        c.innerHTML = parseInt(c.innerHTML) - 1;
    }
    from.removeChild(target);
}


/*
 * args: none
 * Final browser side input validation before submit
 * to server.
 */
function submitOrderForm(){
    // One by One checking if field is valid or not;
    var items = document.getElementsByTagName('product');
    var date = document.querySelector('orderDate');
    var ableToSubmit = true;

    if (items.length <= 1){
        var msg_div = document.getElementById('message');
        var msg = msg_div.querySelector('strong');
        msg_div.classList.remove('hide');
        msg_div.classList.add('warning');
        msg.innerHTML = 'Order list is empty.';
        return;
    }
    
    // Check if any required input is empty
    if (isOrderDateEmpty(date))
        ableToSubmit = false;
    
    for (var i = 1; i < items.length; ++i){
        if (isOrderItemEmpty(items[i]))
            ableToSubmit = false;
    }

    // check if all required inputs are valid
    if (!isOrderDateValid(date))
        ableToSubmit = false;

    for (var i = 1; i < items.length; ++i)
        if (!isOrderItemValid(items[i]))
            ableToSubmit = false;

    // process to submit
    if (ableToSubmit){
        var order = {}
        order['date'] = date.querySelector('input[type="date"]').value;
        // JSON.stringfy data and POST with ajax
        for (var i = 1; i < items.length; ++i)
            order["item" + i.toString()] = objectifyItem(items[i]);

        ajaxPostJson(JSON.stringify(order));
    }
}

/*
 * args: <orderDate ...>
 * check if orderDate input emptyness
 * ret -> true  = empty
 *        false = not empty (valid)
 */
function isOrderDateEmpty(date){
    var input = date.querySelector('input[type="date"]');
    if (input.value == '' || input.value == null){
        makeInvalidField(input.parentNode, 'order date empty');
        return true;
    }
    return false;
}


/*
 * args: <product ...>
 * for each item in order form, check for input.
 * each input field must contain valid data before
 * submit. (Browser side check only)
 */
function isOrderItemEmpty(item){
    var p = item.getElementsByTagName('input')[0];
    var u = item.querySelector('select');
    var q = item.getElementsByTagName('input')[1];
    var arr = [p, u, q];
    var ret = false;

    for (var i = 0; i < arr.length; ++i){
        if (arr[i].value == '' || arr[i].value == null){
            makeInvalidField(arr[i].parentNode, 'required');
            ret = true;
        }
    }
    return ret;
}

function isOrderDateValid(date){
    return !date.querySelector('input[type="date"]').classList.contains('invalid_input');
}

function isOrderItemValid(item){
    var p = item.getElementsByTagName('input')[0];
    var u = item.querySelector('select');
    var q = item.getElementsByTagName('input')[1];
    var arr = [p, u, q];

    for (var i = 0; i < arr.length; ++i)
        if (arr[i].classList.contains('invalid_input'))
            return false;
    return true;
}


/*
 * args: <product ...>
 * Extract any order related input,
 * return a dictionary containing those input values.
 */
function objectifyItem(item){
    var pname = item.querySelector('input[name="pname"]');
    var unit = item.querySelector('select[name="unit"]');
    var quan = item.querySelector('input[name="quantity"]');
    
    return {"pname" : pname.value,
            "unit" : unit.value,
            "quantity" : quan.value};
}

/*
 * args: JSON.stringify'ed value
 * main purpose divide code into smaller section for better maintenance
 * objective: send value via ajax post,
 * upon receive, display success / error message
 */
function ajaxPostJson(jsonString){
    
    var request = new XMLHttpRequest();
    request.open('POST', url_placeorder, true);
    request.setRequestHeader('Content-type',
                             'application/json');

    request.onload = function(){
        var ret =  JSON.parse(this.responseText);
        if (ret.redirect){
            window.location.href = ret.redirect;
            return;
        }
        var msg_div = document.getElementById('message');
        var msg = msg_div.querySelector('strong');
        msg_div.classList.remove('hide');
        msg_div.classList.remove('warning');
        if ('success' in ret){
            msg_div.classList.add('success');
            msg.innerHTML = ret['success'];
            return;
        }
        msg_div.classList.remove('success');
        msg.innerHTML = ret['error'];
    }
    
    request.send(jsonString);
}


// for formHistory section
var fh = document.querySelector('select[name="orderhistory"]');
var fh_child = fh.getElementsByTagName('option');
var fh_clear = new Event('clearsection');

fh.addEventListener('click', function(){
    resetField(this.parentNode, 'most recent orders: maximum of 10');
});

fh.addEventListener('focusout', function(){
    var fh_section = document.querySelector('formHistory');
    if (this.value != ""){
        makeValidField(this.parentNode);
        // view existing order history
        var temp = fh_section.querySelector('button[name="view"]');
        temp.classList.remove('disabled');
        temp.setAttribute('onclick', "showExistingOrder('"+this.value+"')");
        // copy existing order history
        var temp = fh_section.querySelector('button[name="append"]');
        temp.classList.remove('disabled');
        temp.setAttribute('onclick', "appendExistingOrder('"+this.value+"')");

        var temp = fh_section.querySelector('button[name="load"]');
        temp.classList.remove('disabled');
        temp.setAttribute('onclick', "loadExistingOrder('"+this.value+"')");
    }
});

fh.addEventListener('clearsection', function(){
    this.querySelector('option[value=""]').selected = true;
    resetField(this.parentNode, 'most recent orders: maximum of 10');

    var fh_section = document.querySelector('formHistory');
    var temp = fh_section.querySelector('button[name="view"]');
    temp.classList.add('disabled');
    temp.removeAttribute('onclick');
    // copy existing order history
    temp = fh_section.querySelector('button[name="append"]');
    temp.classList.add('disabled');
    temp.removeAttribute('onclick');

    temp = fh_section.querySelector('button[name="load"]');
    temp.classList.add('disabled');
    temp.removeAttribute('onclick');
});

for (var i = 1; i < fh_child.length; ++i){
    fh_child[i].addEventListener('click', function(){
        this.parentNode.dispatchEvent(new Event('focusout'));
    });
}


/* 
 * Just a cleaner version of appendExistingorder,
 * as this first empties current order form data.
 * What I learned: when removing all child element from a div,
 * remove from backward. Last child element remove first.
 * Or dont use reference variable (var)
 */
function loadExistingOrder(data){
    var x = document.getElementsByTagName('product');
    var length = x.length;
    for (var i = length-1; i > 0; --i){
        x[0].parentNode.removeChild(x[i]);
    }
    appendExistingOrder(data);
}

function appendExistingOrder(date){
    var args = "date="+date;
    var request = new XMLHttpRequest();
    request.open('POST', url_copyorder, true);
    request.setRequestHeader('Content-type',
                             'application/x-www-form-urlencoded');

    request.onload = function(){
        var order_info =  JSON.parse(this.responseText);
        for (var i = 0; i < order_info.orders.length; ++i){
            var x = order_info.orders[i];
            newItemArgs(x[0], x[1], x[2]);
        }
        fh.dispatchEvent(fh_clear);
    };

    request.send(args);
}


function showExistingOrder(date){
    // Get the modal
    var modal = document.getElementById("myModal");
    // Get the <span> element that closes the modal
    var span = document.getElementsByClassName("close")[0];
    
    // When the user clicks the button, open the modal 
    modal.style.display = "block";
    
    // When the user clicks on <span> (x), close the modal
    span.onclick = function() {
        modal.style.display = "none";
        removeOrderTable(modal);
    }
    
    // When the user clicks anywhere outside of the modal, close it
    window.onclick = function(event) {
        if (event.target == modal) {
            modal.style.display = "none";
            removeOrderTable(modal);
        }
    }

    /* send AJAX POST to backend, fetching for existing orders list
     */
    var args = "date="+date;
    var request = new XMLHttpRequest();
    request.open('POST', url_vieworder, true);
    request.setRequestHeader('Content-type',
                             'application/x-www-form-urlencoded');

    request.onload = function(){
        var order_info =  JSON.parse(this.responseText);
        makeOrderTable(modal, order_info);
    };

    request.send(args);
}


function makeOrderTable(div, data){
    var contentDiv = div.querySelector('.orderContent');
    var table = document.createElement('table');
    contentDiv.appendChild(table);
    
    var col = document.createElement('tr')
    for (var i = 0; i < data.column.length; ++i){
        var th = document.createElement('th');
        th.innerHTML = data.column[i];
        col.appendChild(th);
    }
    table.appendChild(col);

    var rows = data.rows;
    for (var i = 0; i < rows.length; ++i){
        var row = document.createElement('tr');
        for (var j = 0; j < rows[i].length; ++j){
            var td = document.createElement('td');
            td.innerHTML = rows[i][j];
            row.appendChild(td);
        }
        table.appendChild(row);
    }
}

function removeOrderTable(div){
    var table = div.querySelector('table');
    if (table != null)
        table.parentNode.removeChild(table);
}

