function getProductForm(pid){

    var args = "pid="+pid;
    var request = new XMLHttpRequest();
    request.open('POST', url_pinfo, true);
    request.setRequestHeader('Content-type',
                             'application/x-www-form-urlencoded');

    request.onload = function(){
        var p_id = document.getElementById('pinfo_id');
        var p_name = document.getElementById('pinfo_name');
        var p_des = document.getElementById('pinfo_des');
        var p_ppc = document.getElementById('pinfo_ppc');
        var p_pkg = document.getElementById('pinfo_pkg');
        var p_box = document.getElementById('pinfo_box');
        
        var p_info = JSON.parse(this.responseText);

        p_id.value = p_info.product_id;
        p_name.value = p_info.product_name;
        if (p_info.product_description == null){
            p_info.product_description = '';            
            p_des.value = '';
        } else p_des.value = p_info.product_description;

        if (p_info.price_unit_pc != null)
            p_ppc.value = (p_info.price_unit_pc / 100);
        else p_ppc.value = 0;
        p_ppc.focus();
        p_ppc.blur();

        if (p_info.price_unit_kg != null)
            p_pkg.value = (p_info.price_unit_kg / 100);
        else p_pkg.value = 0;
        p_pkg.focus();
        p_pkg.blur();

        if (p_info.price_unit_box != null)
            p_box.value = (p_info.price_unit_box / 100);
        else p_box.value = 0;
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

        p_ppc.addEventListener("input", function(){
            if (localStringToNumber(p_ppc.value) != Number(p_info.price_unit_pc/100))
                p_field_change('pppc');
            else
                p_field_revert('pppc');
        });

        p_pkg.addEventListener("input", function(){
            if (localStringToNumber(p_pkg.value) != Number(p_info.price_unit_kg/100))
                p_field_change('ppkg');
            else
                p_field_revert('ppkg');
        });

        p_box.addEventListener("input", function(){
            if (localStringToNumber(p_box.value) != Number(p_info.price_unit_box/100))
                p_field_change('ppbox');
            else
                p_field_revert('ppbox');
        });
        
    }
    request.send(args);
}

function open_product(pid){
    revert_all_fields();
    if (!document.getElementById('delete').classList.contains('hide'))
        cancelDelete();

    var p_links = document.getElementsByClassName("product_link");
    unselectAll()
    document.getElementById(pid).classList.add("active");
    document.getElementById('message').classList.add("hide");
    getProductForm(pid);
}

function refresh_product(pid){
    var mess = document.getElementById('message')
    if (! mess.classList.contains('hide')){
        open_product(pid);
        mess.classList.remove('hide')
        return;
    }
    open_product(pid);
}


function p_field_change(f){
    var update_btn = document.querySelector('.reg_btn');
    var label = document.getElementById(f+'_label');
    var input = document.getElementsByName(f)[0];

    update_btn.classList.remove('disabled');
    update_btn.setAttribute('onclick', 'updateProduct()');
    label.classList.add('label_changed');
    label.innerHTML = label.innerHTML.replace('Current', 'Future');
    input.classList.add('input_changed');
}

function p_field_revert(f){
    var label = document.getElementById(f+'_label');
    var input = document.getElementsByName(f)[0];
    
    label.classList.remove('label_changed');
    label.innerHTML = label.innerHTML.replace('Future', 'Current');
    input.classList.remove('input_changed');
    updateSubmitButtonStatus();
}

function updateSubmitButtonStatus(){
    if (document.getElementsByClassName('label_changed').length == 0){
        var update_btn = document.querySelector('.reg_btn');
        update_btn.classList.add('disabled');
        update_btn.setAttribute('onclick', '');        
    }
}

function revert_all_fields(){
    var fields = ["pname", "pdes", "pppc", "ppkg", "ppbox"];
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
    if (value == 0){
        e.target.value = '';
        return;
    }
    e.target.value = value ? localStringToNumber(value) : '';
}

function onBlur(e){
    var value = e.target.value;
    value = localStringToNumber(value);
    const options = {
        maximumFractionDigits : 2,
        currency              : currency,
        style                 : "currency",
        currencyDisplay       : "symbol"
    }
    if (value == '' || value == null){
        e.target.value = 0;
        return;
    }
    e.target.value = value.toLocaleString(undefined, options);
}


function unselectAll(){
    var p_links = document.getElementsByClassName("product_link");
    var i = 0;
    for (; i < p_links.length; ++i)
        p_links[i].classList.remove("active");
}

function getFormData(){
    var form = document.getElementById('product_form');
    var fd = new FormData(form);
    var pid = fd.get('pid');

    var args = 'pid=' + pid;
    args += ('&' + 'pname=' + fd.get('pname'));
    args += ('&' + 'pdes=' + fd.get('pdes').trim());
    args += ('&' + 'pppc=' + localStringToNumber(fd.get('pppc')));
    args += ('&' + 'ppkg=' + localStringToNumber(fd.get('ppkg')));
    args += ('&' + 'ppbox=' + localStringToNumber(fd.get('ppbox')));

    return args;
}

function confirmDelete(e){
    e.currentTarget.style.display= 'none';
    document.getElementById('delete').classList.remove('hide');
    document.getElementById('canceldelete').classList.remove('hide');
}

function cancelDelete(){
    document.getElementById('beforedelete').style.display = "block";
    document.getElementById('delete').classList.add('hide');
    document.getElementById('canceldelete').classList.add('hide');
}

function updateProduct(){
    var form = document.getElementById('product_form');
    // Somehow Flask server does not receiver the form data properly.
    // convert to more permitive way :(
    var fd = new FormData(form);
    var pid = fd.get('pid');

    var args = getFormData();

    var request = new XMLHttpRequest();
    request.open('POST', url_productupdate, true);
    request.setRequestHeader('Content-type',
                             'application/x-www-form-urlencoded');

    request.onload = function(){
        var ret =  JSON.parse(this.responseText);
        var msg_div = document.getElementById('message');
        var msg = msg_div.querySelector('strong');
        msg_div.classList.remove('hide');
        if ('success' in ret){
            refresh_product(pid);
            document.getElementById(pid).innerHTML = fd.get('pname');
            msg_div.classList.add('success');
            msg.innerHTML = ret['success'];
            return;
        }
        msg_div.classList.remove('success');
        msg.innerHTML = ret['error'];
    };

    request.send(args);
}

function deleteProduct(){
    var pid = document.getElementById('pinfo_id').value;
    var args = 'pid=' + pid;
    var request = new XMLHttpRequest();
    request.open('POST', url_productdelete, true);
    request.setRequestHeader('Content-type',
                             'application/x-www-form-urlencoded');
    request.onload = function(){
        var ret =  JSON.parse(this.responseText);
        var msg_div = document.getElementById('message');
        var msg = msg_div.querySelector('strong');
        msg_div.classList.remove('hide');
        if ('success' in ret){
            document.getElementById(pid).style.display = 'none';
            blankForm();
            cancelDelete();
            msg_div.classList.add('warning');
            msg.innerHTML = ret['success'];
            return;            
        }
        msg_div.classList.remove('warning');
        msg.innerHTML = ret['error'];
    };
    request.send(args);
}

function handlerNewProduct(){
    var newInput = document.getElementById('newp');
    var isClickInside = newInput.contains(window.event.target);

    if (!isClickInside){
        document.removeEventListener('mousedown', handlerNewProduct);

        var pname = newInput.value;
        var np = document.getElementById('new_product');
        if (pname == '' || pname == null){
            np.parentNode.removeChild(np);
            return;
        }
        
        var args = "pname="+pname;
        var request = new XMLHttpRequest();
        
        request.open('POST', url_productnew, true);
        request.setRequestHeader('Content-type',
                                 'application/x-www-form-urlencoded');

        request.onload = function(){
            var pid = Number(this.responseText);
            np.firstChild.remove();
            np.setAttribute('id', pid);
            np.setAttribute('onclick', 'open_product(' + pid.toString() +')');
            np.innerHTML = pname;
            open_product(pid);
        };

        request.send(args);
    }    
}

function blankForm(){
    document.getElementById('product_form').reset();
}

function createProduct(){
    blankForm();
    unselectAll();
    
    var list = document.querySelector('.product_tab_list');
    var newProduct = document.createElement('a');
    var newInput = document.createElement('input');

    newProduct.setAttribute('class', 'product_link');
    newProduct.setAttribute('id', 'new_product');
    newProduct.classList.add('active');
    newProduct.classList.add('less_margin');
    
    newInput.setAttribute('type', 'text');
    newInput.setAttribute('value', '');
    newInput.setAttribute('id', 'newp');
    
    newProduct.appendChild(newInput);
    list.insertBefore(newProduct, list.childNodes[0]);
    newInput.focus();

    document.addEventListener('mousedown', handlerNewProduct);
}

blankForm();
