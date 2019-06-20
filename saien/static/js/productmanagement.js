function getProductForm(pid){

    var args = "pid="+pid;
    var request = new XMLHttpRequest();
    request.open('POST', url_gpmf, true);
    request.setRequestHeader('Content-type',
                             'application/x-www-form-urlencoded');

    request.onload = function(){
        var p_name = document.getElementById('pinfo_name');
        var p_des = document.getElementById('pinfo_des');
        var p_pkg = document.getElementById('pinfo_pkg');
        var p_box = document.getElementById('pinfo_box');
        
        p_info = JSON.parse(this.responseText);
        
        p_name.value = p_info.product_name;
        if (p_info.product_description == null){
            p_info.product_description = '';            
            p_des.value = '';
        } else p_des.value = p_info.product_description;

        if (p_info.price_unit_kg != null)
            p_pkg.value = (p_info.price_unit_kg / 100);
        else p_pkg.value = '';
        p_pkg.focus();
        p_pkg.blur();

        if (p_info.price_unit_box != null)
            p_box.value = (p_info.price_unit_box / 100);
        else p_box.value = '';
        p_box.focus();
        p_box.blur();

        p_name.addEventListener("input", function(){
            if (p_name.value != p_info.product_name)
                p_field_change('pname');
            else
                p_field_revert('pname');
        });

        p_des.addEventListener("input", function(){
            if (p_des.value != p_info.product_description)
                p_field_change('pdes');
            else
                p_field_revert('pdes');
        });

        p_pkg.addEventListener("input", function(){
            if (Number(p_pkg.value) != Number(p_info.price_unit_kg/100))
                p_field_change('ppkg');
            else
                p_field_revert('ppkg');
        });

        p_box.addEventListener("input", function(){
            if (Number(p_box.value) != Number(p_info.price_unit_box/100))
                p_field_change('pbox');
            else
                p_field_revert('pbox');
        });
        
    }
    request.send(args);
}

function open_product(e, pid){
    revert_all_fields();
    
    p_links = document.getElementsByClassName("product_link");
    var i = 0;
    for (; i < p_links.length; ++i)
        p_links[i].classList.remove("active");
    e.currentTarget.classList.add("active");
    getProductForm(pid);
}

function p_field_change(f){
    var update_btn = document.querySelector('.reg_btn');
    var label = document.getElementById(f+'_label');
    var border = document.getElementById(f+'_border');
    update_btn.classList.remove('hide');
    label.classList.add('label_changed');
    label.innerHTML = label.innerHTML.replace('Current', 'Future');
    border.classList.add('border_changed');
}

function p_field_revert(f){
    var update_btn = document.querySelector('.reg_btn');
    var label = document.getElementById(f+'_label');
    var border = document.getElementById(f+'_border');
    update_btn.classList.add('hide');    
    label.classList.remove('label_changed');
    label.innerHTML = label.innerHTML.replace('Future', 'Current');
    border.classList.remove('border_changed');
}

function revert_all_fields(){
    var fields = ["pname", "pdes", "ppkg", "pbox"];
    var i = 0;
    for (; i < fields.length; ++i)
        p_field_revert(fields[i]);
}

var currencyInput = document.querySelectorAll('input[type="currency"]');
var currency = 'AUD';
// https://www.currency-iso.org/dam/downloads/lists/list_one.xml

for (var p = 0; p < currencyInput.length; ++p){
    currencyInput[p].addEventListener('focus', onFocus);
    currencyInput[p].addEventListener('blur', onBlur);
}

function localStringToNumber( s ){
    return Number(String(s).replace(/[^0-9.-]+/g,""));
}

function onFocus(e){
    var value = e.target.value;
    e.target.value = value ? localStringToNumber(value) : '';
}

function onBlur(e){
    var value = e.target.value;
    const options = {
        maximumFractionDigits : 2,
        currency              : currency,
        style                 : "currency",
        currencyDisplay       : "symbol"
    }
    
    e.target.value = value 
        ? localStringToNumber(value).toLocaleString(undefined, options)
        : '';
}


function confirmDelete(e){
    e.currentTarget.style.display= 'none';
    document.getElementById('delete').classList.remove('hide');
    document.getElementById('delete').classList.add('del_confirm');
    document.getElementById('canceldelete').classList.remove('hide');
}

function cancelDelete(){
    document.getElementById('beforedelete').style.display = "block";
    document.getElementById('delete').classList.add('hide');
    document.getElementById('delete').classList.remove('del_confirm');
    document.getElementById('canceldelete').classList.add('hide');
}
