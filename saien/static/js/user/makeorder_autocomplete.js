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
