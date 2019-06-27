function open_product(pid){
    var p_links = document.getElementsByClassName("product_link");
    unselectAll();
    document.getElementById(pid).classList.add("active");
    document.getElementById('message').classList.add("hide");
    getProductInfo(pid);
}


function getProductInfo(pid){

    var args = "pid="+pid;
    var request = new XMLHttpRequest();
    request.open('POST', url_gpmf, true);
    request.setRequestHeader('Content-type',
                             'application/x-www-form-urlencoded');

    request.onload = function(){
        var p_info = JSON.parse(this.responseText);
        console.log(p_info);

        var info = document.querySelector('.product_info');
        info.innerHTML = '<p>' + p_info.product_name + '</p>';

        if (p_info.product_description != '' &&
            p_info.product_description != null)
            info.innerHTML += '<p>' + p_info.product_description + '</p>';

        if (p_info.price_unit_kg != 0 &&
            p_info.price_unit_kg != null)
            info.innerHTML += '<p> $' + (p_info.price_unit_kg / 100) + '</p>';

        if (p_info.price_unit_box != 0 &&
            p_info.price_unit_box != null)
            info.innerHTML += '<p> $' + (p_info.price_unit_box / 100) + '</p>';
    }
    request.send(args);
}

function unselectAll(){
    var p_links = document.getElementsByClassName("product_link");
    var i = 0;
    for (; i < p_links.length; ++i)
        p_links[i].classList.remove("active");
}
