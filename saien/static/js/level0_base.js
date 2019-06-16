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

function showLoginForm(){
    var form = get_element(".login_section form");
    var li = get_element(".uicon");
    var ti = get_element(".tab_input");

    form.style.gridTemplateColumns = "0 100%";
    li.style.display = "none";
    ti.style.display = "grid";
}


function hideLoginForm(){
    var form = get_element(".login_section form");
    var li = get_element(".uicon");
    var ti = get_element(".tab_input");

    form.style.gridTemplateColumns = "100% 0";
    li.style.display = "flex";
    ti.style.display = "none";
}
