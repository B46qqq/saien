/*
 * Date picker initalise
 * Restrict to one date selection only
 * Init: 
 *      min-date = current date - 60 days
 *      max-date = current date + 14 days
 */
var calendar = new Datepickk();
calendar.container = document.querySelector('calendar');
calendar.inline = true;
calendar.maxSelections = 1;
calendar.disabledDays = 0;

var currTime = new Date();
var cmd = new Date();
cmd.setDate(cmd.getDate() + 14);
cmd.setHours(0,0,0,0);
calendar.minDate = new Date().setDate(currTime.getDate() - 60);
calendar.maxDate = cmd;
// Setting highlighted dates (existing order)
var delivered_dates = createHighlightDates(existingOrderDate);
var future_order_dates = createHighlightDates(futureOrderDate);


var delivered_order = {
    dates: delivered_dates,
    backgroundColor: '#E99C00',
    color: '#ffffff',
    legend: 'Delivered'//this is optional
};

var future_order = {
    dates: future_order_dates,
    backgroundColor: '#2196F3',
    color: '#ffffff',
    legend: 'Placed Order'//this is optional
};


calendar.highlight = [delivered_order, future_order];

// TODO, more functionality needed
calendar.onSelect = function(checked){
    var state = (checked) ? 'selected' : 'unselected';
    if (checked)
        updateBtn(calendar.selectedDates[0]);
};

calendar.show();
/* 
 * update (activate/disable) function buttons according
 * to the date selected in calendar
 */
function updateBtn(date){
    allBtnDisable();
    var curr = new Date();
    var tmr  = new Date();
    tmr.setDate(tmr.getDate() + 1);
    tmr.setHours(0, 0, 0, 0);

    // If ymd is in the future -> (edit/change, submit, remove::TODO)?
    if (tmr <= date){
        if (selectedDate_inObject(futureOrderDate))
            updateBtnActivate();
        submitBtnActivate();
    } else if (curr.getFullYear() == date.getFullYear()
               && curr.getMonth() == date.getMonth()
               && curr.getDate() == date.getDate()){
        console.log('selected today');
    } else { // checking the existing order ONLY
        if (selectedDate_inObject(existingOrderDate)){
            viewBtnActivate();
            loadBtnActivate();
        }
    }
}

function selectedDate_asString(){
    var s = calendar.selectedDates[0];
    return s.getFullYear().toString()
        + '-'
        + (s.getMonth() + 1).toString()
        + '-'
        + s.getDate().toString();
}

function selectedDate_inObject(object){
    var s = calendar.selectedDates[0];
    if (object[s.getFullYear()] == null) return false;
    if (object[s.getFullYear()][s.getMonth() + 1] == null) return false;
    if (! object[s.getFullYear()][s.getMonth() + 1].includes(s.getDate())) return false;
    return true;
}

function createHighlightDates(dates){
    var dates_list = [];
    for (var y in dates){
        for (var m in dates[y]){
            var days = dates[y][m];

            if (days.length != 0){
                var linked_days_start = days[0];
                var linked_days_end = days[0];

                for (var i = 1; i < days.length; ++i){
                    if ((linked_days_end + 1) == days[i])
                        ++ linked_days_end;
                    else{
                        dates_list.push(
                            {
                                start: new Date(y, m - 1, linked_days_start),
                                end: new Date(y, m - 1, linked_days_end)
                            }
                        );
                        linked_days_start = days[i];
                        linked_days_end = days[i];
                    }
                }
                // Account for the last entry in days list
                dates_list.push(
                    {
                        start: new Date(y, m - 1, linked_days_start),
                        end: new Date(y, m - 1, linked_days_end)
                    }
                );
            }
        }
    }
    return dates_list;
}



function addItem(e){
    newItem();
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
    
    for (var i = 1; i < items.length; ++i){
        if (isOrderItemEmpty(items[i]))
            ableToSubmit = false;
    }

    for (var i = 1; i < items.length; ++i)
        if (!isOrderItemValid(items[i]))
            ableToSubmit = false;

    // process to submit
    if (ableToSubmit){
        var order = {}
        order['date'] = selectedDate_asString();
        // JSON.stringfy data and POST with ajax
        for (var i = 1; i < items.length; ++i)
            order["item" + i.toString()] = objectifyItem(items[i]);

        ajaxPostJson(JSON.stringify(order));
    }
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
function loadExistingOrder(){
    var date = selectedDate_asString();
    var x = document.getElementsByTagName('product');
    var length = x.length;
    for (var i = length-1; i > 0; --i){
        x[0].parentNode.removeChild(x[i]);
    }
    appendExistingOrder(date);
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


function showExistingOrder(){
    var date = selectedDate_asString();
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






/*
 * *****************************************************
 * ********************************Button Status Section
 * Manage all buttons related functionality on this page.
 */
function allBtnDisable(){
    submitBtnDisable();
    updateBtnDisable();
    viewBtnDisable();
    loadBtnDisable();
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

function updateBtnActivate(){
    var btn = document.getElementById('update');
    btn.classList.remove('disabled');
    btn.setAttribute('onclick', 'loadExistingOrder()');
}

function updateBtnDisable(){
    var btn = document.getElementById('update');
    btn.classList.add('disabled');
    btn.setAttribute('onclick', '');    
}

function viewBtnActivate(){
    var btn = document.getElementById('viewBtn');
    btn.classList.remove('disabled');
    btn.setAttribute('onclick', 'showExistingOrder()');
}

function viewBtnDisable(){
    var btn = document.getElementById('viewBtn');
    btn.classList.add('disabled');
    btn.setAttribute('onclick', '');
}

function loadBtnActivate(){
    var btn = document.getElementById('loadBtn');
    btn.classList.remove('disabled');
    btn.setAttribute('onclick', 'loadExistingOrder()');
}

function loadBtnDisable(){
    var btn = document.getElementById('loadBtn');
    btn.classList.add('disabled');
    btn.setAttribute('onclick', '');
}
/*
 * ****************************Button Status Section END
 */
