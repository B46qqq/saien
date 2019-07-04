var products = products.productNames;
// Global array storing names of already selected items.
// This acts as a barrier for user to select the same item
// twice.
var selectedItems = [];

function autocomplete(inp, arr) {
    /*the autocomplete function takes two arguments,
      the text field element and an array of possible autocompleted values:*/
    var currentFocus;
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
        makeValid(inp.parentNode);
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
        setTimeout(function(){
            var needRemove = inp.parentNode.querySelector(".autocomplete-items");
            if (needRemove != null)
                inp.parentNode.removeChild(needRemove);
            verifyProductName(inp.parentNode);
        }, 300);
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

function makeInvalid(element){
    var input = element.querySelector('input');
    var label = element.querySelector('span');
    input.classList.add('invalid_input');
    label.classList.add('invalid_label');
    label.innerHTML = 'product does not exist / invalid';    
}

function makeValid(element){
    var input = element.querySelector('input');
    var label = element.querySelector('span');
    input.classList.remove('invalid_input');
    label.classList.remove('invalid_label');
    label.innerHTML = 'product name';
}

function verifyProductName(element){
    var val = element.querySelector('input').value;
    if (val == null || val == '')
        return;
    if (!products.includes(val))
        makeInvalid(element);
}


function newItem() {
    var toClone = document.querySelector('product');
    var cloned = toClone.cloneNode(true);
    cloned.style.display = 'grid';
    autocomplete(cloned.querySelector('input'), products);
    var orderSection = document.querySelector("orderSection");
    var addBtn = document.querySelector("addBtn");
    orderSection.insertBefore(cloned, addBtn);
    var prevNum = cloned.previousElementSibling.querySelector('orderNumber').innerHTML;
    cloned.querySelector('orderNumber').innerHTML = parseInt(prevNum) + 1;
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
