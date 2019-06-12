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
    var sc = get_element(".sidebar_container");

    sc.style.width = "0vw";
    sc.style.boxShadow = "unset";
    sc.classList.add("sidebar_container_transition");
}


function open_sidebar(){
    var so = get_element(".sidebar_open"); // <body>
    var sc = get_element(".sidebar_container");

    so.style.transition = "unset";
}
