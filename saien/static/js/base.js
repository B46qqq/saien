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

function sidebar_closing(){
    var sc = get_element(".sidebar_container");
    var stcc = get_element(".sidebar_toggle_container_closed");

    sc.classList.add("sc_closed");
    sc.addEventListener("transitionend", function(){
        stcc.style.left = "0vw";
    }, { once: true });

    sc.addEventListener("webkitTransitionEnd", function(){
        stcc.style.left = "0vw";
    }, { once: true });
}

function sidebar_opening(){
    var sc = get_element(".sidebar_container");
    var stcc = get_element(".sidebar_toggle_container_closed");

    stcc.style.left = "-35vw";
    stcc.addEventListener("transitionend", function(){
        sc.classList.remove("sc_closed");
    }, { once: true });

    stcc.addEventListener("webkitTransitionEnd", function(){
        sc.classList.remove("sc_closed");
    }, { once: true });    
}
