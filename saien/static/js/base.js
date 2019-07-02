function get_element(className){
    var element = document.querySelector(className);
    if (element == null || element === undefined){
        console.log("Error : element of class : " +
                    className +
                    " cannot be found");
        return null;
    }
    return element;
}

function sidebar_toggle(x){
    x.classList.toggle('open');

    var sc = get_element(".sidebar_container");
    var cc = get_element(".content_container");
    
    if (x.classList.contains('open')){
        sc.classList.remove('sc_closed');
        x.classList.remove('stc_closed');
    } else {
        sc.classList.add('sc_closed');
        x.classList.add('stc_closed');
    }
}
