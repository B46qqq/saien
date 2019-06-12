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

function sidebar_toggle(){
    var sc = get_element(".sidebar_container");
    var stcc = get_element(".sidebar_toggle_container_closed");

    sc.classList.add("sidebar_container_transition");
    sc.classList.toggle("sidebar_container_closed");

    if (!sc.classList.contains("sidebar_container_closed")){
        sc.addEventListener("transitionend",
                            function(){
                                sc.classList.remove("sidebar_container_transition");
                            });
        sc.addEventListener("webkitTransitionEnd",
                            function(){
                                sc.classList.remove("sidebar_container_transition");
                            });
        stcc.style.left = "-35px";
    } else {
        stcc.style.left = "0vw";
    }
}

