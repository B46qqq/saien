//document.getElementById('product_name').addEventListener('keyup',
//                                                         debounce(250, loadSimilarProduct));

document.querySelector('#search_item').addEventListener('click', loadSearchContent);

// Replace content_container with search html data
function loadSearchContent(){

    var request = new XMLHttpRequest();
    request.open('POST', url_to_search, true);
    request.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');

    request.onload = function(){
        var cc = document.querySelector('.content_container');
        cc.innerHTML = this.responseText;
    }
    
    request.send();
}

function filter_product() {
    var input, filter, ul, li, a, i;
    input = document.getElementById("search_product");
    filter = input.value.toUpperCase();
    ul = document.getElementById("myMenu");
    li = ul.getElementsByTagName("li");
    for (i = 0; i < li.length; i++) {
        a = li[i].getElementsByTagName("a")[0];
        if (a.innerHTML.toUpperCase().indexOf(filter) > -1) {
            li[i].style.display = "";
        } else {
            li[i].style.display = "none";
        }
    }
}


function product_description(evt, pname) {
    var i, tabcontent, tablinks;
    tabcontent = document.getElementsByClassName("tabcontent");
    for (i = 0; i < tabcontent.length; i++) {
        tabcontent[i].style.display = "none";
    }
    tablinks = document.getElementsByClassName("tablinks");
    for (i = 0; i < tablinks.length; i++) {
        tablinks[i].className = tablinks[i].className.replace(" active", "");
    }
    document.getElementById(pname).style.display = "block";
    evt.currentTarget.className += " active";
}




function loadSimilarProduct(e){
    e.preventDefault();

    p_name = document.getElementById('product_name').value;
    params = "p_name="+p_name+'&'+"justname=name";

    var request = new XMLHttpRequest();
    request.open('POST', url_to, true);
    request.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');

    request.onload = function(){
        console.log(this.responseText);
    }

    request.send(params);
}

// Prevent too many request been send to the server
// After some delay, the fn will be called
function debounce(delay, fn){
    let timer;
    return function(...args){
        if (timer)
            clearTimeout(timer);
        timer = setTimeout(() => {
            fn(...args);
            timer = null;
        }, delay);
    }
}
