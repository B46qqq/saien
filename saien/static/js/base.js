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


function close_sidebar(){
    var b = get_element(".sidebar_open"); // <body>
    var sc = get_element(".sidebar_container");

    sc.style.minWidth = "unset";
    b.classList.toggle("sidebar_close");
}

