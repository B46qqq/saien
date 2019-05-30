function get_toggle_btn(){
    var toggle_btn = document.querySelector(".sidebar_toggle_switch");

    if (toggle_btn == null){
        toggle_btn = document.querySelector(".sidebar_toggle_switch_closed");
        if (toggle_btn == null){
            console.log("ERROR @ get_toggle_btn() > possibly classname not found");
            return null;
        }
    }

    return toggle_btn;
}

function toggle_animation(){
    var toggle_btn = get_toggle_btn();
    if (toggle_btn == null) return null;
    
    var tb_content = toggle_btn.textContent;
    if (escape(tb_content) === "%u292B"){
        var togglemation = document.querySelector(".sidebar_toggle_animation");
        togglemation.innerHTML = "&#171;";
    }
        
}


function toggling(){
    var toggle_btn = get_toggle_btn();
    if (toggle_btn == null) return null;

    var tb_content = toggle_btn.textContent;

    var s = document.querySelector(".sidebar");
    var c = document.querySelector(".content_container");
    var sc = document.querySelector(".sidebar_container");
    var stw = toggle_btn;

    if (escape(tb_content) === "%u292B"){
        s.style.width = "0px";
        c.style.left = "0px";
        sc.style.left = "-185px";
        stw.innerHTML = "&#9776;";
        stw.removeAttribute("class");
        stw.setAttribute("class", "sidebar_toggle_switch_closed");
    } else { // Hope there are only two situation
        s.style.width = "225px";
        c.style.left = "225px";
        sc.style.left = "0px";
        stw.innerHTML = "&#10539;";
        stw.removeAttribute("class");
        stw.setAttribute("class", "sidebar_toggle_switch");
    }
}
